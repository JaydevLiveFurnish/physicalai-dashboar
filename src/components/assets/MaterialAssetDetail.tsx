import { AssetDetailPreviewPane } from "@/components/assets/AssetDetailPreviewPane";
import { Button } from "@/components/ui/Button";
import { categoryLabel } from "@/lib/materialDisplay";
import type { MaterialRecord } from "@/types";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

export function MaterialAssetDetail({
  material,
  exportAllowed,
  onGatedExport,
}: {
  material: MaterialRecord;
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

  return (
    <div className="grid min-h-0 items-stretch gap-[var(--s-500)] lg:grid-cols-[minmax(420px,1.5fr)_minmax(300px,400px)]">
      <AssetDetailPreviewPane
        previewModelUrl={material.previewModelUrl}
        thumbnailUrl={material.thumbnailUrl}
        alt={material.name}
      />

      <div className="min-w-0 space-y-[var(--s-400)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">
            {categoryLabel(material)}
          </p>
          <h3 className="mt-[var(--s-100)] text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {material.name}
          </h3>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Physics Properties
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              {(
                [
                  ["Static Friction", String(material.staticFriction)],
                  ["Dynamic Friction", String(material.dynamicFriction)],
                  ["Restitution", String(material.restitution)],
                  ["Density", `${material.densityKgM3} kg/m3`],
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
                alert("Download queued: Material USD");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download Material USD
          </Button>
          <Button
            variant="secondary"
            className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] ${txBtn}`}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() =>
              run(() => {
                alert("Download queued: PBR textures");
              })
            }
          >
            {!exportAllowed ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : null}
            Download PBR Textures
          </Button>
        </div>
      </div>
    </div>
  );
}
