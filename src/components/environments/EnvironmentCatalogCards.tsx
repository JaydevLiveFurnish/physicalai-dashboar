import { Link } from "react-router-dom";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import type { EnvironmentEntity } from "@/types";
import type { AccessTier } from "@/lib/access";
import { environmentWorkspaceHref } from "@/lib/environmentWorkspaceHref";

const tx = "transition-[color,background-color,opacity,transform] duration-200 ease-out";

const categoryPill =
  "inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--papaya-500)_14%,#ffffff)] px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9a3412]";

const statPill =
  "inline-flex items-center rounded-full border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[10px] py-[6px] text-[12px] font-medium text-[var(--text-default-body)]";

const detailLink =
  `inline-flex items-center gap-[2px] text-[13px] font-semibold text-[var(--text-primary-default)] hover:text-[var(--text-default-heading)] ${tx}`;

const requestShell =
  "flex flex-col gap-[var(--s-400)] overflow-hidden rounded-br200 border-2 border-dashed border-[var(--border-primary-default)] bg-[var(--surface-default)] p-[var(--s-400)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:gap-[var(--s-500)] sm:p-[var(--s-500)]";

type EnvironmentCatalogCardsProps = {
  environments: EnvironmentEntity[];
  accessTier: AccessTier;
  showRequestCard?: boolean;
  requestCustomHref?: string;
  onRequestCustom?: () => void;
  onLockedEnvironmentClick?: () => void;
};

export function EnvironmentCatalogCards({
  environments,
  accessTier,
  showRequestCard = true,
  requestCustomHref = "/environments/request-custom",
  onRequestCustom,
  onLockedEnvironmentClick,
}: EnvironmentCatalogCardsProps) {
  void accessTier;

  return (
    <StaggerFadeGroup staggerMs={80} className="flex flex-col gap-[var(--s-400)]">
      {environments.map((e) => {
        const href = environmentWorkspaceHref(e);
        const description =
          e.catalogDescription ??
          "Configure parameters, generate scenes, and export simulation-ready outputs.";
        const category = e.catalogCategory ?? "Environment";
        const models = e.catalogModelsLabel ?? "—";
        const joints = e.catalogJointsLabel ?? "—";
        const thumb = e.catalogThumbnailUrl;

        const detailsControl =
          href != null ? (
            <Link to={href} className={detailLink}>
              View details
              <span aria-hidden>→</span>
            </Link>
          ) : onLockedEnvironmentClick ? (
            <button type="button" onClick={() => onLockedEnvironmentClick()} className={detailLink}>
              View details
              <span aria-hidden>→</span>
            </button>
          ) : (
            <Link to={requestCustomHref} className={detailLink}>
              View details
              <span aria-hidden>→</span>
            </Link>
          );

        return (
          <article
            key={e.id}
            className="flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:flex-row"
          >
            <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[var(--surface-page-secondary)] sm:h-auto sm:min-h-[220px] sm:w-[min(38vw,300px)] sm:max-w-[300px]">
              {thumb ? (
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center text-[var(--text-default-placeholder)]">
                  <span className="material-symbols-outlined text-[48px]" aria-hidden>
                    view_in_ar
                  </span>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-[var(--s-300)] p-[var(--s-400)] sm:justify-between sm:py-[var(--s-500)] sm:pl-[var(--s-500)] sm:pr-[var(--s-500)]">
              <div className="space-y-[var(--s-200)]">
                <div className="flex flex-wrap items-center gap-[var(--s-200)]">
                  <h2 className="text-[17px] font-semibold leading-snug text-[var(--text-default-heading)]">{e.name}</h2>
                  <span className={categoryPill}>{category}</span>
                </div>
                <p className="text-[13px] leading-[20px] text-[var(--text-default-body)]">{description}</p>
              </div>

              <div className="flex flex-col gap-[var(--s-300)] pt-[var(--s-100)] sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-[var(--s-200)]">
                  <span className={statPill}>{models}</span>
                  <span className={statPill}>{joints}</span>
                </div>
                <div className="sm:ml-auto">{detailsControl}</div>
              </div>
            </div>
          </article>
        );
      })}

      {showRequestCard ? (
        <div className={requestShell}>
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-full border-2 border-[var(--border-primary-default)] text-[var(--text-primary-default)] sm:self-center"
            aria-hidden
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </div>
          <div className="min-w-0 flex-1 space-y-[var(--s-200)]">
            <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Request new environment</h2>
            <p className="text-[13px] leading-[20px] text-[var(--text-default-body)]">
              Tell us what you need for your simulation or robotics pipeline.
            </p>
          </div>
          <div className="shrink-0 sm:self-center">
            {onRequestCustom ? (
              <button
                type="button"
                onClick={onRequestCustom}
                className="inline-flex w-full items-center justify-center rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-on-color-body)] transition-[background-color] duration-200 hover:bg-[var(--surface-primary-default-hover)] sm:w-auto"
              >
                Talk to Team
              </button>
            ) : (
              <Link
                to={requestCustomHref}
                className="inline-flex w-full items-center justify-center rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-on-color-body)] sm:w-auto"
              >
                Talk to Team
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </StaggerFadeGroup>
  );
}
