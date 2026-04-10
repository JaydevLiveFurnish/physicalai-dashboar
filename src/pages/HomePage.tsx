import { useState } from "react";
import { Link } from "react-router-dom";
import { RequestCustomSceneModal } from "@/components/environments/RequestCustomSceneModal";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { PageHeader } from "@/components/layout/PageHeader";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MATERIALS, MOCK_PROPS } from "@/data/mockCatalog";
import { ENVIRONMENT_CATALOG_PLACEHOLDERS } from "@/lib/mockApi";
import { environmentWorkspaceHref } from "@/lib/environmentWorkspaceHref";

const tx = "transition-[color,background-color,box-shadow,transform] duration-250 ease-out";

const sectionTitle =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-default-heading)]";

const typeCaption = "text-[12px] text-[var(--text-default-placeholder)]";

const envShell =
  "group relative block w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left";

const txOutline =
  "inline-flex items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-primary-default)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] transition-[color,background-color,border-color] duration-200 hover:bg-[var(--surface-primary-default-subtle)]";

const HOME_ENV_COUNT = 4;

const propsShowcase = MOCK_PROPS.slice(0, 5);
const materialsShowcase = MOCK_MATERIALS.slice(0, 6);

export function HomePage() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);

  return (
    <>
      <StaggerFadeGroup staggerMs={80} className="flex flex-col gap-[var(--s-600)] pb-[var(--s-600)] pt-[var(--s-100)]">
        <PageHeader
          title={
            <>
              Imagine.io{" "}
              <span className="font-normal text-[var(--text-default-placeholder)]" aria-hidden>
                ×
              </span>{" "}
              Physical AI
            </>
          }
          description="Browse environments, props, and materials for simulation-ready scenes — configure spaces, generate variations, and export SimReady outputs."
          actions={
            <Link to="/assets" className={txOutline}>
              Asset library
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                arrow_forward
              </span>
            </Link>
          }
        />

        <section className="space-y-[var(--s-400)]" aria-labelledby="home-env-heading">
          <h2 id="home-env-heading" className={sectionTitle}>
            Environments
          </h2>
          <StaggerFadeGroup staggerMs={70} className="grid grid-cols-1 gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-4">
            {ENVIRONMENT_CATALOG_PLACEHOLDERS.slice(0, HOME_ENV_COUNT).map((env) => {
              const href = environmentWorkspaceHref(env);
              const live = env.status === "active";
              const thumb = env.catalogThumbnailUrl ?? "/assets/environments/galley-kitchen.jpg";
              const innerTop = (
                <>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-page-secondary)]">
                    <img
                      src={thumb}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
                    <div className="absolute left-[var(--s-300)] top-[var(--s-300)] z-[1]">
                      {live ? (
                        <Badge variant="live">Live</Badge>
                      ) : (
                        <span className="inline-flex items-center gap-[6px] rounded-full bg-[#2a2a2a] px-[10px] py-[6px] text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--grey-200)]">
                          <span className="material-symbols-outlined text-[14px]" aria-hidden>
                            lock
                          </span>
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-[var(--s-200)] pb-[var(--s-300)] pt-[var(--s-300)]">
                    <p className="text-[15px] font-semibold leading-tight text-[var(--text-default-heading)]">{env.name}</p>
                    <p className={`mt-[var(--s-100)] ${typeCaption}`}>Environment</p>
                  </div>
                </>
              );

              if (href) {
                return (
                  <Link key={env.id} to={href} className={`${envShell} ${tx}`}>
                    {innerTop}
                  </Link>
                );
              }

              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => setTalkOpen(true)}
                  className={`${envShell} ${tx}`}
                  title="Available with full access — talk to the team"
                >
                  {innerTop}
                </button>
              );
            })}
          </StaggerFadeGroup>

          <p className="text-[13px] text-[var(--text-default-body)]">
            Need another space?{" "}
            <button
              type="button"
              onClick={() => setRequestOpen(true)}
              className="font-medium text-[var(--text-primary-default)] underline underline-offset-2 hover:text-[var(--text-default-heading)]"
            >
              Request an environment
            </button>
          </p>
        </section>

        <section className="space-y-[var(--s-400)]" aria-labelledby="home-props-heading">
          <div className="flex flex-wrap items-end justify-between gap-[var(--s-300)]">
            <h2 id="home-props-heading" className={sectionTitle}>
              Props
            </h2>
            <Link
              to="/assets/props"
              className={`text-[13px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-heading)] ${tx}`}
            >
              View all
            </Link>
          </div>
          <StaggerFadeGroup staggerMs={60} className="grid grid-cols-2 gap-[var(--s-400)] sm:grid-cols-3 lg:grid-cols-5">
            {propsShowcase.map((p) => (
              <Link key={p.id} to="/assets/props" className={`group flex flex-col ${tx}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                  <img
                    src={p.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 m-auto max-h-[88%] max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-[var(--s-200)] text-center text-[13px] font-medium text-[var(--text-default-heading)]">{p.name}</p>
                <p className={`text-center ${typeCaption}`}>Prop</p>
              </Link>
            ))}
          </StaggerFadeGroup>
        </section>

        <section className="space-y-[var(--s-400)]" aria-labelledby="home-mat-heading">
          <div className="flex flex-wrap items-end justify-between gap-[var(--s-300)]">
            <h2 id="home-mat-heading" className={sectionTitle}>
              Materials
            </h2>
            <Link
              to="/assets/materials"
              className={`text-[13px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-heading)] ${tx}`}
            >
              View all
            </Link>
          </div>
          <StaggerFadeGroup staggerMs={50} className="grid grid-cols-2 gap-[var(--s-400)] sm:grid-cols-3 lg:grid-cols-6">
            {materialsShowcase.map((m) => (
              <Link key={m.id} to="/assets/materials" className={`group flex flex-col ${tx}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]">
                  <img
                    src={m.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-[var(--s-200)] text-center text-[13px] font-medium text-[var(--text-default-heading)]">{m.name}</p>
                <p className={`text-center ${typeCaption}`}>Material</p>
              </Link>
            ))}
          </StaggerFadeGroup>
        </section>
      </StaggerFadeGroup>

      <RequestCustomSceneModal open={requestOpen} onClose={() => setRequestOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}
