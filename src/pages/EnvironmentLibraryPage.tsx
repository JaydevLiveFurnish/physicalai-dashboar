import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchEnvironments, ENVIRONMENT_CATALOG_PLACEHOLDERS } from "@/lib/mockApi";
import { EnvironmentCatalogCards } from "@/components/environments/EnvironmentCatalogCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";

const txLink =
  "inline-flex items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-primary-default)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] transition-[color,background-color,border-color,box-shadow] duration-200 hover:bg-[var(--surface-primary-default-subtle)]";

export function EnvironmentLibraryPage() {
  const { accessTier } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const envs = useQuery({ queryKey: ["environments"], queryFn: fetchEnvironments });
  const [requestOpen, setRequestOpen] = useState(false);
  const [talkTeamOpen, setTalkTeamOpen] = useState(false);

  useEffect(() => {
    const st = location.state as { openTalkToTeam?: boolean } | null;
    if (st?.openTalkToTeam) {
      setTalkTeamOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const catalog =
    envs.data && envs.data.length > 0 ? envs.data : ENVIRONMENT_CATALOG_PLACEHOLDERS;

  return (
    <>
    <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-400)]">
      <PageHeader
        title="Environments catalog"
        description="Browse simulation-ready spaces. Open available workspaces or request access for upcoming scenes."
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
        <div className="flex flex-col gap-[var(--s-400)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[min(240px,28vh)] w-full rounded-br200 sm:h-[220px]" />
          ))}
        </div>
      ) : (
        <EnvironmentCatalogCards
          environments={catalog}
          accessTier={accessTier}
          showRequestCard
          onRequestCustom={() => setRequestOpen(true)}
          onLockedEnvironmentClick={() => setTalkTeamOpen(true)}
        />
      )}
    </StaggerFadeGroup>
      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <TalkToTeamModal open={talkTeamOpen} onClose={() => setTalkTeamOpen(false)} context="general" />
    </>
  );
}
