import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KitchenConfigureWorkspace } from "@/components/kitchen/KitchenConfigureWorkspace";
import { AssetModelViewer } from "@/components/assets/AssetModelViewer";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { BatchGenerationPage } from "@/pages/BatchGenerationPage";
import { fetchJobs } from "@/lib/mockApi";
import { isLiveEnvironmentWorkspace, isLockedEnvironmentWorkspace } from "@/lib/environmentAccess";

type WorkspaceTab = "configure" | "batch" | "props" | "assets" | "downloads";

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
    name: "Residential",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/livingroom.png",
  },
  warehouse: {
    slug: "warehouse",
    name: "Industrial",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/warehouse.png",
  },
  "retail-store": {
    slug: "retail-store",
    name: "Retail",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/store.png",
  },
};

const KITCHEN_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "configure", label: "Configure" },
  { id: "batch", label: "Batch Variations" },
  { id: "downloads", label: "Downloads" },
];

const LEGACY_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "configure", label: "Configure" },
  { id: "props", label: "Props" },
  { id: "assets", label: "Assets" },
  { id: "downloads", label: "Downloads" },
];

type BatchFilterGroup = {
  label: string;
  options: string[];
};

const BATCH_FILTERS: BatchFilterGroup[] = [
  { label: "Lighting", options: ["Bright Daylight", "Warm Evening", "Dim Artificial"] },
  { label: "Clutter Density", options: ["Empty", "Moderate", "Dense"] },
  { label: "Camera Angle", options: ["Wide", "Counter", "Top-down"] },
];

const VARIATION_CARDS = Array.from({ length: 16 }).map((_, idx) => ({
  id: `VAR-${String(idx + 1).padStart(4, "0")}`,
  subtitle: idx % 2 === 0 ? "L-Shaped · Slab · Black Acrylic" : "U-Shaped · Shaker · Quartz Cloud",
  lighting: idx % 3 === 0 ? "Bright Daylight" : idx % 3 === 1 ? "Warm Evening" : "Dim Artificial",
  clutter: idx % 2 === 0 ? "Moderate" : "Dense",
}));

function WorkspaceNav({
  environmentSlug,
  tabList,
  end,
}: {
  environmentSlug: string;
  tabList: { id: WorkspaceTab; label: string }[];
  end?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[var(--s-200)] sm:flex-row sm:items-center sm:justify-between sm:gap-[var(--s-400)]">
      <nav className="min-w-0 flex-1" aria-label="Environment sections">
        <ul className="flex flex-wrap gap-[var(--s-200)]">
          {tabList.map((tab) => (
            <li key={tab.id}>
              <NavLink
                to={`/environments/${environmentSlug}/${tab.id}`}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] transition-colors",
                    isActive
                      ? "border-[var(--papaya-500)] font-semibold text-[var(--text-primary-default)]"
                      : "border-transparent font-medium text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {end ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-[var(--s-200)] pb-[var(--s-200)] sm:pb-0">{end}</div>
      ) : null}
    </div>
  );
}

