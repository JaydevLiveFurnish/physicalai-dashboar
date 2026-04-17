import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { allKitchenBatchSelections, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { getBatchCombinationStats } from "@/kitchen/batchCombinatorics";
import { runBatchJob } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining } from "@/lib/kitchenLimits";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";

const BATCH_GENERATE_COUNT = 500;

/** Visible preview slice in the grid (progress animation distributes across this count). */
const GRID_PREVIEW = 96;

const BATCH_PARAM_ORDER: KitchenParamKey[] = [
  "Layout",
  "Island",
  "Base Cabinet",
  "Wall Cabinet",
  "Tall Cabinet",
  "Door Style",
  "Door Handle",
  "Appliance Preset",
  "Cabinet Finish",
  "Counter Top Finish",
  "Hardware Finish",
  "Lighting",
  "Clutter Density",
];

const BATCH_PARAM_LABEL: Partial<Record<KitchenParamKey, string>> = {
  "Cabinet Finish": "Cabinet finish",
  "Clutter Density": "Clutter density",
};

function initialSelections(): Record<KitchenParamKey, string[]> {
  return allKitchenBatchSelections();
}

function OrangeCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-start gap-[var(--s-200)] rounded-br100 py-[6px] text-left text-[13px] text-[var(--text-default-body)] transition-colors hover:bg-[var(--surface-page-secondary)]"
    >
      <span
        className={[
          "mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-[background-color,border-color] duration-200",
          checked
            ? "border-[var(--papaya-500)] bg-[var(--papaya-500)] text-white"
            : "border-[var(--border-default-secondary)] bg-[var(--surface-default)]",
        ].join(" ")}
        aria-hidden
      >
        {checked ? (
          <span className="material-symbols-outlined !text-[14px] leading-none">check</span>
        ) : null}
      </span>
      <span className="leading-snug">{label}</span>
    </button>
  );
}

