import { useEffect, useId, type ReactNode } from "react";
import { tx, txOverlayBackdrop, txOverlayPanel } from "@/components/layout/motion";
import { usePresence } from "@/hooks/usePresence";

type CenterModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Wider panel for dense spec tables */
  size?: "md" | "lg";
};

export function CenterModal({ open, title, onClose, children, size = "md" }: CenterModalProps) {
  const titleId = useId();
  const { mounted, show } = usePresence(open);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, show, onClose]);

  if (!mounted) return null;

  const maxW = size === "lg" ? "max-w-[560px]" : "max-w-[440px]";

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center p-[var(--s-400)] ${show ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className={`absolute inset-0 bg-[var(--grey-900)]/40 backdrop-blur-sm ${txOverlayBackdrop} ${tx} ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-[81] w-full ${maxW} rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-xl ${txOverlayPanel} ${
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
        } ${show ? "" : "pointer-events-none"}`}
      >
        <div className="flex items-start justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] px-[var(--s-500)] py-[var(--s-400)]">
          <h2 id={titleId} className="text-[18px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="max-h-[min(72vh,720px)] overflow-y-auto px-[var(--s-500)] py-[var(--s-500)]">{children}</div>
      </div>
    </div>
  );
}
