import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { tx, txSidebarSlide } from "./motion";

/** Sidebar chrome — screenshot ~#121212 */
const shell = "bg-[#121212] border-r border-[#2a2a2a]";
const muted = "text-[#888888]";
const subIndent = "pl-[28px] pr-s300";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const navRow =
  "max-md:min-h-[44px] max-md:items-center max-md:active:bg-[#252525] md:py-[var(--s-200)]";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [assetOpen, setAssetOpen] = useState(false);
  const [envOpen, setEnvOpen] = useState(true);

  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith("/assets")) setAssetOpen(true);
    if (p.startsWith("/environments") || p === "/batch") setEnvOpen(true);
  }, [location.pathname]);

  const afterNav = () => {
    onClose();
  };

  return (
    <aside
      id="app-sidebar-nav"
      className={cn(
        shell,
        "flex h-[100dvh] w-[min(300px,88vw)] shrink-0 flex-col",
        txSidebarSlide,
        /** Fixed on all breakpoints so the nav stays put while main content scrolls */
        "fixed inset-y-0 left-0 z-50 md:w-[272px] md:max-w-none",
        mobileOpen ? "translate-x-0 shadow-2xl shadow-black/40" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex shrink-0 items-center justify-between px-[var(--s-400)] pb-[var(--s-200)] pt-[max(var(--s-400),env(safe-area-inset-top))] md:justify-start md:pb-0 md:pt-[var(--s-500)]">
        <Link
          to="/"
          onClick={afterNav}
          className={`rounded-br200 outline-none ring-offset-2 ring-offset-[#121212] focus-visible:ring-2 focus-visible:ring-[var(--papaya-500)] ${tx}`}
          aria-label="Home"
        >
          <img src="/logos/Horizontal.svg" alt="imagine.io" className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-br200 text-[#b0b0b0] hover:bg-[#1a1a1a] hover:text-white active:scale-[0.97] md:hidden ${tx}`}
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>
      <div className="mx-[var(--s-300)] mb-[var(--s-400)] h-px shrink-0 bg-[#2a2a2a]" />

      <nav className="flex flex-1 flex-col gap-[2px] overflow-y-auto overflow-x-hidden overscroll-contain px-[var(--s-200)] pb-[max(var(--s-400),env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
        {/* Home */}
        <NavLink
          to="/"
          end
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "group relative flex items-center gap-[var(--s-300)] rounded-br200 py-[var(--s-200)] pl-[var(--s-300)] pr-[var(--s-300)] text-[14px] leading-[20px]",
              navRow,
              isActive
                ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                  isActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                )}
              >
                home
              </span>
              Home
            </>
          )}
        </NavLink>

        {/* Asset Library — collapsible */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setAssetOpen((o) => !o)}
            className={cn(
              tx,
              "group flex w-full items-center gap-[var(--s-300)] rounded-br200 px-[var(--s-300)] text-left text-[14px]",
              navRow,
              muted,
              "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]",
            )}
            aria-expanded={assetOpen}
          >
            <span className="material-symbols-outlined text-[20px] text-[#888888] group-hover:text-[#b0b0b0]">
              inventory_2
            </span>
            <span className="min-w-0 flex-1">Asset Library</span>
            <span className="material-symbols-outlined text-[18px] text-[#666666] transition-transform duration-250 ease-out group-hover:text-[#888888]">
              {assetOpen ? "expand_more" : "chevron_right"}
            </span>
          </button>
          {assetOpen ? (
            <div className={cn(subIndent, "flex flex-col gap-[2px] py-[var(--s-100)]")}>
              <NavLink
                to="/assets/props"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex rounded-br100 py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive
                      ? "font-medium text-[var(--papaya-500)]"
                      : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Props
              </NavLink>
              <NavLink
                to="/assets/materials"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex rounded-br100 py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive
                      ? "font-medium text-[var(--papaya-500)]"
                      : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Materials
              </NavLink>
            </div>
          ) : null}
        </div>

        {/* Environment Library */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setEnvOpen((o) => !o)}
            className={cn(
              tx,
              "group flex w-full items-center gap-[var(--s-300)] rounded-br200 px-[var(--s-300)] text-left text-[14px]",
              navRow,
              muted,
              "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]",
            )}
            aria-expanded={envOpen}
          >
            <span className="material-symbols-outlined text-[20px] text-[#888888] group-hover:text-[#b0b0b0]">
              layers
            </span>
            <span className="min-w-0 flex-1">Environment Library</span>
            <span className="material-symbols-outlined text-[18px] text-[#666666] group-hover:text-[#888888]">
              {envOpen ? "expand_more" : "chevron_right"}
            </span>
          </button>
          {envOpen ? (
            <div className={cn(subIndent, "flex flex-col gap-[2px] py-[var(--s-100)]")}>
              <NavLink
                to="/environments/kitchen/configure"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex items-center justify-between gap-[var(--s-200)] rounded-br100 py-[10px] text-[13px] md:py-[6px]",
                    isActive ? "font-medium text-[var(--papaya-500)]" : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                <span>Kitchen</span>
                <span className="shrink-0 rounded-full bg-[#0d2a1a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none tracking-wide text-[var(--green-500)]">
                  • Live
                </span>
              </NavLink>
              <div className="flex min-h-[40px] items-center justify-between py-[6px] text-[13px] text-[#666666] md:min-h-0">
                <span>Living Room</span>
                <span className="rounded-full bg-[#2a2a2a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none text-[#a3a3a3]">
                  Soon
                </span>
              </div>
              <div className="flex min-h-[40px] items-center justify-between py-[6px] text-[13px] text-[#666666] md:min-h-0">
                <span>Warehouse</span>
                <span className="rounded-full bg-[#2a2a2a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none text-[#a3a3a3]">
                  Soon
                </span>
              </div>
              <NavLink
                to="/environments/request-custom"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex rounded-br100 py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive
                      ? "font-medium text-[var(--papaya-500)]"
                      : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Request Custom
              </NavLink>
              <NavLink
                to="/batch"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex rounded-br100 py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive
                      ? "font-medium text-[var(--papaya-500)]"
                      : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Batch Generation
              </NavLink>
              <NavLink
                to="/environments"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex rounded-br100 py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive
                      ? "font-medium text-[var(--papaya-500)]"
                      : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Overview
              </NavLink>
            </div>
          ) : null}
        </div>

        {/* SimReady */}
        <NavLink
          to="/simready"
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "flex items-center justify-between gap-[var(--s-200)] rounded-br200 px-[var(--s-300)] text-[14px] leading-snug",
              navRow,
              "bg-[#1a1a1a]/80 hover:bg-[#222222]",
              isActive ? "ring-1 ring-[var(--papaya-500)]/40" : "",
            )
          }
        >
          <span className="flex items-center gap-[var(--s-300)] text-[var(--papaya-500)]">
            <span className="material-symbols-outlined text-[20px] text-[var(--papaya-500)]">auto_awesome</span>
            SimReady Generation
          </span>
          <span className="shrink-0 rounded-full bg-[#2a2a2a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none text-[#a3a3a3]">
            Soon
          </span>
        </NavLink>

        {/* Footer nav */}
        <div className="mt-auto flex flex-col gap-[2px] border-t border-[#2a2a2a] pt-[var(--s-500)]">
          <NavLink
            to="/api"
            onClick={afterNav}
            className={({ isActive }) =>
              cn(
                tx,
                "group flex items-center gap-[var(--s-300)] rounded-br200 px-[var(--s-300)] text-[14px]",
                navRow,
                isActive
                  ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                  : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                    isActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                  )}
                >
                  code
                </span>
                API
              </>
            )}
          </NavLink>
          <NavLink
            to="/account"
            onClick={afterNav}
            className={({ isActive }) =>
              cn(
                tx,
                "group flex items-center gap-[var(--s-300)] rounded-br200 px-[var(--s-300)] text-[14px]",
                navRow,
                isActive
                  ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                  : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                    isActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                  )}
                >
                  person
                </span>
                Account
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
