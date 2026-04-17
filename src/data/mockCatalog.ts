import catalog from "@/data/catalog.json";
import { materialThumbnail } from "@/lib/assetThumbnails";
import type {
  ArticulationType,
  CollisionType,
  MaterialRecord,
  PropAsset,
  PropTagKind,
  SimReadyTier,
} from "@/types";

/** Catalog materials aligned to dashboard reference screens */
export const MOCK_MATERIALS: MaterialRecord[] = [
  {
    id: "mat-oak-wood",
    name: "Oak Wood",
    type: "wood",
    categoryLabel: "Wood",
    staticFriction: 0.54,
    dynamicFriction: 0.32,
    restitution: 0.5,
    densityKgM3: 720,
    thumbnailUrl: materialThumbnail("mat-oak-wood"),
  },
  {
    id: "mat-pine-wood",
    name: "Pine Wood",
    type: "wood",
    categoryLabel: "Wood",
    staticFriction: 0.5,
    dynamicFriction: 0.3,
    restitution: 0.45,
    densityKgM3: 510,
    thumbnailUrl: materialThumbnail("mat-pine-wood"),
  },
  {
    id: "mat-walnut-wood",
    name: "Walnut Wood",
    type: "wood",
    categoryLabel: "Wood",
    staticFriction: 0.52,
    dynamicFriction: 0.31,
    restitution: 0.48,
    densityKgM3: 650,
    thumbnailUrl: materialThumbnail("mat-walnut-wood"),
  },
  {
    id: "mat-stainless-steel",
    name: "Stainless Steel",
    type: "metal",
    categoryLabel: "Metal",
    staticFriction: 0.74,
    dynamicFriction: 0.57,
    restitution: 0.6,
    densityKgM3: 7900,
    thumbnailUrl: materialThumbnail("mat-stainless-steel"),
  },
  {
    id: "mat-brushed-aluminum",
    name: "Brushed Aluminum",
    type: "metal",
    categoryLabel: "Metal",
    staticFriction: 0.81,
    dynamicFriction: 0.47,
    restitution: 0.65,
    densityKgM3: 2700,
    thumbnailUrl: materialThumbnail("mat-brushed-aluminum"),
  },
  {
    id: "mat-cast-iron",
    name: "Cast Iron",
    type: "metal",
    categoryLabel: "Metal",
    staticFriction: 0.7,
    dynamicFriction: 0.62,
    restitution: 0.5,
    densityKgM3: 7200,
    thumbnailUrl: materialThumbnail("mat-cast-iron"),
  },
  {
    id: "mat-clear-glass",
    name: "Clear Glass",
    type: "glass",
    categoryLabel: "Glass",
    staticFriction: 0.94,
    dynamicFriction: 0.4,
    restitution: 0.85,
    densityKgM3: 2500,
    thumbnailUrl: materialThumbnail("mat-clear-glass"),
  },
  {
    id: "mat-frosted-glass",
    name: "Frosted Glass",
    type: "glass",
    categoryLabel: "Glass",
    staticFriction: 0.2,
    dynamicFriction: 0.42,
    restitution: 0.5,
    densityKgM3: 2500,
    thumbnailUrl: materialThumbnail("mat-frosted-glass"),
  },
  {
    id: "mat-carrara-marble",
    name: "Carrara Marble",
    type: "stone",
    categoryLabel: "Stone",
    staticFriction: 0.75,
    dynamicFriction: 0.5,
    restitution: 0.5,
    densityKgM3: 2710,
    thumbnailUrl: materialThumbnail("mat-carrara-marble"),
  },
  {
    id: "mat-granite",
    name: "Granite",
    type: "stone",
    categoryLabel: "Stone",
    staticFriction: 0.7,
    dynamicFriction: 0.43,
    restitution: 0.45,
    densityKgM3: 2690,
    thumbnailUrl: materialThumbnail("mat-granite"),
  },
  {
    id: "mat-ceramic-tile",
    name: "Ceramic Tile",
    type: "tile",
    categoryLabel: "Ceramic",
    staticFriction: 0.8,
    dynamicFriction: 0.5,
    restitution: 0.55,
    densityKgM3: 2300,
    thumbnailUrl: materialThumbnail("mat-ceramic-tile"),
  },
  {
    id: "mat-porcelain",
    name: "Porcelain",
    type: "tile",
    categoryLabel: "Ceramic",
    staticFriction: 0.78,
    dynamicFriction: 0.58,
    restitution: 0.52,
    densityKgM3: 2400,
    thumbnailUrl: materialThumbnail("mat-porcelain"),
  },
  {
    id: "mat-abs-plastic",
    name: "ABS Plastic",
    type: "plastic",
    categoryLabel: "Plastic",
    staticFriction: 0.5,
    dynamicFriction: 0.35,
    restitution: 0.4,
    densityKgM3: 1050,
    thumbnailUrl: materialThumbnail("mat-abs-plastic"),
  },
  {
    id: "mat-rubber",
    name: "Rubber",
    type: "plastic",
    categoryLabel: "Plastic",
    staticFriction: 1,
    dynamicFriction: 0.8,
    restitution: 0.75,
    densityKgM3: 1100,
    thumbnailUrl: materialThumbnail("mat-rubber"),
  },
  {
    id: "mat-leather",
    name: "Leather",
    type: "fabric",
    categoryLabel: "Fabric",
    staticFriction: 0.6,
    dynamicFriction: 0.4,
    restitution: 0.3,
    densityKgM3: 900,
    thumbnailUrl: materialThumbnail("mat-leather"),
  },
  {
    id: "mat-cotton",
    name: "Cotton Fabric",
    type: "fabric",
    categoryLabel: "Fabric",
    staticFriction: 0.55,
    dynamicFriction: 0.38,
    restitution: 0.25,
    densityKgM3: 200,
    thumbnailUrl: materialThumbnail("mat-cotton"),
  },
  {
    id: "mat-carpet",
    name: "Carpet",
    type: "fabric",
    categoryLabel: "Fabric",
    staticFriction: 0.5,
    dynamicFriction: 0.35,
    restitution: 0.2,
    densityKgM3: 120,
    thumbnailUrl: materialThumbnail("mat-carpet"),
    physicsLineOverride: "Physics coming soon",
  },
  {
    id: "mat-velvet",
    name: "Velvet",
    type: "fabric",
    categoryLabel: "Fabric",
    staticFriction: 0.48,
    dynamicFriction: 0.33,
    restitution: 0.18,
    densityKgM3: 400,
    thumbnailUrl: materialThumbnail("mat-velvet"),
    physicsLineOverride: "Physics coming soon",
  },
];

