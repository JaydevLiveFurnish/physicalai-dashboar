import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { usePresence } from "@/hooks/usePresence";
import { txOverlayBackdrop } from "./motion";
import { AppTopBar } from "./AppTopBar";
import { PageTransition } from "./PageTransition";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const location = useLocation();
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
    <div className="min-h-[100dvh] bg-[var(--surface-page)]">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {backdropMounted ? (
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-[#0a0a0a]/65 backdrop-blur-[3px] md:hidden ${txOverlayBackdrop} ${
            backdropShow ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:pl-[272px]">
        <AppTopBar onOpenNav={() => setMobileNavOpen(true)} navOpen={mobileNavOpen} />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-[var(--s-300)] pb-[max(var(--s-500),env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top)+var(--s-400))] sm:px-[var(--s-400)] md:px-[var(--s-600)] md:pb-[var(--s-500)] md:pt-[calc(3.5rem+env(safe-area-inset-top)+var(--s-500))]">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
