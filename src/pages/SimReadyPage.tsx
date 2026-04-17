import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Break out of AppShell main padding so the hero spans the full content column */
const bleed =
  "-mx-[var(--s-300)] w-[calc(100%+2*var(--s-300))] max-w-none sm:-mx-[var(--s-400)] sm:w-[calc(100%+2*var(--s-400))] md:-mx-[var(--s-600)] md:w-[calc(100%+2*var(--s-600))]";

const FEATURES = [
  { icon: "view_in_ar", label: "Physics and collision setup" },
  { icon: "account_tree", label: "Articulation and joint definitions" },
  { icon: "label", label: "Semantic labeling for training data" },
  { icon: "file_export", label: "Material and USD export" },
] as const;

export function SimReadyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className={`relative flex min-h-0 flex-1 flex-col ${bleed}`}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="absolute inset-0 min-h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/assets/simready-hero.png)" }}
          aria-hidden
        />
        <div className="absolute inset-0 min-h-full bg-black/55" aria-hidden />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-[var(--s-400)] py-[var(--s-600)] text-center max-md:pt-[var(--s-500)]">
          <div className="flex justify-center">
            <span className="inline-flex items-center justify-center rounded-full border border-white/35 bg-black/25 px-[10px] py-[4px] text-[11px] font-semibold uppercase leading-none tracking-[0.06em] text-white/95 backdrop-blur-[2px]">
              Coming soon
            </span>
          </div>

          <h1 className="mt-[var(--s-400)] max-w-[920px] text-[clamp(28px,5vw,42px)] font-semibold leading-[1.1] tracking-tight text-white">
            Make any asset simulation-ready
          </h1>
          <p className="mx-auto mt-[var(--s-400)] max-w-[640px] text-[17px] leading-[30px] text-white/90">
            Convert 3D models into structured USD assets with physics, semantics, and articulation, ready for simulation and
            training.
          </p>

          <div className="mx-auto mt-[var(--s-400)] grid w-full max-w-[560px] grid-cols-1 gap-x-[var(--s-400)] gap-y-[var(--s-300)] sm:grid-cols-2 sm:gap-y-[var(--s-400)]">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="flex gap-[var(--s-300)] text-left">
                <span className="material-symbols-outlined mt-[1px] shrink-0 text-[22px] leading-none text-white/95" aria-hidden>
                  {icon}
                </span>
                <span className="text-[15px] leading-[22px] text-white/85">{label}</span>
              </div>
            ))}
          </div>

          {sent ? (
            <p className="mt-[var(--s-500)] text-[15px] font-medium text-[var(--text-success-default)]">
              You are on the waitlist. We will notify you when access opens.
            </p>
          ) : (
            <form
              className="mx-auto mt-[var(--s-500)] w-full max-w-[420px]"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-stretch">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-h-[48px] min-w-0 flex-1 rounded-br100 border border-white/25 bg-white px-[var(--s-400)] text-[15px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--surface-primary-default-subtle)]"
                />
                <Button
                  variant="primary"
                  type="submit"
                  className="h-[48px] shrink-0 px-[var(--s-500)] text-[15px] font-semibold sm:min-w-[148px]"
                >
                  Get early access
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
