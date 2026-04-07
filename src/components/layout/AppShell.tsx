import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--surface-page)]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-[1200px] px-[var(--s-600)] py-[var(--s-500)]">{children}</main>
      </div>
    </div>
  );
}
