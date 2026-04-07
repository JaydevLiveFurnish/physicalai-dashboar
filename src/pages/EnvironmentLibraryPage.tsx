import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchEnvironments } from "@/lib/mockApi";
import { EmptyState } from "@/components/system/EmptyState";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";

export function EnvironmentLibraryPage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const batchAccess = canUseFeature(accessTier, "batch_submit");
  const envs = useQuery({ queryKey: ["environments"], queryFn: fetchEnvironments });

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Environment library
        </p>
        <h1 className="text-page-title mt-[var(--s-200)]">
          Environments
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Parameterized worlds. Status reflects generation pipeline availability.
        </p>
      </header>

      {envs.isError ? (
        <ErrorPanel message="Environments couldn’t be loaded." onRetry={() => envs.refetch()} />
      ) : envs.isLoading ? (
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : !envs.data?.length ? (
        <EmptyState
          title="No environments"
          description="There are no environments to show yet. Check back after your workspace is provisioned."
          action={
            <Link to="/environments/request-custom">
              <Button variant="primary">Request custom environment</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          {envs.data?.map((e) => (
            <Card key={e.id}>
              <div className="mb-[var(--s-300)] flex flex-wrap items-start justify-between gap-[var(--s-300)]">
                <div className="flex min-w-0 flex-wrap items-center gap-[var(--s-200)]">
                  <h2 className="text-[18px] font-semibold">{e.name}</h2>
                  {e.id === "env-kitchen-v2" && !fullExport ? <PreviewModeBadge /> : null}
                </div>
                {e.status === "active" ? (
                  <Badge variant="success">active</Badge>
                ) : (
                  <Badge variant="neutral">soon</Badge>
                )}
              </div>
              <dl className="grid grid-cols-1 gap-[var(--s-200)] text-[13px] text-[var(--text-default-body)] min-[400px]:grid-cols-2">
                <div>
                  <dt>Parameters</dt>
                  <dd className="font-semibold text-[var(--text-default-heading)]">{e.parameterCount}</dd>
                </div>
                <div>
                  <dt>Combinations (upper bound)</dt>
                  <dd className="font-mono text-[var(--text-default-heading)]">
                    {e.totalCombinations.toLocaleString()}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt>Last generated</dt>
                  <dd className="font-mono text-[12px] text-[var(--text-default-heading)]">
                    {e.lastGeneratedAt ? new Date(e.lastGeneratedAt).toLocaleString() : "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-[var(--s-400)] flex flex-wrap gap-[var(--s-200)]">
                {e.id === "env-kitchen-v2" ? (
                  <Link to="/environments/kitchen/configure">
                    <Button variant="primary">Open configurator</Button>
                  </Link>
                ) : null}
                <Link to="/batch">
                  <Button variant="secondary" className="inline-flex items-center gap-[var(--s-200)]">
                    {!batchAccess ? (
                      <span className="material-symbols-outlined text-[18px]" aria-hidden>
                        lock
                      </span>
                    ) : null}
                    Batch generation
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
