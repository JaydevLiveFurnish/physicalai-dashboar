import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { tx, txSidebarSlide } from "./motion";
import { sidebarWidthClass } from "./sidebarLayout";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";
import { useAuth } from "@/context/AuthContext";
import { isLiveEnvironmentWorkspace } from "@/lib/environmentAccess";

/** Sidebar — Imagine.io × Physical AI (Figma: no section titles; Home → Assets → Environments → SimReady → API) */
const shell = "bg-[#0a0a0a] border-r border-[#262626]";
const muted = "text-[#9a9a9a]";
const subTree = "ml-[var(--s-300)] border-l border-[#2f2f2f] pl-[var(--s-300)]";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const navRow =
  "max-md:min-h-[44px] max-md:items-center max-md:active:bg-[#141414] md:py-[10px]";

const navItemShell =
  "mx-[var(--s-200)] rounded-[6px] px-[var(--s-300)] py-[10px] text-[13px] font-medium leading-[18px] tracking-[-0.01em]";

const navActive =
  "bg-[rgba(255,255,255,0.07)] text-[#f5f5f5] shadow-[inset_3px_0_0_0_var(--papaya-500)]";
const navInactive = cn(muted, "hover:bg-[rgba(255,255,255,0.04)] hover:text-[#e8e8e8]");

