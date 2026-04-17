/**
 * HubSpot scheduler + forms client.
 *
 * These lambda endpoints proxy HubSpot's private scheduler API (OAuth-gated +
 * no public CORS). They are the same endpoints used by imagine.io/talk-to-an-expert.
 * The HubSpot forms submission hits the public documented Forms API directly.
 */

const AVAILABILITY_API =
  import.meta.env.VITE_HUBSPOT_AVAILABILITY_API ||
  'https://esox4mb3x7swrvx3zh5jlele3e0vkbgf.lambda-url.us-east-1.on.aws/'

const BOOKING_API =
  import.meta.env.VITE_HUBSPOT_BOOKING_API ||
  'https://sjgwafku6wivgmenb52ipcdmi40kmaes.lambda-url.us-east-1.on.aws/'

export const MEETING_SLUG =
  import.meta.env.VITE_HUBSPOT_MEETING_SLUG || 'rachit-nanda/physical-ai-website'

export const INDIA_MEETING_SLUG =
  import.meta.env.VITE_HUBSPOT_INDIA_MEETING_SLUG || 'rachit-nanda/physical-ai-website'

export const HUBSPOT_PORTAL_ID =
  import.meta.env.VITE_HUBSPOT_PORTAL_ID || '6917454'

export const HUBSPOT_FORM_ID =
  import.meta.env.VITE_HUBSPOT_FORM_ID || 'a042a45b-23ce-4bcf-8a69-3e58180359cd'

export const HUBSPOT_CONTACT_API =
  import.meta.env.VITE_HUBSPOT_CONTACT_API ||
  'https://ojqfnf5pddw7baonujuh3fwgv40rvorh.lambda-url.us-east-1.on.aws/'

export const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeMgDIrAAAAABPBNa13b8hvyNGT-YsFEMHRo31m'

export const MEETING_DURATION_MS = 1800000 // 30 minutes

export const RESTRICTED_EMAIL_DOMAINS = [
  'imagine.io',
  'livefurnish.com',
  'taglineinfotech',
  'tagline',
  'algoworks',
  'zedinteractive',
]

const LF_DEBUGGER_KEY = 'LF_DEBUGGER'

export function isInternalEmail(email: string): boolean {
  if (!email) return false
  const lower = email.toLowerCase()
  return RESTRICTED_EMAIL_DOMAINS.some(d => lower.includes(d))
}

export function isDebuggingEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).get('lf_debugger') === '1') {
      sessionStorage.setItem(LF_DEBUGGER_KEY, 'true')
    }
    return sessionStorage.getItem(LF_DEBUGGER_KEY) === 'true'
  } catch {
    return false
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const UTM_COOKIE = 'UTM_PARAMS'

/* ── Cookie helpers ─────────────────────────────────── */

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${name}=`))
  return match ? match.substring(name.length + 1) : undefined
}

export function getHubspotUtk(): string | undefined {
  return readCookie('hubspotutk')
}

export function getGA4ClientId(): string | undefined {
  return readCookie('_ga')
}

/* ── UTM helpers (URL-only, per spec) ───────────────── */

export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export function getUtmParamsFromUrl(): UtmParams {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: UtmParams = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  return out
}

export function getUtmParamsFromCookie(): UtmParams & { adgroupname?: string } {
  if (typeof document === 'undefined') return {}
  const raw = readCookie(UTM_COOKIE)
  if (!raw) return {}
  try {
    return JSON.parse(decodeURIComponent(raw)) as UtmParams & { adgroupname?: string }
  } catch {
    return {}
  }
}

export function persistUtmParamsFromUrl(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const payload: Record<string, string> = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) payload[k] = v
  }
  const ad = params.get('adgroupname')
  if (ad) payload.adgroupname = ad
  if (Object.keys(payload).length === 0) return
  document.cookie = `${UTM_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; max-age=2592000; path=/`
}

function clearUtmCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${UTM_COOKIE}=; max-age=0; path=/`
}

function getAdGroupName(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const fromUrl = new URLSearchParams(window.location.search).get('adgroupname')
  if (fromUrl) return fromUrl
  return getUtmParamsFromCookie().adgroupname
}

/* ── Availability ───────────────────────────────────── */

export interface AvailabilitySlot {
  startMillisUtc: number
  endMillisUtc: number
}

export interface AvailabilityResponse {
  slotsByDate: Record<string, AvailabilitySlot[]>
  availableDates: string[]
  durationMs: number
  hasMore: boolean
}

function toLocalDateKey(tsMs: number, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(tsMs))
}

