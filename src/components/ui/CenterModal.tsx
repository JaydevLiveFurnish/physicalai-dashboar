import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { tx, txOverlayPanel } from "@/components/layout/motion";
import { usePresence } from "@/hooks/usePresence";

type CenterModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Wider panel for dense spec tables; `xl` / `2xl` for wide split layouts (e.g. asset 3D + specs) */
  size?: "md" | "lg" | "xl" | "2xl";
  /** Detail views (asset specs) read better left-aligned */
  contentAlign?: "center" | "start";
  /** Hide top title bar when content renders its own heading */
  hideHeader?: boolean;
};

export function CenterModal({
  open,
  title,
  onClose,
  children,
  size = "md",
  contentAlign = "center",
  hideHeader = false,
}: CenterModalProps) {
  const titleId = useId();
  const { mounted, show } = usePresence(open);
  const latchedChildrenRef = useRef<ReactNode>(children);
  const latchedTitleRef = useRef(title);
  if (open) {
    latchedChildrenRef.current = children;
    latchedTitleRef.current = title;
  }
  const renderedChildren = open ? children : latchedChildrenRef.current;
  const renderedTitle = open ? title : latchedTitleRef.current;

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

  if (!mounted || typeof document === "undefined") return null;

  /** Panel width; `2xl` fits wide 16:9 preview + spec column */
  const maxW =
    size === "2xl"
      ? "max-w-[min(1180px,calc(100vw-2rem))] sm:max-w-[min(1180px,calc(100vw-3rem))]"
      : size === "xl"
        ? "max-w-[min(960px,calc(100vw-2rem))] sm:max-w-[min(960px,calc(100vw-3rem))]"
        : size === "lg"
          ? "max-w-[min(92vw,720px)]"
          : "max-w-[min(92vw,440px)]";

  /**
   * Portal to `document.body`. One scroll container with tinted backdrop; clicking any
   * non-dialog surface closes. Dialog uses stopPropagation — no pointer-events tricks.
   */
  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden overscroll-contain transition-opacity duration-250 ease-out ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="presentation"
    >
      <div
        className="flex min-h-[100dvh] min-h-[100lvh] w-full max-w-[100vw] flex-col bg-black/70 backdrop-blur-xl backdrop-saturate-50"
        onClick={onClose}
        role="presentation"
      >
        <div className="flex w-full flex-1 items-center justify-center px-[var(--s-300)] pb-[max(var(--s-500),env(safe-area-inset-bottom))] pt-[max(var(--s-400),env(safe-area-inset-top))] sm:px-[var(--s-500)]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxW} overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-2xl ${txOverlayPanel} ${
              show ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
            } ${show ? "" : "pointer-events-none"}`}
          >
            {!hideHeader ? (
              <div className="relative border-b border-[var(--border-default-secondary)] px-[var(--s-500)] pb-[var(--s-400)] pt-[var(--s-400)] text-center">
                <h2
                  id={titleId}
                  className="mx-auto max-w-[calc(100%-3rem)] text-[18px] font-semibold leading-tight text-[var(--text-default-heading)]"
                >
                  {renderedTitle}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={`absolute right-[var(--s-300)] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={`absolute right-[var(--s-300)] top-[var(--s-300)] z-10 flex h-9 w-9 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            )}
            <div
              className={
                contentAlign === "start"
                  ? "max-h-[min(78vh,800px)] overflow-y-auto px-[var(--s-500)] py-[var(--s-500)] text-left [&_table]:w-full"
                  : "max-h-[min(78vh,800px)] overflow-y-auto px-[var(--s-500)] py-[var(--s-500)] text-center [&_p]:mx-auto [&_p]:max-w-[min(52ch,100%)] [&_ul]:mx-auto [&_ul]:inline-block [&_ul]:text-left [&_ul]:[text-align:left]"
              }
            >
              {renderedChildren}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
