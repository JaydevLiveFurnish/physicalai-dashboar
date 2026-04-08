import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchAssets, fetchMaterialById, fetchMaterials, fetchPropById } from "@/lib/mockApi";
import { assetKindPill } from "@/lib/prismSurfaces";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";

export function AssetsHubPage() {
  const propsList = useQuery({ queryKey: ["assets", "all-hub"], queryFn: () => fetchAssets({}) });
  const materialsList = useQuery({ queryKey: ["materials", "all-hub"], queryFn: () => fetchMaterials({}) });
  const [selected, setSelected] = useState<{ kind: "prop" | "material"; id: string } | null>(null);
  const isLoading = propsList.isLoading || materialsList.isLoading;
  const isError = propsList.isError || materialsList.isError;
  const selectedProp = useQuery({
    queryKey: ["asset", "all-hub", selected?.kind, selected?.id],
    queryFn: () => fetchPropById(selected!.id),
    enabled: selected?.kind === "prop",
  });
  const selectedMaterial = useQuery({
    queryKey: ["material", "all-hub", selected?.kind, selected?.id],
    queryFn: () => fetchMaterialById(selected!.id),
    enabled: selected?.kind === "material",
  });

  if (isLoading) {
    return (
      <div className="space-y-[var(--s-500)]">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorPanel
        message="We couldn’t load assets. Check your connection and try again."
        onRetry={() => {
          propsList.refetch();
          materialsList.refetch();
        }}
      />
    );
  }

  const props = propsList.data ?? [];
  const materials = materialsList.data ?? [];

  const allCards = [
    ...props.map((p) => ({
      id: p.id,
      kind: "prop" as const,
      name: p.name,
      subtitle: p.category.charAt(0).toUpperCase() + p.category.slice(1),
      detail: `${p.massKg} kg`,
      thumb: p.thumbnailUrl,
      meta: `SimReady: ${p.simReady}`,
    })),
    ...materials.map((m) => ({
      id: m.id,
      kind: "material" as const,
      name: m.name,
      subtitle: m.type.charAt(0).toUpperCase() + m.type.slice(1),
      detail: `us ${m.staticFriction.toFixed(2)} · ud ${m.dynamicFriction.toFixed(2)}`,
      thumb: m.thumbnailUrl ?? "",
      meta: `e ${m.restitution.toFixed(2)}`,
    })),
  ];

  return (
    <div className="space-y-[var(--s-400)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Assets"
        description="Browse all physics-ready props and PBR materials with the same card layout used in the dedicated libraries."
      />

      <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCards.map((item) => (
          <button
            key={`${item.kind}-${item.id}`}
            type="button"
            onClick={() => setSelected({ kind: item.kind, id: item.id })}
            className="flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm transition-[box-shadow,transform] duration-250 ease-out hover:shadow-md active:scale-[0.99]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
              <span
                className={`absolute left-[var(--s-300)] top-[var(--s-300)] z-[1] rounded-br100 px-[var(--s-200)] py-[3px] text-[10px] font-bold leading-tight tracking-wide ${
                  item.kind === "prop" ? assetKindPill.prop : assetKindPill.material
                }`}
              >
                {item.kind === "prop" ? "Prop" : "Material"}
              </span>
              {item.thumb ? <img src={item.thumb} alt="" className="h-full w-full object-cover object-center" /> : null}
            </div>
            <div className="space-y-[var(--s-200)] px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
              <span className="block text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">{item.name}</span>
              <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">{item.subtitle}</p>
              <p className="text-[13px] text-[var(--text-default-body)]">{item.detail}</p>
              <p className="text-[12px] text-[var(--text-default-placeholder)]">{item.meta}</p>
            </div>
          </button>
        ))}
      </div>

      <CenterModal
        open={Boolean(selected)}
        title={selected?.kind === "prop" ? selectedProp.data?.name ?? "Prop" : selectedMaterial.data?.name ?? "Material"}
        onClose={() => setSelected(null)}
        size="xl"
        contentAlign="start"
        hideHeader
      >
        {selected?.kind === "prop" ? (
          selectedProp.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : selectedProp.data ? (
            <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(280px,1fr)_minmax(340px,420px)]">
              <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
                <img
                  src={selectedProp.data.thumbnailUrl}
                  alt={selectedProp.data.name}
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <div className="space-y-[var(--s-300)]">
                <h3 className="text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">{selectedProp.data.name}</h3>
                <p className="text-[14px] text-[var(--text-default-body)]">
                  {selectedProp.data.category} · {selectedProp.data.massKg} kg · {selectedProp.data.materialType}
                </p>
                <Link to="/assets/props">
                  <Button variant="primary">Open in Props</Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[var(--text-error-default)]">Asset not found.</p>
          )
        ) : selectedMaterial.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selectedMaterial.data ? (
          <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(280px,1fr)_minmax(340px,420px)]">
            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
              {selectedMaterial.data.thumbnailUrl ? (
                <img
                  src={selectedMaterial.data.thumbnailUrl}
                  alt={selectedMaterial.data.name}
                  className="h-full w-full object-contain object-center"
                />
              ) : null}
            </div>
            <div className="space-y-[var(--s-300)]">
              <h3 className="text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">{selectedMaterial.data.name}</h3>
              <p className="text-[14px] text-[var(--text-default-body)]">
                {selectedMaterial.data.type} · us {selectedMaterial.data.staticFriction.toFixed(2)} · ud{" "}
                {selectedMaterial.data.dynamicFriction.toFixed(2)}
              </p>
              <Link to="/assets/materials">
                <Button variant="primary">Open in Materials</Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
        )}
      </CenterModal>
    </div>
  );
}
