import { Link, NavLink } from "react-router-dom";
import { KitchenConfigureWorkspace } from "@/components/kitchen/KitchenConfigureWorkspace";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] transition-colors",
    isActive
      ? "border-[var(--papaya-500)] font-semibold text-[var(--text-default-heading)]"
      : "border-transparent font-medium text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
  ].join(" ");

export function KitchenConfiguratorPage() {
  return (
    <div className="space-y-[var(--s-400)] pb-[var(--s-500)]">
      <nav
        className="flex flex-wrap items-center gap-x-[var(--s-200)] gap-y-[var(--s-100)] text-[13px] text-[var(--text-default-body)]"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-[var(--text-default-heading)]">
          Dashboard
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments" className="transition-colors hover:text-[var(--text-default-heading)]">
          Environments
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments/kitchen/configure" className="transition-colors hover:text-[var(--text-default-heading)]">
          Kitchen
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <span className="text-[var(--text-default-heading)]">Scene</span>
      </nav>

      <header className="space-y-[var(--s-300)]">
        <h1 className="text-page-title">Kitchen Environment</h1>
        <p className="max-w-[52rem] text-[13px] leading-[20px] text-[var(--text-default-body)]">
          Configure the scene, generate previews, and export simulation-ready outputs. Limited access includes capped generations and downloads.
        </p>
        <nav className="border-b border-[var(--border-default-secondary)]" aria-label="Kitchen sections">
          <ul className="flex flex-wrap gap-[var(--s-200)]">
            <li>
              <NavLink to="/environments/kitchen/scene" end className={tabClass}>
                Scene
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/configure" className={tabClass}>
                Configure
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/downloads" className={tabClass}>
                Downloads
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <KitchenConfigureWorkspace />
    </div>
  );
}
