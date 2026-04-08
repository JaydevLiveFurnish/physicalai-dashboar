import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import type { EnvironmentEntity } from "@/types";
import type { AccessTier } from "@/lib/access";

const cardShell =
  "flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left";

const heroSoon = "relative flex min-h-[140px] shrink-0 items-center justify-center bg-[var(--surface-page-secondary)] md:min-h-[160px]";
const heroActive =
  "relative flex min-h-[140px] shrink-0 items-center justify-center bg-[color-mix(in_srgb,var(--papaya-500)_12%,var(--surface-page-secondary))] md:min-h-[160px]";

const txPrimaryCta =
  "inline-flex items-center justify-center gap-[var(--s-200)] rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-on-color-body)] transition-[background-color,opacity,transform] duration-250 ease-out hover:bg-[var(--surface-primary-default-hover)] active:scale-[0.99]";

function environmentPath(id: string): string {
  if (id === "env-kitchen-v2") return "/environments/kitchen/configure";
  if (id.startsWith("env-living")) return "/environments/living-room/batch";
  if (id.startsWith("env-warehouse")) return "/environments/warehouse/batch";
  if (id.startsWith("env-retail")) return "/environments/retail-store/batch";
  return "/environments/kitchen/batch";
}

type EnvironmentCatalogCardsProps = {
  environments: EnvironmentEntity[];
  accessTier: AccessTier;
  /** Show dashed “Request a Custom Scene” tile (hide on `/environments/request-custom`) */
  showRequestCard?: boolean;
  requestCustomHref?: string;
  onRequestCustom?: () => void;
};

export function EnvironmentCatalogCards({
  environments,
  accessTier,
  showRequestCard = true,
  requestCustomHref = "/environments/request-custom",
  onRequestCustom,
}: EnvironmentCatalogCardsProps) {
  void accessTier;

  return (
    <div className="grid gap-[var(--s-400)] sm:grid-cols-2 xl:grid-cols-3">
      {environments.map((e) => {
        const isActive = e.status === "active";
        const title = e.name;
        const description =
          e.catalogDescription ??
          (isActive
            ? "Configure parameters, generate scenes, and export SimReady assets."
            : "Not available in Explore access.");
        const eyebrow = e.catalogEyebrow;
        const icon = e.catalogIcon ?? "view_in_ar";
        const thumbnailUrl = e.catalogThumbnailUrl;

        return (
          <article key={e.id} className={cardShell}>
            <div className={isActive ? heroActive : heroSoon}>
              {thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt={`${e.name} environment`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-black/25" />
                </>
              ) : null}
              <div className="absolute left-[var(--s-300)] top-[var(--s-300)] z-[1]">
                {isActive ? (
                  <Badge variant="live">Live</Badge>
                ) : (
                  <span className="inline-flex items-center gap-[6px] rounded-full bg-[#f5efd2] px-[10px] py-[4px] text-[12px] font-semibold uppercase tracking-[0.02em] text-[#60511d]">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden>
                      lock
                    </span>
                    Locked
                  </span>
                )}
              </div>
              {isActive && !thumbnailUrl ? (
                <span
                  className="material-symbols-outlined text-[64px] text-[var(--papaya-500)]/90"
                  aria-hidden
                >
                  {icon}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-[var(--s-200)] p-[var(--s-400)]">
              <div className="flex flex-wrap items-center gap-[var(--s-200)]">
                <h2 className="text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">
                  {title}
                </h2>
              </div>

              {eyebrow ? (
                <p className="text-[12px] font-medium leading-[18px] text-[var(--text-primary-default)]">
                  {eyebrow}
                </p>
              ) : null}

              <p className="flex-1 text-[13px] leading-[20px] text-[var(--text-default-body)]">{description}</p>

              <div className="pt-[var(--s-100)]">
                <Link to={environmentPath(e.id)} className={txPrimaryCta}>
                  {e.id === "env-kitchen-v2" ? "Open Kitchen" : "Open"}
                  <span className="material-symbols-outlined text-[18px]" aria-hidden>
                    arrow_forward
                  </span>
                </Link>
                {!isActive ? (
                  <p className="mt-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">
                    Not available in Explore access.
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}

      {showRequestCard ? (
        <div
          className={`${cardShell} border-2 border-dashed border-[var(--border-primary-default)] transition-[background-color,box-shadow] duration-200 hover:bg-[var(--surface-primary-default-subtle)]`}
        >
          <div className="relative flex min-h-[140px] shrink-0 items-center justify-center border-b border-dashed border-[var(--border-primary-default)] bg-[var(--surface-default)] md:min-h-[160px]">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border-primary-default)] text-[var(--text-primary-default)]"
              aria-hidden
            >
              <span className="material-symbols-outlined text-[36px]">add</span>
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-[var(--s-200)] p-[var(--s-400)]">
            <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Request a Custom Scene</h2>
            <p className="flex-1 text-[13px] leading-[20px] text-[var(--text-default-body)]">
              Need a specific environment for your training pipeline? Tell us what you need.
            </p>
            <div className="pt-[var(--s-100)]">
              {onRequestCustom ? (
                <button type="button" className={txPrimaryCta} onClick={onRequestCustom}>
                  Submit Request
                  <span className="material-symbols-outlined text-[18px]" aria-hidden>
                    arrow_forward
                  </span>
                </button>
              ) : (
                <Link to={requestCustomHref} className={txPrimaryCta}>
                  Submit Request
                  <span className="material-symbols-outlined text-[18px]" aria-hidden>
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
