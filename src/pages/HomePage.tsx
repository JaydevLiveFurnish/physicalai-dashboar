import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { MaterialAssetDetail } from "@/components/assets/MaterialAssetDetail";
import { PropAssetDetail } from "@/components/assets/PropAssetDetail";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { AssetCardLockOverlay } from "@/components/assets/AssetCardLockOverlay";
import { canUseFeature } from "@/lib/access";
import { hasPreviewModel } from "@/lib/assetPreview";
import { MOCK_MATERIALS, MOCK_PROPS } from "@/data/mockCatalog";
import { ENVIRONMENT_CATALOG_PLACEHOLDERS, fetchMaterialById, fetchPropById } from "@/lib/mockApi";
import { environmentWorkspaceHref } from "@/lib/environmentWorkspaceHref";

const tx = "transition-[color,background-color,box-shadow,transform] duration-250 ease-out";

/** Section headings — sentence case, medium weight (reference: editorial home rail). */
const homeSectionTitle =
  "text-[17px] font-medium leading-snug tracking-normal text-[var(--text-default-heading)] sm:text-[18px]";

const homeSectionHeaderRow =
  "flex flex-wrap items-baseline justify-between gap-x-[var(--s-400)] gap-y-[var(--s-200)]";

const homeViewAllLink = `shrink-0 text-[13px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-heading)] ${tx}`;

const envShell =
  "group relative block w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left";

/** Match locked pill scale — Live uses the same footprint as Locked on thumbnails. */
const envLivePill =
  "inline-flex items-center rounded-full bg-[#0d2a1a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none tracking-[0.06em] text-[var(--text-success-default)]";

const envLockedPill =
  "inline-flex items-center gap-[2px] rounded-full bg-[#2a2a2a] px-[8px] py-[3px] text-[10px] font-semibold uppercase leading-none tracking-[0.06em] text-[var(--grey-200)]";

const HOME_ENV_COUNT = 4;

function daypartGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const HOME_PROPS_COUNT = 5;
const HOME_MATERIALS_COUNT = 9;

const propsShowcase = MOCK_PROPS.slice(0, HOME_PROPS_COUNT);
const materialsShowcase = MOCK_MATERIALS.slice(0, HOME_MATERIALS_COUNT);

type HomeAssetSelection = { kind: "prop" | "material"; id: string } | null;

