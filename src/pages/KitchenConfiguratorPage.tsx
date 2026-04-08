import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { generateScene } from "@/lib/mockApi";
import { KitchenScenePreview } from "@/components/kitchen/KitchenScenePreview";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature, FULL_ACCESS_TOOLTIP } from "@/lib/access";
import type { SceneGenerationResult } from "@/types";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity,transform] duration-250 ease-out";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] font-medium transition-colors",
    isActive
      ? "border-[var(--papaya-500)] text-[var(--text-default-heading)]"
      : "border-transparent text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
  ].join(" ");

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-placeholder)]";

const selectClass =
  "mt-[var(--s-100)] w-full rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]";

function formatIslandLabel(value: string) {
  if (value === "true") return "Standard Island";
  if (value === "false") return "No island";
  return value;
}

export function KitchenConfiguratorPage() {
  const { accessTier } = useAuth();
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);

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

  const runExport = (kind: "usd" | "package") => {
    if (!sceneResult) return;
    alert(
      kind === "usd"
        ? `Download queued: scene.usd\n${sceneResult.sceneId}`
        : `Export queued: simulation package zip\n${sceneResult.checksum}`,
    );
  };

  return (
    <div className="space-y-[var(--s-400)] pb-[var(--s-500)]">
      <nav
        className="flex flex-wrap items-center gap-x-[var(--s-200)] gap-y-[var(--s-100)] text-[13px] text-[var(--text-default-body)]"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-[var(--text-default-heading)]">
          Dashboard
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments" className="transition-colors hover:text-[var(--text-default-heading)]">
          Environments
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments/kitchen/configure" className="transition-colors hover:text-[var(--text-default-heading)]">
          Kitchen
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <span className="text-[var(--text-default-heading)]">Configure</span>
      </nav>

      <header className="space-y-[var(--s-300)]">
        <div className="flex flex-wrap items-center gap-[var(--s-300)]">
          <h1 className="text-page-title">Kitchen Environment</h1>
          {!fullExport ? <PreviewModeBadge title={FULL_ACCESS_TOOLTIP} /> : null}
        </div>
        <p className="max-w-[52rem] text-[14px] leading-[22px] text-[var(--text-default-body)]">
          35 physics-ready models · 18 articulated assets · 24+ joints
        </p>
        <nav className="border-b border-[var(--border-default-secondary)]" aria-label="Kitchen sections">
          <ul className="flex flex-wrap gap-[var(--s-200)]">
            <li>
              <NavLink to="/environments/kitchen/configure" end className={tabClass}>
                Configure
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/batch" className={tabClass}>
                Batch Variations
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/api" className={tabClass}>
                API
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <p className="text-[13px] text-[var(--text-default-body)]">
        Only geometry parameters update the preview. Scene conditions are applied during generation.
      </p>

      <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start">
        <div className="lg:sticky lg:top-[calc(3.5rem+var(--s-400)+env(safe-area-inset-top))] lg:self-start">
          <KitchenScenePreview values={values} />
        </div>

        <div className="space-y-[var(--s-300)] lg:max-h-[calc(100dvh-13rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-[var(--s-100)]">
          {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
            ([group, params]) => (
              <Card key={group} title={group.toUpperCase()}>
                <div className="space-y-[var(--s-400)]">
                  {Object.entries(params).map(([key, opts]) => {
                    const k = key as KitchenParamKey;
                    return (
                      <label key={key} className="block">
                        <span className={labelClass}>{key}</span>
                        <select
                          value={values[k]}
                          onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                          className={selectClass}
                        >
                          {opts.map((o) => (
                            <option key={o} value={o}>
                              {k === "Island" ? formatIslandLabel(o) : o}
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
              <Button variant="primary" disabled={mutation.isPending} onClick={() => mutation.mutate({})}>
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
            <button
              type="button"
              onClick={() => setDevOpen((o) => !o)}
              className="mt-[var(--s-400)] text-[12px] font-medium text-[var(--text-default-body)] underline underline-offset-2"
            >
              Developer tools
            </button>
            {devOpen ? (
              <div className="mt-[var(--s-200)] rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
                <p className="text-[12px] text-[var(--text-default-body)]">Inject pipeline error (testing)</p>
                <Button
                  variant="secondary"
                  className="mt-[var(--s-200)]"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ fail: true })}
                >
                  Simulate failure
                </Button>
              </div>
            ) : null}
          </Card>

          <Card title="Exports">
            <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">
              After a successful preview, download the USD stage or the full package. Requires full access.
            </p>
            <div className="mt-[var(--s-400)] flex flex-col gap-[var(--s-300)]">
              <Button
                variant="primary"
                className={`w-full ${txBtn}`}
                disabled={!sceneResult}
                title={!fullExport ? FULL_ACCESS_TOOLTIP : undefined}
                onClick={() => (fullExport ? runExport("usd") : setAccessModalOpen(true))}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  {fullExport ? "download" : "lock"}
                </span>
                Download USD
              </Button>
              <Button
                variant="secondary"
                className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] ${txBtn}`}
                disabled={!sceneResult}
                title={!fullExport ? FULL_ACCESS_TOOLTIP : undefined}
                onClick={() => (fullExport ? runExport("package") : setAccessModalOpen(true))}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  {fullExport ? "archive" : "lock"}
                </span>
                Export package
              </Button>
            </div>
            {!sceneResult ? (
              <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                Generate a preview first to enable exports.
              </p>
            ) : !fullExport ? (
              <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">Requires full access</p>
            ) : null}
          </Card>
        </div>
      </div>

      <ExportAccessModal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} />
    </div>
  );
}
