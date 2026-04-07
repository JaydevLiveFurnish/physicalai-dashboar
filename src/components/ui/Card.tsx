import type { ReactNode } from "react";

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] ${className}`}
    >
      {title ? (
        <h2 className="mb-[var(--s-300)] text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
