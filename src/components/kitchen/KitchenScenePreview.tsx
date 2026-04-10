import type { CSSProperties } from "react";
import type { KitchenParamKey } from "@/kitchen/params";

type KitchenScenePreviewProps = {
  values: Record<KitchenParamKey, string>;
  /** Light studio background (environment workspace) vs dark dev preview */
  variant?: "dark" | "light";
};

function formatConfiguratorHeadline(values: Record<KitchenParamKey, string>): string {
  const layout = values.Layout ?? "L-Shaped";
  const door = values["Door Style"] ?? "Shaker";
  const finish = values["Cabinet Finish"] ?? "White Oak";
  const island = values.Island?.startsWith("No") ? "" : ` · ${values.Island ?? ""}`;
  return `3D Configurator — ${layout}, ${door}, ${finish}${island}`;
}

const EDGE = 120;
const HZ = EDGE / 2;

function faceStyle(light: boolean): CSSProperties {
  return {
    position: "absolute",
    width: EDGE,
    height: EDGE,
    left: 0,
    top: 0,
    border: light ? "2px solid rgba(0,0,0,0.12)" : "2px solid rgba(255,255,255,0.36)",
    background: light ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
    boxShadow: light ? "inset 0 0 12px rgba(0,0,0,0.04)" : "inset 0 0 20px rgba(255,255,255,0.04)",
  };
}

/** CSS 3D wireframe cube — lightweight stand-in for a WebGL viewport. */
function WireframeCube({ light }: { light?: boolean }) {
  const fs = faceStyle(Boolean(light));
  return (
    <div
      className="relative mx-auto [perspective:760px]"
      style={{ width: EDGE, height: EDGE }}
      aria-hidden
    >
      <div
        className="animate-kitchen-cube [transform-style:preserve-3d]"
        style={{
          width: EDGE,
          height: EDGE,
          position: "relative",
          margin: "0 auto",
        }}
      >
        <div style={{ ...fs, transform: `rotateY(0deg) translateZ(${HZ}px)` }} />
        <div style={{ ...fs, transform: `rotateY(180deg) translateZ(${HZ}px)` }} />
        <div style={{ ...fs, transform: `rotateY(90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...fs, transform: `rotateY(-90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...fs, transform: `rotateX(90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...fs, transform: `rotateX(-90deg) translateZ(${HZ}px)` }} />
      </div>
    </div>
  );
}

export function KitchenScenePreview({ values, variant = "dark" }: KitchenScenePreviewProps) {
  const headline = formatConfiguratorHeadline(values);
  const light = variant === "light";

  return (
    <div
      className={
        light
          ? "flex h-full min-h-[320px] flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:min-h-0"
          : "flex h-full min-h-[280px] flex-col overflow-hidden rounded-br200 border border-[var(--grey-700)] bg-[var(--dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:min-h-[320px] lg:aspect-square lg:min-h-0"
      }
    >
      <div
        className="flex flex-1 flex-col items-center justify-center gap-[var(--s-400)] px-[var(--s-400)] py-[var(--s-500)]"
        style={
          light
            ? {
                backgroundImage: [
                  "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(236,78,11,0.06), transparent 60%)",
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 24px)",
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 24px)",
                ].join(","),
              }
            : {
                backgroundImage: [
                  "radial-gradient(ellipse 80% 60% at 50% 28%, rgba(236,78,11,0.1), transparent 55%)",
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
                ].join(","),
              }
        }
      >
        <WireframeCube light={light} />
        <div className="max-w-[32rem] text-center">
          <p
            className={
              light
                ? "text-[15px] font-medium leading-snug text-[var(--text-default-heading)]"
                : "text-[15px] font-medium leading-snug text-[var(--grey-100)]"
            }
          >
            {headline}
          </p>
          <p
            className={
              light
                ? "mt-[var(--s-200)] text-[13px] text-[var(--text-default-body)]"
                : "mt-[var(--s-200)] text-[13px] text-[var(--grey-400)]"
            }
          >
            Drag to orbit · scroll to zoom — full scene loads here
          </p>
        </div>
      </div>
    </div>
  );
}
