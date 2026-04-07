import { tx } from "@/components/layout/motion";

type PreviewModeBadgeProps = {
  className?: string;
  /** Visible label (e.g. Kitchen vs batch workflow). */
  label?: string;
  /** Tooltip / title attribute */
  title?: string;
};

/** Subtle pill for surfaces where exploration works but full runs are gated. */
export function PreviewModeBadge({
  className = "",
  label = "Preview mode",
  title = "Configure and generate preview scenes. Simulation package downloads require full access.",
}: PreviewModeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-wide text-[var(--text-default-body)] ${tx} ${className}`}
      title={title}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-default-placeholder)]" aria-hidden />
      {label}
    </span>
  );
}
