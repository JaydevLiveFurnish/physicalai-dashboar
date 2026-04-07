import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createApiKey, fetchApiKeys, revokeApiKey } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const BASE = "https://api.imagine.io/physical-ai/v1";

export function ApiDocsPage() {
  const qc = useQueryClient();
  const keys = useQuery({ queryKey: ["apiKeys"], queryFn: fetchApiKeys });
  const [label, setLabel] = useState("");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () => createApiKey(label || "unnamed"),
    onSuccess: (data) => {
      setNewSecret(data.secret);
      setError(null);
      qc.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: () => setError("Could not create key (mock)"),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apiKeys"] }),
  });

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          API
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold text-[var(--text-default-heading)]">
          HTTP surface
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Keys, endpoints, and example payloads. All calls require <span className="font-mono">Authorization: Bearer</span>.
        </p>
      </header>

      <div className="grid gap-[var(--s-400)] lg:grid-cols-2">
        <Card title="Keys">
          {keys.isLoading ? <Skeleton className="h-24" /> : null}
          <ul className="space-y-[var(--s-200)] text-[13px]">
            {keys.data?.map((k) => (
              <li key={k.id} className="flex items-center justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] py-[var(--s-200)] last:border-0">
                <div>
                  <div className="font-medium">{k.label}</div>
                  <div className="font-mono text-[12px] text-[var(--text-default-body)]">
                    {k.prefix}••••••••
                  </div>
                </div>
                <Button variant="secondary" onClick={() => revoke.mutate(k.id)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-[var(--s-400)] flex flex-col gap-[var(--s-200)] sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[12px] uppercase text-[var(--text-default-body)]">
              Label
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
              />
            </label>
            <Button variant="primary" onClick={() => create.mutate()} disabled={create.isPending}>
              Generate key
            </Button>
          </div>
          {error ? <p className="text-[13px] text-[var(--text-error-default)]">{error}</p> : null}
          {newSecret ? (
            <p className="mt-[var(--s-300)] break-all font-mono text-[12px] text-[var(--text-success-default)]">
              {newSecret}
            </p>
          ) : null}
        </Card>

        <Card title="Endpoints">
          <ul className="space-y-[var(--s-200)] font-mono text-[12px] text-[var(--text-default-heading)]">
            <li>POST {BASE}/configs</li>
            <li>POST {BASE}/variations/generate</li>
            <li>GET {BASE}/jobs/{"{id}"}</li>
            <li>GET {BASE}/exports/{"{id}"}</li>
          </ul>
        </Card>
      </div>

      <Card title="Example · generate variation">
        <p className="mb-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">Request</p>
        <pre className="overflow-x-auto rounded-br100 bg-[var(--surface-page-secondary)] p-[var(--s-300)] text-[12px] leading-[18px]">
{`curl -X POST ${BASE}/variations/generate \\
  -H "Authorization: Bearer $IMAGINE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"environmentId":"env-kitchen-v2","selections":{...},"count":96}'`}
        </pre>
        <p className="mb-[var(--s-200)] mt-[var(--s-400)] text-[12px] text-[var(--text-default-body)]">Python</p>
        <pre className="overflow-x-auto rounded-br100 bg-[var(--surface-page-secondary)] p-[var(--s-300)] text-[12px] leading-[18px]">
{`import requests
r = requests.post(
  "${BASE}/variations/generate",
  headers={"Authorization": f"Bearer {token}"},
  json={"environmentId": "env-kitchen-v2", "count": 96},
  timeout=30,
)
r.raise_for_status()
print(r.json())`}
        </pre>
      </Card>
    </div>
  );
}
