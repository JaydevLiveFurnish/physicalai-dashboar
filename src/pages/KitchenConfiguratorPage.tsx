import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { generateScene } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { SceneGenerationResult } from "@/types";

export function KitchenConfiguratorPage() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    const entries = Object.entries(values) as [KitchenParamKey, string][];
    return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
  }, [values]);

  const mutation = useMutation({
    mutationFn: (opts: { fail?: boolean }) => generateScene(values as unknown as Record<string, string>, opts),
    onSuccess: (data: SceneGenerationResult) => {
      setError(null);
      alert(`Scene ${data.sceneId}\n${data.usdPath}\n${data.checksum}`);
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Environment · Kitchen
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold text-[var(--text-default-heading)]">
          Kitchen configurator
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Geometry-affecting parameters update the preview contract. Scene conditions are emitted as metadata for downstream
          datasets.
        </p>
      </header>

      <div className="grid gap-[var(--s-400)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Card title="Preview">
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
            {mutation.isSuccess && !error ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-success-default)]">Generation completed.</p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