function VariationGrid({
  simProgress,
  batchTotal,
  tileCount,
  onSelectTile,
}: {
  simProgress: number;
  batchTotal: number;
  tileCount: number;
  onSelectTile: (payload: { id: string; index: number; ready: boolean }) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-[var(--s-200)] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      {Array.from({ length: tileCount }).map((_, i) => {
        const n = i + 1;
        const id = `VAR-${String(n).padStart(4, "0")}`;
        const threshold = ((n - 1) / tileCount) * batchTotal;
        const ready = simProgress > threshold || simProgress >= batchTotal;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTile({ id, index: n, ready })}
            className="group flex min-h-0 flex-col items-center overflow-hidden rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-100)] py-[var(--s-200)] text-center transition-[border-color,box-shadow,transform] duration-200 hover:border-[var(--grey-300)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-primary-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-page-secondary)]"
            aria-label={`Open preview ${id}${ready ? ", ready" : ", queued"}`}
          >
            <span
              className="material-symbols-outlined text-[18px] text-[var(--text-default-placeholder)] transition-colors group-hover:text-[var(--text-default-body)]"
              aria-hidden
            >
              kitchen
            </span>
            <p className="mt-[4px] w-full truncate font-mono text-[10px] leading-tight text-[var(--text-default-body)] sm:text-[11px]">
              {id}
            </p>
            <p
              className={`mt-[4px] text-[10px] font-semibold leading-tight sm:text-[11px] ${
                ready ? "text-[var(--text-success-default)]" : "text-[var(--text-default-placeholder)]"
              }`}
            >
              {ready ? "Ready" : "Queued"}
            </p>
            <span className="mt-[6px] text-[9px] font-medium text-[var(--text-primary-default)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              View
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type BatchGenerationPageProps = {
  embedded?: boolean;
};

export function BatchGenerationPage({ embedded = false }: BatchGenerationPageProps) {
  const [selections, setSelections] = useState<Record<KitchenParamKey, string[]>>(initialSelections);
  const [limitMessage] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<{ id: string; index: number; ready: boolean } | null>(null);
  const parameterOptions = useMemo(() => {
    const optionsByParam = new Map<KitchenParamKey, readonly string[]>();
    for (const params of Object.values(KITCHEN_PARAMETER_GROUPS)) {
      for (const [param, opts] of Object.entries(params)) {
        optionsByParam.set(param as KitchenParamKey, opts);
      }
    }
    return BATCH_PARAM_ORDER.map((key) => ({
      key,
      label: BATCH_PARAM_LABEL[key] ?? key,
      options: optionsByParam.get(key) ?? [],
    }));
  }, []);
  const [collapsedParams, setCollapsedParams] = useState<Record<KitchenParamKey, boolean>>(() =>
    Object.fromEntries(BATCH_PARAM_ORDER.map((key) => [key, key !== "Layout"])) as Record<KitchenParamKey, boolean>,
  );

  const [simProgress, setSimProgress] = useState(0);
  const [simActive, setSimActive] = useState(false);
  const [talkToTeamOpen, setTalkToTeamOpen] = useState(false);

  const comboStats = useMemo(() => getBatchCombinationStats(selections), [selections]);
  const { raw: rawCount, valid: validCombinations } = comboStats;
  const generateCap = Math.min(BATCH_GENERATE_COUNT, Math.max(0, validCombinations));

  const mutation = useMutation({
    mutationFn: () =>
      runBatchJob({
        environmentId: "env-kitchen-v2",
        selections: selections as unknown as Record<string, string[]>,
      }),
    onSuccess: (data) => {
      if (data.validCombinations > 0 && data.status !== "failed") {
        setSimActive(true);
        setSimProgress(0);
      }
    },
  });

  useEffect(() => {
    if (!simActive) return;
    if (simProgress >= BATCH_GENERATE_COUNT) {
      setSimActive(false);
      return;
    }
    const id = window.setTimeout(() => {
      setSimProgress((p) => Math.min(BATCH_GENERATE_COUNT, p + Math.max(1, Math.ceil((BATCH_GENERATE_COUNT - p) / 25))));
    }, 45);
    return () => window.clearTimeout(id);
  }, [simActive, simProgress]);


  const toggleValue = (key: KitchenParamKey, value: string) => {
    setSelections((prev) => {
      const cur = new Set(prev[key] ?? []);
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      const next = Array.from(cur);
      return { ...prev, [key]: next.length ? next : [value] };
    });
  };
  const toggleParamCollapsed = (key: KitchenParamKey) => {
    setCollapsedParams((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const batchLeft = remaining("batchRuns");

  const queueing = mutation.isPending;
  const generationComplete = simProgress >= BATCH_GENERATE_COUNT;
  const generationSucceeded =
    mutation.isSuccess &&
    mutation.data &&
    mutation.data.status !== "failed" &&
    mutation.data.validCombinations > 0;
  const showVariationOutput = generationSucceeded && (simActive || generationComplete);
  const showEmptyState = !queueing && !showVariationOutput && !mutation.isSuccess;


  const headerBlock =
    embedded ? null : (
      <PageHeader
        title="Batch variations"
        description="Pick parameter ranges to define combinations, then queue a batch run."
      />
    );

  const shellClass = embedded
    ? "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden"
    : "flex min-h-0 w-full max-w-none flex-col gap-[var(--s-500)] lg:max-w-[1400px]";

  const batchFooter = (
    <div
      className="shrink-0 border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-300)] shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
      aria-label="Combination statistics and batch actions"
    >
      <div className="grid gap-[var(--s-200)] sm:grid-cols-2">
        <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[color-mix(in_srgb,var(--papaya-500)_6%,var(--surface-page-secondary))] px-[var(--s-300)] py-[var(--s-200)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
            Valid combinations
          </p>
          <p className="mt-[4px] font-mono text-[15px] font-semibold leading-tight tabular-nums tracking-tight text-[var(--text-default-heading)] sm:text-[16px]">
            {validCombinations.toLocaleString()}
          </p>
        </div>
        <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-200)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
            Cartesian product (raw)
          </p>
          <p className="mt-[4px] font-mono text-[15px] font-semibold leading-tight tabular-nums text-[var(--text-default-body)] sm:text-[16px]">
            {rawCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-[var(--s-300)] border-t border-[var(--border-default-secondary)] pt-[var(--s-300)]">
        <div className="flex flex-col gap-[4px]">
          <Button
            variant="primary"
            className="h-9 min-h-0 w-full justify-center px-[var(--s-400)] py-[var(--s-200)] text-[13px] font-semibold"
            disabled={queueing || batchLeft === 0 || validCombinations === 0}
            onClick={() => setTalkToTeamOpen(true)}
          >
            {queueing ? "Queueing…" : "Generate batch"}
          </Button>
          {validCombinations > 0 ? (
            <p className="text-[11px] leading-snug text-[var(--text-default-body)]">
              Queues up to{" "}
              <span className="font-mono font-semibold text-[var(--text-default-heading)]">
                {generateCap.toLocaleString()}
              </span>{" "}
              preview tiles per run.
            </p>
          ) : (
            <p className="text-[11px] leading-snug text-[var(--text-error-default)]">
              No valid combinations for the current selection.
            </p>
          )}
          <p className="text-[11px] leading-snug text-[var(--text-default-body)]">
            Batch runs left:{" "}
            <span className="font-mono font-medium text-[var(--text-default-heading)]">
              {batchLeft} / {KITCHEN_LIMITS.batchRuns}
            </span>
          </p>
          {limitMessage ? (
            <p className="text-[11px] leading-snug text-[var(--text-error-default)]" role="status">
              {limitMessage}
            </p>
          ) : null}
          {mutation.isError ? (
            <p className="text-[11px] leading-snug text-[var(--text-error-default)]" role="alert">
              Could not queue the job.{" "}
              <button type="button" className="font-medium underline underline-offset-2" onClick={() => mutation.reset()}>
                Dismiss
              </button>
            </p>
          ) : null}
          {mutation.data && !mutation.isError ? (
            <p className="font-mono text-[10px] leading-snug text-[var(--text-default-placeholder)]">
              Last job {mutation.data.jobId}
              {mutation.data.invalidRules.length ? ` · ${mutation.data.invalidRules.join("; ")}` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  const outputMain = (
    <div className="min-h-0 flex flex-1 flex-col gap-[var(--s-400)] overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
      {queueing ? (
        <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-500)]">
          <p className="text-[14px] font-semibold text-[var(--text-default-heading)]">Queueing batch job</p>
          <p className="mt-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
            Sending your parameter ranges to the job runner…
          </p>
          <div className="relative mt-[var(--s-400)] h-3 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
            <div
              className="h-full w-1/3 rounded-full bg-[var(--papaya-500)] animate-batch-queue-indeterminate"
              aria-hidden
            />
          </div>
          <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-placeholder)]">This usually takes a moment.</p>
        </div>
      ) : null}

      {!queueing && showVariationOutput ? (
        <>
          <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)]">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
              <div
                className="h-full rounded-full bg-[var(--papaya-500)] transition-[width] duration-200 ease-out"
                style={{
                  width: `${Math.min(100, (simProgress / BATCH_GENERATE_COUNT) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-heading)]">
              {generationComplete ? (
                <>Complete — {BATCH_GENERATE_COUNT.toLocaleString()} preview tiles</>
              ) : (
                <>
                  Generating preview tiles… {simProgress.toLocaleString()} / {BATCH_GENERATE_COUNT.toLocaleString()}
                </>
              )}
            </p>
          </div>

          <div>
            <h3 className="mb-[var(--s-300)] text-[13px] font-semibold text-[var(--text-default-heading)]">
              Generated variations (preview)
            </h3>
            <p className="mb-[var(--s-300)] text-[12px] text-[var(--text-default-placeholder)]">
              Showing {GRID_PREVIEW.toLocaleString()} samples · Click a tile to expand.
            </p>
            <VariationGrid
              simProgress={simProgress}
              batchTotal={BATCH_GENERATE_COUNT}
              tileCount={GRID_PREVIEW}
              onSelectTile={setPreviewDetail}
            />
          </div>
        </>
      ) : null}

      {showEmptyState ? (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-[var(--s-300)] rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
          <span className="material-symbols-outlined text-[40px] text-[var(--text-default-placeholder)]" aria-hidden>
            grid_view
          </span>
          <p className="max-w-[42ch] text-[15px] font-medium text-[var(--text-default-heading)]">
            Run a batch to generate preview tiles here
          </p>
          <p className="max-w-[min(52ch,100%)] text-[13px] leading-[22px] text-[var(--text-default-placeholder)]">
            Adjust selections in the sidebar, then use <span className="font-medium text-[var(--text-default-body)]">Generate batch</span>{" "}
            to queue work and stream progress.
          </p>
        </div>
      ) : null}
    </div>
  );

  const previewModal = (
    <CenterModal
      open={previewDetail !== null}
      title={previewDetail ? `Preview ${previewDetail.id}` : "Preview"}
      onClose={() => setPreviewDetail(null)}
      size="lg"
      contentAlign="start"
    >
      {previewDetail ? (
        <div className="space-y-[var(--s-400)]">
          <div className="overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]">
            <img
              src="/assets/kitchen-scene-placeholder.png"
              alt={`Kitchen preview for ${previewDetail.id}`}
              className="mx-auto max-h-[min(52vh,520px)] w-full object-contain p-[var(--s-400)]"
            />
          </div>
          <dl className="grid gap-[var(--s-300)] text-[13px] sm:grid-cols-2">
            <div className="space-y-[var(--s-100)]">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-placeholder)]">
                Variation
              </dt>
              <dd className="font-mono text-[15px] font-medium text-[var(--text-default-heading)]">{previewDetail.id}</dd>
            </div>
            <div className="space-y-[var(--s-100)]">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-placeholder)]">
                Status
              </dt>
              <dd
                className={`text-[15px] font-semibold ${
                  previewDetail.ready ? "text-[var(--text-success-default)]" : "text-[var(--text-default-placeholder)]"
                }`}
              >
                {previewDetail.ready ? "Ready for export" : "Queued"}
              </dd>
            </div>
          </dl>
          <p className="text-[13px] leading-[22px] text-[var(--text-default-body)]">
            This is a representative render for the batch slice. In a connected pipeline, each variation would map to a
            unique parameter draw from your selections.
          </p>
        </div>
      ) : null}
    </CenterModal>
  );

  const paramsAside = (
    <aside className="flex min-h-0 w-full min-w-0 shrink-0 flex-col border-b border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:w-[min(100%,340px)] lg:border-b-0 lg:border-r">
      <div className="min-h-0 flex-1 space-y-[var(--s-500)] overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
        {parameterOptions.map(({ key, label, options }) => {
          const isCollapsed = collapsedParams[key];
          return (
            <section key={key} className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-200)] py-[var(--s-200)]">
              <button
                type="button"
                onClick={() => toggleParamCollapsed(key)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between gap-[var(--s-200)] text-left"
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-heading)]">{label}</p>
                <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)]" aria-hidden>
                  {isCollapsed ? "expand_more" : "expand_less"}
                </span>
              </button>
              <p className="mt-[4px] text-[11px] text-[var(--text-default-body)]">{(selections[key] ?? []).length} selected</p>
              <div className={`mt-[var(--s-200)] flex flex-col gap-[2px] ${isCollapsed ? "hidden" : ""}`}>
                {options.map((opt) => (
                  <OrangeCheckbox
                    key={opt}
                    label={opt}
                    checked={Boolean(selections[key]?.includes(opt))}
                    onToggle={() => toggleValue(key, opt)}
                  />
                ))}
              </div>
              {!isCollapsed && key === "Appliance Preset" ? (
                <p className="mt-[var(--s-200)] text-[11px] leading-[16px] text-[var(--text-default-placeholder)]">
                  Presets are fixed configs to avoid 2<sup className="text-[10px]">7</sup> appliance combinations.
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </aside>
  );

  return (
    <div className={shellClass}>
      {headerBlock}
      <div className={embedded ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)]"}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
          {paramsAside}
          {outputMain}
        </div>
        {batchFooter}
      </div>

      {previewModal}
      <TalkToTeamModal open={talkToTeamOpen} onClose={() => setTalkToTeamOpen(false)} />
    </div>
  );
}









