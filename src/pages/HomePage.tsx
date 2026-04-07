import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchActivity, fetchSystemOverview } from "@/lib/mockApi";
import { Callout } from "@/components/system/Callout";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { useAuth } from "@/context/AuthContext";
import { ACCESS_COPY, canUseFeature } from "@/lib/access";

const tx = "transition-[color,background-color,box-shadow,transform] duration-250 ease-out";

function firstName(name: string | undefined) {
  if (!name?.trim()) return "there";
  return name.trim().split(/\s+/)[0] ?? "there";
}

export function HomePage() {
  const { user, accessTier } = useAuth();
  const fullExportAccess = canUseFeature(accessTier, "full_export");
  const batchAccess = canUseFeature(accessTier, "batch_submit");
  const apiKeysAllowed = canUseFeature(accessTier, "api_keys_write");
  const overview = useQuery({ queryKey: ["overview"], queryFn: fetchSystemOverview });
  const activity = useQuery({ queryKey: ["activity"], queryFn: fetchActivity });

  const welcome = firstName(user?.name);
  const paramCount = overview.data?.environments.parameterCount ?? 13;

  const downloadActivity = activity.data?.filter((a) => a.kind === "download") ?? [];

  if (overview.isLoading) {
    return (
      <div className="space-y-[var(--s-500)]">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-[var(--s-500)] lg:grid-cols-[1fr_minmax(260px,320px)]">
          <div className="space-y-[var(--s-400)]">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-[var(--s-400)]">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <ErrorPanel
        message="We couldn’t load the system overview. Check your connection and try again."
        onRetry={() => overview.refetch()}
      />
    );
  }

  return (
    <div className="space-y-[var(--s-600)] pb-[var(--s-400)]">
      <header>
        <h1 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-semibold leading-tight text-[var(--text-default-heading)]">
          Welcome back, {welcome}
        </h1>
      </header>

      {accessTier !== "full" ? (
        <Callout variant="info" title="Product window">
          <p>{ACCESS_COPY.exploreBanner}</p>
          <p className="mt-[var(--s-200)] text-[13px]">
            Choose <strong>Full</strong> under Account for mock API credentials, batch jobs, and export pipelines on this
            device.
          </p>
        </Callout>
      ) : null}

      {activity.isError ? (
        <Callout variant="warning" title="Activity feed unavailable">
          Recent downloads couldn’t be loaded.{" "}
          <button
            type="button"
            className="font-medium text-[var(--text-primary-default)] underline underline-offset-2"
            onClick={() => activity.refetch()}
          >
            Retry
          </button>
        </Callout>
      ) : null}

      <div className="grid gap-[var(--s-500)] lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-start lg:gap-[var(--s-600)]">
        <div className="space-y-[var(--s-500)]">
          <section className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 bg-[var(--surface-primary-default-subtle)] text-[var(--papaya-500)]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-[var(--s-300)]">
                  <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Kitchen Environment</h2>
                  {!fullExportAccess ? <PreviewModeBadge /> : null}
                </div>
                <p className="mt-[var(--s-200)] text-[14px] leading-[20px] text-[var(--text-default-body)]">
                  Configure, generate, and download physics-ready kitchen environments for robotic manipulation training.
                </p>
              </div>
            </div>

            <div className="mt-[var(--s-500)] flex flex-wrap gap-x-[var(--s-600)] gap-y-[var(--s-400)] border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]">
              {(
                [
                  { value: "35", label: "Layout presets" },
                  { value: "18", label: "Appliances" },
                  { value: "24+", label: "Style variants" },
                  { value: String(paramCount), label: "Parameters" },
                ] as const
              ).map((s) => (
                <div key={s.label} className="min-w-[72px]">
                  <p className="text-[28px] font-semibold leading-none tracking-tight text-[var(--text-default-heading)]">
                    {s.value}
                  </p>
                  <p className="mt-[var(--s-100)] text-[12px] text-[var(--text-default-body)]">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/environments/kitchen/configure"
              className={`mt-[var(--s-500)] flex w-full items-center justify-center gap-[var(--s-200)] rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-400)] py-[var(--s-300)] text-[15px] font-medium text-[var(--text-on-color-body)] hover:bg-[var(--surface-primary-default-hover)] active:scale-[0.99] ${tx}`}
            >
              Configure environment
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                arrow_forward
              </span>
            </Link>

            <div className="mt-[var(--s-400)] flex flex-wrap gap-x-[var(--s-500)] gap-y-[var(--s-200)] text-[13px]">
              <Link
                to="/batch"
                className={`inline-flex items-center gap-[var(--s-200)] text-[var(--text-default-body)] hover:text-[var(--text-default-heading)] ${tx}`}
              >
                <span className="material-symbols-outlined text-[18px] text-[var(--text-default-placeholder)]">
                  inventory_2
                </span>
                Batch variations
                {!batchAccess ? (
                  <span className="material-symbols-outlined text-[16px] text-[var(--text-default-placeholder)]" title="Running jobs requires Full access" aria-hidden>
                    lock
                  </span>
                ) : null}
              </Link>
              <Link
                to="/api"
                className={`inline-flex items-center gap-[var(--s-200)] text-[var(--text-default-body)] hover:text-[var(--text-default-heading)] ${tx}`}
              >
                <span className="material-symbols-outlined text-[18px] text-[var(--text-default-placeholder)]">
                  code
                </span>
                API documentation
                {!apiKeysAllowed ? (
                  <span
                    className="material-symbols-outlined text-[16px] text-[var(--text-default-placeholder)]"
                    title="Issuing keys requires Full access"
                    aria-hidden
                  >
                    lock
                  </span>
                ) : null}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Recent activity</h2>
            <div className="mt-[var(--s-300)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] sm:p-[var(--s-500)]">
              {activity.isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : downloadActivity.length === 0 ? (
                <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
                  No downloads yet. Configure your first kitchen environment to get started.{" "}
                  <Link
                    to="/environments/kitchen/configure"
                    className="font-medium text-[var(--text-primary-default)] underline-offset-2 hover:underline"
                  >
                    Go to Kitchen Environment
                  </Link>
                </p>
              ) : (
                <ul className="divide-y divide-[var(--border-default-secondary)]">
                  {downloadActivity.slice(0, 5).map((a) => (
                    <li key={a.id} className="py-[var(--s-300)] first:pt-0 last:pb-0">
                      <p className="text-[13px] text-[var(--text-default-body)]">
                        {new Date(a.at).toLocaleString()}
                      </p>
                      <p className="mt-[var(--s-100)] text-[14px] text-[var(--text-default-heading)]">{a.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-[var(--s-400)] lg:sticky lg:top-[calc(3.5rem+var(--s-400)+env(safe-area-inset-top))]">
          <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 border border-[#7eb8ff]/40 bg-[#e8f2ff] text-[#2563eb]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[22px]">deployed_code</span>
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Asset library</h2>
                <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--text-default-body)]">
                  Browse props and materials with physics properties, collision meshes, and SimReady tier classifications.
                </p>
                <Link
                  to="/assets/props"
                  className={`mt-[var(--s-400)] inline-flex items-center gap-0.5 text-[14px] font-medium text-[var(--text-primary-default)] hover:underline ${tx}`}
                >
                  Browse assets
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 border border-[#e8b8ff]/50 bg-[#f6edff] text-[#9333ea]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">SimReady generation</h2>
                <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--text-default-body)]">
                  Convert any 3D model into a simulation-ready USD asset with physics and articulation.
                </p>
                <Link
                  to="/simready"
                  className={`mt-[var(--s-400)] inline-flex items-center gap-0.5 text-[14px] font-medium text-[var(--text-primary-default)] hover:underline ${tx}`}
                >
                  Learn more
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
