import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAssets, fetchPropById } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";
import type { PropAsset, PropTagKind, SimReadyTier } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

function tagLabel(kind: PropTagKind) {
  switch (kind) {
    case "manipulation":
      return "Manipulation";
    case "articulated":
      return "Articulated";
    case "navigation":
      return "Navigation";
  }
}

const PROP_SHELF_CATEGORY: Record<string, string> = {
  tableware: "Kitchenware",
  cabinetry: "Furniture",
  appliance: "Appliance",
  decor: "Decor",
  lighting: "Lighting",
  furniture: "Furniture",
  seating: "Seating",
};

function shelfCategory(slug: string) {
  return PROP_SHELF_CATEGORY[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

function tagHeroClass(kind: PropTagKind) {
  if (kind === "manipulation") return "bg-[#fff1f2]";
  if (kind === "articulated") return "bg-[#fffbeb]";
  return "bg-[#eff6ff]";
}

function tagPillClass(kind: PropTagKind) {
  if (kind === "manipulation") return "border border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]";
  if (kind === "articulated") return "border border-[#fde68a] bg-[#fffbeb] text-[#b45309]";
  return "border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]";
}

function simReadyLabel(t: SimReadyTier) {
  if (t === "certified") return "Certified";
  if (t === "pending") return "Pending";
  return "Unsupported";
}

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
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [exportModalOpen, setExportModalOpen] = useState(false);
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
    <div className="space-y-[var(--s-400)]">
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
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.data?.map((p) => (
            <PropCard key={p.id} asset={p} onOpen={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Prop"}
        onClose={() => setSelectedId(null)}
        size="xl"
        contentAlign="start"
        hideHeader
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <PropDetail
            asset={selected}
            exportAllowed={fullExport}
            onGatedExport={() => setExportModalOpen(true)}
          />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Asset not found.</p>
        )}
      </CenterModal>

      <ExportAccessModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}

function PropCard({ asset, onOpen }: { asset: PropAsset; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm hover:shadow-md active:scale-[0.99] ${txInteract}`}
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${tagHeroClass(asset.tag)}`}>
        <span
          className={`absolute left-[var(--s-300)] top-[var(--s-300)] z-[1] rounded-br100 px-[var(--s-200)] py-[3px] text-[10px] font-bold leading-tight tracking-wide ${tagPillClass(asset.tag)}`}
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

function PropDetail({
  asset,
  exportAllowed,
  onGatedExport,
}: {
  asset: PropAsset;
  exportAllowed: boolean;
  onGatedExport: () => void;
}) {
  const run = (fn: () => void) => {
    if (!exportAllowed) {
      onGatedExport();
      return;
    }
    fn();
  };

  const dims = `${asset.dimensionsMm.w} × ${asset.dimensionsMm.h} × ${asset.dimensionsMm.d} mm`;
  return (
    <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(280px,1fr)_minmax(340px,420px)]">
      <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
        <img src={asset.thumbnailUrl} alt={asset.name} className="h-full w-full object-contain object-center" />
      </div>

      <div className="space-y-[var(--s-400)]">
        <div>
          <div className="flex items-center gap-[var(--s-200)]">
            <span className="rounded-br100 border border-[#fed7aa] bg-[#fff7ed] px-[var(--s-200)] py-[3px] text-[12px] font-semibold text-[#c2410c]">
              {tagLabel(asset.tag)}
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">
              {shelfCategory(asset.category)}
            </span>
          </div>
          <h3 className="mt-[var(--s-100)] text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {asset.name}
          </h3>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Dimensions
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              <tr className="border-b border-[var(--border-default-secondary)]">
                <td className="py-[var(--s-200)] text-[var(--text-default-body)]">W x H x D</td>
                <td className="py-[var(--s-200)] text-right font-mono text-[var(--text-default-heading)]">{dims}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Physics Properties
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              {(
                [
                  ["Mass", `${asset.massKg} kg`],
                  ["Material", asset.materialType],
                  ["Static Friction", String(asset.physics.frictionStatic)],
                  ["Dynamic Friction", String(asset.physics.frictionDynamic)],
                  ["Restitution", String(asset.physics.restitution)],
                  ["Density", `${asset.densityKgM3} kg/m3`],
                  ["Collision", asset.collisionLabel],
                ] as const
              ).map(([k, v]) => (
                <tr key={k} className="border-b border-[var(--border-default-secondary)]">
                  <td className="py-[var(--s-200)] text-[var(--text-default-body)]">{k}</td>
                  <td className="py-[var(--s-200)] text-right font-mono text-[var(--text-default-heading)]">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-[var(--s-200)] pt-[var(--s-100)]">
          <Button
            variant="primary"
            className={`w-full ${txBtn}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Download queued: SimReady USD");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download SimReady USD
          </Button>
          <Button
            variant="secondary"
            className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] ${txBtn}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Download queued: GLB");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download GLB
          </Button>
          <button
            type="button"
            className={`inline-flex w-full items-center justify-center gap-[var(--s-200)] text-center text-[14px] font-medium text-[var(--text-primary-default)] underline underline-offset-4 ${txInteract}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Metadata JSON — download queued");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download metadata
          </button>
        </div>
      </div>
    </div>
  );
}
