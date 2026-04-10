/**
 * Kitchen environment parameters — configure (single) and batch (multi-select per key).
 * Option strings match product UI copy.
 */
export const KITCHEN_PARAMETER_GROUPS = {
  "Layout & flow": {
    Layout: ["L-Shaped", "U-Shaped", "Galley", "Single Wall"],
    Island: ["No Island", "Standard Island", "Large Island"],
  },
  Cabinets: {
    "Base Cabinet": [
      "Single Door",
      "Single Door + Drawer",
      "Single 2 Drawer",
      "Single 3 Drawer",
      "Double Door",
      "Double Door + Drawer",
      "Double Door + 2 Drawer",
      "Oven Cabinet",
    ],
    "Wall Cabinet": ["Single Door", "Double Door", "Microwave Cabinet"],
    "Tall Cabinet": ["Single Door", "Double Door", "Oven Cabinet", "Refrigerator Cabinet"],
  },
  "Doors & hardware": {
    "Door Style": ["Slab", "Shaker", "Recessed Panel", "Raised Panel"],
    "Door Handle": ["None", "Knob", "T Bar", "D Pulls", "Handle 4", "Handle 5", "Handle 6"],
  },
  Appliances: {
    "Appliance Preset": ["Full Kitchen", "Essential Only", "All Appliances", "Minimal (Sink Only)"],
  },
  Finishes: {
    "Cabinet Finish": [
      "Black Acrylic",
      "White Metallic",
      "Walnut",
      "American Walnut",
      "Mahogany",
      "White Oak",
      "Sage Green",
      "Forest Green",
      "Silk Grey",
    ],
    "Counter Top Finish": ["White Metallic", "Granite", "Stone", "Terrazzo", "Quartz Cloud", "Butcher Block"],
    "Hardware Finish": ["Brass", "Chrome", "Matte Black", "Stainless Steel"],
  },
  "Scene conditions": {
    Lighting: ["Bright Daylight", "Warm Evening", "Dim Artificial"],
    "Clutter Density": ["Empty", "Moderate", "Dense"],
  },
} as const;

export type KitchenParamKey =
  | "Layout"
  | "Island"
  | "Base Cabinet"
  | "Wall Cabinet"
  | "Tall Cabinet"
  | "Door Style"
  | "Door Handle"
  | "Appliance Preset"
  | "Cabinet Finish"
  | "Counter Top Finish"
  | "Hardware Finish"
  | "Lighting"
  | "Clutter Density";

export function defaultKitchenValues(): Record<KitchenParamKey, string> {
  return {
    Layout: "L-Shaped",
    Island: "Standard Island",
    "Base Cabinet": "Double Door + Drawer",
    "Wall Cabinet": "Double Door",
    "Tall Cabinet": "Refrigerator Cabinet",
    "Door Style": "Shaker",
    "Door Handle": "T Bar",
    "Appliance Preset": "Full Kitchen",
    "Cabinet Finish": "White Oak",
    "Counter Top Finish": "Granite",
    "Hardware Finish": "Brass",
    Lighting: "Bright Daylight",
    "Clutter Density": "Moderate",
  };
}

/** Orange rule list (always shown in batch UI). */
export const KITCHEN_BATCH_RULE_DISPLAY = [
  "Galley layout cannot have Standard Island or Large Island.",
  "Microwave Cabinet (wall) requires Microwave appliance or shows warning.",
  "Oven Cabinet (base/tall) requires Freestanding Range or Stove appliance.",
  '"None" door handle is only compatible with Slab door style (push-to-open).',
  '"Empty" clutter skips object placement entirely (fastest to generate, useful for navigation-only tasks).',
] as const;

/** Rules that invalidate the combination set (batch validation). */
export const KITCHEN_BATCH_RULES: {
  id: string;
  message: string;
  test: (s: Record<KitchenParamKey, string[]>) => boolean;
}[] = [
  {
    id: "R1",
    message: KITCHEN_BATCH_RULE_DISPLAY[0],
    test: (s) =>
      (s.Layout ?? []).includes("Galley") &&
      ((s.Island ?? []).includes("Standard Island") || (s.Island ?? []).includes("Large Island")),
  },
  {
    id: "R2",
    message: KITCHEN_BATCH_RULE_DISPLAY[1],
    test: (s) =>
      (s["Wall Cabinet"] ?? []).includes("Microwave Cabinet") &&
      (s["Appliance Preset"] ?? []).includes("Minimal (Sink Only)"),
  },
  {
    id: "R3",
    message: KITCHEN_BATCH_RULE_DISPLAY[2],
    test: (s) =>
      ((s["Base Cabinet"] ?? []).includes("Oven Cabinet") || (s["Tall Cabinet"] ?? []).includes("Oven Cabinet")) &&
      (s["Appliance Preset"] ?? []).includes("Minimal (Sink Only)"),
  },
  {
    id: "R4",
    message: KITCHEN_BATCH_RULE_DISPLAY[3],
    test: (s) =>
      (s["Door Handle"] ?? []).includes("None") && (s["Door Style"] ?? []).some((d) => d !== "Slab"),
  },
];

export const KITCHEN_PARAM_KEYS = Object.keys(defaultKitchenValues()) as KitchenParamKey[];

export function fillBatchSelections(sel: Record<string, string[] | undefined>): Record<KitchenParamKey, string[]> {
  const out = {} as Record<KitchenParamKey, string[]>;
  for (const k of KITCHEN_PARAM_KEYS) {
    out[k] = sel[k] ?? [];
  }
  return out;
}

export function getBrokenBatchRules(s: Record<KitchenParamKey, string[]>): string[] {
  return KITCHEN_BATCH_RULES.filter((r) => r.test(s)).map((r) => r.message);
}

/** Batch API payloads may omit keys; normalize before rule checks. */
export function getBrokenBatchRulesFromRequest(sel: Record<string, string[]>): string[] {
  return getBrokenBatchRules(fillBatchSelections(sel));
}
