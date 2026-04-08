import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Button } from "@/components/ui/Button";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { fetchJobs } from "@/lib/mockApi";

type WorkspaceTab = "batch" | "api" | "props" | "assets" | "downloads";

type EnvironmentMeta = {
  slug: string;
  name: string;
  status: "live" | "in-progress";
  accentClass: string;
  heroImage: string;
};

const ENVIRONMENTS: Record<string, EnvironmentMeta> = {
  kitchen: {
    slug: "kitchen",
    name: "Kitchen",
    status: "live",
    accentClass: "bg-[var(--green-500)]",
    heroImage: "/assets/environments/kitchen.jpg",
  },
  "living-room": {
    slug: "living-room",
    name: "Living Room",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/livingroom.png",
  },
  warehouse: {
    slug: "warehouse",
    name: "Warehouse",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/warehouse.png",
  },
  "retail-store": {
    slug: "retail-store",
    name: "Retail Store",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/store.png",
  },
};

const tabs: { id: WorkspaceTab; label: string }[] = [
  { id: "batch", label: "Batch Variations" },
  { id: "api", label: "API" },
  { id: "props", label: "Props" },
  { id: "assets", label: "Assets" },
  { id: "downloads", label: "Downloads" },
];

function WorkspaceNav({ environmentSlug }: { environmentSlug: string }) {
  return (
    <nav className="border-b border-[var(--border-default-secondary)]">
      <ul className="flex flex-wrap gap-[var(--s-200)]">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <NavLink
              to={`/environments/${environmentSlug}/${tab.id}`}
              className={({ isActive }) =>
                [
                  "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] font-medium transition-colors",
                  isActive
                    ? "border-[var(--papaya-500)] text-[var(--text-default-heading)]"
                    : "border-transparent text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function WorkspacePanel({ section }: { section: WorkspaceTab }) {
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs, enabled: section === "downloads" });

  if (section === "batch") {
    return (
      <Card title="Batch variations">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Configure parameter sweeps and queue variation jobs from the batch workspace.
        </p>
        <Link
          to="/batch"
          className="mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
        >
          Open batch workspace
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </Card>
    );
  }

  if (section === "api") {
    return (
      <Card title="API">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Manage API keys and integration references for this environment workflow.
        </p>
        <Link
          to="/api"
          className="mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
        >
          Open API docs
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </Card>
    );
  }

  if (section === "props") {
    return (
      <Card title="Props library">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Browse and filter simulation-ready props used by environment configurations.
        </p>
        <Link
          to="/assets/props"
          className="mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
        >
          Open props
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </Card>
    );
  }

  if (section === "assets") {
    return (
      <Card title="Assets">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Open the asset libraries used by this environment workflow.
        </p>
        <div className="mt-[var(--s-300)] grid gap-[var(--s-300)] md:grid-cols-2">
          <Link
            to="/assets/props"
            className="group overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]"
          >
            <img src="/assets/Props/Dining Chair.png" alt="Props" className="h-[120px] w-full object-cover" />
            <div className="flex items-center justify-between px-[var(--s-300)] py-[var(--s-300)]">
              <span className="text-[15px] font-medium text-[var(--text-default-heading)]">Props</span>
              <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-200 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Link>
          <Link
            to="/assets/materials"
            className="group overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]"
          >
            <img src="/assets/Materials/Carrara Marble.png" alt="Materials" className="h-[120px] w-full object-cover" />
            <div className="flex items-center justify-between px-[var(--s-300)] py-[var(--s-300)]">
              <span className="text-[15px] font-medium text-[var(--text-default-heading)]">Materials</span>
              <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-200 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>
        <div className="mt-[var(--s-300)]">
          <Link
            to="/assets"
            className="inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
          >
            Open all assets
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Downloads">
      {jobs.isError ? (
        <ErrorPanel message="Could not load downloads." onRetry={() => jobs.refetch()} />
      ) : jobs.isLoading ? (
        <div className="space-y-[var(--s-200)]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : jobs.data?.length ? (
        <ul className="space-y-[var(--s-200)] text-[13px]">
          {jobs.data.slice(0, 6).map((job) => (
            <li key={job.id} className="flex items-center justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] pb-[var(--s-200)] last:border-0">
              <span className="font-mono text-[12px] text-[var(--text-default-heading)]">{job.id}</span>
              <span className="capitalize text-[var(--text-default-body)]">{job.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] text-[var(--text-default-body)]">No downloads yet.</p>
      )}
    </Card>
  );
}

export function EnvironmentWorkspacePage() {
  const { environmentSlug, section } = useParams();
  const meta = environmentSlug ? ENVIRONMENTS[environmentSlug] : null;
  const [talkOpen, setTalkOpen] = useState(false);

  if (!meta) {
    return <Navigate to="/environments" replace />;
  }

  const activeSection = (section ?? "batch") as WorkspaceTab;
  if (!tabs.some((t) => t.id === activeSection)) {
    return <Navigate to={`/environments/${meta.slug}/batch`} replace />;
  }

  return (
    <div className="space-y-[var(--s-400)]">
      <section className="relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)]">
        <img src={meta.heroImage} alt={`${meta.name}`} className="h-[220px] w-full object-cover md:h-[260px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
      </section>

      <div className="relative">
        <div className={meta.status === "live" ? "" : "pointer-events-none select-none opacity-45 blur-[3px] saturate-75"}>
          <PageHeader
            title={
              <span className="inline-flex items-center gap-[var(--s-200)]">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.accentClass}`} aria-hidden />
                {meta.name}
              </span>
            }
            description={
              meta.status === "live"
                ? "Environment workspace with generation, APIs, asset libraries, and downloads."
                : "Environment workspace is available for planning flows and asset/API setup."
            }
          />
          <WorkspaceNav environmentSlug={meta.slug} />
          <WorkspacePanel section={activeSection} />
        </div>
        {meta.status !== "live" ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-br200 bg-[var(--surface-default)]/68 backdrop-blur-md">
            <div className="mx-[var(--s-300)] w-full max-w-[560px] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-500)] py-[calc(var(--s-500)+var(--s-100))] shadow-lg sm:px-[calc(var(--s-500)+var(--s-100))]">
              <p className="text-[26px] font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--text-default-heading)]">Full Access Required</p>
              <div className="mt-[var(--s-300)] space-y-[var(--s-300)] text-left text-[16px] leading-[27px] text-[var(--text-default-body)]">
                <p>{meta.name} environments are available with full platform access.</p>
                <p>Contact our team to enable access.</p>
              </div>
              <Button variant="primary" className="mt-[var(--s-400)] w-full" onClick={() => setTalkOpen(true)}>
                Talk to Team
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}
