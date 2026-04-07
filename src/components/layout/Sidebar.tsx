import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-s300 rounded-br200 px-s300 py-s200 text-[14px] leading-[16px] text-[var(--grey-300)] transition-colors hover:bg-[#1f1f1f] hover:text-[var(--grey-100)]";
const linkActive = "bg-[#1f1f1f] text-[var(--text-primary-default)] shadow-[inset_2px_0_0_0_var(--border-primary-default)]";

const sub = "ml-s800 flex flex-col gap-s100 border-l border-[#2a2a2a] pl-s300";

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-[#2a2a2a] bg-[var(--dark)]">
      <div className="px-s400 pt-s500">
        <img src="/logos/Horizontal.svg" alt="imagine.io" className="h-8 w-auto" />
      </div>
      <div className="mx-s300 my-s400 h-px bg-[#2a2a2a]" />

      <nav className="flex flex-1 flex-col gap-s100 overflow-y-auto px-s200 pb-s400">
        <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <span className="material-symbols-outlined text-[20px]">home</span>
          Home
        </NavLink>

        <div className="px-s300 pt-s200 text-caption font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--grey-500)]">
          Asset Library
        </div>
        <div className={sub}>
          <NavLink
            to="/assets/props"
            className={({ isActive }) =>
              `rounded-br100 py-s100 text-small ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            Props
          </NavLink>
          <NavLink
            to="/assets/materials"
            className={({ isActive }) =>
              `rounded-br100 py-s100 text-small ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            Materials
          </NavLink>
        </div>

        <div className="px-s300 pt-s300 text-caption font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--grey-500)]">
          Environment Library
        </div>
        <div className={sub}>
          <NavLink
            to="/environments"
            className={({ isActive }) =>
              `rounded-br100 py-s100 text-[14px] ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/environments/kitchen/configure"
            className={({ isActive }) =>
              `flex items-center justify-between rounded-br100 py-s100 text-[14px] ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            <span>Kitchen</span>
            <span className="rounded-full bg-[#0d2a1a] px-s200 py-s100 text-[10px] font-medium uppercase leading-none text-[var(--text-success-default)]">
              Live
            </span>
          </NavLink>
          <NavLink
            to="/batch"
            className={({ isActive }) =>
              `rounded-br100 py-s100 text-[14px] ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            Batch Generation
          </NavLink>
          <div className="flex items-center justify-between py-s100 text-small text-[var(--grey-500)]">
            <span>Living Room</span>
            <span className="rounded-full bg-[#2a2a2a] px-s200 py-s100 text-[10px] uppercase text-[var(--grey-300)]">
              Soon
            </span>
          </div>
          <div className="flex items-center justify-between py-s100 text-small text-[var(--grey-500)]">
            <span>Warehouse</span>
            <span className="rounded-full bg-[#2a2a2a] px-s200 py-s100 text-[10px] uppercase text-[var(--grey-300)]">
              Soon
            </span>
          </div>
          <NavLink
            to="/environments/request-custom"
            className={({ isActive }) =>
              `rounded-br100 py-s100 text-small ${isActive ? "text-[var(--text-primary-default)]" : "text-[var(--grey-400)]"}`
            }
          >
            Request Custom
          </NavLink>
        </div>

        <NavLink
          to="/simready"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""} justify-between`}
        >
          <span className="flex items-center gap-s300">
            <span className="material-symbols-outlined">auto_awesome</span>
            SimReady Generation
          </span>
          <span className="rounded-md bg-[#2a2a2a] px-s100 py-[2px] text-[10px] uppercase leading-[1.1] text-[var(--grey-300)] [writing-mode:vertical-rl]">
            Soon
          </span>
        </NavLink>

        <div className="mt-auto flex flex-col gap-s100 border-t border-[#2a2a2a] pt-s400">
          <NavLink to="/api" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
            <span className="material-symbols-outlined">code</span>
            API
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}>
            <span className="material-symbols-outlined">person</span>
            Account
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
