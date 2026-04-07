import type { ReactNode } from "react";
import { tx } from "@/components/layout/motion";

type Variant = "info" | "warning" | "success";

const styles: Record<
  Variant,
  { box: string; title: string }
> = {
  info: {
    box: "border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]",
    title: "text-[var(--text-default-heading)]",
  },
  warning: {
    box: "border-[var(--yellow-800)]/25 bg-[var(--yellow-100)]",
    title: "text-[var(--yellow-800)]",
  },
  success: {
    box: "border-[var(--green-900)]/15 bg-[var(--surface-success-default-subtle)]",
    title: "text-[var(--green-900)]",
  },
};

export function Callout({
  variant,
  title,
  children,
  className = "",
}: {
  variant: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <div
      role="note"
      className={`rounded-br200 border px-[var(--s-400)] py-[var(--s-300)] text-[14px] leading-[20px] text-[var(--text-default-body)] ${s.box} ${tx} ${className}`}
    >
      {title ? <p className={`mb-[var(--s-100)] text-[13px] font-semibold ${s.title}`}>{title}</p> : null}
      {children}
    </div>
  );
}
