import { Fragment, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useTalkToTeamFlow } from "./useTalkToTeamFlow";

type Flow = ReturnType<typeof useTalkToTeamFlow>;

const EXPECT_ITEMS = [
  "A validated OpenUSD scene you can load directly in your simulator",
  "Working articulation: doors open, drawers slide, physics runs",
  "Sub-millimeter accurate geometry from real-world products",
  "A conversation about your specific pipeline needs",
] as const;

function ThinCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="mt-[3px] shrink-0 text-[var(--text-default-placeholder)]"
      aria-hidden
    >
      <path
        d="M4.5 9.25 7.5 12.25 13.5 5.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const inputLineClass =
  "w-full border-0 border-b border-[var(--border-default-secondary)] bg-transparent py-[12px] text-[15px] leading-normal text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] outline-none transition-[border-color] duration-200 focus:border-[var(--papaya-500)]";

const inputAreaClass =
  "w-full resize-y rounded-br100 border-0 bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] text-[15px] leading-normal text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] outline-none transition-[box-shadow] duration-200 focus:ring-2 focus:ring-[color-mix(in_srgb,var(--papaya-500)_35%,transparent)]";

/** Book-a-demo reference: DETAILS / SCHEDULE / CONFIRM; grey caps; active step = papaya circle + white index. */
function FormProgressSteps({ step }: { step: number }) {
  const labels = ["DETAILS", "SCHEDULE", "CONFIRM"] as const;
  return (
    <nav aria-label="Form progress" className="w-full">
      <div className="flex items-start justify-center">
        {labels.map((label, i) => (
          <Fragment key={label}>
            {i > 0 ? (
              <div
                className={`mx-2 mt-4 h-px min-w-[20px] flex-1 max-sm:min-w-[8px] ${
                  step >= i
                    ? "bg-[color-mix(in_srgb,var(--papaya-500)_45%,var(--border-default-secondary))]"
                    : "bg-[var(--border-default-secondary)]"
                }`}
                aria-hidden
              />
            ) : null}
            <div className="flex w-[min(28vw,104px)] shrink-0 flex-col items-center gap-[10px] sm:w-[104px]">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ${
                  step === i
                    ? "bg-[var(--surface-primary-default)] text-[var(--text-on-color-body)]"
                    : step > i
                      ? "bg-[var(--surface-page-secondary)] text-[var(--text-default-heading)] ring-1 ring-[var(--border-default-secondary)]"
                      : "bg-[var(--surface-default)] text-[var(--text-default-placeholder)] ring-1 ring-[var(--border-default-secondary)]"
                }`}
                aria-current={step === i ? "step" : undefined}
              >
                {i + 1}
              </div>
              <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--text-default-placeholder)]">
                {label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}

function SuccessBody({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  const refLine = useRef<string | null>(null);
  if (refLine.current === null) {
    refLine.current = `${flow.topic.slice(0, 3)}-${flow.email ? (flow.email.split("@")[0] ?? "anon").slice(0, 6) : "anon"}-${String(Date.now()).slice(-4)}`;
  }

  const who = flow.displayName || flow.firstName || "there";

  return (
    <div className="space-y-[var(--s-400)]">
      <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
        Thanks{who !== "there" ? `, ${who}` : ""}. In production we&apos;d route this to your workspace owner and reply within one business day.
      </p>
      <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)] text-[13px] text-[var(--text-default-body)]">
        <p className="font-mono text-[12px] text-[var(--text-default-heading)]">ref: {refLine.current ?? "—"}</p>
        <p className="mt-[var(--s-200)]">Demo — no data was transmitted.</p>
      </div>
      <div className="flex justify-end border-t border-[var(--border-default-secondary)] pt-[var(--s-400)]">
        <Button variant="primary" type="button" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

function FormFooter({
  primaryLabel,
  onBack,
  showBack,
  primaryFullWidth,
  withDivider = true,
}: {
  primaryLabel: string;
  onBack?: () => void;
  showBack?: boolean;
  primaryFullWidth?: boolean;
  /** Editorial book-demo layout uses open spacing instead of a hairline above the CTA. */
  withDivider?: boolean;
}) {
  const fullPrimary = primaryFullWidth || !showBack;
  return (
    <div
      className={`flex gap-[var(--s-300)] pt-[var(--s-600)] ${
        withDivider ? "border-t border-[var(--border-default-secondary)]" : ""
      } ${showBack ? "flex-col sm:flex-row sm:items-center sm:justify-between" : "flex-col"}`}
    >
      {showBack ? (
        <Button variant="secondary" type="button" onClick={onBack} className="order-2 w-full sm:order-1 sm:w-auto">
          Back
        </Button>
      ) : null}
      <Button
        variant="primary"
        type="submit"
        className={`order-1 min-h-[48px] text-[15px] font-semibold ${fullPrimary ? "w-full" : ""}`}
      >
        {primaryLabel}
      </Button>
    </div>
  );
}

function DetailsFields({ flow }: { flow: Flow }) {
  const labelClass = "flex flex-col gap-[var(--s-200)] text-[12px] font-medium text-[var(--text-default-body)]";
  return (
    <div className="space-y-[var(--s-500)]">
      <div className="grid grid-cols-1 gap-x-[var(--s-500)] gap-y-[var(--s-500)] sm:grid-cols-2">
        <label className={labelClass}>
          First name
          <input
            required
            name="firstName"
            value={flow.firstName}
            onChange={(e) => flow.setFirstName(e.target.value)}
            autoComplete="given-name"
            placeholder="Jane"
            className={inputLineClass}
          />
        </label>
        <label className={labelClass}>
          Last name
          <input
            required
            name="lastName"
            value={flow.lastName}
            onChange={(e) => flow.setLastName(e.target.value)}
            autoComplete="family-name"
            placeholder="Doe"
            className={inputLineClass}
          />
        </label>
      </div>
      <label className={labelClass}>
        Work email
        <input
          required
          type="email"
          name="email"
          value={flow.email}
          onChange={(e) => flow.setEmail(e.target.value)}
          autoComplete="email"
          placeholder="jane@company.com"
          className={inputLineClass}
        />
      </label>
      <label className={labelClass}>
        Company
        <input
          name="company"
          value={flow.company}
          onChange={(e) => flow.setCompany(e.target.value)}
          autoComplete="organization"
          placeholder="Acme Robotics"
          className={inputLineClass}
        />
      </label>
      <label className={labelClass}>
        What are you building?
        <textarea
          required
          name="message"
          rows={5}
          value={flow.message}
          onChange={(e) => flow.setMessage(e.target.value)}
          placeholder="Tell us about your project, timeline, or any specific requirements."
          className={`${inputAreaClass} min-h-[120px]`}
        />
      </label>
    </div>
  );
}

function ScheduleFields({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-500)]">
      <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
        We&apos;ll email you a scheduling link after you submit. Add any timezone or availability notes so we can match you faster.
      </p>
      <label className="flex flex-col gap-[var(--s-200)] text-[12px] font-medium text-[var(--text-default-body)]">
        Availability or timezone <span className="font-normal text-[var(--text-default-placeholder)]">(optional)</span>
        <textarea
          name="scheduleNote"
          rows={4}
          value={flow.scheduleNote}
          onChange={(e) => flow.setScheduleNote(e.target.value)}
          placeholder="e.g. PT mornings, EU business hours, or link preferences"
          className={`${inputAreaClass} min-h-[100px]`}
        />
      </label>
    </div>
  );
}

function ConfirmSummary({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-400)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] p-[var(--s-400)] text-[13px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">Summary</p>
      <dl className="space-y-[var(--s-200)]">
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Name</dt>
          <dd className="text-right font-medium text-[var(--text-default-heading)]">{flow.displayName || "—"}</dd>
        </div>
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Email</dt>
          <dd className="max-w-[60%] break-all text-right font-medium text-[var(--text-default-heading)]">{flow.email || "—"}</dd>
        </div>
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Company</dt>
          <dd className="text-right font-medium text-[var(--text-default-heading)]">{flow.company || "—"}</dd>
        </div>
        <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
          <dt className="text-[var(--text-default-body)]">Project</dt>
          <dd className="mt-[var(--s-100)] whitespace-pre-wrap text-[var(--text-default-heading)]">{flow.message || "—"}</dd>
        </div>
        {flow.scheduleNote ? (
          <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
            <dt className="text-[var(--text-default-body)]">Scheduling notes</dt>
            <dd className="mt-[var(--s-100)] whitespace-pre-wrap text-[var(--text-default-heading)]">{flow.scheduleNote}</dd>
          </div>
        ) : null}
        <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
          <dt className="text-[var(--text-default-body)]">Interest</dt>
          <dd className="mt-[var(--s-100)] text-[var(--text-default-heading)]">{flow.topicLabel}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Two-column: narrative left rail + focused form column. */
export function TalkToTeamOverlaySplit({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="px-[var(--s-500)] pb-[var(--s-500)] pt-[var(--s-400)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[min(72vh,640px)] flex-col md:flex-row">
      <aside className="flex min-h-0 flex-col border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-500)] py-[var(--s-600)] md:w-[min(46%,400px)] md:max-w-[420px] md:justify-center md:border-b-0 md:border-r md:pl-[var(--s-600)] md:pr-[var(--s-500)]">
        <h2 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--text-default-heading)]">
          Book a demo with our experts
        </h2>
        <ul className="mt-[var(--s-500)] space-y-[var(--s-400)] text-[14px] leading-[1.45] text-[var(--text-default-body)]">
          {EXPECT_ITEMS.map((line) => (
            <li key={line} className="flex gap-[var(--s-300)]">
              <ThinCheckIcon />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-1 flex-col border-t border-[var(--border-default-secondary)] md:border-t-0">
        <div className="px-[var(--s-500)] pb-[var(--s-400)] pt-[var(--s-500)] md:pl-[var(--s-600)] md:pr-[var(--s-600)]">
          <FormProgressSteps step={flow.step} />
        </div>
        <div className="flex flex-1 flex-col px-[var(--s-500)] pb-[var(--s-600)] pt-[var(--s-200)] md:pl-[var(--s-600)] md:pr-[var(--s-600)]">
          {flow.step === 0 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <DetailsFields flow={flow} />
              <div className="mt-auto">
                <FormFooter primaryLabel="Pick a time" primaryFullWidth withDivider={false} />
              </div>
            </form>
          ) : null}

          {flow.step === 1 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <ScheduleFields flow={flow} />
              <div className="mt-auto">
                <FormFooter
                  primaryLabel="Next: Confirm"
                  showBack
                  onBack={() => flow.setStep(0)}
                  primaryFullWidth
                  withDivider={false}
                />
              </div>
            </form>
          ) : null}

          {flow.step === 2 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <ConfirmSummary flow={flow} />
              <div className="mt-auto">
                <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} withDivider={false} />
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Single-column grid layout. */
export function TalkToTeamOverlayGrid({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="space-y-[var(--s-400)] px-[var(--s-100)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-[var(--s-500)] px-[var(--s-100)]">
      <div className="py-[var(--s-200)]">
        <FormProgressSteps step={flow.step} />
      </div>

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <DetailsFields flow={flow} />
          <FormFooter primaryLabel="Pick a time" primaryFullWidth withDivider={false} />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <ScheduleFields flow={flow} />
          <FormFooter primaryLabel="Next: Confirm" showBack onBack={() => flow.setStep(0)} primaryFullWidth withDivider={false} />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <ConfirmSummary flow={flow} />
          <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} withDivider={false} />
        </form>
      ) : null}
    </div>
  );
}

/** Horizontal stepper + single-column flow. */
export function TalkToTeamOverlayStepper({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="space-y-[var(--s-400)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-[var(--s-600)]">
      <FormProgressSteps step={flow.step} />

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <DetailsFields flow={flow} />
          <FormFooter primaryLabel="Pick a time" primaryFullWidth withDivider={false} />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <ScheduleFields flow={flow} />
          <FormFooter primaryLabel="Next: Confirm" showBack onBack={() => flow.setStep(0)} primaryFullWidth withDivider={false} />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-500)]" onSubmit={flow.handleSubmit}>
          <ConfirmSummary flow={flow} />
          <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} withDivider={false} />
        </form>
      ) : null}
    </div>
  );
}
