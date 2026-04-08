import type { ReactNode } from "react";
import { Button } from "./Button";
import { txOverlayBackdrop, txOverlayPanel } from "@/components/layout/motion";
import { usePresence } from "@/hooks/usePresence";

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { mounted, show } = usePresence(open);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end p-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:p-0 ${show ? "" : "pointer-events-none"}`}
      role="dialog"
      aria-modal
      aria-labelledby="drawer-title"
    >
      <button
        type="button"
        className={`h-full min-h-0 flex-1 cursor-default bg-black/55 backdrop-blur-[2px] ${txOverlayBackdrop} ${
          show ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`flex h-[100dvh] max-h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-xl sm:max-h-[100dvh] ${txOverlayPanel} ${
          show ? "translate-x-0 opacity-100" : "translate-x-full opacity-95"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-300)] sm:px-[var(--s-400)]">
          <h2 id="drawer-title" className="min-w-0 truncate text-[17px] font-semibold leading-tight text-[var(--text-default-heading)] sm:text-[18px]">
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose} className="!min-h-[44px] shrink-0 !px-s300 !py-s200">
            Close
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[var(--s-300)] pb-[max(var(--s-400),env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] sm:p-[var(--s-400)]">
          {children}
        </div>
      </div>
    </div>
  );
}
