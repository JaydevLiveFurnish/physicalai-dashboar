import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAssets, fetchMaterials } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Skeleton } from "@/components/ui/Skeleton";

export function AssetsHubPage() {
  const propsList = useQuery({ queryKey: ["assets", "all-hub"], queryFn: () => fetchAssets({}) });
  const materialsList = useQuery({ queryKey: ["materials", "all-hub"], queryFn: () => fetchMaterials({}) });
  const isLoading = propsList.isLoading || materialsList.isLoading;
  const isError = propsList.isError || materialsList.isError;

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
      href: "/assets/props",
    })),
    ...materials.map((m) => ({
      id: m.id,
      kind: "material" as const,
      name: m.name,
      subtitle: m.type.charAt(0).toUpperCase() + m.type.slice(1),
      detail: `us ${m.staticFriction.toFixed(2)} · ud ${m.dynamicFriction.toFixed(2)}`,
      thumb: m.thumbnailUrl ?? "",
      href: "/assets/materials",
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
          <Link
            key={`${item.kind}-${item.id}`}
            to={item.href}
            className="flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm transition-[box-shadow,transform] duration-250 ease-out hover:shadow-md active:scale-[0.99]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
              <span
                className={`absolute left-[var(--s-300)] top-[var(--s-300)] z-[1] rounded-br100 px-[var(--s-200)] py-[3px] text-[10px] font-bold leading-tight tracking-wide ${
                  item.kind === "prop"
                    ? "border border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]"
                    : "border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]"
                }`}
              >
                {item.kind === "prop" ? "Prop" : "Material"}
              </span>
              {item.thumb ? <img src={item.thumb} alt="" className="h-full w-full object-cover object-center" /> : null}
            </div>
            <div className="space-y-[var(--s-200)] px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
              <span className="block text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">{item.name}</span>
              <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">{item.subtitle}</p>
              <p className="text-[12px] text-[var(--text-default-placeholder)]">{item.detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
