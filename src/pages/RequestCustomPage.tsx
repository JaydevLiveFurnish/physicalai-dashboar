import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchEnvironments, ENVIRONMENT_CATALOG_PLACEHOLDERS } from "@/lib/mockApi";
import { EnvironmentCatalogCards } from "@/components/environments/EnvironmentCatalogCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { RequestCustomSceneForm } from "@/components/environments/RequestCustomSceneForm";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";

export function RequestCustomPage() {
  const { accessTier } = useAuth();
  const [talkOpen, setTalkOpen] = useState(false);
  const envs = useQuery({ queryKey: ["environments"], queryFn: fetchEnvironments });
  const catalog =
    envs.data && envs.data.length > 0 ? envs.data : ENVIRONMENT_CATALOG_PLACEHOLDERS;

  return (
    <>
    <div className="space-y-[var(--s-500)]">
      <PageHeader
        title="Request a Custom Scene"
        description="Tell us about your robot, simulation platform, and environment needs. We will follow up with scoping."
      />

      <section className="space-y-[var(--s-300)]">
        <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">
          Environment library
        </h2>
        <p className="sr-only">
          Browse available and upcoming environments. Submit this form below for a custom scene.
        </p>
        {envs.isLoading ? (
          <div className="flex flex-col gap-[var(--s-400)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[220px] w-full rounded-br200" />
            ))}
          </div>
        ) : (
          <EnvironmentCatalogCards
            environments={catalog}
            accessTier={accessTier}
            showRequestCard={false}
            onLockedEnvironmentClick={() => setTalkOpen(true)}
          />
        )}
      </section>

      <section className="space-y-[var(--s-300)]">
        <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Your request</h2>
        <Card>
          <RequestCustomSceneForm />
        </Card>
      </section>
    </div>
    <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}