const envItems = [
  {
    slug: "kitchen",
    label: "Kitchen",
    live: true,
    thumbnail: "/assets/environments/kitchen.jpg",
  },
  {
    slug: "living-room",
    label: "Living Room",
    live: false,
    thumbnail: "/assets/environments/livingroom.png",
  },
  {
    slug: "warehouse",
    label: "Warehouse",
    live: false,
    thumbnail: "/assets/environments/warehouse.png",
  },
  {
    slug: "retail-store",
    label: "Retail Store",
    live: false,
    thumbnail: "/assets/environments/store.png",
  },
] as const;

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  const a = parts[0]?.[0];
  const b = parts[parts.length - 1]?.[0];
  if (a && b) return (a + b).toUpperCase();
  return "?";
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [assetOpen, setAssetOpen] = useState(false);
  const [envOpen, setEnvOpen] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [talkTeamOpen, setTalkTeamOpen] = useState(false);

  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith("/assets")) setAssetOpen(true);
    if (p.startsWith("/environments")) setEnvOpen(true);
  }, [location.pathname]);

  const afterNav = () => {
    onClose();
  };

  const assetsNavActive = location.pathname.startsWith("/assets");
  const environmentsNavActive = location.pathname.startsWith("/environments");
  const accountNavActive = location.pathname.startsWith("/account");

  const displayName = user?.name ?? "Account";

  return (
    <aside
      id="app-sidebar-nav"
      className={cn(
        shell,
        "flex h-[100dvh] w-[min(300px,88vw)] shrink-0 flex-col",
        txSidebarSlide,
        "fixed inset-y-0 left-0 z-50 md:max-w-none",
        sidebarWidthClass,
        mobileOpen ? "translate-x-0 shadow-2xl shadow-black/40" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="relative flex shrink-0 flex-col items-center px-[var(--s-400)] pb-[var(--s-800)] pt-[max(var(--s-400),env(safe-area-inset-top))]">
        <Link
          to="/"
          onClick={afterNav}
          className={`mx-auto flex w-full max-w-[200px] justify-center outline-none ring-offset-2 ring-offset-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[var(--papaya-500)] ${tx}`}
          aria-label="Home"
        >
          <img src="/logos/Horizontal.svg" alt="imagine.io" className="h-6 w-auto max-w-full" />
        </Link>

        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className={`absolute right-[var(--s-200)] top-[max(var(--s-400),env(safe-area-inset-top))] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[6px] text-[#a3a3a3] hover:bg-[rgba(255,255,255,0.06)] hover:text-white active:scale-[0.97] md:hidden ${tx}`}
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-[2px] overflow-y-auto overflow-x-hidden overscroll-contain px-[var(--s-100)] pb-[max(var(--s-400),env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
        <NavLink
          to="/"
          end
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "group relative flex items-center gap-[var(--s-300)]",
              navItemShell,
              navRow,
              isActive ? navActive : navInactive,
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                  isActive ? "text-[var(--papaya-500)]" : "text-[#737373] group-hover:text-[#a8a8a8]",
                )}
              >
                home
              </span>
              Home
            </>
          )}
        </NavLink>

        <div className="flex flex-col">
          <div className="flex w-full min-w-0 items-stretch">
            <Link
              to="/assets"
              onClick={afterNav}
              className={cn(
                tx,
                "group relative flex min-w-0 flex-1 items-center gap-[var(--s-300)] py-[var(--s-200)] pl-[calc(var(--s-300)+var(--s-200))] pr-[var(--s-100)] text-left text-[13px] leading-[18px]",
                navRow,
                "rounded-[6px]",
                assetsNavActive ? navActive : navInactive,
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined shrink-0 text-[20px] transition-colors duration-250 ease-out",
                  assetsNavActive ? "text-[var(--papaya-500)]" : "text-[#737373] group-hover:text-[#a8a8a8]",
                )}
              >
                folder
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
                "mr-[var(--s-200)] shrink-0 rounded-[6px] px-[var(--s-200)] py-[var(--s-200)] text-[#5c5c5c] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#b0b0b0] md:py-[var(--s-200)]",
                navRow,
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {assetOpen ? "expand_more" : "chevron_right"}
              </span>
            </button>
          </div>
          {assetOpen ? (
            <div className={cn(subTree, "flex flex-col gap-[2px] py-[var(--s-100)]")}>
              <NavLink
                to="/assets/props"
                onClick={afterNav}
                className={({ isActive }) =>
                  cn(
                    tx,
                    "flex py-[10px] text-[13px] max-md:min-h-[44px] max-md:items-center max-md:leading-none md:py-[6px]",
                    isActive ? "font-medium text-[var(--papaya-500)]" : "text-[#a3a3a3] hover:text-[#d4d4d4]",
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
                    isActive ? "font-medium text-[var(--papaya-500)]" : "text-[#a3a3a3] hover:text-[#d4d4d4]",
                  )
                }
              >
                Materials
              </NavLink>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <div className="flex w-full min-w-0 items-stretch">
            <Link
              to="/environments"
              onClick={afterNav}
              className={cn(
                tx,
                "group relative flex min-w-0 flex-1 items-center gap-[var(--s-300)] py-[var(--s-200)] pl-[calc(var(--s-300)+var(--s-200))] pr-[var(--s-100)] text-left text-[13px] leading-[18px]",
                navRow,
                "rounded-[6px]",
                environmentsNavActive ? navActive : navInactive,
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined shrink-0 text-[20px] transition-colors duration-250 ease-out",
                  environmentsNavActive ? "text-[var(--papaya-500)]" : "text-[#737373] group-hover:text-[#a8a8a8]",
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
                "mr-[var(--s-200)] shrink-0 rounded-[6px] px-[var(--s-200)] py-[var(--s-200)] text-[#5c5c5c] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#b0b0b0] md:py-[var(--s-200)]",
                navRow,
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {envOpen ? "expand_more" : "chevron_right"}
              </span>
            </button>
          </div>
          {envOpen ? (
            <div className={cn(subTree, "flex flex-col gap-[var(--s-100)] py-[var(--s-100)]")}>
              {envItems.map((item) => {
                const base = `/environments/${item.slug}/configure`;
                const openWorkspace = isLiveEnvironmentWorkspace(item.slug);

                const rowClass = (active: boolean) =>
                  cn(
                    tx,
                    "flex w-full items-center gap-[var(--s-200)] py-[8px] pr-[var(--s-300)] text-[13px] md:py-[6px]",
                    item.live ? "justify-between" : "",
                    active ? "font-medium text-[var(--papaya-500)]" : "text-[#e8e8e8] hover:text-white",
                  );

                const rowInner = (
                  <>
                    <span className="flex min-w-0 flex-1 items-center gap-[var(--s-200)]">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-5 w-5 shrink-0 rounded-[4px] object-cover"
                        aria-hidden
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.live ? (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--green-500)]"
                        title="Live"
                        aria-hidden
                      />
                    ) : null}
                  </>
                );

                if (openWorkspace) {
                  return (
                    <NavLink key={item.slug} to={base} onClick={afterNav} className={({ isActive }) => rowClass(isActive)}>
                      {rowInner}
                    </NavLink>
                  );
                }

                return (
                  <button
                    key={item.slug}
                    type="button"
                    title="This environment isn’t available yet — talk to the team for access"
                    onClick={() => {
                      setTalkTeamOpen(true);
                      afterNav();
                    }}
                    className={rowClass(false)}
                  >
                    {rowInner}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setRequestOpen(true)}
                className={cn(
                  tx,
                  "flex items-center gap-[var(--s-200)] py-[10px] text-left text-[13px] text-[#a3a3a3] max-md:min-h-[44px] max-md:items-center md:py-[6px]",
                  "hover:text-[#d4d4d4]",
                )}
              >
                <span className="material-symbols-outlined text-[18px] text-[#737373]" aria-hidden>
                  add
                </span>
                Add new
              </button>
            </div>
          ) : null}
        </div>

        <NavLink
          to="/simready"
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "group flex min-w-0 items-center gap-[var(--s-300)]",
              navItemShell,
              navRow,
              isActive ? navActive : navInactive,
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "material-symbols-outlined shrink-0 text-[20px] transition-colors duration-250 ease-out",
                  isActive ? "text-[var(--papaya-500)]" : "text-[#737373] group-hover:text-[#a8a8a8]",
                )}
              >
                autorenew
              </span>
              <span className="min-w-0 truncate">SimReady Generation</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/api"
          onClick={afterNav}
          className={({ isActive }) =>
            cn(
              tx,
              "group flex items-center gap-[var(--s-300)]",
              navItemShell,
              navRow,
              isActive ? navActive : navInactive,
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "material-symbols-outlined text-[20px] transition-colors duration-250 ease-out",
                  isActive ? "text-[var(--papaya-500)]" : "text-[#737373] group-hover:text-[#a8a8a8]",
                )}
              >
                code
              </span>
              API
            </>
          )}
        </NavLink>

        <div className="mt-auto border-t border-[#262626] pt-[var(--s-400)]">
          <Link
            to="/account"
            onClick={afterNav}
            className={cn(
              tx,
              "group relative flex w-full min-w-0 items-center gap-[var(--s-300)]",
              navItemShell,
              navRow,
              accountNavActive ? navActive : navInactive,
            )}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-primary-default)] text-[10px] font-semibold leading-none text-[var(--text-on-color-body)]"
              aria-hidden
            >
              {userInitials(displayName)}
            </span>
            <span className="min-w-0 flex-1 truncate">{displayName}</span>
          </Link>
        </div>
      </nav>
      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <TalkToTeamModal open={talkTeamOpen} onClose={() => setTalkTeamOpen(false)} context="general" />
    </aside>
  );
}
