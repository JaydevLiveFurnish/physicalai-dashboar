import { Link, useLocation } from "react-router-dom";

const tx =
  "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out border-b-2 border-transparent pb-[var(--s-200)] pt-[2px] text-[14px] font-medium";

export function AssetLibraryTabs() {
  const { pathname } = useLocation();
  const hubActive = pathname === "/assets" || pathname === "/assets/";
  const propsActive = pathname.startsWith("/assets/props");
  const materialsActive = pathname.startsWith("/assets/materials");

  return (
    <nav className="flex flex-wrap gap-[var(--s-400)] sm:gap-[var(--s-500)] border-b border-[var(--border-default-secondary)]" aria-label="Assets">
      <Link
        to="/assets"
        className={`${tx} ${
          hubActive
            ? "border-[var(--surface-primary-default)] text-[var(--text-primary-default)]"
            : "text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]"
        }`}
      >
        All
      </Link>
      <Link
        to="/assets/props"
        className={`${tx} ${
          propsActive
            ? "border-[var(--surface-primary-default)] text-[var(--text-primary-default)]"
            : "text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]"
        }`}
      >
        Props
      </Link>
      <Link
        to="/assets/materials"
        className={`${tx} ${
          materialsActive
            ? "border-[var(--surface-primary-default)] text-[var(--text-primary-default)]"
            : "text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]"
        }`}
      >
        Materials
      </Link>
    </nav>
  );
}