export function HomePage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [requestOpen, setRequestOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [assetDetail, setAssetDetail] = useState<HomeAssetSelection>(null);

  const propDetailQuery = useQuery({
    queryKey: ["home", "prop", assetDetail?.id] as const,
    queryFn: () => fetchPropById(assetDetail!.id),
    enabled: assetDetail?.kind === "prop",
  });

  const materialDetailQuery = useQuery({
    queryKey: ["home", "material", assetDetail?.id] as const,
    queryFn: () => fetchMaterialById(assetDetail!.id),
    enabled: assetDetail?.kind === "material",
  });

  const homeEnvironments = useMemo(
    () =>
      ENVIRONMENT_CATALOG_PLACEHOLDERS.slice(0, HOME_ENV_COUNT),
    [],
  );

  return (
    <>
      <StaggerFadeGroup
        staggerMs={80}
        className="flex flex-col gap-12 pb-[var(--s-800)] pt-[var(--s-200)] sm:gap-14"
      >
        <header className="px-[var(--s-100)] sm:px-0">
          <h1 className="text-page-title text-[var(--text-default-heading)]">{daypartGreeting()}</h1>
        </header>

        <section className="space-y-[var(--s-600)] px-[var(--s-100)] sm:px-0" aria-labelledby="home-env-heading">
          <div className={homeSectionHeaderRow}>
            <h2 id="home-env-heading" className={homeSectionTitle}>
              Environments
            </h2>
            <Link to="/environments" className={homeViewAllLink}>
              View all
            </Link>
          </div>
          <StaggerFadeGroup staggerMs={70} className="grid grid-cols-1 gap-[var(--s-500)] sm:grid-cols-2 lg:grid-cols-4">
            {homeEnvironments.map((env) => {
              const href = environmentWorkspaceHref(env);
              const live = env.status === "active";
              const thumb = env.catalogThumbnailUrl ?? "/assets/environments/open-plan-kitchen.jpg";
              const innerTop = (
                <>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
                    <img
                      src={thumb}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-[var(--s-300)] top-[var(--s-300)] z-[1]">
                      {live ? (
                        <span className={envLivePill}>Live</span>
                      ) : (
                        <span className={envLockedPill}>
                          <span className="material-symbols-outlined shrink-0 text-[10px] leading-none" aria-hidden>
                            lock
                          </span>
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
                    <p className="text-[13px] font-normal leading-snug text-[var(--text-default-body)]">{env.name}</p>
                  </div>
                </>
              );

              if (href) {
                return (
                  <Link
                    key={env.id}
                    to={href}
                    className={`${envShell} ${tx}`}
                    aria-label={`${env.name} — open environment`}
                  >
                    {innerTop}
                  </Link>
                );
              }

              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => setTalkOpen(true)}
                  className={`${envShell} ${tx}`}
                  aria-label={`${env.name} — request access`}
                  title="Available with full access — talk to the team"
                >
                  {innerTop}
                </button>
              );
            })}
          </StaggerFadeGroup>

          <p className="text-[13px] text-[var(--text-default-body)]">
            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className="font-medium text-[var(--text-primary-default)] underline underline-offset-2 hover:text-[var(--text-default-heading)]"
            >
              Request an environment
            </button>
          </p>
        </section>

        <section className="space-y-[var(--s-600)] px-[var(--s-100)] sm:px-0" aria-labelledby="home-props-heading">
          <div className={homeSectionHeaderRow}>
            <h2 id="home-props-heading" className={homeSectionTitle}>
              Props
            </h2>
            <Link to="/assets/props" className={homeViewAllLink}>
              View all
            </Link>
          </div>
          <StaggerFadeGroup
            staggerMs={60}
            className="grid w-full grid-cols-2 gap-[var(--s-400)] sm:grid-cols-3 lg:grid-cols-5"
          >
            {propsShowcase.map((p) => {
              const canOpen = hasPreviewModel(p.previewModelUrl);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={!canOpen}
                  title={
                    canOpen
                      ? undefined
                      : "3D preview not available yet — publish a GLB in /public/assets/3d to unlock"
                  }
                  onClick={canOpen ? () => setAssetDetail({ kind: "prop", id: p.id }) : undefined}
                  className={`group flex w-full min-w-0 flex-col rounded-br200 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--papaya-500)] disabled:cursor-not-allowed disabled:opacity-100 ${canOpen ? tx : ""}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                    <img
                      src={p.thumbnailUrl}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover ${canOpen ? "transition-transform duration-300 group-hover:scale-[1.03]" : ""}`}
                    />
                    {!canOpen ? <AssetCardLockOverlay /> : null}
                  </div>
                  <p className="mt-[var(--s-300)] text-left text-[13px] font-medium leading-snug text-[var(--text-default-heading)]">
                    {p.name}
                  </p>
                </button>
              );
            })}
          </StaggerFadeGroup>
        </section>

        <section className="space-y-[var(--s-600)] px-[var(--s-100)] sm:px-0" aria-labelledby="home-mat-heading">
          <div className={homeSectionHeaderRow}>
            <h2 id="home-mat-heading" className={homeSectionTitle}>
              Materials
            </h2>
            <Link to="/assets/materials" className={homeViewAllLink}>
              View all
            </Link>
          </div>
          <StaggerFadeGroup
            staggerMs={50}
            className="grid w-full grid-cols-2 gap-x-[var(--s-300)] gap-y-[var(--s-500)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 min-[1280px]:grid-cols-[repeat(9,minmax(0,1fr))] min-[1280px]:gap-[var(--s-400)]"
          >
            {materialsShowcase.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setAssetDetail({ kind: "material", id: m.id })}
                className={`group flex w-full min-w-0 flex-col rounded-br200 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--papaya-500)] ${tx}`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]">
                  <img
                    src={m.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/20 transition-[background-color] duration-300 group-hover:bg-black/35"
                    aria-hidden
                  />
                </div>
                <p className="mt-[var(--s-300)] text-left text-[13px] font-medium leading-snug text-[var(--text-default-heading)]">
                  {m.name}
                </p>
              </button>
            ))}
          </StaggerFadeGroup>
        </section>
      </StaggerFadeGroup>

      <CenterModal
        open={Boolean(assetDetail)}
        title={
          assetDetail?.kind === "prop"
            ? propDetailQuery.data?.name ?? "Prop"
            : materialDetailQuery.data?.name ?? "Material"
        }
        onClose={() => setAssetDetail(null)}
        size="2xl"
        contentAlign="start"
        hideHeader
      >
        {assetDetail?.kind === "prop" ? (
          propDetailQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : propDetailQuery.data ? (
            <PropAssetDetail asset={propDetailQuery.data} />
          ) : (
            <p className="text-[14px] text-[var(--text-error-default)]">Prop not found.</p>
          )
        ) : assetDetail?.kind === "material" ? (
          materialDetailQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : materialDetailQuery.data ? (
            <MaterialAssetDetail
              material={materialDetailQuery.data}
              exportAllowed={fullExport}
              onGatedExport={() => setExportModalOpen(true)}
            />
          ) : (
            <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
          )
        ) : null}
      </CenterModal>

      <ExportAccessModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}
