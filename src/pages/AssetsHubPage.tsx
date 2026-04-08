import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSystemOverview } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { tx } from "@/components/layout/motion";

const txCardLink =
  "mt-[var(--s-400)] inline-flex items-center gap-0.5 text-[14px] font-medium text-[var(--text-primary-default)] hover:underline";

const propThumbs = [
  "/assets/Props/Dining Chair.png",
  "/assets/Props/Bar Stool.png",
  "/assets/Props/Coffee Machine.png",
  "/assets/Props/Floor Lamp.png",
];

const materialThumbs = [
  "/assets/Materials/Carrara Marble.png",
  "/assets/Materials/Oak Wood.png",
  "/assets/Materials/Stainless Steel.png",
  "/assets/Materials/Ceramic Tile.png",
];

export function AssetsHubPage() {
  const overview = useQuery({ queryKey: ["overview"], queryFn: fetchSystemOverview });

  if (overview.isLoading) {
    return (
      <div className="space-y-[var(--s-400)]">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <ErrorPanel
        message="We couldn’t load asset counts. Check your connection and try again."
        onRetry={() => overview.refetch()}
      />
    );
  }

  const { propsCount, materialsCount } = overview.data.assets;

  return (
    <div className="space-y-[var(--s-500)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Assets"
        description="Browse physics-ready props and PBR materials for Kitchen environments. Open a library to filter and inspect assets."
      />

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="grid h-[200px] grid-cols-2 gap-[1px] bg-[var(--border-default-secondary)]">
            {propThumbs.map((src, idx) => (
              <img key={src} src={src} alt="" className={`h-full w-full bg-[var(--surface-page-secondary)] object-cover ${idx === 0 ? "object-[55%_45%]" : ""}`} />
            ))}
          </div>
          <div className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start justify-between gap-[var(--s-300)]">
              <div>
                <h2 className="text-[20px] font-semibold text-[var(--text-default-heading)]">Props</h2>
                <p className="mt-[var(--s-200)] text-[14px] leading-[22px] text-[var(--text-default-body)]">
                  Kitchen-native props with collision proxies, articulation metadata, and SimReady tiers.
                </p>
              </div>
              <span className="rounded-br100 border border-[#7eb8ff]/40 bg-[#e8f2ff] px-[var(--s-200)] py-[4px] text-[12px] font-medium text-[#2563eb]">
                Library
              </span>
            </div>
            <p className="mt-[var(--s-300)] text-[32px] font-semibold tabular-nums text-[var(--text-default-heading)]">
              {propsCount.toLocaleString()}
              <span className="ml-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">assets</span>
            </p>
            <Link to="/assets/props" className={`${txCardLink} ${tx}`}>
              Open props
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="grid h-[200px] grid-cols-2 gap-[1px] bg-[var(--border-default-secondary)]">
            {materialThumbs.map((src, idx) => (
              <img key={src} src={src} alt="" className={`h-full w-full bg-[var(--surface-page-secondary)] object-cover ${idx === 0 ? "object-[55%_45%]" : ""}`} />
            ))}
          </div>
          <div className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start justify-between gap-[var(--s-300)]">
              <div>
                <h2 className="text-[20px] font-semibold text-[var(--text-default-heading)]">Materials</h2>
                <p className="mt-[var(--s-200)] text-[14px] leading-[22px] text-[var(--text-default-body)]">
                  PBR surfaces with friction, restitution, and density presets for simulation.
                </p>
              </div>
              <span className="rounded-br100 border border-[#86efac]/40 bg-[#ecfdf5] px-[var(--s-200)] py-[4px] text-[12px] font-medium text-[#15803d]">
                Library
              </span>
            </div>
            <p className="mt-[var(--s-300)] text-[32px] font-semibold tabular-nums text-[var(--text-default-heading)]">
              {materialsCount.toLocaleString()}
              <span className="ml-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">assets</span>
            </p>
            <Link to="/assets/materials" className={`${txCardLink} ${tx}`}>
              Open materials
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
