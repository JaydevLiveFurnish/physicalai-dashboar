import { tx } from "./motion";
import { topBarLeftOffsetClass } from "./sidebarLayout";

type AppTopBarProps = {
  onOpenNav: () => void;
  navOpen: boolean;
};

/** Mobile only: menu control. Profile lives in the sidebar on desktop. */
export function AppTopBar({ onOpenNav, navOpen }: AppTopBarProps) {
  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[35] border-b border-[var(--border-default-secondary)] bg-[var(--surface-default)]/92 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface-default)]/88 md:hidden ${topBarLeftOffsetClass} ${tx}`}
    >
      <div className="flex h-14 w-full items-center px-[var(--s-300)] sm:px-[var(--s-400)]">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={navOpen}
          aria-controls="app-sidebar-nav"
          onClick={onOpenNav}
          className={`flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] active:scale-[0.98] ${tx}`}
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
      </div>
    </header>
  );
}
