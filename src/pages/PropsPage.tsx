import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAssets, fetchPropById } from "@/lib/mockApi";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";
import type { PropAsset, PropTagKind } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

function tagClasses(kind: PropTagKind) {
  if (kind === "navigation") return "text-[#2563eb]";
  return "text-[var(--text-primary-default)]";
}

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

export function PropsPage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);
  const [category, setCategory] = useState("all");
  const [simReady, setSimReady] = useState("all");
  const [articulation, setArticulation] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo(
    () => ({ q: q || undefined, category, simReady, articulation }),
    [q, category, simReady, articulation],
  );

  const list = useQuery({ queryKey: ["assets", query], queryFn: () => fetchAssets(query) });
  const detail = useQuery({
    queryKey: ["asset", selectedId],
    queryFn: () => fetchPropById(selectedId!),
    enabled: Boolean(selectedId),
  });

  const selected = detail.data ?? null;

  return (
    <div className="space-y-[var(--s-400)]">
      <header className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Asset library
          </p>
          <h1 className="text-page-title mt-[var(--s-200)]">Props</h1>
          <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
            Kitchen-native props — cabinetry, island, brass hardware, prep tools — with collision proxies and material
            bindings.
          </p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-[var(--s-200)] self-start rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${txInteract}`}
        >
          <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">tune</span>
          Filters
        </button>
      </header>

      <Card>
        <div className="flex flex-col gap-[var(--s-300)] md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
              placeholder="id, name, category"
            />
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            SimReady
            <select
              value={simReady}
              onChange={(e) => setSimReady(e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
            >
              <option value="all">All</option>
              <option value="certified">certified</option>
              <option value="pending">pending</option>
              <option value="unsupported">unsupported</option>
            </select>
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Articulation
            <select
              value={articulation}
              onChange={(e) => setArticulation(e.target.value)}
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

      {list.isError ? (
        <ErrorPanel message="Props couldn’t be loaded." onRetry={() => list.refetch()} />
      ) : list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : list.data?.length === 0 ? (
        <Card title="Results">
          <p className="text-[14px] text-[var(--text-default-body)]">No props match filters.</p>
        </Card>
      ) : (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {list.data?.map((p) => (
            <PropCard key={p.id} asset={p} onOpen={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Prop"}
        onClose={() => setSelectedId(null)}
        size="lg"
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
    </div>
  );
}

function PropCard({ asset, onOpen }: { asset: PropAsset; onOpen: () => void }) {
  const sub = `${asset.massKg} kg, ${asset.materialType}`;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex flex-col rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left hover:shadow-md active:scale-[0.99] ${txInteract}`}
    >
      <div className="flex items-center gap-[var(--s-100)] px-[var(--s-300)] pt-[var(--s-300)] text-[11px] font-semibold uppercase tracking-wide">
        <span className={`inline-flex items-center gap-0.5 ${tagClasses(asset.tag)}`}>
          {asset.tag === "articulated" ? (
            <span className="material-symbols-outlined text-[14px]" aria-hidden>
              all_inclusive
            </span>
          ) : null}
          {tagLabel(asset.tag)}
        </span>
      </div>
      <div className="px-[var(--s-300)] pb-[var(--s-200)] pt-[var(--s-200)]">
        <img
          src={asset.thumbnailUrl}
          alt=""
          className="h-[100px] w-full rounded-br100 object-cover opacity-95"
        />
      </div>
      <div className="space-y-[var(--s-100)] px-[var(--s-300)] pb-[var(--s-300)]">
        <span className="text-[14px] font-semibold leading-[18px] text-[var(--text-default-heading)]">
          {asset.name}
        </span>
        <p className="text-[12px] leading-[16px] text-[var(--text-default-body)]">{sub}</p>
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
    <div className="space-y-[var(--s-500)]">
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${tagClasses(asset.tag)}`}>
        {tagLabel(asset.tag)}
      </p>

      <div>
        <h3 className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Dimensions
        </h3>
        <p className="mt-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
          <span className="text-[var(--text-default-body)]">W × H × D</span>
          <span className="mx-[var(--s-200)] text-[var(--border-default-secondary)]">·</span>
          <span className="font-mono text-[var(--text-default-heading)]">{dims}</span>
        </p>
      </div>

      <div>
        <h3 className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Physics properties
        </h3>
        <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
          <tbody>
            {(
              [
                ["Mass", `${asset.massKg} kg`],
                ["Material", asset.materialType],
                ["Static friction", String(asset.physics.frictionStatic)],
                ["Dynamic friction", String(asset.physics.frictionDynamic)],
                ["Restitution", String(asset.physics.restitution)],
                ["Density", `${asset.densityKgM3} kg/m³`],
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

      <div className="space-y-[var(--s-300)]">
        <Button
          variant="primary"
          className={`w-full ${txBtn}`}
          aria-haspopup={!exportAllowed ? "dialog" : undefined}
          onClick={() =>
            run(() => {
              alert("Download queued: SimReady USD — mock");
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
              alert("Download queued: GLB — mock");
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
              alert("Metadata JSON — mock");
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
  );
}
