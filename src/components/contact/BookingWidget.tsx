import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type AvailabilityResponse,
  type AvailabilitySlot,
  // RECAPTCHA_SITE_KEY,
  bookMeeting,
  fetchAvailability,
  isDebuggingEnabled,
  isInternalEmail,
  persistUtmParamsFromUrl,
  submitDemoForm,
  trackContactFormAbandon,
} from '@/lib/hubspotScheduler'
import { BLOCKED_EMAIL_DOMAINS } from '@/data/blockedEmailDomains'
import {
  TIMEZONE_OPTIONS,
  type TimezoneOption,
  getBestMatchTimezone,
  getUserTimezone,
} from '@/data/timezones'
import styles from './BookingWidget.module.css'

declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void
      getResponse: () => string
    }
    onBwRecaptchaSuccess?: (token: string) => void
    onBwRecaptchaExpired?: () => void
  }
}

/* ── Types ────────────────────────────────────────── */

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,6}$/

/* ── Date helpers ─────────────────────────────────── */

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const offset = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatTimeLabel(startMs: number, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(startMs))
}

function mergeAvailability(
  prev: AvailabilityResponse | null,
  next: AvailabilityResponse,
): AvailabilityResponse {
  if (!prev) return next
  const slotsByDate: Record<string, AvailabilitySlot[]> = { ...prev.slotsByDate }
  for (const [date, slots] of Object.entries(next.slotsByDate)) {
    const existing = slotsByDate[date]
    if (existing) {
      const seen = new Set(existing.map(s => s.startMillisUtc))
      slotsByDate[date] = [...existing, ...slots.filter(s => !seen.has(s.startMillisUtc))]
        .sort((a, b) => a.startMillisUtc - b.startMillisUtc)
    } else {
      slotsByDate[date] = slots
    }
  }
  return {
    slotsByDate,
    availableDates: Object.keys(slotsByDate).sort(),
    durationMs: next.durationMs,
    hasMore: next.hasMore,
  }
}

/* ── Component ────────────────────────────────────── */

