import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchMaterials } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function MaterialsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const query = useMemo(() => ({ q: q || undefined, type }), [q, type]);
  const list = useQuery({ queryKey: ["materials", query], queryFn: () => fetchMaterials(query) });

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Asset library
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold text-[var(--text-default-heading)]">Materials</h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Physics presets: friction, restitution, density. Used by collision and grip simulation.
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
            />
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
            >
              <option value="all">All</option>
              <option value="laminate">laminate</option>
              <option value="stone_composite">stone_composite</option>
              <option value="metal">metal</option>
              <option value="polymer">polymer</option>
            </select>
          </label>
        </div>
      </Card>

      {list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3">
          {list.data?.map((m) => (
            <Card key={m.id}>
              <h2 className="mb-[var(--s-200)] text-[16px] font-semibold text-[var(--text-default-heading)]">
                {m.name}
              </h2>
              <p className="mb-[var(--s-300)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
                {m.type}
              </p>
              <dl className="grid grid-cols-2 gap-[var(--s-200)] text-[13px]">
                <div>
                  <dt className="text-[var(--text-default-body)]">μs</dt>
                  <dd className="font-mono">{m.staticFriction}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-default-body)]">μk</dt>
                  <dd className="font-mono">{m.dynamicFriction}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-default-body)]">Restitution</dt>
                  <dd className="font-mono">{m.restitution}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-default-body)]">Density</dt>
                  <dd className="font-mono">{m.densityKgM3} kg/m³</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