function normalizeAvailability(
  raw: unknown,
  timezone: string,
  durationMs: number,
): AvailabilityResponse {
  const slotsByDate: Record<string, AvailabilitySlot[]> = {}
  const pushSlot = (start: number, end: number) => {
    if (!Number.isFinite(start) || !Number.isFinite(end)) return
    const key = toLocalDateKey(start, timezone)
    if (!slotsByDate[key]) slotsByDate[key] = []
    slotsByDate[key].push({ startMillisUtc: start, endMillisUtc: end })
  }

  const obj = raw as Record<string, unknown> | undefined
  const bodyRaw = obj?.body
  const body = (typeof bodyRaw === 'string' ? safeParse(bodyRaw) : bodyRaw) ?? obj
  const bodyObj = body as Record<string, unknown> | undefined

  const linkAvailability = bodyObj?.linkAvailability as Record<string, unknown> | undefined
  const nested = linkAvailability?.linkAvailabilityByDuration as Record<string, { availabilities?: AvailabilitySlot[] }> | undefined
  const hasMoreRaw = linkAvailability?.hasMore ?? bodyObj?.hasMore
  const hasMore = hasMoreRaw === undefined ? true : Boolean(hasMoreRaw)

  if (nested) {
    const durationKey = String(durationMs)
    const bucket = nested[durationKey] || Object.values(nested)[0]
    const list = bucket?.availabilities || []
    for (const s of list) {
      pushSlot(Number(s.startMillisUtc), Number(s.endMillisUtc))
    }
  } else if (Array.isArray(bodyObj?.availabilities)) {
    for (const s of bodyObj.availabilities as AvailabilitySlot[]) {
      pushSlot(Number(s.startMillisUtc), Number(s.endMillisUtc))
    }
  } else if (Array.isArray(bodyObj?.availableTimes)) {
    for (const t of bodyObj.availableTimes as number[]) {
      pushSlot(Number(t), Number(t) + durationMs)
    }
  }

  for (const key of Object.keys(slotsByDate)) {
    slotsByDate[key]!.sort((a, b) => a.startMillisUtc - b.startMillisUtc)
  }

  return {
    slotsByDate,
    availableDates: Object.keys(slotsByDate).sort(),
    durationMs,
    hasMore,
  }
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

export async function fetchAvailability(params: {
  slug?: string
  timezone: string
  durationMs?: number
  monthOffset?: number
}): Promise<AvailabilityResponse> {
  const durationMs = params.durationMs ?? MEETING_DURATION_MS
  const res = await fetch(AVAILABILITY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: encodeURIComponent(params.slug ?? MEETING_SLUG),
      timezone: params.timezone.replace(/\//g, '%2F'),
      monthOffset: params.monthOffset ?? 0,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Availability fetch failed (${res.status}): ${text.slice(0, 120)}`)
  }

  const json = await res.json()
  return normalizeAvailability(json, params.timezone, durationMs)
}

/* ── Booking ────────────────────────────────────────── */

export interface BookMeetingInput {
  firstName: string
  lastName: string
  email: string
  company?: string
  phone?: string
  startTime: number
  timezone: string
  slug?: string
  durationMs?: number
  isIndia?: boolean
}

export async function bookMeeting(input: BookMeetingInput): Promise<void> {
  const slug = input.slug ?? (input.isIndia ? INDIA_MEETING_SLUG : MEETING_SLUG)
  const payload = {
    duration: input.durationMs ?? MEETING_DURATION_MS,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    formFields: [
      ...(input.company ? [{ name: 'company', value: input.company }] : []),
      ...(input.phone ? [{ name: 'phone', value: input.phone }] : []),
    ],
    startTime: input.startTime,
    slug,
    timezone: input.timezone,
  }

  const maxAttempts = 3
  let lastError: unknown = null
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(BOOKING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        clearUtmCookie()
        return
      }
      if (attempt === maxAttempts) {
        const data = await res.json().catch(() => null)
        const msg =
          (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
            ? data.message
            : null) || 'Unable to schedule the meeting. Please try again later.'
        throw new Error(msg)
      }
    } catch (err) {
      lastError = err
      if (attempt === maxAttempts) throw err
    }
  }
  if (lastError) throw lastError
}

/* ── HubSpot Forms submit ───────────────────────────── */

export interface DemoFormSubmitInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  country?: string
  startTime?: number
  timezone: string
}

function formatMeetingDateTimeLabel(startMs: number, timezone: string): string {
  const d = new Date(startMs)
  const local = d.toLocaleString('en-GB', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = dtf.formatToParts(d)
  const map: Record<string, string> = Object.fromEntries(parts.map(p => [p.type, p.value]))
  const localTs = Date.UTC(
    +(map.year ?? '1970'),
    +(map.month ?? '1') - 1,
    +(map.day ?? '1'),
    +(map.hour ?? '0'),
    +(map.minute ?? '0'),
  )
  const offsetMin = (localTs - d.getTime()) / 60000
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  const hh = String(Math.floor(abs / 60)).padStart(2, '0')
  const mm = String(abs % 60).padStart(2, '0')
  return `${local} - UTC ${sign}${hh}:${mm} ${timezone}`
}

export async function submitDemoForm(input: DemoFormSubmitInput): Promise<void> {
  const urlUtms = getUtmParamsFromUrl()
  const cookieUtms = getUtmParamsFromCookie()

  const fields: { name: string; value: string }[] = [
    { name: 'firstname', value: input.firstName },
    { name: 'lastname', value: input.lastName },
    { name: 'email', value: input.email },
    ...(input.company ? [{ name: 'company', value: input.company }] : []),
    ...(input.phone ? [{ name: 'phone', value: input.phone }] : []),
    ...(input.country ? [{ name: 'country', value: input.country }] : []),
  ]

  for (const k of UTM_KEYS) {
    const v = urlUtms[k] || cookieUtms[k]
    if (v) fields.push({ name: k, value: v })
  }

  const adGroup = getAdGroupName()
  if (adGroup) fields.push({ name: 'ad_group_name', value: adGroup })

  if (input.startTime) {
    fields.push({
      name: 'demo_meeting___date___time',
      value: formatMeetingDateTimeLabel(input.startTime, input.timezone),
    })
  }

  const gaId = getGA4ClientId()
  if (gaId) fields.push({ name: 'ga4_client_id', value: gaId })

  fields.push({ name: 'demo_form_interaction', value: 'Form Submitted' })

  const body = {
    fields,
    context: {
      hutk: getHubspotUtk(),
      pageUri: window.location.href,
      pageName: document.title,
    },
  }

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const data = await res.json().catch(() => null) as { message?: string; errors?: { message?: string }[] } | null
    const msg =
      data?.errors?.[0]?.message ||
      data?.message ||
      'Unable to submit the form. Please try again later.'
    throw new Error(msg)
  }
}

/* ── Abandon tracking ───────────────────────────────── */

export async function trackContactFormAbandon(email: string): Promise<void> {
  if (!email) return
  try {
    const existsResp = await fetch(HUBSPOT_CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search_contacts',
        data: {
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
          properties: ['email', 'firstname', 'lastname'],
        },
      }),
    })
    const existsData = existsResp.ok ? await existsResp.json().catch(() => null) : null
    const contactId = existsData?.results?.[0]?.id as string | undefined

    const payload = {
      action: contactId ? 'update_contact' : 'create_contact',
      data: {
        properties: {
          email,
          ga4_client_id: getGA4ClientId() ?? '',
          demo_form_interaction: 'Form Abandoned',
        },
        ...(contactId ? { contactId } : {}),
      },
    }

    await fetch(HUBSPOT_CONTACT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    /* fire-and-forget */
  }
}
