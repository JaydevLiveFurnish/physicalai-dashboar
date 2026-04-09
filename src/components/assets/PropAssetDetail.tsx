import { AssetDetailPreviewPane } from "@/components/assets/AssetDetailPreviewPane";
import { Button } from "@/components/ui/Button";
import { propTagPill } from "@/lib/prismSurfaces";
import { shelfCategory, tagLabel } from "@/lib/propDisplay";
import type { PropAsset } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

export function PropAssetDetail({
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
    <div className="grid min-h-0 items-stretch gap-[var(--s-500)] lg:grid-cols-[minmax(420px,1.5fr)_minmax(300px,400px)]">
      <AssetDetailPreviewPane
        previewModelUrl={asset.previewModelUrl}
        thumbnailUrl={asset.thumbnailUrl}
        alt={asset.name}
      />

      <div className="min-w-0 space-y-[var(--s-400)]">
        <div>
          <div className="flex flex-wrap items-center gap-[var(--s-200)]">
            <span className={`rounded-br100 px-[var(--s-200)] py-[3px] text-[12px] font-semibold ${propTagPill[asset.tag]}`}>
              {tagLabel(asset.tag)}
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">
              {shelfCategory(asset.category)}
            </span>
          </div>
          <h3 className="mt-[var(--s-100)] text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {asset.name}
          </h3>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Dimensions
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              <tr className="border-b border-[var(--border-default-secondary)]">
                <td className="py-[var(--s-200)] text-[var(--text-default-body)]">W x H x D</td>
                <td className="py-[var(--s-200)] text-right font-mono text-[var(--text-default-heading)]">{dims}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Physics Properties
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              {(
                [
                  ["Mass", `${asset.massKg} kg`],
                  ["Material", asset.materialType],
                  ["Static Friction", String(asset.physics.frictionStatic)],
                  ["Dynamic Friction", String(asset.physics.frictionDynamic)],
                  ["Restitution", String(asset.physics.restitution)],
                  ["Density", `${asset.densityKgM3} kg/m3`],
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

        <div className="space-y-[var(--s-200)] pt-[var(--s-100)]">
          <Button
            variant="primary"
            className={`w-full ${txBtn}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Download queued: SimReady USD");
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
                alert("Download queued: GLB");
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
                alert("Metadata JSON — download queued");
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
    </div>
  );
}
