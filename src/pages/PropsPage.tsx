import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAssets, fetchPropById } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { AssetCardLockOverlay, AssetLibraryAccessOverlay } from "@/components/assets/AssetCardLockOverlay";
import { PropAssetDetail } from "@/components/assets/PropAssetDetail";
import { propTagHeroWash, propTagPill } from "@/lib/prismSurfaces";
import { shelfCategory, simReadyLabel, tagLabel } from "@/lib/propDisplay";
import type { PropAsset } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

function useAssetSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const simReady = searchParams.get("simReady") ?? "all";
  const articulation = searchParams.get("articulation") ?? "all";

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  return { q, category, simReady, articulation, setParam, searchParams };
}

export function PropsPage() {
  const [talkOpen, setTalkOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { q, category, simReady, articulation, setParam } = useAssetSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      q: q.trim() || undefined,
      category,
      simReady,
      articulation,
    }),
    [q, category, simReady, articulation],
  );

  const list = useQuery({
    queryKey: ["assets", q.trim(), category, simReady, articulation] as const,
    queryFn: () => fetchAssets(query),
  });

  const detail = useQuery({
    queryKey: ["asset", selectedId],
    queryFn: () => fetchPropById(selectedId!),
    enabled: Boolean(selectedId),
  });

  const selected = detail.data ?? null;

  return (
    <>
    <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-400)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Props"
        description="Kitchen-native props — cabinetry, island, brass hardware, prep tools — with collision proxies and material bindings."
        actions={
          <div className="flex flex-wrap gap-[var(--s-200)] lg:justify-end">
            <Button
              variant="secondary"
              type="button"
              className={txBtn}
              onClick={() => setTalkOpen(true)}
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                upload
              </span>
              Upload / Add New
            </Button>
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              className={`inline-flex shrink-0 items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${txInteract}`}
            >
              <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">tune</span>
              {filtersOpen ? "Hide filters" : "Filters"}
            </button>
          </div>
        }
      />

      {filtersOpen ? (
        <div id="asset-filters">
          <Card>
            <div className="flex flex-col gap-[var(--s-300)] md:flex-row md:flex-wrap md:items-end">
            <label className="flex min-w-[140px] flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Category
              <select
                value={category}
                onChange={(e) => setParam("category", e.target.value)}
                className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
              >
                <option value="all">All</option>
                <option value="tableware">tableware</option>
                <option value="cabinetry">cabinetry</option>
                <option value="appliance">appliance</option>
                <option value="decor">decor</option>
                <option value="lighting">lighting</option>
                <option value="furniture">furniture</option>
                <option value="seating">seating</option>
              </select>
            </label>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              SimReady
              <select
                value={simReady}
                onChange={(e) => setParam("simReady", e.target.value)}
                className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
              >
                <option value="all">All</option>
                <option value="certified">certified</option>
                <option value="pending">pending</option>
                <option value="unsupported">unsupported</option>
              </select>
            </label>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Articulation
              <select
                value={articulation}
                onChange={(e) => setParam("articulation", e.target.value)}
                className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
              >
                <option value="all">All</option>
                <option value="fixed">fixed</option>
                <option value="revolute">revolute</option>
                <option value="prismatic">prismatic</option>
                <option value="compound">compound</option>
              </select>
            </label>
          </div>
          </Card>
        </div>
      ) : null}

      {list.isError ? (
        <ErrorPanel message="Props couldn’t be loaded." onRetry={() => list.refetch()} />
      ) : list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : list.data?.length === 0 ? (
        <Card title="Results">
          <p className="text-[14px] text-[var(--text-default-body)]">No props match filters.</p>
        </Card>
      ) : (
        <StaggerFadeGroup
          staggerMs={150}
          className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {list.data?.map((p) => (
            <PropCard key={p.id} asset={p} onOpen={() => setSelectedId(p.id)} />
          ))}
        </StaggerFadeGroup>
      )}
    </StaggerFadeGroup>

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Prop"}
        onClose={() => setSelectedId(null)}
        size="2xl"
        contentAlign="start"
        hideHeader
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <PropAssetDetail asset={selected} />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Asset not found.</p>
        )}
      </CenterModal>

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}

function PropCard({ asset, onOpen }: { asset: PropAsset; onOpen: () => void }) {
  const canOpen = !asset.isLocked;
  return (
    <button
      type="button"
      disabled={!canOpen}
      title={
        canOpen ? undefined : "3D preview not available yet — publish a GLB in /public/assets/3d to unlock"
      }
      onClick={canOpen ? onOpen : undefined}
      className={`flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:active:scale-100 ${
        canOpen ? `hover:shadow-md active:scale-[0.99] ${txInteract}` : ""
      }`}
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${propTagHeroWash[asset.tag]}`}>
        <span
          className={`absolute left-[var(--s-300)] top-[var(--s-300)] z-[1] rounded-br100 px-[var(--s-200)] py-[3px] text-[10px] font-bold leading-tight tracking-wide ${propTagPill[asset.tag]}`}
        >
          {tagLabel(asset.tag)}
        </span>
        <img
          src={asset.thumbnailUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        {!canOpen ? <AssetCardLockOverlay /> : null}
        {canOpen && asset.libraryLocked ? <AssetLibraryAccessOverlay /> : null}
      </div>
      <div className="space-y-[var(--s-200)] px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
        <span className="block text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">
          {asset.name}
        </span>
        <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">{shelfCategory(asset.category)}</p>
        <p className="text-[13px] text-[var(--text-default-body)]">{asset.massKg} kg</p>
        <p className="text-[13px] text-[var(--text-default-body)]">{asset.materialType}</p>
        <p className="text-[12px] text-[var(--text-default-placeholder)]">SimReady: {simReadyLabel(asset.simReady)}</p>
      </div>
    </button>
  );
}

