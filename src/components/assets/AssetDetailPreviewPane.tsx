import GLBViewer from "@/components/library/GLBViewer";
import { hasPreviewModel } from "@/lib/assetPreview";

type AssetDetailPreviewPaneProps = {
  previewModelUrl?: string | null;
  /** Flat image for cards / modal fallback; omit when only 3D is available. */
  thumbnailUrl?: string | null;
  alt: string;
};

/** Left column for asset/material modals: GLB fills grid cell height beside the spec column (lg+). */
export function AssetDetailPreviewPane({ previewModelUrl, thumbnailUrl, alt }: AssetDetailPreviewPaneProps) {
  const shell =
    "relative flex h-full min-h-[280px] w-full min-w-0 flex-col overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] shadow-[inset_0_0_0_1px_var(--border-default-secondary)]";

  if (hasPreviewModel(previewModelUrl)) {
    return (
      <div className={shell}>
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            <GLBViewer
              glbPath={previewModelUrl!.trim()}
              fallbackImage={thumbnailUrl ?? ""}
              className="h-full w-full"
            />
            <p className="pointer-events-none absolute bottom-[var(--s-200)] left-[var(--s-200)] right-[var(--s-200)] text-center text-[11px] text-[var(--text-default-placeholder)]">
              Drag to orbit · scroll to zoom
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (thumbnailUrl) {
    return (
      <div className={shell}>
        <div className="relative min-h-0 flex-1">
          <img src={thumbnailUrl} alt={alt} className="h-full w-full object-contain object-center p-[var(--s-300)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${shell} items-center justify-center`}>
      <span className="material-symbols-outlined text-[72px] text-[var(--text-default-placeholder)]/40" aria-hidden>
        texture
      </span>
    </div>
  );
}