export default function BookingWidget() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  // const [captchaOk, setCaptchaOk] = useState(false)
  const abandonedRef = useRef(false)
  const interactionTrackedRef = useRef(false)

  const [timezone, setTimezone] = useState<string>(() => getBestMatchTimezone(getUserTimezone()).value)

  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [selectedStartMs, setSelectedStartMs] = useState<number | null>(null)

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [loadedOffsets, setLoadedOffsets] = useState<Set<number>>(() => new Set())
  const [endOffset, setEndOffset] = useState<number | null>(null)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  /* ── Persist UTM params to cookie on mount ── */
  useEffect(() => {
    persistUtmParamsFromUrl()

    // window.onBwRecaptchaSuccess = () => setCaptchaOk(true)
    // window.onBwRecaptchaExpired = () => setCaptchaOk(false)
    //
    // const existing = document.getElementById('bw-recaptcha-script')
    // if (!existing) {
    //   const s = document.createElement('script')
    //   s.id = 'bw-recaptcha-script'
    //   s.src = 'https://www.google.com/recaptcha/api.js'
    //   s.async = true
    //   s.defer = true
    //   document.body.appendChild(s)
    // }
    //
    // return () => {
    //   delete window.onBwRecaptchaSuccess
    //   delete window.onBwRecaptchaExpired
    // }
  }, [])

  /* ── Fire GTM demo_form_interaction once on first interaction ── */
  const trackFirstInteraction = useCallback(() => {
    if (interactionTrackedRef.current) return
    interactionTrackedRef.current = true
    if (typeof window !== 'undefined') {
      const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []
      dl.push({ event: 'demo_form_interaction' })
      ;(window as unknown as { dataLayer?: unknown[] }).dataLayer = dl
    }
  }, [])

  /* ── Offset of current view relative to today's month ── */
  const currentMonthOffset = useMemo(() => {
    const now = new Date()
    return (viewMonth.year - now.getFullYear()) * 12 + (viewMonth.month - now.getMonth())
  }, [viewMonth.year, viewMonth.month])

  /* ── Reset availability when timezone changes ── */
  useEffect(() => {
    setAvailability(null)
    setLoadedOffsets(new Set())
    setEndOffset(null)
  }, [timezone])

  /* ── Fetch availability for current month (if not loaded and not past end) ── */
  useEffect(() => {
    if (currentMonthOffset < 0) return
    if (loadedOffsets.has(currentMonthOffset)) return
    if (endOffset !== null && currentMonthOffset > endOffset) return

    let cancelled = false
    setLoadingAvailability(true)
    setAvailabilityError(null)
    fetchAvailability({ timezone, monthOffset: currentMonthOffset })
      .then(data => {
        if (cancelled) return
        setAvailability(prev => mergeAvailability(prev, data))
        setLoadedOffsets(prev => {
          const next = new Set(prev)
          next.add(currentMonthOffset)
          return next
        })
        if (!data.hasMore) {
          setEndOffset(prev => (prev === null ? currentMonthOffset : Math.min(prev, currentMonthOffset)))
        }
      })
      .catch((err: Error) => {
        if (cancelled) return
        setAvailabilityError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false)
      })
    return () => {
      cancelled = true
    }
  }, [timezone, currentMonthOffset, loadedOffsets, endOffset])

  /* ── Derived: which dates in this view have slots ── */
  const availableDateSet = useMemo(() => {
    return new Set(availability?.availableDates || [])
  }, [availability])

  /* ── Auto-select first available date when availability loads ── */
  useEffect(() => {
    if (!availability) return
    if (selectedDateKey && availableDateSet.has(selectedDateKey)) return
    const first = availability.availableDates[0]
    if (first) {
      setSelectedDateKey(first)
      setSelectedStartMs(null)
      const [y, m] = first.split('-').map(Number)
      if (y && m) setViewMonth({ year: y, month: m - 1 })
    }
  }, [availability, availableDateSet, selectedDateKey])

  const monthCells = useMemo(
    () => buildMonthGrid(viewMonth.year, viewMonth.month),
    [viewMonth.year, viewMonth.month],
  )

  const todayKey = useMemo(() => formatDateKey(new Date()), [])

  const slotsForSelectedDate: AvailabilitySlot[] = useMemo(() => {
    if (!availability || !selectedDateKey) return []
    return availability.slotsByDate[selectedDateKey] || []
  }, [availability, selectedDateKey])

  /* ── Handlers ─────────────────────────────────────── */

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    trackFirstInteraction()
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleEmailBlur = useCallback(() => {
    const email = form.email.trim()
    if (!email) return
    if (!EMAIL_REGEX.test(email)) return
    const domain = email.split('@')[1]?.toLowerCase()
    if (domain && BLOCKED_EMAIL_DOMAINS.has(domain)) return
    if (isInternalEmail(email) && !isDebuggingEnabled()) return
    if (abandonedRef.current) return
    abandonedRef.current = true
    void trackContactFormAbandon(email)
  }, [form.email])

  function handleMonthNav(delta: number) {
    setViewMonth(prev => {
      const m = prev.month + delta
      const year = prev.year + Math.floor(m / 12)
      const month = ((m % 12) + 12) % 12
      return { year, month }
    })
  }

  const handleSelectDate = useCallback((d: Date) => {
    const key = formatDateKey(d)
    if (!availableDateSet.has(key)) return
    setSelectedDateKey(key)
    setSelectedStartMs(null)
  }, [availableDateSet])

  const validate = useCallback((): string | null => {
    if (!form.firstName.trim()) return 'First name is required'
    if (!form.lastName.trim()) return 'Last name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!EMAIL_REGEX.test(form.email.trim())) return 'Please enter a valid email'
    const domain = form.email.trim().split('@')[1]?.toLowerCase()
    if (domain && BLOCKED_EMAIL_DOMAINS.has(domain)) return 'Please use your work email address'
    if (isInternalEmail(form.email.trim()) && !isDebuggingEnabled()) {
      return 'Internal email addresses are not allowed'
    }
    if (!form.company.trim()) return 'Company is required'
    if (form.phone.trim() && !PHONE_REGEX.test(form.phone.trim())) return 'Please enter a valid phone number'
    if (!selectedStartMs) return 'Please select a date and time'
    // if (!captchaOk) return 'Please complete the captcha'
    return null
  }, [form, selectedStartMs])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setFormError(err)
      return
    }
    setFormError(null)
    setSubmitting(true)

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      timezone,
      startTime: selectedStartMs!,
    }

    try {
      await submitDemoForm(payload)
      await bookMeeting(payload)

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: 'talk_to_expert',
        })
      }

      setSuccess(true)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setFormError(msg)
      // setCaptchaOk(false)
      // try { window.grecaptcha?.reset() } catch { /* noop */ }
    } finally {
      setSubmitting(false)
    }
  }

  const timezoneGroups = useMemo(() => {
    const groups = new Map<string, TimezoneOption[]>()
    for (const opt of TIMEZONE_OPTIONS) {
      const list = groups.get(opt.region)
      if (list) list.push(opt)
      else groups.set(opt.region, [opt])
    }
    return Array.from(groups.entries())
  }, [])

  /* ── Render ───────────────────────────────────────── */

  if (success) {
    return (
      <div className={styles.success}>
        <span className={`material-symbols-outlined ${styles.successIcon}`} aria-hidden="true">
          check_circle
        </span>
        <h5 className={styles.successTitle}>Your meeting is booked!</h5>
        <p className={styles.successText}>
          You will be receiving an email confirmation shortly
        </p>
      </div>
    )
  }

  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <form className={styles.widget} onSubmit={handleSubmit} noValidate>
      {/* Contact fields */}
      <div className={styles.fieldRow}>
        <Field id="bw-first" label="First Name" required>
          <input
            id="bw-first"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={e => updateField('firstName', e.target.value)}
            autoComplete="given-name"
            required
          />
        </Field>
        <Field id="bw-last" label="Last Name" required>
          <input
            id="bw-last"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={e => updateField('lastName', e.target.value)}
            autoComplete="family-name"
            required
          />
        </Field>
      </div>

      <div className={styles.fieldRow}>
        <Field id="bw-email" label="Work Email" required>
          <input
            id="bw-email"
            type="email"
            placeholder="Work email address"
            value={form.email}
            onChange={e => updateField('email', e.target.value)}
            onBlur={handleEmailBlur}
            autoComplete="email"
            required
          />
        </Field>
        <Field id="bw-phone" label="Phone Number">
          <input
            id="bw-phone"
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={e => updateField('phone', e.target.value)}
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field id="bw-company" label="Company" required>
        <input
          id="bw-company"
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={e => updateField('company', e.target.value)}
          autoComplete="organization"
          required
        />
      </Field>

      {/* Calendar + Timezone + Slots */}
      <div className={styles.scheduleBlock}>
        <div className={styles.calendarLabel}>
          Choose a date and time within your desired timezone
          <span className={styles.required}>*</span>
        </div>

        <select
          className={styles.timezoneSelect}
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          aria-label="Timezone"
        >
          {timezoneGroups.map(([region, opts]) => (
            <optgroup key={region} label={region}>
              {opts.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.monthNav}
              onClick={() => handleMonthNav(-1)}
              aria-label="Previous month"
              disabled={currentMonthOffset <= 0}
            >
              «
            </button>
            <span className={styles.monthLabel}>{monthLabel}</span>
            <button
              type="button"
              className={styles.monthNav}
              onClick={() => handleMonthNav(1)}
              aria-label="Next month"
              disabled={endOffset !== null && currentMonthOffset >= endOffset}
            >
              »
            </button>
          </div>
          <div className={styles.weekdayRow}>
            {WEEKDAY_LABELS.map(d => (
              <div key={d} className={styles.weekday}>{d}</div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {monthCells.map((d, i) => {
              if (!d) return <div key={i} className={styles.dayEmpty} />
              const key = formatDateKey(d)
              const isAvailable = availableDateSet.has(key)
              const isPast = key < todayKey
              const isSelected = key === selectedDateKey
              const disabled = isPast || !isAvailable
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.day} ${disabled ? styles.dayDisabled : ''} ${isSelected ? styles.daySelected : ''} ${isAvailable && !disabled ? styles.dayAvailable : ''}`}
                  onClick={() => handleSelectDate(d)}
                  disabled={disabled}
                  aria-label={d.toDateString()}
                  aria-pressed={isSelected}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.slotsWrapper}>
            {loadingAvailability && <div className={styles.slotsEmpty}>Loading availability…</div>}
            {!loadingAvailability && availabilityError && (
              <div className={styles.slotsError}>{availabilityError}</div>
            )}
            {!loadingAvailability && !availabilityError && !selectedDateKey && (
              <div className={styles.slotsEmpty}>Select a date to see times</div>
            )}
            {!loadingAvailability && !availabilityError && selectedDateKey && slotsForSelectedDate.length === 0 && (
              <div className={styles.slotsEmpty}>No times available for this date</div>
            )}
            {!loadingAvailability && !availabilityError && slotsForSelectedDate.length > 0 && (
              <div className={styles.slotsGrid}>
                {slotsForSelectedDate.map(slot => {
                  const isActive = slot.startMillisUtc === selectedStartMs
                  return (
                    <button
                      key={slot.startMillisUtc}
                      type="button"
                      className={`${styles.slot} ${isActive ? styles.slotActive : ''}`}
                      onClick={() => setSelectedStartMs(slot.startMillisUtc)}
                      aria-pressed={isActive}
                    >
                      {formatTimeLabel(slot.startMillisUtc, timezone)}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
      <div
        className="g-recaptcha"
        data-sitekey={RECAPTCHA_SITE_KEY}
        data-callback="onBwRecaptchaSuccess"
        data-expired-callback="onBwRecaptchaExpired"
      />
      */}

      {formError && <div className={styles.error}>{formError}</div>}

      <button
        type="submit"
        className={styles.submit}
        disabled={submitting || !selectedStartMs}
      >
        {submitting ? 'Submitting...' : 'Talk to an Expert'}
      </button>
    </form>
  )
}

/* ── Small helpers ─────────────────────────────────── */

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
    </div>
  )
}
