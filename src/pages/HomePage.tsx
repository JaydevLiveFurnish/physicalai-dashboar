import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchActivity, fetchSystemOverview } from "@/lib/mockApi";
import { Callout } from "@/components/system/Callout";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";

const tx = "transition-[color,background-color,box-shadow,transform] duration-250 ease-out";
const teaserShell =
  "group relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)]";

function daypartGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const { accessTier } = useAuth();
  const batchAccess = canUseFeature(accessTier, "batch_submit");
  const apiKeysAllowed = canUseFeature(accessTier, "api_keys_write");
  const overview = useQuery({ queryKey: ["overview"], queryFn: fetchSystemOverview });
  const activity = useQuery({ queryKey: ["activity"], queryFn: fetchActivity });

  const greeting = daypartGreeting();
  const paramCount = overview.data?.environments.parameterCount ?? 13;

  const downloadActivity = activity.data?.filter((a) => a.kind === "download") ?? [];

  if (overview.isLoading) {
    return (
      <div className="space-y-[var(--s-500)]">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-[var(--s-500)] lg:grid-cols-[1fr_minmax(260px,320px)]">
          <div className="space-y-[var(--s-400)]">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-[var(--s-400)]">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <ErrorPanel
        message="We couldn’t load the system overview. Check your connection and try again."
        onRetry={() => overview.refetch()}
      />
    );
  }

  return (
    <div className="space-y-[var(--s-600)] pb-[var(--s-400)]">
      <header>
        <h1 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-semibold leading-tight text-[var(--text-default-heading)]">
          {greeting}
        </h1>
      </header>

      {activity.isError ? (
        <Callout variant="warning" title="Activity feed unavailable">
          Recent downloads couldn’t be loaded.{" "}
          <button
            type="button"
            className="font-medium text-[var(--text-primary-default)] underline underline-offset-2"
            onClick={() => activity.refetch()}
          >
            Retry
          </button>
        </Callout>
      ) : null}

      <section className="space-y-[var(--s-300)]">
        <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Environments</h2>
        <div className="grid gap-[var(--s-300)] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "Kitchen", href: "/environments/kitchen/batch", img: "/assets/environments/kitchen.jpg", live: true },
            {
              name: "Living Room",
              href: "/environments/living-room/batch",
              img: "/assets/environments/livingroom.png",
              live: false,
            },
            { name: "Warehouse", href: "/environments/warehouse/batch", img: "/assets/environments/warehouse.png", live: false },
            { name: "Retail Store", href: "/environments/retail-store/batch", img: "/assets/environments/store.png", live: false },
          ].map((env) => (
            <Link key={env.name} to={env.href} className={teaserShell}>
              <img src={env.img} alt={env.name} className="h-[130px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/10" />
              <div className="absolute left-[var(--s-200)] top-[var(--s-200)]">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${env.live ? "bg-[var(--green-500)]" : "bg-[#eab308]"}`} />
              </div>
              <div className="absolute inset-x-[var(--s-200)] bottom-[var(--s-200)] z-[1]">
                <p className="text-[16px] font-semibold text-white">{env.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-[var(--s-500)] lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-start lg:gap-[var(--s-600)]">
        <div className="space-y-[var(--s-500)]">
          <section className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 bg-[var(--surface-primary-default-subtle)] text-[var(--papaya-500)]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[24px]">layers</span>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">
                  Kitchen Environment
                </h2>
                <p className="mt-[var(--s-200)] text-[14px] leading-[20px] text-[var(--text-default-body)]">
                  Configure, generate, and download physics-ready kitchen environments for robotic manipulation training.
                </p>
              </div>
            </div>

            <div className="mt-[var(--s-500)] flex flex-wrap gap-x-[var(--s-600)] gap-y-[var(--s-400)] border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]">
              {(
                [
                  { value: "35", label: "Models" },
                  { value: "18", label: "Articulated" },
                  { value: "24+", label: "Joints" },
                  { value: String(paramCount), label: "Parameters" },
                ] as const
              ).map((s) => (
                <div key={s.label} className="min-w-[72px]">
                  <p className="text-[28px] font-semibold leading-none tracking-tight text-[var(--text-default-heading)]">
                    {s.value}
                  </p>
                  <p className="mt-[var(--s-100)] text-[12px] text-[var(--text-default-body)]">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-[var(--s-500)] space-y-[var(--s-200)] border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]">
              <Link
                to="/environments/kitchen/batch"
                className={`flex w-full items-center justify-between rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-300)] py-[var(--s-300)] text-[15px] font-medium text-[var(--text-on-color-body)] hover:bg-[var(--surface-primary-default-hover)] ${tx}`}
              >
                <span className="inline-flex items-center gap-[var(--s-200)]">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    tune
                  </span>
                  Configure Environment
                </span>
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/environments/kitchen/batch"
                className={`flex w-full items-center justify-between rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] text-[15px] text-[var(--text-default-heading)] hover:bg-[var(--surface-default)] ${tx}`}
              >
                <span className="inline-flex items-center gap-[var(--s-200)]">
                  <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]" aria-hidden>
                    dashboard
                  </span>
                  Batch Variations
                  {!batchAccess ? (
                    <span className="material-symbols-outlined text-[16px] text-[var(--text-default-placeholder)]" aria-hidden>
                      lock
                    </span>
                  ) : null}
                </span>
                <span className="material-symbols-outlined text-[20px] text-[var(--text-default-placeholder)]" aria-hidden>
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/environments/kitchen/api"
                className={`flex w-full items-center justify-between rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] text-[15px] text-[var(--text-default-heading)] hover:bg-[var(--surface-default)] ${tx}`}
              >
                <span className="inline-flex items-center gap-[var(--s-200)]">
                  <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]" aria-hidden>
                    code
                  </span>
                  API Documentation
                  {!apiKeysAllowed ? (
                    <span className="material-symbols-outlined text-[16px] text-[var(--text-default-placeholder)]" aria-hidden>
                      lock
                    </span>
                  ) : null}
                </span>
                <span className="material-symbols-outlined text-[20px] text-[var(--text-default-placeholder)]" aria-hidden>
                  arrow_forward
                </span>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Recent activity</h2>
            <div className="mt-[var(--s-300)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] sm:p-[var(--s-500)]">
              {activity.isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : downloadActivity.length === 0 ? (
                <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
                  No downloads yet. Configure your first kitchen environment to get started.{" "}
                  <Link
                    to="/environments/kitchen/batch"
                    className="font-medium text-[var(--text-primary-default)] underline-offset-2 hover:underline"
                  >
                    Configure kitchen
                  </Link>
                </p>
              ) : (
                <ul className="divide-y divide-[var(--border-default-secondary)]">
                  {downloadActivity.slice(0, 5).map((a) => (
                    <li key={a.id} className="py-[var(--s-300)] first:pt-0 last:pb-0">
                      <p className="text-[13px] text-[var(--text-default-body)]">
                        {new Date(a.at).toLocaleString()}
                      </p>
                      <p className="mt-[var(--s-100)] text-[14px] text-[var(--text-default-heading)]">{a.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <footer className="border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]">
            <p className="text-[11px] font-semibold uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
              Quick links
            </p>
            <ul className="mt-[var(--s-300)] flex flex-wrap gap-x-[var(--s-500)] gap-y-[var(--s-200)] text-[13px] font-medium">
              <li>
                <Link to="/api" className={`text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}>
                  API
                </Link>
              </li>
              <li>
                <Link
                  to="/assets/props"
                  className={`text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
                >
                  Props Library
                </Link>
              </li>
              <li>
                <Link
                  to="/assets/materials"
                  className={`text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
                >
                  Materials
                </Link>
              </li>
              <li>
                <Link to="/api" className={`text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}>
                  API Keys
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className={`text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
                >
                  Account
                </Link>
              </li>
            </ul>
          </footer>
        </div>

        <aside className="flex flex-col gap-[var(--s-400)] lg:sticky lg:top-[calc(3.5rem+var(--s-400)+env(safe-area-inset-top))]">
          <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Assets summary</h2>
              <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--text-default-body)]">
                Quick access to core libraries used in scene generation.
              </p>

              <div className="mt-[var(--s-300)] space-y-[var(--s-300)]">
                <Link
                  to="/assets/props"
                  className={`group flex items-center justify-between gap-[var(--s-200)] border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] hover:bg-[var(--surface-default)] ${tx}`}
                >
                  <span className="flex min-w-0 items-center gap-[var(--s-200)]">
                    <img
                      src="/assets/Props/Dining Chair.png"
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-br100 object-cover"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-[var(--text-default-heading)]">Props</span>
                      <span className="text-[12px] text-[var(--text-default-body)]">
                        {overview.data.assets.propsCount.toLocaleString()} items
                      </span>
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-250 group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  to="/assets/materials"
                  className={`group flex items-center justify-between gap-[var(--s-200)] border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] hover:bg-[var(--surface-default)] ${tx}`}
                >
                  <span className="flex min-w-0 items-center gap-[var(--s-200)]">
                    <img
                      src="/assets/Materials/Carrara Marble.png"
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-br100 object-cover"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-[var(--text-default-heading)]">Materials</span>
                      <span className="text-[12px] text-[var(--text-default-body)]">
                        {overview.data.assets.materialsCount.toLocaleString()} items
                      </span>
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-250 group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </Link>

              </div>

              <Link
                to="/assets"
                className={`mt-[var(--s-400)] inline-flex items-center text-[14px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
              >
                Open assets summary
              </Link>
            </div>
          </Card>

          <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 border border-[#e8b8ff]/50 bg-[#f6edff] text-[#9333ea]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">SimReady</h2>
                <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--text-default-body)]">
                  Convert any 3D model into a simulation-ready USD asset with physics and articulation.
                </p>
                <Link
                  to="/simready"
                  className={`mt-[var(--s-400)] inline-flex items-center text-[14px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
                >
                  Learn more
                </Link>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
