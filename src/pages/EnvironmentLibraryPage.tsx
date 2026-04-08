import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchEnvironments, ENVIRONMENT_CATALOG_PLACEHOLDERS } from "@/lib/mockApi";
import { EnvironmentCatalogCards } from "@/components/environments/EnvironmentCatalogCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";

const txLink =
  "inline-flex items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-primary-default)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] transition-[color,background-color,border-color,box-shadow] duration-200 hover:bg-[var(--surface-primary-default-subtle)]";

export function EnvironmentLibraryPage() {
  const { accessTier } = useAuth();
  const envs = useQuery({ queryKey: ["environments"], queryFn: fetchEnvironments });
  const [requestOpen, setRequestOpen] = useState(false);

  const catalog =
    envs.data && envs.data.length > 0 ? envs.data : ENVIRONMENT_CATALOG_PLACEHOLDERS;

  return (
    <div className="space-y-[var(--s-400)]">
      <PageHeader
        title="Environments"
        description="Parameterized environments. Status reflects availability."
        actions={
          <button type="button" className={txLink} onClick={() => setRequestOpen(true)}>
            Request custom
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              arrow_forward
            </span>
          </button>
        }
      />

      {envs.isError ? (
        <ErrorPanel message="Environments couldn’t be loaded." onRetry={() => envs.refetch()} />
      ) : envs.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="min-h-[360px] rounded-br200" />
          ))}
        </div>
      ) : (
        <EnvironmentCatalogCards
          environments={catalog}
          accessTier={accessTier}
          showRequestCard
          onRequestCustom={() => setRequestOpen(true)}
        />
      )}
      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  );
}
