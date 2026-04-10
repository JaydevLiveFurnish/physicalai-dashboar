import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { allKitchenBatchSelections, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { getBatchCombinationStats } from "@/kitchen/batchCombinatorics";
import { fetchJobs, runBatchJob } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining, tryConsume } from "@/lib/kitchenLimits";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const BATCH_GENERATE_COUNT = 500;

const GRID_PREVIEW = 12;

const BATCH_GROUP_LABEL: Partial<Record<string, string>> = {
  "Layout & flow": "LAYOUT",
  Cabinets: "CABINETS",
  "Doors & hardware": "STYLE",
  Appliances: "APPLIANCES",
  Finishes: "FINISHES",
  "Scene conditions": "SCENE CONDITIONS",
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
}: {
  simProgress: number;
  batchTotal: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-[var(--s-300)] sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: GRID_PREVIEW }).map((_, i) => {
        const n = i + 1;
        const id = `VAR-${String(n).padStart(4, "0")}`;
        const threshold = ((n - 1) / GRID_PREVIEW) * batchTotal;
        const ready = simProgress > threshold || simProgress >= batchTotal;
        return (
          <div
            key={id}
            className="flex flex-col items-center overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-200)] py-[var(--s-400)] text-center"
          >
            <span className="material-symbols-outlined text-[22px] text-[var(--text-default-placeholder)]" aria-hidden>
              kitchen
            </span>
            <p className="mt-[var(--s-200)] font-mono text-[12px] text-[var(--text-default-body)]">{id}</p>
            <p
              className={`mt-[var(--s-200)] text-[12px] font-semibold ${
                ready ? "text-[var(--text-success-default)]" : "text-[var(--text-default-placeholder)]"
              }`}
            >
              {ready ? "Ready" : "Queued"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export type BatchGenerationPageProps = {
  embedded?: boolean;
};

export function BatchGenerationPage({ embedded = false }: BatchGenerationPageProps) {
  const qc = useQueryClient();
  const [selections, setSelections] = useState<Record<KitchenParamKey, string[]>>(initialSelections);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const [simProgress, setSimProgress] = useState(0);
  const [simActive, setSimActive] = useState(false);

  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: 4000,
  });

  const comboStats = useMemo(() => getBatchCombinationStats(selections), [selections]);
  const { raw: rawCount, valid: validCombinations, invalid: invalidCombinations } = comboStats;
  const generateCap = Math.min(BATCH_GENERATE_COUNT, Math.max(0, validCombinations));

  const mutation = useMutation({
    mutationFn: () =>
      runBatchJob({
        environmentId: "env-kitchen-v2",
        selections: selections as unknown as Record<string, string[]>,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
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

  const batchLeft = remaining("batchRuns");

  const queueing = mutation.isPending;
  const generationComplete = simProgress >= BATCH_GENERATE_COUNT;
  const generationSucceeded =
    mutation.isSuccess &&
    mutation.data &&
    mutation.data.status !== "failed" &&
    mutation.data.validCombinations > 0;
  const showVariationOutput = generationSucceeded && (simActive || generationComplete);

  const runBatch = () => {
    setLimitMessage(null);
    if (!tryConsume("batchRuns")) {
      setLimitMessage("No batch runs remaining in this preview session.");
      return;
    }
    mutation.reset();
    setSimProgress(0);
    setSimActive(false);
    mutation.mutate();
  };

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
      <div className="grid gap-[var(--s-200)] sm:grid-cols-3">
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
        <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-200)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
            Invalid combos
          </p>
          <p className="mt-[4px] font-mono text-[15px] font-semibold leading-tight tabular-nums text-[var(--text-default-body)] sm:text-[16px]">
            − {invalidCombinations.toLocaleString()}
            <span className="ml-[6px] text-[10px] font-sans font-medium text-[var(--text-default-placeholder)]">
              invalid
            </span>
          </p>
        </div>
      </div>

      <div className="mt-[var(--s-300)] border-t border-[var(--border-default-secondary)] pt-[var(--s-300)]">
        <div className="flex flex-col gap-[4px]">
          <Button
            variant="primary"
            className="h-9 min-h-0 w-full max-w-none justify-center px-[var(--s-400)] py-[var(--s-200)] text-[13px] font-semibold sm:max-w-[220px]"
            disabled={queueing || batchLeft === 0 || validCombinations === 0}
            onClick={runBatch}
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
    <div className="min-h-0 flex-1 space-y-[var(--s-400)] overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
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
            <VariationGrid simProgress={simProgress} batchTotal={BATCH_GENERATE_COUNT} />
          </div>
        </>
      ) : null}

      {!queueing && !showVariationOutput && !mutation.isSuccess ? (
        <div className="flex min-h-[min(240px,40vh)] flex-col items-center justify-center gap-[var(--s-300)] rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
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

      <section aria-labelledby="job-queue-heading" className="space-y-[var(--s-300)] border-t border-[var(--border-default-secondary)] pt-[var(--s-400)]">
        <h2 id="job-queue-heading" className="text-[15px] font-semibold text-[var(--text-default-heading)]">
          Job queue
        </h2>
        {jobs.isError ? (
          <ErrorPanel message="Could not load the job queue." onRetry={() => jobs.refetch()} />
        ) : jobs.isLoading ? (
          <div className="space-y-[var(--s-300)]" aria-busy="true" aria-live="polite">
            <p className="text-[12px] text-[var(--text-default-body)]">Loading queue…</p>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : jobs.data?.length === 0 ? (
          <div className="rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
            <span
              className="material-symbols-outlined mx-auto mb-[var(--s-200)] block text-[28px] text-[var(--text-default-placeholder)]"
              aria-hidden
            >
              inventory_2
            </span>
            <p className="text-[14px] font-medium text-[var(--text-default-heading)]">No jobs yet</p>
            <p className="mt-[var(--s-200)] text-[13px] leading-[20px] text-[var(--text-default-body)]">
              Queued runs appear here with status and progress.
            </p>
          </div>
        ) : (
          <ul className="space-y-[var(--s-200)] text-[13px]">
            {jobs.data?.map((j) => (
              <li key={j.id} className="border-b border-[var(--border-default-secondary)] pb-[var(--s-200)] last:border-0">
                <div className="flex justify-between gap-[var(--s-200)]">
                  <span className="font-mono text-[12px]">{j.id}</span>
                  <span className="capitalize">{j.status}</span>
                </div>
                <div className="mt-[var(--s-100)] h-1 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
                  <div
                    className={`h-full ${j.status === "failed" ? "bg-[var(--text-error-default)]" : "bg-[var(--text-primary-default)]"}`}
                    style={{ width: `${j.progress}%` }}
                  />
                </div>
                {j.errorCode ? (
                  <p className="mt-[var(--s-100)] text-[12px] text-[var(--text-error-default)]">{j.errorCode}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );

  const paramsAside = (
    <aside className="flex min-h-0 w-full min-w-0 shrink-0 flex-col border-b border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:w-[min(100%,340px)] lg:border-b-0 lg:border-r">
      <div className="min-h-0 flex-1 space-y-[var(--s-500)] overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
        {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
          ([group, params]) => (
            <section key={group} className="space-y-[var(--s-300)]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
                {BATCH_GROUP_LABEL[group] ?? group}
              </h3>
              <div className="space-y-[var(--s-400)]">
                {Object.entries(params).map(([param, opts]) => {
                  const key = param as KitchenParamKey;
                  return (
                    <div key={param}>
                      <p className="mb-[var(--s-200)] text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-heading)]">
                        {param}
                      </p>
                      <div className="flex flex-col gap-[2px]">
                        {opts.map((opt) => (
                          <OrangeCheckbox
                            key={opt}
                            label={opt}
                            checked={Boolean(selections[key]?.includes(opt))}
                            onToggle={() => toggleValue(key, opt)}
                          />
                        ))}
                      </div>
                      {param === "Appliance Preset" ? (
                        <p className="mt-[var(--s-200)] text-[11px] leading-[16px] text-[var(--text-default-placeholder)]">
                          Presets are fixed configs to avoid 2<sup className="text-[10px]">7</sup> appliance combinations.
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ),
        )}
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

    </div>
  );
}
