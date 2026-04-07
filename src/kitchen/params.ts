export const KITCHEN_PARAMETER_GROUPS = {
  Layout: {
    Layout: ["L-Shape", "U-Shape", "Galley"],
    Island: ["false", "true"],
  },
  Style: {
    "Door Style": ["Shaker Minimal", "Slab Modern", "Traditional Raised"],
    Hardware: ["Bar", "Knob", "Integrated"],
    "Cabinet Finish": ["Matte Bone", "Graphite", "Walnut Veneer"],
    Countertop: ["Quartz Cloud", "Granite Steel", "Butcher Block"],
    Backsplash: ["Subway", "None", "Full-height Stone"],
    Flooring: ["Oak Engineered", "Vinyl Plank", "Tile"],
  },
  Appliances: {
    Appliances: ["Pack A", "Pack B", "Pack C"],
  },
  "Scene Conditions": {
    Lighting: ["Studio 5600K", "Overcast", "Warm Tungsten"],
    "Object Density": ["sparse", "medium", "dense"],
    "Time of Day": ["morning", "noon", "evening"],
    "Clutter Level": ["none", "low", "medium"],
  },
} as const;

export type KitchenParamKey =
  | "Layout"
  | "Island"
  | "Door Style"
  | "Hardware"
  | "Cabinet Finish"
  | "Countertop"
  | "Backsplash"
  | "Flooring"
  | "Appliances"
  | "Lighting"
  | "Object Density"
  | "Time of Day"
  | "Clutter Level";

export function defaultKitchenValues(): Record<KitchenParamKey, string> {
  return {
    Layout: "L-Shape",
    Island: "false",
    "Door Style": "Shaker Minimal",
    Hardware: "Bar",
    "Cabinet Finish": "Matte Bone",
    Countertop: "Quartz Cloud",
    Backsplash: "Subway",
    Flooring: "Oak Engineered",
    Appliances: "Pack A",
    Lighting: "Studio 5600K",
    "Object Density": "medium",
    "Time of Day": "noon",
    "Clutter Level": "low",
  };
}
