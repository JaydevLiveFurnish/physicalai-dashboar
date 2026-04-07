import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { generateScene } from "@/lib/mockApi";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { Callout } from "@/components/system/Callout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";
import type { SceneGenerationResult } from "@/types";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity,transform] duration-250 ease-out";

export function KitchenConfiguratorPage() {
  const { accessTier } = useAuth();
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);

  const fullExport = canUseFeature(accessTier, "full_export");

  const summary = useMemo(() => {
    const entries = Object.entries(values) as [KitchenParamKey, string][];
    return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
  }, [values]);

  const mutation = useMutation({
    mutationFn: (opts: { fail?: boolean }) => generateScene(values as unknown as Record<string, string>, opts),
    onMutate: () => {
      setSceneResult(null);
      setError(null);
    },
    onSuccess: (data: SceneGenerationResult) => {
      setError(null);
      setSceneResult(data);
    },
    onError: (e: Error) => {
      setSceneResult(null);
      setError(e.message);
    },
  });

  const runMockExport = (kind: "usd" | "package") => {
    if (!sceneResult) return;
    alert(
      kind === "usd"
        ? `Download queued: scene.usd (mock)\n${sceneResult.sceneId}`
        : `Export queued: simulation package zip (mock)\n${sceneResult.checksum}`,
    );
  };

  return (
    <div className="space-y-[var(--s-400)]">
      <header className="flex flex-col gap-[var(--s-200)] sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Environment · Kitchen
          </p>
          <div className="mt-[var(--s-200)] flex flex-wrap items-center gap-[var(--s-300)]">
            <h1 className="text-page-title">Kitchen configurator</h1>
            {!fullExport ? <PreviewModeBadge /> : null}
          </div>
          <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
            Geometry-affecting parameters update the preview contract. Scene conditions are emitted as metadata for downstream
            datasets.
          </p>
        </div>
      </header>

      <Callout variant="info" title="Interactive preview">
        <p>
          Scene generation uses the <strong>mock pipeline</strong> for checksums and IDs.{" "}
          {!fullExport ? (
            <>
              <strong>Preview mode</strong> — configure parameters and generate preview scenes. Downloading{" "}
              <span className="font-mono text-[13px]">scene.usd</span> and the full simulation export package requires{" "}
              <strong>Full access</strong>.
            </>
          ) : (
            <>Full access is enabled for this session — exports below use mock queue responses.</>
          )}
        </p>
      </Callout>

      <div className="grid gap-[var(--s-400)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Card>
          <div className="mb-[var(--s-300)] flex flex-wrap items-center justify-between gap-[var(--s-200)]">
            <h2 className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
              Preview
            </h2>
            {!fullExport ? <PreviewModeBadge /> : null}
          </div>
          <div className="flex aspect-[16/10] items-center justify-center rounded-br100 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] text-[13px] text-[var(--text-default-body)]">
            Viewport placeholder (WebGL / USD stage)
          </div>
          <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
            Preview uses last resolved mesh graph; lighting and clutter may not affect collision hulls in real time.
          </p>
        </Card>

        <div className="space-y-[var(--s-300)]">
          {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
            ([group, params]) => (
              <Card key={group} title={group}>
                <div className="space-y-[var(--s-300)]">
                  {Object.entries(params).map(([key, opts]) => {
                    const k = key as KitchenParamKey;
                    return (
                      <label key={key} className="flex flex-col gap-[var(--s-100)] text-[12px] text-[var(--text-default-body)]">
                        {key}
                        <select
                          value={values[k]}
                          onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                          className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
                        >
                          {opts.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  })}
                </div>
              </Card>
            ),
          )}

          <Card title="Current configuration">
            <p className="font-mono text-[12px] leading-[18px] text-[var(--text-default-heading)]">{summary}</p>
            <div className="mt-[var(--s-400)] flex flex-wrap gap-[var(--s-200)]">
              <Button
                variant="primary"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({})}
              >
                {mutation.isPending ? "Generating…" : "Generate scene"}
              </Button>
              <Button variant="secondary" disabled={mutation.isPending} onClick={() => mutation.mutate({ fail: true })}>
                Simulate failure
              </Button>
            </div>
            {error ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-error-default)]">{error}</p>
            ) : null}
            {mutation.isSuccess && !error && sceneResult ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-success-default)]">
                Generation completed — scene <span className="font-mono">{sceneResult.sceneId}</span>.
              </p>
            ) : null}
          </Card>

          <Card title="Simulation exports">
            <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">
              After a successful generation, download the USD stage or the full structured package. These actions require{" "}
              <strong>full access</strong> for your organization.
            </p>
            <div className="mt-[var(--s-400)] flex flex-col gap-[var(--s-300)]">
              <Button
                variant="primary"
                className={`w-full ${txBtn}`}
                disabled={!sceneResult}
                onClick={() =>
                  fullExport ? runMockExport("usd") : setAccessModalOpen(true)
                }
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  {fullExport ? "download" : "lock"}
                </span>
                Download scene USD
              </Button>
              <Button
                variant="secondary"
                className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] ${txBtn}`}
                disabled={!sceneResult}
                onClick={() =>
                  fullExport ? runMockExport("package") : setAccessModalOpen(true)
                }
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  {fullExport ? "archive" : "lock"}
                </span>
                Export full simulation package
              </Button>
            </div>
            {!sceneResult ? (
              <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                Generate a scene first to enable export actions (preview still works without full access).
              </p>
            ) : !fullExport ? (
              <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                Locked in preview mode — request access to download real packages.
              </p>
            ) : null}
          </Card>
        </div>
      </div>

      <ExportAccessModal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} />
    </div>
  );
}
