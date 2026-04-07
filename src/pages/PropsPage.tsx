import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchAssets, fetchPropById } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Skeleton } from "@/components/ui/Skeleton";
import type { PropAsset } from "@/types";

export function PropsPage() {
  const [q, setQ] = useState("");
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
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Asset library
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold leading-[32px] text-[var(--text-default-heading)]">
          Props
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Scanned objects with collision proxies, articulation metadata, and material bindings.
        </p>
      </header>

      <Card>
        <div className="flex flex-col gap-[var(--s-300)] md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
              placeholder="id, name, category"
            />
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
            >
              <option value="all">All</option>
              <option value="cabinetry">cabinetry</option>
              <option value="appliance">appliance</option>
              <option value="seating">seating</option>
            </select>
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            SimReady
            <select
              value={simReady}
              onChange={(e) => setSimReady(e.target.value)}
              className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
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
              className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
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

      {list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : list.data?.length === 0 ? (
        <Card title="Results">
          <p className="text-[14px] text-[var(--text-default-body)]">No props match filters.</p>
        </Card>
      ) : (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3">
          {list.data?.map((p) => (
            <PropCard key={p.id} asset={p} onOpen={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}

      <Drawer
        open={Boolean(selectedId)}
        title={selected?.name ?? "Prop"}
        onClose={() => setSelectedId(null)}
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <PropDetail asset={selected} />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Asset not found.</p>
        )}
      </Drawer>
    </div>
  );
}

function PropCard({ asset, onOpen }: { asset: PropAsset; onOpen: () => void }) {
  const sim =
    asset.simReady === "certified" ? "success" : asset.simReady === "pending" ? "warning" : "error";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left transition-shadow hover:shadow-md"
    >
      <img src={asset.thumbnailUrl} alt="" className="h-[100px] w-full rounded-t-[var(--br-200)] object-cover" />
      <div className="space-y-[var(--s-200)] p-[var(--s-300)]">
        <div className="flex items-start justify-between gap-[var(--s-200)]">
          <span className="text-[14px] font-semibold leading-[18px] text-[var(--text-default-heading)]">
            {asset.name}
          </span>
          <Badge variant={sim}>{asset.simReady}</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">
          <div>
            <dt>Mass</dt>
            <dd className="font-mono text-[var(--text-default-heading)]">{asset.massKg} kg</dd>
          </div>
          <div>
            <dt>Collision</dt>
            <dd className="font-mono text-[var(--text-default-heading)]">{asset.collision}</dd>
          </div>
          <div>
            <dt>Articulation</dt>
            <dd className="text-[var(--text-default-heading)]">
              {asset.articulationJoints} · {asset.articulationType}
            </dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd className="text-[var(--text-default-heading)]">{asset.materialType}</dd>
          </div>
        </dl>
      </div>
    </button>
  );
}

function PropDetail({ asset }: { asset: PropAsset }) {
  return (
    <div className="space-y-[var(--s-400)]">
      <div className="grid grid-cols-2 gap-[var(--s-200)]">
        {asset.previewUrls.map((u) => (
          <img key={u} src={u} alt="" className="rounded-br100 border border-[var(--border-default-secondary)]" />
        ))}
      </div>
      <div>
        <h3 className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Physics
        </h3>
        <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
          <tbody>
            {(
              [
                ["Inertia (kg·m²)", asset.physics.inertiaApproxKgM2.join(" / ")],
                ["μs", String(asset.physics.frictionStatic)],
                ["μk", String(asset.physics.frictionDynamic)],
                ["Restitution", String(asset.physics.restitution)],
                ["Collision margin (mm)", String(asset.physics.collisionMarginMm)],
              ] as const
            ).map(([k, v]) => (
              <tr key={k} className="border-b border-[var(--border-default-secondary)]">
                <td className="py-[var(--s-200)] text-[var(--text-default-body)]">{k}</td>
                <td className="py-[var(--s-200)] font-mono text-[var(--text-default-heading)]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          alert("Download queued: prop bundle (USDZ) — mock");
        }}
      >
        Download USD package
      </Button>
    </div>
  );
}
