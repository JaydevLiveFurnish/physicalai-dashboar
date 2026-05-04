import assets from "@/data/assets.json";
import { materialThumbnail } from "@/lib/assetThumbnails";
import type {
  ArticulationType,
  CollisionType,
  MaterialRecord,
  PropAsset,
  PropTagKind,
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

/** Raw schema mirroring `physical-imagine-io/src/data/assets.json`. */
interface AssetEntry {
  id: string;
  name: string;
  category: string;
  type: "Prop" | "Appliance" | "Cabinet";
  material: string;
  dimensions: { width: number; height: number; depth: number; unit: "mm" };
  mass: number | null;
  physics: {
    staticFriction: number;
    dynamicFriction: number;
    restitution: number;
    density: number;
    collision: string;
  };
  thumbnail: string;
  glbPath: string;
  usdPath: string;
  simreadyStatus: "certified" | "pending" | "unsupported";
  license?: { name: string; type: string; url: string };
  physicsData?: {
    dimensions: { width_m: number; height_m: number; depth_m: number };
    overall_mass_kg: number | null;
    part_count: number;
    parts: Array<{
      label: string;
      count: number;
      material: {
        name: string | null;
        static_friction: number | null;
        dynamic_friction: number | null;
        restitution: number | null;
        density: number | null;
      };
      mass: {
        total_kg: number | null;
        min_kg: number | null;
        max_kg: number | null;
        single_kg: number | null;
      };
      collider_types: string[];
    }>;
  };
  displayOrder?: number;
}

const rawAssets = assets as AssetEntry[];

function collisionFor(entry: AssetEntry): { type: CollisionType; label: string } {
  switch (entry.physics.collision) {
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

function articulationJointsFor(entry: AssetEntry): number {
  if (entry.type === "Cabinet") {
    return Math.max(0, (entry.physicsData?.part_count ?? 1) - 1);
  }
  if (entry.type === "Appliance") {
    return Math.max(0, (entry.physicsData?.part_count ?? 1) - 1);
  }
  return 0;
}

function articulationTypeFor(entry: AssetEntry, joints: number): ArticulationType {
  if (joints === 0) return "fixed";
  const name = entry.name.toLowerCase();
  const hasDoor = name.includes("door");
  const hasDrawer = name.includes("drawer");
  if (hasDoor && hasDrawer) return "compound";
  if (hasDrawer) return "prismatic";
  if (hasDoor) return "revolute";
  if (joints > 1) return "compound";
  return "revolute";
}

function tagFor(entry: AssetEntry, joints: number): PropTagKind {
  if (entry.type === "Cabinet" || entry.type === "Appliance" || joints > 0) return "articulated";
  const mass = entry.mass ?? 0;
  const { width, height, depth } = entry.dimensions;
  const volumeM3 = (width / 1000) * (height / 1000) * (depth / 1000);
  if (mass >= 10 || volumeM3 >= 0.25) return "navigation";
  return "manipulation";
}

function approxInertia(massKg: number, widthM: number, heightM: number, depthM: number): [number, number, number] {
  const m = massKg || 0.1;
  const ix = (m * (heightM * heightM + depthM * depthM)) / 12;
  const iy = (m * (widthM * widthM + depthM * depthM)) / 12;
  const iz = (m * (widthM * widthM + heightM * heightM)) / 12;
  const round = (x: number) => Number(x.toFixed(4));
  return [round(ix), round(iy), round(iz)];
}

function categorySlug(category: string): string {
  return category.toLowerCase();
}

function transformEntry(entry: AssetEntry): PropAsset {
  const widthM = entry.dimensions.width / 1000;
  const heightM = entry.dimensions.height / 1000;
  const depthM = entry.dimensions.depth / 1000;
  const mass = entry.mass ?? 0.5;
  const collision = collisionFor(entry);
  const joints = articulationJointsFor(entry);
  const articulationType = articulationTypeFor(entry, joints);
  const tag = tagFor(entry, joints);
  const physics = {
    inertiaApproxKgM2: approxInertia(mass, widthM, heightM, depthM),
    frictionStatic: entry.physics.staticFriction,
    frictionDynamic: entry.physics.dynamicFriction,
    restitution: entry.physics.restitution,
    collisionMarginMm: 0.2,
  };
  return {
    id: `prop-${entry.id}`,
    name: entry.name,
    category: categorySlug(entry.category),
    simReady: entry.simreadyStatus,
    tag,
    massKg: Number(mass.toFixed(3)),
    collision: collision.type,
    collisionLabel: collision.label,
    articulationJoints: joints,
    articulationType,
    materialType: entry.material,
    thumbnailUrl: entry.thumbnail,
    previewUrls: [entry.thumbnail],
    previewModelUrl: entry.glbPath,
    usdUrl: entry.usdPath,
    dimensionsMm: {
      w: entry.dimensions.width,
      h: entry.dimensions.height,
      d: entry.dimensions.depth,
    },
    densityKgM3: entry.physics.density || 1000,
    physics,
  };
}

/** All SimReady props — sourced from physical-imagine-io's assets.json */
export const MOCK_PROPS: PropAsset[] = rawAssets
  .slice()
  .sort((a, b) => {
    const orderDelta = (a.displayOrder ?? 100) - (b.displayOrder ?? 100);
    if (orderDelta !== 0) return orderDelta;
    return a.name.localeCompare(b.name);
  })
  .map(transformEntry);
