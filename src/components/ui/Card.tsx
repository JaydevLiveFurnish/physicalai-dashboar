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
      className={`rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-300)] transition-[border-color,box-shadow] duration-200 ease-out sm:p-[var(--s-400)] ${className}`}
    >
      {title ? (
        <h2 className="mb-[var(--s-300)] text-[14px] font-semibold leading-snug text-[var(--text-default-heading)]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
