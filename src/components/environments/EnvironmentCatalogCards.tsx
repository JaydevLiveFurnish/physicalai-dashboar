import { useMemo } from "react";
import { Link } from "react-router-dom";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { Badge } from "@/components/ui/Badge";
import type { EnvironmentEntity } from "@/types";
import type { AccessTier } from "@/lib/access";
import { environmentWorkspaceHref } from "@/lib/environmentWorkspaceHref";

/** Matches home rail — compact lock glyph (14px was visually loud on thumbnails). */
const lockedOverlayPill =
  "inline-flex items-center gap-[3px] rounded-full bg-[#2a2a2a] px-[8px] py-[3px] text-[11px] font-semibold uppercase leading-none tracking-[0.06em] text-[var(--grey-200)]";

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

  const orderedEnvironments = useMemo(() => {
    const kitchen = environments.find((e) => e.id === "env-open-plan-kitchen");
    if (!kitchen) return environments;
    return [kitchen, ...environments.filter((e) => e.id !== "env-open-plan-kitchen")];
  }, [environments]);

  const cardShell =
    "group flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[var(--grey-300)] hover:shadow-md active:scale-[0.99] sm:flex-row";

  return (
    <StaggerFadeGroup staggerMs={80} className="flex flex-col gap-[var(--s-400)]">
      {orderedEnvironments.map((e) => {
        const href = environmentWorkspaceHref(e);
        const description =
          e.catalogDescription ??
          "Configure parameters, generate scenes, and export simulation-ready outputs.";
        const thumb = e.catalogThumbnailUrl;
        const live = e.status === "active";

        const body = (
          <>
            <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[var(--surface-page-secondary)] sm:h-auto sm:min-h-[220px] sm:w-[min(38vw,300px)] sm:max-w-[300px]">
              {thumb ? (
                <img src={thumb} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center text-[var(--text-default-placeholder)]">
                  <span className="material-symbols-outlined text-[48px]" aria-hidden>
                    view_in_ar
                  </span>
                </div>
              )}
              <div className="absolute left-[var(--s-300)] top-[var(--s-300)] z-[1]">
                {live ? (
                  <Badge variant="live">Live</Badge>
                ) : (
                  <span className={lockedOverlayPill}>
                    <span className="material-symbols-outlined shrink-0 text-[11px] leading-none" aria-hidden>
                      lock
                    </span>
                    Locked
                  </span>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[var(--s-200)] p-[var(--s-400)] sm:py-[var(--s-500)] sm:pl-[var(--s-500)] sm:pr-[var(--s-500)]">
              <h2 className="text-[17px] font-semibold leading-snug text-[var(--text-default-heading)]">{e.name}</h2>
              <p className="text-[13px] leading-[20px] text-[var(--text-default-body)]">{description}</p>
            </div>
          </>
        );

        if (href != null) {
          return (
            <Link key={e.id} to={href} className={cardShell}>
              {body}
            </Link>
          );
        }

        if (onLockedEnvironmentClick) {
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onLockedEnvironmentClick()}
              className={`${cardShell} cursor-pointer`}
              aria-label={`Request access: ${e.name}`}
              title="Available with full access — talk to the team"
            >
              {body}
            </button>
          );
        }

        return (
          <Link key={e.id} to={requestCustomHref} className={cardShell}>
            {body}
          </Link>
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