function BatchVariationsPanel({ environmentSlug }: { environmentSlug: string }) {
  const [filters, setFilters] = useState<Record<string, string[]>>({
    Lighting: ["Bright Daylight"],
    "Clutter Density": ["Moderate"],
    "Camera Angle": [],
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCards = VARIATION_CARDS.filter((card) => {
    const lighting = filters.Lighting ?? [];
    const clutter = filters["Clutter Density"] ?? [];
    const camera = filters["Camera Angle"] ?? [];
    const lightingMatch = lighting.length === 0 || lighting.includes(card.lighting);
    const clutterMatch = clutter.length === 0 || clutter.includes(card.clutter);
    const cameraMatch = camera.length === 0 || camera.includes("Wide");
    return lightingMatch && clutterMatch && cameraMatch;
  });

  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[group] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  const toggleCard = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedIds(filteredCards.map((c) => c.id));
  };

  const clearAll = () => setSelectedIds([]);

  const generateSelected = () => {
    if (!selectedIds.length || isGenerating) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      alert(`Generation started for ${selectedIds.length} variation(s) in ${environmentSlug}.`);
    }, 450);
  };

  return (
    <div className="space-y-[var(--s-300)]">
      <div className="flex flex-wrap items-center gap-[var(--s-200)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-300)]">
        <p className="text-[13px] text-[var(--text-default-body)]">
          <span className="font-medium text-[var(--text-default-heading)]">{selectedIds.length}</span> selected
        </p>
        <Button variant="primary" onClick={generateSelected} disabled={!selectedIds.length || isGenerating}>
          {isGenerating ? "Generating..." : "Generate Selected"}
        </Button>
        <Button variant="secondary" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="secondary" onClick={clearAll}>
          Clear
        </Button>
      </div>

      <div className="grid gap-[var(--s-300)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-[var(--s-300)]">
          {BATCH_FILTERS.map((group) => (
            <Card key={group.label} title={group.label}>
              <div className="space-y-[var(--s-200)]">
                {group.options.map((opt) => {
                  const checked = (filters[group.label] ?? []).includes(opt);
                  return (
                    <label key={opt} className="flex cursor-pointer items-center gap-[var(--s-200)] text-[13px] text-[var(--text-default-heading)]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(group.label, opt)}
                        className="h-4 w-4 rounded border-[var(--border-default-secondary)]"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-[var(--s-300)] sm:grid-cols-2 xl:grid-cols-4">
          {filteredCards.map((card) => {
            const selected = selectedIds.includes(card.id);
            return (
              <button
                type="button"
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={`overflow-hidden rounded-br200 border text-left transition-[border-color,box-shadow,transform] duration-200 ${
                  selected
                    ? "border-[var(--border-primary-default)] shadow-[0_0_0_1px_var(--border-primary-default)]"
                    : "border-[var(--border-default-secondary)]"
                }`}
              >
                <div className="flex h-[96px] items-center justify-center bg-[var(--surface-page-secondary)]">
                  <span className="material-symbols-outlined text-[24px] text-[var(--text-default-placeholder)]">deployed_code</span>
                </div>
                <div className="space-y-[6px] p-[var(--s-300)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-[var(--text-default-heading)]">{card.id}</p>
                    <input type="checkbox" readOnly checked={selected} className="h-4 w-4 rounded" />
                  </div>
                  <p className="text-[12px] text-[var(--text-default-body)]">{card.subtitle}</p>
                  <p className="text-[12px] text-[var(--text-default-placeholder)]">
                    {card.lighting} · {card.clutter}
                  </p>
                  <p className="text-[12px] font-medium text-[var(--text-success-default)]">Ready</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspacePanel({ section, environmentSlug }: { section: WorkspaceTab; environmentSlug: string }) {
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs, enabled: section === "downloads" });

  if (section === "configure" && environmentSlug === "kitchen") {
    return <KitchenConfigureWorkspace />;
  }

  if (section === "batch" && environmentSlug === "kitchen") {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[inset_0_0_0_1px_var(--border-default-secondary)]">
        <BatchGenerationPage embedded />
      </div>
    );
  }

  if (section === "configure") {
    return <BatchVariationsPanel environmentSlug={environmentSlug} />;
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
        <div className="mt-[var(--s-300)] grid gap-[var(--s-300)] sm:grid-cols-2">
          <Link
            to="/assets/props"
            className="group overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
              <img
                src="/assets/Props/Dining Chair.png"
                alt="Props preview"
                className="h-full w-full object-cover object-center"
              />
            </div>
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
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
              <img
                src="/assets/Materials/Carrara Marble.png"
                alt="Materials preview"
                className="h-full w-full object-cover object-center"
              />
            </div>
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

function lockedEnvironmentPreviewUrl(slug: string): string {
  if (slug === "living-room") return "/assets/3d/floor-lamp.glb";
  if (slug === "warehouse") return "/assets/3d/drawer-base-unit-900mm.glb";
  if (slug === "retail-store") return "/assets/3d/microwave.glb";
  return "/assets/3d/dining-table.glb";
}

function LockedEnvironmentPage({ meta }: { meta: EnvironmentMeta }) {
  const [talkOpen, setTalkOpen] = useState(false);
  const modelUrl = lockedEnvironmentPreviewUrl(meta.slug);

  return (
    <>
      <div className="w-full max-w-none space-y-[var(--s-500)] lg:max-w-[1400px]">
        <header className="border-b border-[var(--border-default-secondary)] pb-[var(--s-400)]">
          <div className="flex items-start gap-[var(--s-300)]">
            <Link
              to="/environments"
              className="mt-[2px] flex h-10 w-10 shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] hover:text-[var(--text-default-heading)]"
              aria-label="Back to environments"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <img src={meta.heroImage} alt="" className="h-14 w-[4.5rem] shrink-0 rounded-br200 object-cover" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-tight text-[var(--text-default-heading)]">
                {meta.name}
              </h1>
            </div>
          </div>
        </header>

        <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,1fr)] lg:items-stretch">
          <div className="relative min-h-[min(440px,52vh)] overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] shadow-[inset_0_0_0_1px_var(--border-default-secondary)]">
            <AssetModelViewer url={modelUrl} />
          </div>
          <div className="flex flex-col justify-center space-y-[var(--s-400)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-500)]">
            <h2 className="text-[clamp(1.15rem,1.8vw,1.35rem)] font-semibold leading-snug text-[var(--text-default-heading)]">
              Full access required
            </h2>
            <p className="text-[15px] leading-[24px] text-[var(--text-default-body)]">
              This environment is available as part of the full platform.
            </p>
            <Button variant="primary" type="button" className="w-full justify-center sm:w-auto" onClick={() => setTalkOpen(true)}>
              Talk to Team
            </Button>
          </div>
        </div>
      </div>
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}

export function EnvironmentWorkspacePage() {
  const { environmentSlug, section } = useParams();
  const meta = environmentSlug ? ENVIRONMENTS[environmentSlug] : null;

  const tabList = meta?.slug === "kitchen" ? KITCHEN_TABS : LEGACY_TABS;

  if (!meta) {
    return <Navigate to="/environments" replace />;
  }

  if (isLockedEnvironmentWorkspace(meta.slug)) {
    return <LockedEnvironmentPage meta={meta} />;
  }

  if (!isLiveEnvironmentWorkspace(meta.slug)) {
    return <Navigate to="/environments" replace />;
  }

  const activeSection = (section ?? "configure") as WorkspaceTab;
  if (!tabList.some((t) => t.id === activeSection)) {
    return <Navigate to={`/environments/${meta.slug}/configure`} replace />;
  }

  const isKitchen = meta.slug === "kitchen";
  const kitchenWorkspaceFill = isKitchen && (activeSection === "configure" || activeSection === "batch");
  const [bookDemoOpen, setBookDemoOpen] = useState(false);

  const kitchenTabActions =
    isKitchen ? (
      <>
        <Button
          variant="secondary"
          type="button"
          className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-200)] text-[13px]"
          onClick={() => setBookDemoOpen(true)}
        >
          Add from library
        </Button>
        <Button
          variant="secondary"
          type="button"
          className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-200)] text-[13px]"
          onClick={() => setBookDemoOpen(true)}
        >
          Upload
        </Button>
      </>
    ) : undefined;

  return (
    <>
      <div
        className={
          kitchenWorkspaceFill
            ? "flex w-full max-w-none flex-col gap-[var(--s-400)] lg:max-w-[1400px] md:min-h-0 md:flex-1"
            : "w-full max-w-none space-y-[var(--s-400)] lg:max-w-[1400px]"
        }
      >
        {isKitchen ? (
          <header className="border-b border-[var(--border-default-secondary)] pb-[var(--s-400)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <Link
                to="/environments"
                className={`mt-[2px] flex h-10 w-10 shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] hover:text-[var(--text-default-heading)]`}
                aria-label="Back to environments"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </Link>
              <img
                src={meta.heroImage}
                alt=""
                className="h-14 w-[4.5rem] shrink-0 rounded-br200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-tight text-[var(--text-default-heading)]">
                  {meta.name}
                </h1>
                <p className="mt-[var(--s-200)] text-[13px] leading-snug text-[var(--text-default-body)]">
                  35 physics-ready models · 18 articulated assets · 24+ joints
                </p>
              </div>
            </div>
          </header>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)]">
              <img src={meta.heroImage} alt={`${meta.name}`} className="h-[220px] w-full object-cover md:h-[260px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
            </section>
            <PageHeader
              title={
                <span className="inline-flex items-center gap-[var(--s-200)]">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.accentClass}`} aria-hidden />
                  {meta.name}
                </span>
              }
              description={meta.status === "live" ? "Configure parameters, run batch jobs, and manage asset libraries and downloads." : undefined}
            />
          </>
        )}

        <WorkspaceNav environmentSlug={meta.slug} tabList={tabList} end={kitchenTabActions} />

        <div
          className={
            kitchenWorkspaceFill
              ? "min-h-0 w-full flex-1 overflow-hidden"
              : "min-h-[min(560px,calc(100dvh-20rem))] w-full pt-[var(--s-200)]"
          }
        >
          <WorkspacePanel section={activeSection} environmentSlug={meta.slug} />
        </div>
      </div>

      {isKitchen ? <TalkToTeamModal open={bookDemoOpen} onClose={() => setBookDemoOpen(false)} context="general" /> : null}
    </>
  );
}
