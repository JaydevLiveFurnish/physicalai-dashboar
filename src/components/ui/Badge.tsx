import type { ReactNode } from "react";

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "error";
}) {
  const map = {
    neutral: "bg-[#2a2a2a] text-[var(--grey-200)]",
    success: "bg-[#0d2a1a] text-[var(--text-success-default)]",
    warning: "bg-[var(--yellow-100)] text-[var(--yellow-800)]",
    error: "bg-[var(--surface-error-default-subtle)] text-[var(--text-error-default)]",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-s200 py-s100 text-[10px] font-medium uppercase leading-none ${map[variant]}`}
    >
      {children}
    </span>
  );
}
