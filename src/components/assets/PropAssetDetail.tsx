import { useCallback, useState } from "react";
import { AssetDetailPreviewPane } from "@/components/assets/AssetDetailPreviewPane";
import { Callout } from "@/components/system/Callout";
import { Button } from "@/components/ui/Button";
import { isAssetInWorkspace, recordAssetDownloaded } from "@/lib/workspaceAssetDownloads";
import type { PropAsset } from "@/types";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

const txLink =
  "text-[13px] font-medium text-[var(--text-default-body)] underline underline-offset-2 transition-[color] duration-200 hover:text-[var(--text-default-heading)]";

export function PropAssetDetail({ asset }: { asset: PropAsset }) {
  const inWorkspace = isAssetInWorkspace(asset.id);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const handleDownloadUsd = useCallback(async () => {
    const url = asset.usdUrl;
    if (!url) {
      setConfirmationMsg("Download failed. Please try again.");
      window.setTimeout(() => setConfirmationMsg(""), 5000);
      return;
    }
    setConfirmationMsg("Downloading...");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = url.split("/").pop()?.replace(/%20/g, " ") || `${asset.id}.usdz`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
      recordAssetDownloaded(asset.id);
      setConfirmationMsg("Download complete");
      window.setTimeout(() => setConfirmationMsg(""), 3000);
    } catch {
      setConfirmationMsg("Download failed. Please try again.");
      window.setTimeout(() => setConfirmationMsg(""), 5000);
    }
  }, [asset.id, asset.usdUrl]);

  const dims = `${asset.dimensionsMm.w} × ${asset.dimensionsMm.h} × ${asset.dimensionsMm.d} mm`;
  return (
    <div className="grid min-h-0 items-stretch gap-[var(--s-500)] lg:grid-cols-[minmax(420px,1.5fr)_minmax(300px,400px)]">
      <AssetDetailPreviewPane
        previewModelUrl={asset.previewModelUrl}
        thumbnailUrl={asset.thumbnailUrl}
        alt={asset.name}
      />

      <div className="min-w-0 space-y-[var(--s-500)] px-[var(--s-400)] py-[var(--s-400)] sm:px-[var(--s-600)] sm:py-[var(--s-500)] lg:px-[var(--s-600)] lg:py-[var(--s-600)]">
        {/* {inWorkspace ? (
          <Callout variant="info" title="In your workspace">
            This asset is already in your workspace.
          </Callout>
        ) : null} */}

        <h3 className="text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">{asset.name}</h3>

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

        <div className="space-y-[var(--s-300)] pt-[var(--s-200)]" role="group" aria-label="Download options">
          {confirmationMsg ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-br100 border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.08)] px-[var(--s-500)] py-[var(--s-400)] text-center text-[13px] leading-[1.5] text-[var(--text-default-heading)]"
            >
              {confirmationMsg}
            </div>
          ) : null}
          <Button
            variant="primary"
            className={`w-full text-[14px] font-semibold ${txBtn}`}
            onClick={handleDownloadUsd}
            disabled={confirmationMsg === "Downloading..." || !asset.usdUrl}
          >
            Download USD
          </Button>
          {/* <Button
            variant="secondary"
            className={`w-full border-[var(--border-primary-default)] bg-[var(--surface-default)] text-[14px] font-semibold text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] ${txBtn}`}
            onClick={() => {
              recordAssetDownloaded(asset.id);
              alert("Download queued: GLB");
            }}
          >
            Download GLB Preview
          </Button>
          <div className="flex justify-center pt-[var(--s-100)]">
            <button
              type="button"
              className={`inline-flex items-center gap-[var(--s-200)] ${txLink}`}
              onClick={() => {
                recordAssetDownloaded(asset.id);
                alert("Metadata JSON — download queued");
              }}
            >
              Download Metadata
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
