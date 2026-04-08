import { tx } from "@/components/layout/motion";
import { FULL_ACCESS_TOOLTIP } from "@/lib/access";

type PreviewModeBadgeProps = {
  className?: string;
  /** Visible label (override for workflow-specific hints, e.g. batch). */
  label?: string;
  /** Tooltip / title attribute */
  title?: string;
};

/** Explore access tier — generation, exports, and keys require full access. */
export function PreviewModeBadge({
  className = "",
  label = "Explore access",
  title = FULL_ACCESS_TOOLTIP,
}: PreviewModeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[10px] py-[4px] text-[12px] font-medium text-[var(--text-default-body)] ${tx} ${className}`}
      title={title}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-default-placeholder)]" aria-hidden />
      {label}
    </span>
  );
}
