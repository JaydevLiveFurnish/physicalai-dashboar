import type { ReactNode } from "react";
import { Button } from "./Button";

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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal>
      <button type="button" className="h-full flex-1 cursor-default bg-transparent" onClick={onClose} aria-label="Close" />
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border-default-secondary)] px-[var(--s-400)] py-[var(--s-300)]">
          <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="!p-s200">
            Close
          </Button>
        </div>
        <div className="p-[var(--s-400)]">{children}</div>
      </div>
    </div>
  );
}
