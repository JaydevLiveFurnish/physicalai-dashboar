import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-500)] py-[var(--s-600)] text-center">
      <p className="text-[15px] font-semibold text-[var(--text-default-heading)]">{title}</p>
      <p className="mx-auto mt-[var(--s-200)] max-w-[420px] text-[14px] leading-[20px] text-[var(--text-default-body)]">
        {description}
      </p>
      {action ? <div className="mt-[var(--s-400)] flex justify-center">{action}</div> : null}
    </div>
  );
}
