import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchEnvironments } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export function EnvironmentLibraryPage() {
  const envs = useQuery({ queryKey: ["environments"], queryFn: fetchEnvironments });

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Environment library
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold text-[var(--text-default-heading)]">
          Environments
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Parameterized worlds. Status reflects generation pipeline availability.
        </p>
      </header>

      {envs.isLoading ? (
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          {envs.data?.map((e) => (
            <Card key={e.id}>
              <div className="mb-[var(--s-300)] flex items-start justify-between gap-[var(--s-300)]">
                <h2 className="text-[18px] font-semibold">{e.name}</h2>
                {e.status === "active" ? (
                  <Badge variant="success">active</Badge>
                ) : (
                  <Badge variant="neutral">soon</Badge>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
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
                  <Button variant="secondary">Batch generation</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
