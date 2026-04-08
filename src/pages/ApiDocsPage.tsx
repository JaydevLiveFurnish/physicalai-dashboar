import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createApiKey, fetchApiKeys, revokeApiKey } from "@/lib/mockApi";
import { ApiAccessModal } from "@/components/access/ApiAccessModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature, FULL_ACCESS_TOOLTIP } from "@/lib/access";
import type { ApiKeyRecord } from "@/types";

const BASE = "https://api.imagine.io/physical-ai/v1";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

const txIcon =
  "inline-flex h-8 w-8 items-center justify-center rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)]";

export function ApiDocsPage() {
  const { accessTier } = useAuth();
  const qc = useQueryClient();
  const keys = useQuery({ queryKey: ["apiKeys"], queryFn: fetchApiKeys });
  const keysWrite = canUseFeature(accessTier, "api_keys_write");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);

  const create = useMutation({
    mutationFn: () => createApiKey("generated"),
    onSuccess: (data) => {
      setNewSecret(data.secret);
      setError(null);
      qc.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: () => setError("Could not create key"),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apiKeys"] }),
  });

  const copyKey = (text: string) => {
    void navigator.clipboard?.writeText(text);
  };

  return (
    <div className="space-y-[var(--s-500)]">
      <PageHeader
        title="API Keys"
        description="API keys enable programmatic access to scene generation and exports. Send the key in the Authorization header as a Bearer token."
        actions={
          keysWrite ? (
            <Button
              variant="primary"
              className={`shrink-0 ${txBtn}`}
              disabled={create.isPending}
              onClick={() => create.mutate()}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                add
              </span>
              {create.isPending ? "Generating..." : "Generate New Key"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className={`shrink-0 border-[var(--border-primary-default)] text-[var(--text-primary-default)] ${txBtn}`}
              type="button"
              title={FULL_ACCESS_TOOLTIP}
              disabled
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
              Generate New Key
            </Button>
          )
        }
      />

      <section className="space-y-[var(--s-300)]">
        {!keysWrite ? (
          <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)]">
            <div className="flex flex-col gap-[var(--s-200)] text-[14px] leading-[22px] text-[var(--text-default-body)]">
              <p className="text-[12px] text-[var(--text-default-placeholder)]">Requires full access</p>
              <p>Issuing and revoking keys is not available in Explore access.</p>
              <div className="flex flex-wrap gap-[var(--s-300)] pt-[var(--s-100)]">
                <Button variant="primary" type="button" onClick={() => setTalkOpen(true)}>
                  Talk to Team
                </Button>
                <Button variant="secondary" type="button" onClick={() => setApiModalOpen(true)}>
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <section className="overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)]">
              <div className="border-b border-[var(--border-default-secondary)] px-[var(--s-500)] py-[var(--s-300)]">
                <h3 className="text-[14px] text-[var(--text-default-body)]">
                  {keys.isLoading ? "—" : `${keys.data?.length ?? 0} keys`}
                </h3>
              </div>

              {keys.isError ? (
                <div className="p-[var(--s-500)]">
                  <ErrorPanel message="Could not load API keys." onRetry={() => keys.refetch()} />
                </div>
              ) : null}
              {keys.isLoading ? (
                <div className="p-[var(--s-500)]">
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : null}
              {!keys.isLoading && !keys.isError && keys.data?.length === 0 ? (
                <p className="p-[var(--s-500)] text-[14px] text-[var(--text-default-body)]">No keys yet. Generate one above.</p>
              ) : null}
              {!keys.isLoading && !keys.isError && keys.data && keys.data.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] text-[12px] font-semibold text-[var(--text-default-body)]">
                        <th className="px-[var(--s-400)] py-[var(--s-300)] sm:px-[var(--s-500)]">KEY</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">Created</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">Last used</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">REQUESTS (MONTH)</th>
                        <th className="px-[var(--s-400)] py-[var(--s-300)] text-right sm:px-[var(--s-500)]">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keys.data.map((k: ApiKeyRecord) => (
                        <tr key={k.id} className="border-b border-[var(--border-default-secondary)] last:border-0">
                          <td className="max-w-[1px] px-[var(--s-400)] py-[var(--s-400)] sm:px-[var(--s-500)]">
                            <div className="truncate font-mono text-[12px] text-[var(--text-default-heading)]">{k.maskedKey}</div>
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] text-[var(--text-default-body)]">
                            {new Date(k.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] text-[var(--text-default-body)]">
                            {k.lastUsedAt
                              ? new Date(k.lastUsedAt).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] font-mono text-[var(--text-default-heading)]">
                            {k.requestsThisMonth.toLocaleString()}
                          </td>
                          <td className="px-[var(--s-400)] py-[var(--s-400)] text-right sm:px-[var(--s-500)]">
                            <div className="inline-flex justify-end gap-[var(--s-200)]">
                              <button
                                type="button"
                                className={txIcon}
                                aria-label="Copy key fingerprint"
                                onClick={() => copyKey(k.maskedKey)}
                              >
                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                              </button>
                              <button
                                type="button"
                                className={`${txIcon} text-[var(--text-error-default)] hover:bg-[var(--surface-error-default-subtle)]`}
                                aria-label="Revoke key"
                                disabled={revoke.isPending}
                                onClick={() => revoke.mutate(k.id)}
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {error ? <p className="px-[var(--s-500)] pb-[var(--s-400)] text-[13px] text-[var(--text-error-default)]">{error}</p> : null}
              {newSecret ? (
                <p className="break-all px-[var(--s-500)] pb-[var(--s-500)] font-mono text-[12px] text-[var(--text-success-default)]">
                  New secret (copy now): {newSecret}
                </p>
              ) : null}
            </section>
          </>
        )}
      </section>

      <div className="grid gap-[var(--s-500)] lg:grid-cols-2">
        <Card title="Reference · Endpoints">
          <ul className="space-y-[var(--s-200)] break-words font-mono text-[12px] text-[var(--text-default-heading)]">
            <li>POST {BASE}/configs</li>
            <li>POST {BASE}/variations/generate</li>
            <li>GET {BASE}/jobs/{"{id}"}</li>
            <li>GET {BASE}/exports/{"{id}"}</li>
          </ul>
        </Card>

        <Card title="Reference · Example · curl">
          <pre className="overflow-x-auto rounded-br100 bg-[var(--surface-page-secondary)] p-[var(--s-300)] text-[12px] leading-[18px]">
            {`curl -X POST ${BASE}/variations/generate \\
  -H "Authorization: Bearer $IMAGINE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"environmentId":"env-kitchen-v2","selections":{...},"count":96}'`}
          </pre>
        </Card>
      </div>

      <Card title="Reference · Python">
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

      <ApiAccessModal open={apiModalOpen} onClose={() => setApiModalOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="api" />
    </div>
  );
}
