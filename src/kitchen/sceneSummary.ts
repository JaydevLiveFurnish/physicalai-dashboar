import type { KitchenParamKey } from "@/kitchen/params";

export type KitchenSceneSummary = {
  models: number;
  articulatedAssets: number;
  totalJoints: number;
  isaacFps: string;
  appliances: number;
};

const presetAppliances: Record<string, number> = {
  "Full Kitchen": 5,
  "Essential Only": 4,
  "All Appliances": 7,
  "Minimal (Sink Only)": 2,
};

/** Deterministic scene stats from current configuration (demo / preview). */
export function computeKitchenSceneSummary(values: Record<KitchenParamKey, string>): KitchenSceneSummary {
  let models = 22;
  const layout = values.Layout;
  if (layout === "U-Shaped") models += 14;
  else if (layout === "L-Shaped") models += 10;
  else if (layout === "Galley") models += 6;
  else models += 8;

  const island = values.Island;
  if (island === "Large Island") models += 12;
  else if (island === "Standard Island") models += 8;

  const clutter = values["Clutter Density"];
  if (clutter === "Dense") models += 9;
  else if (clutter === "Moderate") models += 4;

  const wall = values["Wall Cabinet"];
  if (wall.includes("Microwave")) models += 3;
  const tall = values["Tall Cabinet"];
  if (tall.includes("Refrigerator") || tall.includes("Oven")) models += 4;

  const base = values["Base Cabinet"];
  if (base.includes("Oven")) models += 2;
  if (base.includes("Drawer")) models += 2;

  let joints = 10;
  if (layout === "U-Shaped") joints += 10;
  else if (layout === "L-Shaped") joints += 8;
  else if (layout === "Galley") joints += 4;
  else joints += 6;

  if (island !== "No Island") joints += 6;
  if (base.includes("Drawer")) joints += Math.min(12, (base.match(/Drawer/g) ?? []).length * 3);
  if (tall.includes("Oven") || tall.includes("Refrigerator")) joints += 4;
  joints += wall.includes("Microwave") ? 2 : 0;

  const doorHandle = values["Door Handle"];
  if (doorHandle !== "None") joints += 8;

  const appliances = presetAppliances[values["Appliance Preset"]] ?? 5;

  const lighting = values.Lighting;
  let fpsBase = 70;
  if (lighting === "Dim Artificial") fpsBase -= 4;
  if (lighting === "Warm Evening") fpsBase -= 2;
  if (clutter === "Dense") fpsBase -= 3;
  const isaacFps = fpsBase >= 70 ? "70+" : `${Math.max(58, fpsBase)}`;

  const modelsRounded = Math.min(120, Math.max(18, Math.round(models)));
  const jointsRounded = Math.min(48, Math.max(6, Math.round(joints)));
  const art = Math.min(modelsRounded - 1, Math.max(6, Math.round(modelsRounded * 0.48)));

  return {
    models: modelsRounded,
    articulatedAssets: art,
    totalJoints: jointsRounded,
    isaacFps,
    appliances,
  };
}
