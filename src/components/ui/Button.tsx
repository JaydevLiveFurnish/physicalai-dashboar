import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "secondary",
  children,
  className = "",
  ...rest
}: {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const v =
    variant === "primary"
      ? "bg-[var(--surface-primary-default)] text-[var(--text-on-color-body)] hover:bg-[var(--surface-primary-default-hover)]"
      : variant === "ghost"
        ? "border border-transparent bg-transparent text-[var(--text-primary-default)] hover:bg-[var(--surface-page-secondary)]"
        : "border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)]";
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-br100 px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium transition-colors disabled:opacity-50 ${v} ${className}`}
      {...rest}
    />
  );
}
