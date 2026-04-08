import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { tx, txSidebarSlide } from "./motion";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";

/** Sidebar chrome — screenshot ~#121212 */
const shell = "bg-[#121212] border-r border-[#2a2a2a]";
const muted = "text-[#888888]";
const subIndent = "pl-[28px] pr-s300";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const navRow =
  "max-md:min-h-[44px] max-md:items-center max-md:active:bg-[#252525] md:py-[var(--s-200)]";

const envItems = [
  {
    label: "Kitchen",
    to: "/environments/kitchen/batch",
    thumbnail: "/assets/environments/kitchen.jpg",
  },
  {
    label: "Living Room",
    to: "/environments/living-room/batch",
    thumbnail: "/assets/environments/livingroom.png",
  },
  {
    label: "Warehouse",
    to: "/environments/warehouse/batch",
    thumbnail: "/assets/environments/warehouse.png",
  },
  {
    label: "Retail Store",
    to: "/environments/retail-store/batch",
    thumbnail: "/assets/environments/store.png",
  },
] as const;

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [assetOpen, setAssetOpen] = useState(false);
  const [envOpen, setEnvOpen] = useState(true);
  const [talkOpen, setTalkOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith("/assets")) setAssetOpen(true);
    if (p.startsWith("/environments") || p === "/batch") setEnvOpen(true);
  }, [location.pathname]);

  const afterNav = () => {
    onClose();
  };

  const assetsNavActive = location.pathname.startsWith("/assets");
  const environmentsNavActive = location.pathname.startsWith("/environments");

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
      <div className="relative flex shrink-0 items-center justify-center px-[var(--s-400)] py-[var(--s-300)] pt-[max(var(--s-300),env(safe-area-inset-top))] md:py-[var(--s-400)] md:pt-[max(var(--s-400),env(safe-area-inset-top))]">
        <Link
          to="/"
          onClick={afterNav}
          className={`outline-none ring-offset-2 ring-offset-[#121212] focus-visible:ring-2 focus-visible:ring-[var(--papaya-500)] ${tx}`}
          aria-label="Home"
        >
          <img src="/logos/Horizontal.svg" alt="imagine.io" className="h-6 w-auto" />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`absolute right-[var(--s-300)] top-[max(var(--s-200),env(safe-area-inset-top))] flex min-h-[44px] min-w-[44px] items-center justify-center text-[#b0b0b0] hover:bg-[#1a1a1a] hover:text-white active:scale-[0.97] md:hidden ${tx}`}
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
              "group relative flex items-center gap-[var(--s-300)] py-[var(--s-200)] pl-[var(--s-300)] pr-[var(--s-300)] text-[14px] leading-[20px]",
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

        {/* Assets — summary link + collapsible subnav */}
        <div className="flex flex-col">
          <div className="flex w-full min-w-0 items-stretch">
            <Link
              to="/assets"
              onClick={afterNav}
              className={cn(
                tx,
                "group relative flex min-w-0 flex-1 items-center gap-[var(--s-300)] py-[var(--s-200)] pl-[var(--s-300)] pr-[var(--s-100)] text-left text-[14px] leading-[20px]",
                navRow,
                assetsNavActive
                  ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                  : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined shrink-0 text-[20px] transition-colors duration-250 ease-out",
                  assetsNavActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                )}
              >
                inventory_2
              </span>
              <span className="min-w-0 flex-1 truncate">Assets</span>
            </Link>
            <button
              type="button"
              aria-label={assetOpen ? "Collapse assets menu" : "Expand assets menu"}
              aria-expanded={assetOpen}
              onClick={() => setAssetOpen((o) => !o)}
              className={cn(
                tx,
                "shrink-0 px-[var(--s-200)] py-[var(--s-200)] text-[#666666] hover:bg-[#1a1a1a] hover:text-[#b0b0b0] md:py-[var(--s-200)]",
                navRow,
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {assetOpen ? "expand_more" : "chevron_right"}
              </span>
            </button>
          </div>
          {assetOpen ? (
            <div className={cn(subIndent, "flex flex-col gap-[2px] py-[var(--s-100)]")}>
              <NavLink
                to="/assets/props"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
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
                    "flex py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
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

        {/* Environments — summary link + collapsible subnav */}
        <div className="flex flex-col">
          <div className="flex w-full min-w-0 items-stretch">
            <Link
              to="/environments"
              onClick={afterNav}
              className={cn(
                tx,
                "group relative flex min-w-0 flex-1 items-center gap-[var(--s-300)] py-[var(--s-200)] pl-[var(--s-300)] pr-[var(--s-100)] text-left text-[14px] leading-[20px]",
                navRow,
                environmentsNavActive
                  ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                  : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined shrink-0 text-[20px] transition-colors duration-250 ease-out",
                  environmentsNavActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                )}
              >
                public
              </span>
              <span className="min-w-0 flex-1 truncate">Environments</span>
            </Link>
            <button
              type="button"
              aria-label={envOpen ? "Collapse environments menu" : "Expand environments menu"}
              aria-expanded={envOpen}
              onClick={() => setEnvOpen((o) => !o)}
              className={cn(
                tx,
                "shrink-0 px-[var(--s-200)] py-[var(--s-200)] text-[#666666] hover:bg-[#1a1a1a] hover:text-[#b0b0b0] md:py-[var(--s-200)]",
                navRow,
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {envOpen ? "expand_more" : "chevron_right"}
              </span>
            </button>
          </div>
          {envOpen ? (
            <div className={cn(subIndent, "flex flex-col gap-[2px] py-[var(--s-100)]")}>
              {envItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={afterNav}
                  className={({ isActive }) =>
                    cn(
                      tx,
                      "flex items-center justify-between gap-[var(--s-200)] py-[10px] text-[13px] md:py-[6px]",
                      isActive ? "font-medium text-[var(--papaya-500)]" : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                    )
                  }
                >
                  <span className="flex min-w-0 items-center gap-[var(--s-200)]">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-5 w-5 shrink-0 rounded-[4px] object-cover"
                      aria-hidden
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => setRequestOpen(true)}
                className={cn(
                  tx,
                  "flex py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                  "text-[#a3a3a3] hover:text-[#d4d4d4]",
                )}
              >
                + New
              </button>
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
              "group flex items-center justify-between gap-[var(--s-200)] px-[var(--s-300)] text-[14px] leading-snug",
              navRow,
              isActive
                ? "bg-[#1e1e1e] text-[var(--papaya-500)] shadow-[inset_3px_0_0_0_var(--papaya-500)]"
                : cn(muted, "hover:bg-[#1a1a1a] hover:text-[#b0b0b0]"),
            )
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-[var(--s-300)]">
              <span
                className={cn(
                  "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                  isActive ? "text-[var(--papaya-500)]" : "text-[#888888] group-hover:text-[#b0b0b0]",
                )}
              >
                auto_awesome
              </span>
              <span>SimReady Generation</span>
            </span>
          )}
        </NavLink>

        <NavLink
          to="/api"
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "group flex items-center gap-[var(--s-300)] px-[var(--s-300)] text-[14px]",
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

        {/* Footer nav */}
        <div className="mt-auto flex flex-col gap-[2px] border-t border-[#2a2a2a] pt-[var(--s-500)]">
          <button
            type="button"
            onClick={() => setTalkOpen(true)}
            className={cn(
              tx,
              "mx-[var(--s-300)] mb-[var(--s-300)] flex items-center justify-between rounded-full bg-[#1b1b1b] px-[10px] py-[8px] text-[13px] text-[#f2f2f2] hover:bg-[#202020]",
            )}
            aria-label="Need help"
          >
            <span className="inline-flex items-center -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1b1b1b] bg-[#7c5cff] text-[10px] font-semibold text-white">
                AK
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1b1b1b] bg-[#14b8a6] text-[10px] font-semibold text-white">
                RS
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1b1b1b] bg-[#f97316] text-[10px] font-semibold text-white">
                MO
              </span>
            </span>
            <span className="font-medium text-[13px] leading-none">Need help?</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
          </button>

          <NavLink
            to="/account"
            onClick={afterNav}
            className={({ isActive }) =>
              cn(
                tx,
                "group flex items-center gap-[var(--s-300)] px-[var(--s-300)] text-[14px]",
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
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </aside>
  );
}
