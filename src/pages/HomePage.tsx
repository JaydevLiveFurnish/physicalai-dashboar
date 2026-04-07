import { useQuery } from "@tanstack/react-query";
import { fetchActivity, fetchSystemOverview } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function formatTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export function HomePage() {
  const overview = useQuery({ queryKey: ["overview"], queryFn: fetchSystemOverview });
  const activity = useQuery({ queryKey: ["activity"], queryFn: fetchActivity });

  if (overview.isLoading) {
    return (
      <div className="space-y-[var(--s-400)]">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <Card title="System">
        <p className="text-[14px] text-[var(--text-error-default)]">Failed to load system overview.</p>
      </Card>
    );
  }

  const o = overview.data;

  return (
    <div className="space-y-[var(--s-500)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          System overview
        </p>
        <h1 className="mt-[var(--s-200)] text-[32px] font-semibold leading-[40px] tracking-[-0.5px] text-[var(--text-default-heading)]">
          Physical AI control plane
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] leading-[20px] text-[var(--text-default-body)]">
          Environments, assets, generation jobs, and API surface. Structured outputs: simulation-ready USD.
        </p>
      </header>

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="Environments">
          <dl className="grid grid-cols-2 gap-[var(--s-300)] text-[14px]">
            <div>
              <dt className="text-[var(--text-default-body)]">Active</dt>
              <dd className="font-semibold text-[var(--text-default-heading)]">{o.environments.activeCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Parameters</dt>
              <dd className="font-semibold">{o.environments.parameterCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Combinations (max)</dt>
              <dd className="font-semibold">{o.environments.availableCombinations}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Last generated</dt>
              <dd className="font-mono text-[12px]">{formatTime(o.environments.lastGeneratedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Assets">
          <dl className="grid grid-cols-2 gap-[var(--s-300)] text-[14px]">
            <div>
              <dt className="text-[var(--text-default-body)]">Props</dt>
              <dd className="font-semibold">{o.assets.propsCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Materials</dt>
              <dd className="font-semibold">{o.assets.materialsCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">SimReady coverage</dt>
              <dd className="font-semibold">{o.assets.simReadyPercent}%</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Articulated props</dt>
              <dd className="font-semibold">{o.assets.articulatedCount}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Generation">
          <dl className="grid grid-cols-2 gap-[var(--s-300)] text-[14px]">
            <div>
              <dt className="text-[var(--text-default-body)]">Completed</dt>
              <dd className="font-semibold">{o.generation.jobsCompleted}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Running</dt>
              <dd className="font-semibold">{o.generation.jobsRunning}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Failed</dt>
              <dd className="font-semibold text-[var(--text-error-default)]">{o.generation.jobsFailed}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Last job</dt>
              <dd className="font-semibold uppercase">{o.generation.lastJobStatus}</dd>
            </div>
          </dl>
        </Card>

        <Card title="API">
          <dl className="grid grid-cols-2 gap-[var(--s-300)] text-[14px]">
            <div>
              <dt className="text-[var(--text-default-body)]">Status</dt>
              <dd className="font-semibold capitalize">{o.api.status}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-default-body)]">Keys</dt>
              <dd className="font-semibold">{o.api.keyCount}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--text-default-body)]">Usage (window)</dt>
              <dd className="font-mono text-[12px]">{o.api.usageSummary}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title="Activity feed">
        {activity.isLoading ? (
          <div className="space-y-[var(--s-200)]">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : activity.data?.length === 0 ? (
          <p className="text-[14px] text-[var(--text-default-body)]">No system activity recorded.</p>
        ) : (
          <ul className="divide-y divide-[var(--border-default-secondary)]">
            {activity.data?.map((a) => (
              <li key={a.id} className="flex flex-col gap-[var(--s-100)] py-[var(--s-300)] first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-[var(--s-400)]">
                  <span className="text-[12px] font-mono text-[var(--text-default-body)]">
                    {new Date(a.at).toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase text-[var(--text-default-placeholder)]">{a.kind}</span>
                </div>
                <p className="text-[14px] text-[var(--text-default-heading)]">{a.message}</p>
                {a.meta ? <p className="text-[12px] text-[var(--text-default-body)]">{a.meta}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
