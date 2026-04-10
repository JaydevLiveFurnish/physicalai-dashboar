import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { computeKitchenSceneSummary } from "@/kitchen/sceneSummary";
import { kitchenOptionThumbnail } from "@/kitchen/kitchenConfigThumbnails";
import { generateScene } from "@/lib/mockApi";
import { tryConsume } from "@/lib/kitchenLimits";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Button } from "@/components/ui/Button";
import type { SceneGenerationResult } from "@/types";

const groupLabelClass =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]";

const paramLabelClass =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-heading)]";

const thumbBtn = (active: boolean) =>
  [
    "group flex flex-col items-center gap-[6px] rounded-br100 border p-[6px] text-center transition-[border-color,box-shadow,transform] duration-200",
    active
      ? "border-[var(--papaya-500)] bg-[color-mix(in_srgb,var(--papaya-500)_10%,var(--surface-default))] shadow-[0_0_0_1px_var(--papaya-500)]"
      : "border-[var(--border-default-secondary)] bg-[var(--surface-default)] hover:border-[var(--grey-300)]",
  ].join(" ");

function OptionThumbnails({
  param,
  options,
  value,
  onPick,
}: {
  param: KitchenParamKey;
  options: readonly string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-[var(--s-200)] sm:grid-cols-4">
      {options.map((opt) => {
        const active = value === opt;
        const src = kitchenOptionThumbnail(param, opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(opt)}
            className={thumbBtn(active)}
            title={opt}
          >
            <span className="relative flex aspect-square w-full min-h-0 items-center justify-center overflow-hidden rounded-[6px] bg-[var(--surface-page-secondary)]">
              <img src={src} alt="" className="max-h-full max-w-full object-contain" />
            </span>
            <span className="line-clamp-2 w-full px-[2px] text-[10px] font-medium leading-tight text-[var(--text-default-body)]">
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function KitchenConfigureWorkspace() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [talkOpen, setTalkOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

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
    },
    onError: (e: Error) => {
      setSceneResult(null);
      setError(e.message);
    },
  });

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

  const set = (key: KitchenParamKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  useEffect(() => {
    if (!tryConsume("configChanges")) {
      setTalkOpen(true);
      return;
    }
    mutation.mutate({});
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:flex-row">
      {/* Single scene preview — no duplicate background plate */}
      <div className="relative flex min-h-[min(280px,40vh)] w-full flex-1 flex-col bg-[var(--surface-page-secondary)] lg:min-h-0 lg:overflow-hidden">
        <div className="flex flex-1 items-center justify-center px-[var(--s-400)] py-[var(--s-500)]">
          <img
            src="/assets/kitchen-scene-placeholder.png"
            alt="Kitchen configuration preview"
            className="max-h-[min(56vh,520px)] w-full max-w-[min(96%,720px)] object-contain drop-shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      <aside className="flex min-h-0 w-full shrink-0 flex-col border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:min-h-0 lg:w-[min(100%,440px)] lg:border-l lg:border-t-0">
        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
          <div className="space-y-[var(--s-500)]">
            {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
              ([group, params]) => (
                <section key={group} className="space-y-[var(--s-400)]">
                  <h2 className={groupLabelClass}>{group}</h2>
                  <div className="space-y-[var(--s-400)]">
                    {Object.entries(params).map(([key, opts]) => {
                      const k = key as KitchenParamKey;
                      return (
                        <div key={key}>
                          <p className={paramLabelClass}>{key}</p>
                          <div className="mt-[var(--s-200)]">
                            <OptionThumbnails
                              param={k}
                              options={opts}
                              value={values[k]}
                              onPick={(v) => set(k, v)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
        </div>

        <div
          className="shrink-0 border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-400)] shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
          role="region"
          aria-label="Scene summary and downloads"
        >
          <div className="mb-[var(--s-400)] border-b border-[var(--border-default-secondary)] pb-[var(--s-400)]">
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              aria-expanded={summaryOpen}
              className="flex w-full flex-wrap items-center justify-between gap-[var(--s-200)] text-left"
            >
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-[var(--s-200)] gap-y-[var(--s-100)]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-default-heading)]">
                  Scene summary
                </span>
                <span className="rounded-full bg-[color-mix(in_srgb,var(--papaya-500)_12%,transparent)] px-[var(--s-200)] py-[2px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-primary-default)]">
                  Live
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-semibold text-[var(--text-primary-default)] underline-offset-2 hover:underline">
                {summaryOpen ? "Hide details" : "Show details"}
              </span>
            </button>
            {summaryOpen ? (
              <dl className="mt-[var(--s-300)] max-h-[min(28vh,240px)] space-y-[var(--s-200)] overflow-y-auto overscroll-contain pr-[var(--s-100)] text-[13px]">
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
                    <dd className="text-right font-medium tabular-nums text-[var(--text-default-heading)]">{dd}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="flex flex-col gap-[var(--s-200)]">
            <Button
              variant="primary"
              disabled={!sceneResult || mutation.isPending}
              onClick={() => runExport("usd")}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-[var(--s-200)] px-[var(--s-300)] text-[14px] font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                download
              </span>
              Download USD Scene
            </Button>
            <Button
              variant="secondary"
              disabled={!sceneResult || mutation.isPending}
              onClick={() => runExport("glb")}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-[var(--s-200)] border-[var(--border-primary-default)] bg-[var(--surface-default)] px-[var(--s-300)] text-[14px] font-semibold text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)]"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                download
              </span>
              Download GLB Preview
            </Button>
          </div>
          {error ? <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-error-default)]">{error}</p> : null}
        </div>
      </aside>

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}
