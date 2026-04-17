import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { usePresence } from "@/hooks/usePresence";
import { txOverlayBackdrop } from "./motion";
import { AppTopBar } from "./AppTopBar";
import { mainOffsetFromSidebarClass } from "./sidebarLayout";
import { PageTransition } from "./PageTransition";
import { Sidebar } from "./Sidebar";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Kitchen configure & batch: fill viewport on md+; inner workspace panels scroll */
const KITCHEN_WORKSPACE_FILL_PATH = /^\/environments\/kitchen\/(configure|batch)$/;

export function AppShell() {
  const location = useLocation();
  const contentWidthClass = "mx-auto w-full max-w-[1250px]";
  const kitchenWorkspaceFill = KITCHEN_WORKSPACE_FILL_PATH.test(location.pathname);
  const simReadyHeroFill = location.pathname === "/simready";
  /** Outlet grows to fill main so full-bleed heroes (SimReady) and kitchen workspaces get real height */
  const mainOutletFill = kitchenWorkspaceFill || simReadyHeroFill;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { mounted: backdropMounted, show: backdropShow } = usePresence(mobileNavOpen);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!backdropMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [backdropMounted]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--surface-page)]">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {backdropMounted ? (
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[3px] md:hidden ${txOverlayBackdrop} ${
            backdropShow ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${mainOffsetFromSidebarClass}`}>
        <AppTopBar onOpenNav={() => setMobileNavOpen(true)} navOpen={mobileNavOpen} />

        <main
          className={cn(
            "w-full max-w-none min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-[var(--s-300)] pb-[max(var(--s-500),env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top)+var(--s-400))] sm:px-[var(--s-400)] md:px-[var(--s-600)] md:pb-[var(--s-500)] md:pt-[max(var(--s-500),env(safe-area-inset-top))] [-webkit-overflow-scrolling:touch]",
            mainOutletFill && "flex flex-col",
            kitchenWorkspaceFill && "md:overflow-hidden",
            simReadyHeroFill && "pb-0 md:pt-0",
          )}
        >
          <PageTransition className={mainOutletFill ? "flex min-h-0 w-full flex-1 flex-col" : undefined}>
            <div
              className={cn(
                contentWidthClass,
                mainOutletFill && "flex min-h-0 flex-1 flex-col",
              )}
            >
              <Outlet />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
