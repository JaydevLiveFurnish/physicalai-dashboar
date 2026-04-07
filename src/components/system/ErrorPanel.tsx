import { Button } from "@/components/ui/Button";
import { tx } from "@/components/layout/motion";

export function ErrorPanel({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-br200 border border-[var(--text-error-default)]/20 bg-[var(--surface-error-default-subtle)] px-[var(--s-400)] py-[var(--s-400)]"
      role="alert"
    >
      <p className="text-[14px] font-semibold text-[var(--text-default-heading)]">{title}</p>
      <p className="mt-[var(--s-200)] text-[14px] text-[var(--text-default-body)]">{message}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" className={`mt-[var(--s-400)] ${tx}`} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
