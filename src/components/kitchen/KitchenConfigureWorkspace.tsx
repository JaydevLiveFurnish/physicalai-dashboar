import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { computeKitchenSceneSummary } from "@/kitchen/sceneSummary";
import { generateScene } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining, tryConsume } from "@/lib/kitchenLimits";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Button } from "@/components/ui/Button";
import type { SceneGenerationResult } from "@/types";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-heading)]";

const selectClass =
  "mt-[var(--s-100)] w-full cursor-pointer appearance-none rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] pr-[2.25rem] text-[14px] text-[var(--text-default-heading)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";

const selectChevron = (
  <span
    className="pointer-events-none absolute right-[var(--s-300)] top-1/2 -translate-y-1/2 text-[var(--text-default-placeholder)]"
    aria-hidden
  >
    <span className="material-symbols-outlined text-[20px]">expand_more</span>
  </span>
);

const txBtn =
  "inline-flex w-full items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity,transform] duration-250 ease-out";

export function KitchenConfigureWorkspace() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [talkOpen, setTalkOpen] = useState(false);
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const snapshot = useMemo(() => JSON.stringify(values), [values]);
  const isStale = lastApplied !== snapshot;
  const statusLabel = !sceneResult ? "Draft" : isStale ? "Draft (unsaved changes)" : "Preview ready";

  const sceneSummary = useMemo(() => computeKitchenSceneSummary(values), [values]);

  const mutation = useMutation({
    mutationFn: (opts: { fail?: boolean }) => generateScene(values as unknown as Record<string, string>, opts),
    onMutate: () => {
      setSceneResult(null);
      setError(null);
    },
    onSuccess: (data: SceneGenerationResult) => {
      setError(null);
      setSceneResult(data);
      setLastApplied(JSON.stringify(values));
    },
    onError: (e: Error) => {
      setSceneResult(null);
      setError(e.message);
    },
  });

  const runGenerate = () => {
    if (!tryConsume("configChanges")) {
      setTalkOpen(true);
      return;
    }
    mutation.mutate({});
  };

  const runExport = (kind: "usd" | "glb") => {
    if (!sceneResult) return;
    if (!tryConsume("sceneDownloads")) {
      setTalkOpen(true);
      return;
    }
    alert(
      kind === "usd"
        ? `Download queued: kitchen.usd\n${sceneResult.sceneId}`
        : `Download queued: kitchen.glb preview\n${sceneResult.checksum.slice(0, 24)}…`,
    );
  };

  const dlLeft = remaining("sceneDownloads");
  const cfgLeft = remaining("configChanges");

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:h-[min(820px,calc(100dvh-8.5rem))] lg:min-h-[520px] lg:flex-row">
      {/* Scene viewport: room plate + 3D placeholder cutout */}
      <div className="relative flex min-h-[min(320px,42vh)] w-full flex-1 flex-col lg:min-h-0">
        <img src="/assets/kitchen.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/25 via-black/5 to-black/30" />
        <div className="relative z-[1] flex min-h-[min(320px,42vh)] flex-1 flex-col lg:min-h-0">
          <div className="flex flex-1 items-center justify-center px-[var(--s-400)] py-[var(--s-400)]">
            <img
              src="/assets/kitchen-scene-placeholder.png"
              alt="Kitchen configuration preview"
              className="max-h-[min(58vh,480px)] w-full max-w-[min(96%,680px)] object-contain drop-shadow-[0_16px_48px_rgba(0,0,0,0.38)]"
            />
          </div>
          <div className="relative flex flex-wrap items-start justify-between gap-[var(--s-300)] px-[var(--s-400)] pb-[var(--s-400)] pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 drop-shadow-sm">
                Simulation preview
              </p>
              <p className="mt-[var(--s-100)] max-w-[28rem] text-[15px] font-medium leading-snug text-white drop-shadow-md">
                {values.Layout} · {values.Island} · {values["Door Style"]} · {values["Cabinet Finish"]}
              </p>
            </div>
            <span
              className={`rounded-full px-[var(--s-300)] py-[var(--s-100)] text-[12px] font-semibold shadow-md ${
                statusLabel.includes("ready")
                  ? "bg-[var(--green-500)]/95 text-white"
                  : "bg-white/95 text-[var(--text-default-heading)]"
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Options column: summary + actions fixed; parameters scroll */}
      <aside className="flex min-h-0 w-full shrink-0 flex-col border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:w-[min(100%,420px)] lg:border-l lg:border-t-0">
        <div className="shrink-0 space-y-[var(--s-400)] border-b border-[var(--border-default-secondary)] px-[var(--s-400)] py-[var(--s-400)]">
          <section aria-labelledby="scene-summary-heading">
            <h2
              id="scene-summary-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-default-heading)]"
            >
              Scene summary
            </h2>
            <dl className="mt-[var(--s-300)] space-y-[var(--s-200)] text-[13px]">
              {(
                [
                  ["Models", String(sceneSummary.models)],
                  ["Articulated assets", String(sceneSummary.articulatedAssets)],
                  ["Total joints", String(sceneSummary.totalJoints)],
                  ["Isaac Sim FPS", sceneSummary.isaacFps],
                  ["Appliances", String(sceneSummary.appliances)],
                  ["Lighting", values.Lighting],
                  ["Clutter", values["Clutter Density"]],
                ] as const
              ).map(([dt, dd]) => (
                <div key={dt} className="flex justify-between gap-[var(--s-400)]">
                  <dt className="text-[var(--text-default-body)]">{dt}</dt>
                  <dd className="text-right font-medium text-[var(--text-default-heading)]">{dd}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div>
            <p className="text-[12px] text-[var(--text-default-body)]">
              Preview generations remaining:{" "}
              <span className="font-mono font-medium text-[var(--text-default-heading)]">
                {cfgLeft} / {KITCHEN_LIMITS.configChanges}
              </span>
            </p>
            <div className="mt-[var(--s-300)] flex flex-wrap gap-[var(--s-200)]">
              <Button variant="primary" disabled={mutation.isPending} onClick={runGenerate} className="w-full sm:w-auto">
                {mutation.isPending ? "Generating…" : "Generate preview"}
              </Button>
            </div>
            {error ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-error-default)]">{error}</p>
            ) : null}
            {mutation.isSuccess && !error && sceneResult ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-success-default)]">
                Preview ready — scene <span className="font-mono">{sceneResult.sceneId}</span>.
              </p>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
          <div className="space-y-[var(--s-500)]">
            {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
              ([group, params]) => (
                <section key={group} className="space-y-[var(--s-400)]">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
                    {group}
                  </h2>
                  <div className="space-y-[var(--s-400)]">
                    {Object.entries(params).map(([key, opts]) => {
                      const k = key as KitchenParamKey;
                      return (
                        <label key={key} className="block">
                          <span className={labelClass}>{key}</span>
                          <div className="relative">
                            <select
                              value={values[k]}
                              onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                              className={selectClass}
                            >
                              {opts.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                            {selectChevron}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-400)] shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
          <p className="text-[12px] text-[var(--text-default-body)]">
            Scene downloads remaining:{" "}
            <span className="font-mono font-medium text-[var(--text-default-heading)]">
              {dlLeft} / {KITCHEN_LIMITS.sceneDownloads}
            </span>
          </p>
          <div className="mt-[var(--s-300)] flex flex-col gap-[var(--s-300)]">
            <Button
              variant="primary"
              className={txBtn}
              disabled={!sceneResult}
              onClick={() => runExport("usd")}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                download
              </span>
              Download USD scene
            </Button>
            <Button
              variant="secondary"
              className={`${txBtn} border-[var(--border-primary-default)] text-[var(--text-primary-default)]`}
              disabled={!sceneResult}
              onClick={() => runExport("glb")}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                download
              </span>
              Download GLB preview
            </Button>
          </div>
          {!sceneResult ? (
            <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
              Generate a preview to enable exports.
            </p>
          ) : null}
        </div>
      </aside>

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}
