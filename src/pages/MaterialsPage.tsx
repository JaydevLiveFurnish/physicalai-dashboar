import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMaterialById, fetchMaterials } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { EmptyState } from "@/components/system/EmptyState";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";
import type { MaterialRecord } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

function materialFrictionLine(m: MaterialRecord) {
  const us = m.staticFriction.toFixed(2);
  const ud = m.dynamicFriction.toFixed(2);
  const e = m.restitution.toFixed(2);
  return `us ${us} · ud ${ud} · e ${e}`;
}

function categoryLabel(m: MaterialRecord) {
  if (m.categoryLabel) return m.categoryLabel;
  return m.type.charAt(0).toUpperCase() + m.type.slice(1);
}

function materialPreviewAccent(type: string) {
  if (type === "wood") return "bg-[#fefce8]";
  if (type === "metal") return "bg-[#f8fafc]";
  if (type === "glass") return "bg-[#ecfeff]";
  if (type === "stone") return "bg-[#fafaf9]";
  if (type === "tile") return "bg-[#fff7ed]";
  if (type === "plastic") return "bg-[#f5f3ff]";
  if (type === "fabric") return "bg-[#fdf4ff]";
  return "bg-[#fefce8]";
}

function useMaterialSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "all";

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

  return { q, type, setParam };
}

export function MaterialsPage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { q, type, setParam } = useMaterialSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      q: q.trim() || undefined,
      type,
    }),
    [q, type],
  );

  const list = useQuery({
    queryKey: ["materials", q.trim(), type] as const,
    queryFn: () => fetchMaterials(query),
  });

  const detail = useQuery({
    queryKey: ["material", selectedId],
    queryFn: () => fetchMaterialById(selectedId!),
    enabled: Boolean(selectedId),
  });
  const selected = detail.data ?? null;

  return (
    <div className="space-y-[var(--s-400)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Materials"
        description="PBR surfaces with friction and restitution presets for Kitchen environments — wood, metal, glass, stone, tile, and fabrics."
        actions={
          <div className="flex flex-wrap gap-[var(--s-200)] lg:justify-end">
            <Button variant="secondary" type="button" className={txBtn} onClick={() => setTalkOpen(true)}>
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                upload
              </span>
              Upload / Add New
            </Button>
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              className={`inline-flex items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${txInteract}`}
            >
              <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">tune</span>
              {filtersOpen ? "Hide filters" : "Filters"}
            </button>
            <Button
              variant="secondary"
              type="button"
              className={txBtn}
              aria-haspopup={!fullExport ? "dialog" : undefined}
              onClick={() => {
                if (!fullExport) {
                  setExportModalOpen(true);
                  return;
                }
                alert("Bulk export queued: material library manifest");
              }}
            >
              {!fullExport ? (
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  lock
                </span>
              ) : null}
              Bulk export
            </Button>
          </div>
        }
      />

      {filtersOpen ? (
        <div id="material-filters">
          <Card className="p-[var(--s-300)] sm:p-[var(--s-400)]">
          <label className="flex max-w-xs flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
            Type
            <select
              value={type}
              onChange={(e) => setParam("type", e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
            >
              <option value="all">All</option>
              <option value="wood">Wood</option>
              <option value="metal">Metal</option>
              <option value="glass">Glass</option>
              <option value="stone">Stone</option>
              <option value="tile">Tile / ceramic</option>
              <option value="plastic">Plastic</option>
              <option value="fabric">Fabric</option>
            </select>
          </label>
          </Card>
        </div>
      ) : null}

      {list.isError ? (
        <ErrorPanel message="Materials couldn’t be loaded." onRetry={() => list.refetch()} />
      ) : list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : list.data?.length === 0 ? (
        <EmptyState
          title="No materials match"
          description="Try clearing search or type filters to see the full library."
        />
      ) : (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.data?.map((m) => (
            <MaterialCard key={m.id} material={m} onOpen={() => setSelectedId(m.id)} />
          ))}
        </div>
      )}

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Material"}
        onClose={() => setSelectedId(null)}
        size="xl"
        contentAlign="start"
        hideHeader
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <MaterialDetail
            material={selected}
            exportAllowed={fullExport}
            onGatedExport={() => setExportModalOpen(true)}
          />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
        )}
      </CenterModal>

      <ExportAccessModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}

function MaterialCard({ material, onOpen }: { material: MaterialRecord; onOpen: () => void }) {
  const accent = materialPreviewAccent(material.type);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm hover:shadow-md active:scale-[0.99] ${txInteract}`}
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-t-[var(--br-200)] ${accent}`}>
        {material.thumbnailUrl ? (
          <img
            src={material.thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[44px] text-[var(--text-default-heading)] opacity-[0.14]">
              grid_on
            </span>
          </div>
        )}
      </div>
      <div className="space-y-[var(--s-200)] px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
        <h2 className="text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">{material.name}</h2>
        <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">{categoryLabel(material)}</p>
        <p className="font-mono text-[12px] leading-[18px] text-[var(--text-default-placeholder)]">{materialFrictionLine(material)}</p>
        {material.physicsLineOverride ? (
          <p className="text-[12px] leading-[16px] text-[var(--text-default-body)]">{material.physicsLineOverride}</p>
        ) : null}
      </div>
    </button>
  );
}

function MaterialDetail({
  material,
  exportAllowed,
  onGatedExport,
}: {
  material: MaterialRecord;
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

  return (
    <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(280px,1fr)_minmax(340px,420px)]">
      <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
        {material.thumbnailUrl ? (
          <img src={material.thumbnailUrl} alt={material.name} className="h-full w-full object-contain object-center" />
        ) : (
          <span className="material-symbols-outlined text-[72px] text-[var(--text-default-placeholder)]/40">texture</span>
        )}
      </div>

      <div className="space-y-[var(--s-400)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">
            {categoryLabel(material)}
          </p>
          <h3 className="mt-[var(--s-100)] text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {material.name}
          </h3>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Physics Properties
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              {(
                [
                  ["Static Friction", String(material.staticFriction)],
                  ["Dynamic Friction", String(material.dynamicFriction)],
                  ["Restitution", String(material.restitution)],
                  ["Density", `${material.densityKgM3} kg/m3`],
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
                alert("Download queued: Material USD");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download Material USD
          </Button>
          <Button
            variant="secondary"
            className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] ${txBtn}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Download queued: PBR textures");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download PBR Textures
          </Button>
        </div>
      </div>
    </div>
  );
}
