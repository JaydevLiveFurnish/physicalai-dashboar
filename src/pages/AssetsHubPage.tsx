import { useMemo, useState } from "react";
import AssetCard from "@/components/library/AssetCard";
import AssetDetailModal, { type Asset } from "@/components/library/AssetDetailModal";
import assetsData from "@/data/assets.json";
import { PageHeader } from "@/components/layout/PageHeader";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";

const CATEGORY_ORDER = [
  "Appliances",
  "Cabinetry",
  "Cookware",
  "Tableware",
  "Utensils",
  "Food",
  "Decor",
] as const;

const CATEGORY_TABS: ReadonlyArray<string> = ["All", ...CATEGORY_ORDER];

const categoryRank = new Map<string, number>(CATEGORY_ORDER.map((c, i) => [c, i]));

const SORTED_ASSETS: Asset[] = (assetsData as Asset[])
  .slice()
  .sort((a, b) => {
    const catCompare = (categoryRank.get(a.category) ?? 99) - (categoryRank.get(b.category) ?? 99);
    if (catCompare !== 0) return catCompare;
    const orderCompare = (a.displayOrder ?? 100) - (b.displayOrder ?? 100);
    if (orderCompare !== 0) return orderCompare;
    return a.name.localeCompare(b.name);
  });

export function AssetsHubPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? SORTED_ASSETS
        : SORTED_ASSETS.filter((a) => a.category === activeFilter),
    [activeFilter],
  );

  return (
    <>
      <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-400)]">
        <PageHeader
          title="Assets"
          description="Sub-millimeter accurate SimReady 3D models with physics, materials, and collision data — ready for NVIDIA Isaac Sim."
        />

        <div className="flex flex-wrap items-center gap-[var(--s-200)]">
          {CATEGORY_TABS.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className="rounded-full border px-[var(--s-500)] py-[var(--s-200)] text-[14px] font-medium transition-colors"
                style={{
                  background: isActive ? "var(--accent)" : "var(--surface-card)",
                  borderColor: isActive ? "var(--accent)" : "var(--surface-card-border)",
                  color: isActive ? "var(--white)" : "var(--text-default-heading)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-[80px] text-center text-[var(--text-caption-color)]">
            No assets in this category yet. More coming soon.
          </p>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-[var(--s-500)]">
            {filtered.map((asset, i) => (
              <AssetCard key={asset.id} asset={asset} index={i} onSelect={setSelectedAsset} />
            ))}
          </div>
        )}
      </StaggerFadeGroup>

      <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  );
}
