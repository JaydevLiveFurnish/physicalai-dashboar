import type { CSSProperties } from "react";
import type { KitchenParamKey } from "@/kitchen/params";

type KitchenScenePreviewProps = {
  values: Record<KitchenParamKey, string>;
};

function formatConfiguratorHeadline(values: Record<KitchenParamKey, string>): string {
  const layout =
    values.Layout === "L-Shape"
      ? "L-Shaped"
      : values.Layout === "U-Shape"
        ? "U-Shaped"
        : "Galley";
  const door = values["Door Style"]
    .replace(" Minimal", "")
    .replace(" Modern", "")
    .replace(" Raised", "");
  const finish =
    values["Cabinet Finish"] === "Matte Bone"
      ? "White Oak"
      : values["Cabinet Finish"] === "Walnut Veneer"
        ? "Walnut"
        : values["Cabinet Finish"] === "Graphite"
          ? "Graphite"
          : values["Cabinet Finish"];
  const island = values.Island === "true" ? " · Island" : "";
  return `3D Configurator — ${layout}, ${door}, ${finish}${island}`;
}

const EDGE = 120;
const HZ = EDGE / 2;

const faceStyle: CSSProperties = {
  position: "absolute",
  width: EDGE,
  height: EDGE,
  left: 0,
  top: 0,
  border: "2px solid rgba(255,255,255,0.36)",
  background: "rgba(255,255,255,0.02)",
  boxShadow: "inset 0 0 20px rgba(255,255,255,0.04)",
};

/** CSS 3D wireframe cube — lightweight stand-in for a WebGL viewport. */
function WireframeCube() {
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
        <div style={{ ...faceStyle, transform: `rotateY(0deg) translateZ(${HZ}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${HZ}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${HZ}px)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${HZ}px)` }} />
      </div>
    </div>
  );
}

export function KitchenScenePreview({ values }: KitchenScenePreviewProps) {
  const headline = formatConfiguratorHeadline(values);

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-br200 border border-[var(--grey-700)] bg-[var(--dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:min-h-[320px] lg:aspect-square lg:min-h-0">
      <div
        className="flex flex-1 flex-col items-center justify-center gap-[var(--s-400)] px-[var(--s-400)] py-[var(--s-500)]"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 60% at 50% 28%, rgba(236,78,11,0.1), transparent 55%)",
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)",
          ].join(","),
        }}
      >
        <WireframeCube />
        <div className="max-w-[32rem] text-center">
          <p className="text-[15px] font-medium leading-snug text-[var(--grey-100)]">{headline}</p>
          <p className="mt-[var(--s-200)] text-[13px] text-[var(--grey-400)]">Interactive preview will load here</p>
        </div>
      </div>
    </div>
  );
}