interface CatalogEntry {
  id: string;
  name: string;
  thumb: string;
  glb: string;
  usdz: string;
  isAsset: boolean;
  isAppliance: boolean;
  isCabinet: boolean;
  size: [number, number, number];
  overallMassKg: number | null;
  topMaterial: string | null;
  material: {
    dynamic_friction: number;
    static_friction: number;
    restitution: number;
    density: number;
  } | null;
  collisionTypes: string[];
  articulationJoints: number;
  articulationKind: string | null;
  partCount: number;
  primaryLabel: string | null;
  isLocked?: boolean;
}

const rawCatalog = catalog as CatalogEntry[];

function titleCase(input: string): string {
  return input
    .replace(/[_\-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function humanizeMaterial(raw: string | null, fallback: string): string {
  if (!raw) return fallback;
  const cleaned = raw
    .replace(/^Material_(Base_|Wall_)?Cabinet_/i, "")
    .replace(/_\d+$/, "")
    .replace(/^opaque_/i, "")
    .replace(/_toaster$/i, "")
    .replace(/_spice_jar$/i, "");
  const pretty = titleCase(cleaned);
  // Collapse common aliases
  if (/^Omni\s?Glass$/i.test(pretty)) return "Glass";
  if (/^Plasric$/i.test(pretty)) return "Plastic";
  if (/^Bone China/i.test(pretty)) return "Bone China";
  if (/^Stainless Steel/i.test(pretty) || /^White Stainless Steel$/i.test(pretty))
    return "Stainless Steel";
  if (/^Carbon Steel Back$/i.test(pretty)) return "Stainless Steel";
  if (/^Paper Shaker$/i.test(pretty)) return "Ceramic";
  if (/^Metal$/i.test(pretty)) return "Metal";
  return pretty;
}

function categoryFor(entry: CatalogEntry): string {
  if (entry.isCabinet) return "cabinetry";
  if (entry.isAppliance) return "appliance";
  return "tableware";
}

function collisionFor(entry: CatalogEntry): { type: CollisionType; label: string } {
  const first = entry.collisionTypes[0];
  switch (first) {
    case "sdf":
      return { type: "sdf", label: "sdf" };
    case "convexDecomposition":
      return { type: "convex_decomposition", label: "convexDecomposition" };
    case "boundingCube":
      return { type: "convex_hull", label: "boundingCube" };
    case "convexHull":
    default:
      return { type: "convex_hull", label: "convexHull" };
  }
}

function articulationJointsFor(entry: CatalogEntry): number {
  if (entry.articulationJoints > 0) return entry.articulationJoints;
  if (entry.isCabinet) return Math.max(0, entry.partCount - 1);
  return 0;
}

function articulationTypeFor(entry: CatalogEntry, joints: number): ArticulationType {
  if (joints === 0) return "fixed";
  if (entry.articulationKind === "mixed") return "compound";
  const name = entry.name.toLowerCase();
  const hasDoor = name.includes("door");
  const hasDrawer = name.includes("drawer");
  if (hasDoor && hasDrawer) return "compound";
  if (hasDrawer) return "prismatic";
  if (hasDoor) return "revolute";
  if (joints > 1) return "compound";
  return "revolute";
}

function tagFor(entry: CatalogEntry, joints: number): PropTagKind {
  if (entry.isCabinet || entry.isAppliance || joints > 0) return "articulated";
  const mass = entry.overallMassKg ?? 0;
  const volume = entry.size[0] * entry.size[1] * entry.size[2];
  if (mass >= 10 || volume >= 0.25) return "navigation";
  return "manipulation";
}

function simReadyFor(entry: CatalogEntry): SimReadyTier {
  if (entry.overallMassKg == null) return "pending";
  if (!entry.material && !entry.topMaterial) return "pending";
  return "certified";
}

function densityFor(entry: CatalogEntry): number {
  const matDensity = entry.material?.density ?? 0;
  if (matDensity > 0) return matDensity;
  const [w, h, d] = entry.size;
  const volume = w * h * d;
  const mass = entry.overallMassKg ?? 0;
  if (volume > 0 && mass > 0) return Math.round(mass / volume);
  return 1000;
}

function approxInertia(
  massKg: number,
  size: [number, number, number],
): [number, number, number] {
  const [w, h, d] = size;
  const m = massKg || 0.1;
  const ix = (m * (h * h + d * d)) / 12;
  const iy = (m * (w * w + d * d)) / 12;
  const iz = (m * (w * w + h * h)) / 12;
  const round = (x: number) => Number(x.toFixed(4));
  return [round(ix), round(iy), round(iz)];
}

function fallbackMaterialName(entry: CatalogEntry): string {
  if (entry.isCabinet) return "Walnut Wood";
  if (entry.isAppliance) return "Stainless Steel";
  const name = entry.name.toLowerCase();
  if (name.includes("glass") || name.includes("wine") || name.includes("bottle")) return "Glass";
  if (name.includes("knife") || name.includes("fork") || name.includes("spoon") || name.includes("whisk") || name.includes("tongs"))
    return "Stainless Steel";
  if (name.includes("cutting") || name.includes("board") || name.includes("basket") || name.includes("ladle") || name.includes("spatula"))
    return "Wood";
  if (name.includes("plate") || name.includes("bowl") || name.includes("mug") || name.includes("cup") || name.includes("shaker"))
    return "Ceramic";
  if (name.includes("bread") || name.includes("sandwich") || name.includes("loaf")) return "Bread";
  return "Mixed";
}

function transformEntry(entry: CatalogEntry): PropAsset {
  const [w, h, d] = entry.size;
  const mass = entry.overallMassKg ?? 0.5;
  const collision = collisionFor(entry);
  const joints = articulationJointsFor(entry);
  const articulationType = articulationTypeFor(entry, joints);
  const tag = tagFor(entry, joints);
  const materialType = humanizeMaterial(entry.topMaterial, fallbackMaterialName(entry));
  const mat = entry.material;
  const physics = {
    inertiaApproxKgM2: approxInertia(mass, entry.size),
    frictionStatic: mat?.static_friction ?? 0.5,
    frictionDynamic: mat?.dynamic_friction ?? 0.35,
    restitution: mat?.restitution ?? 0.3,
    collisionMarginMm: 0.2,
  };
  return {
    id: `prop-${entry.id}`,
    name: entry.name,
    category: categoryFor(entry),
    simReady: simReadyFor(entry),
    tag,
    massKg: Number(mass.toFixed(3)),
    collision: collision.type,
    collisionLabel: collision.label,
    articulationJoints: joints,
    articulationType,
    materialType,
    thumbnailUrl: entry.thumb,
    previewUrls: [entry.thumb],
    previewModelUrl: entry.glb,
    dimensionsMm: {
      w: Math.round(w * 1000),
      h: Math.round(h * 1000),
      d: Math.round(d * 1000),
    },
    densityKgM3: densityFor(entry),
    physics,
    isLocked: entry.isLocked ?? false,
  };
}

/** Kitchen props — derived from the SimReady catalog */
export const MOCK_PROPS: PropAsset[] = rawCatalog.map(transformEntry);
