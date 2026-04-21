import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AssetCardLockOverlay } from "@/components/assets/AssetCardLockOverlay";
import { MaterialAssetDetail } from "@/components/assets/MaterialAssetDetail";
import { PropAssetDetail } from "@/components/assets/PropAssetDetail";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { fetchAssets, fetchMaterialById, fetchMaterials, fetchPropById } from "@/lib/mockApi";
import { assetKindPill } from "@/lib/prismSurfaces";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";

export function AssetsHubPage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [talkToTeamOpen, setTalkToTeamOpen] = useState(false);

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
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-[var(--s-300)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full min-w-0" />
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
      previewModelUrl: p.previewModelUrl,
      isLocked: p.isLocked ?? false,
    })),
    // ...materials.map((m) => ({
    //   id: m.id,
    //   kind: "material" as const,
    //   name: m.name,
    //   subtitle: m.type.charAt(0).toUpperCase() + m.type.slice(1),
    //   detail: `us ${m.staticFriction.toFixed(2)} · ud ${m.dynamicFriction.toFixed(2)}`,
    //   thumb: m.thumbnailUrl ?? "",
    //   meta: `e ${m.restitution.toFixed(2)}`,
    //   previewModelUrl: m.previewModelUrl,
    //   isLocked: false,
    // })),
  ];

  return (
    <>
    <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-400)]">
      {/* <AssetLibraryTabs /> */}

      <PageHeader
        title="Assets"
        description="Browse all physics-ready props and PBR materials with the same card layout used in the dedicated libraries."
      />

      <StaggerFadeGroup
        staggerMs={150}
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-[var(--s-300)]"
      >
        {allCards.map((item) => {
          const canOpen = !item.isLocked;
          return (
            <button
              key={`${item.kind}-${item.id}`}
              type="button"
              onClick={
                canOpen
                  ? () => setSelected({ kind: item.kind, id: item.id })
                  : () => setTalkToTeamOpen(true)
              }
              className={`asset-card-ring relative flex w-full min-w-0 flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm hover:-translate-y-1 hover:border-[rgba(236,78,11,0.3)] active:scale-[0.99] ${
                canOpen ? "" : "cursor-pointer"
              }`}
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden border-b border-[var(--border-default-secondary)]">
                {/* <span
                  className={`absolute left-[var(--s-300)] top-[var(--s-300)] z-[1] rounded-[4px] px-[var(--s-200)] py-[1px] text-[10px] font-semibold leading-tight tracking-[0.5px] ${
                    item.kind === "prop" ? assetKindPill.prop : assetKindPill.material
                  }`}
                >
                  {item.kind === "prop" ? "Prop" : "Material"}
                </span> */}
                {item.thumb ? <img src={item.thumb} alt="" className="h-full w-full object-contain p-[12px]" /> : null}
                {!canOpen ? <AssetCardLockOverlay /> : null}
              </div>
              <div className="px-[var(--s-500)] py-[var(--s-400)]">
                <div className="line-clamp-2 text-[14px] font-semibold leading-[1.3] text-[var(--text-default-heading)]">{item.name}</div>
                <div className="mt-[var(--s-100)] text-[12px] font-normal text-[var(--text-default-subtle)]">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </StaggerFadeGroup>
    </StaggerFadeGroup>

      <CenterModal
        open={Boolean(selected)}
        title={selected?.kind === "prop" ? selectedProp.data?.name ?? "Prop" : selectedMaterial.data?.name ?? "Material"}
        onClose={() => setSelected(null)}
        size="2xl"
        contentAlign="start"
        hideHeader
      >
        {selected?.kind === "prop" ? (
          selectedProp.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : selectedProp.data ? (
            <PropAssetDetail asset={selectedProp.data} />
          ) : (
            <p className="text-[14px] text-[var(--text-error-default)]">Asset not found.</p>
          )
        ) : selectedMaterial.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selectedMaterial.data ? (
          <MaterialAssetDetail
            material={selectedMaterial.data}
            exportAllowed={fullExport}
            onGatedExport={() => setExportModalOpen(true)}
          />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
        )}
      </CenterModal>

      <ExportAccessModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <TalkToTeamModal open={talkToTeamOpen} onClose={() => setTalkToTeamOpen(false)} />
    </>
  );
}
