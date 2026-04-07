import type {
  ActivityItem,
  ApiKeyRecord,
  BatchJobRequest,
  BatchJobResult,
  EnvironmentEntity,
  GenerationJob,
  MaterialRecord,
  PropAsset,
  SceneGenerationResult,
  SystemOverview,
} from "@/types";
import { materialThumbnail, propPreviewUrls, propThumbnail } from "@/lib/assetThumbnails";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const MOCK_PROPS: PropAsset[] = [
  {
    id: "prop-mason-jar",
    name: "Glass storage jar",
    category: "tableware",
    tag: "manipulation",
    simReady: "certified",
    massKg: 0.35,
    collision: "convex_decomposition",
    collisionLabel: "convexDecomposition",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Glass",
    thumbnailUrl: propThumbnail("prop-mason-jar"),
    previewUrls: propPreviewUrls("prop-mason-jar"),
    dimensionsMm: { w: 76, h: 130, d: 76 },
    densityKgM3: 2500,
    physics: {
      inertiaApproxKgM2: [0.001, 0.0012, 0.001],
      frictionStatic: 0.94,
      frictionDynamic: 0.4,
      restitution: 0.65,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-wine-glasses",
    name: "Stemless wine glasses",
    category: "tableware",
    tag: "manipulation",
    simReady: "certified",
    massKg: 0.42,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Glass",
    thumbnailUrl: propThumbnail("prop-wine-glasses"),
    previewUrls: propPreviewUrls("prop-wine-glasses"),
    dimensionsMm: { w: 85, h: 95, d: 85 },
    densityKgM3: 2500,
    physics: {
      inertiaApproxKgM2: [0.0015, 0.0018, 0.0015],
      frictionStatic: 0.9,
      frictionDynamic: 0.38,
      restitution: 0.6,
      collisionMarginMm: 0.15,
    },
  },
  {
    id: "prop-oak-board",
    name: "Marble serving board",
    category: "tableware",
    tag: "navigation",
    simReady: "certified",
    massKg: 1.2,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Quartz / marble",
    thumbnailUrl: propThumbnail("prop-oak-board"),
    previewUrls: propPreviewUrls("prop-oak-board"),
    dimensionsMm: { w: 400, h: 25, d: 300 },
    densityKgM3: 2710,
    physics: {
      inertiaApproxKgM2: [0.05, 0.02, 0.04],
      frictionStatic: 0.54,
      frictionDynamic: 0.32,
      restitution: 0.12,
      collisionMarginMm: 0.3,
    },
  },
  {
    id: "prop-base-cab-600",
    name: "Base cabinet 600mm (espresso shaker)",
    category: "cabinetry",
    tag: "articulated",
    simReady: "certified",
    massKg: 28.0,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 2,
    articulationType: "revolute",
    materialType: "Stained wood — vertical grain",
    thumbnailUrl: propThumbnail("prop-base-cab-600"),
    previewUrls: propPreviewUrls("prop-base-cab-600"),
    dimensionsMm: { w: 600, h: 720, d: 560 },
    densityKgM3: 680,
    physics: {
      inertiaApproxKgM2: [0.8, 0.7, 0.25],
      frictionStatic: 0.45,
      frictionDynamic: 0.38,
      restitution: 0.02,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-wall-cab-800",
    name: "Wall cabinet 800mm (espresso shaker)",
    category: "cabinetry",
    tag: "articulated",
    simReady: "certified",
    massKg: 22.0,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 2,
    articulationType: "revolute",
    materialType: "Stained wood — vertical grain",
    thumbnailUrl: propThumbnail("prop-wall-cab-800"),
    previewUrls: propPreviewUrls("prop-wall-cab-800"),
    dimensionsMm: { w: 800, h: 720, d: 350 },
    densityKgM3: 680,
    physics: {
      inertiaApproxKgM2: [0.55, 0.5, 0.12],
      frictionStatic: 0.45,
      frictionDynamic: 0.38,
      restitution: 0.02,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-oven-bi",
    name: "Built-in Oven",
    category: "appliance",
    tag: "manipulation",
    simReady: "certified",
    massKg: 32.0,
    collision: "sdf",
    collisionLabel: "sdf",
    articulationJoints: 1,
    articulationType: "revolute",
    materialType: "Steel + glass",
    thumbnailUrl: propThumbnail("prop-oven-bi"),
    previewUrls: propPreviewUrls("prop-oven-bi"),
    dimensionsMm: { w: 600, h: 600, d: 550 },
    densityKgM3: 7900,
    physics: {
      inertiaApproxKgM2: [0.9, 0.85, 0.35],
      frictionStatic: 0.35,
      frictionDynamic: 0.3,
      restitution: 0.05,
      collisionMarginMm: 0.5,
    },
  },
  {
    id: "prop-pantry-tall",
    name: "Tall Pantry Cabinet",
    category: "cabinetry",
    tag: "articulated",
    simReady: "pending",
    massKg: 48.0,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Plywood + laminate",
    thumbnailUrl: propThumbnail("prop-pantry-tall"),
    previewUrls: propPreviewUrls("prop-pantry-tall"),
    dimensionsMm: { w: 600, h: 2100, d: 560 },
    densityKgM3: 680,
    physics: {
      inertiaApproxKgM2: [2.1, 1.9, 0.4],
      frictionStatic: 0.5,
      frictionDynamic: 0.42,
      restitution: 0.01,
      collisionMarginMm: 0.3,
    },
  },
  {
    id: "prop-planter-ceramic",
    name: "Herb pots (basil / rosemary)",
    category: "decor",
    tag: "navigation",
    simReady: "certified",
    massKg: 3.5,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Ceramic",
    thumbnailUrl: propThumbnail("prop-planter-ceramic"),
    previewUrls: propPreviewUrls("prop-planter-ceramic"),
    dimensionsMm: { w: 280, h: 240, d: 280 },
    densityKgM3: 2200,
    physics: {
      inertiaApproxKgM2: [0.04, 0.035, 0.04],
      frictionStatic: 0.65,
      frictionDynamic: 0.5,
      restitution: 0.15,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-counter-stool",
    name: "Counter stool (brass foot)",
    category: "seating",
    tag: "articulated",
    simReady: "certified",
    massKg: 6.2,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 1,
    articulationType: "revolute",
    materialType: "Espresso wood + brass",
    thumbnailUrl: propThumbnail("prop-counter-stool"),
    previewUrls: propPreviewUrls("prop-counter-stool"),
    dimensionsMm: { w: 460, h: 880, d: 520 },
    densityKgM3: 520,
    physics: {
      inertiaApproxKgM2: [0.12, 0.15, 0.08],
      frictionStatic: 0.42,
      frictionDynamic: 0.36,
      restitution: 0.1,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-pendant",
    name: "Brass dome pendant",
    category: "lighting",
    tag: "navigation",
    simReady: "certified",
    massKg: 1.8,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Glass + brass",
    thumbnailUrl: propThumbnail("prop-pendant"),
    previewUrls: propPreviewUrls("prop-pendant"),
    dimensionsMm: { w: 350, h: 1200, d: 350 },
    densityKgM3: 4500,
    physics: {
      inertiaApproxKgM2: [0.03, 0.08, 0.03],
      frictionStatic: 0.5,
      frictionDynamic: 0.4,
      restitution: 0.2,
      collisionMarginMm: 0.15,
    },
  },
  {
    id: "prop-blinds",
    name: "Kitchen roller shade",
    category: "decor",
    tag: "articulated",
    simReady: "pending",
    massKg: 2.1,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 1,
    articulationType: "revolute",
    materialType: "Polyester",
    thumbnailUrl: propThumbnail("prop-blinds"),
    previewUrls: propPreviewUrls("prop-blinds"),
    dimensionsMm: { w: 1800, h: 120, d: 80 },
    densityKgM3: 300,
    physics: {
      inertiaApproxKgM2: [0.08, 0.01, 0.06],
      frictionStatic: 0.55,
      frictionDynamic: 0.45,
      restitution: 0.05,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-kitchen-island",
    name: "Kitchen island — quartz + espresso base",
    category: "cabinetry",
    tag: "navigation",
    simReady: "certified",
    massKg: 42.0,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Quartz top + stained wood",
    thumbnailUrl: propThumbnail("prop-kitchen-island"),
    previewUrls: propPreviewUrls("prop-kitchen-island"),
    dimensionsMm: { w: 2000, h: 760, d: 950 },
    densityKgM3: 650,
    physics: {
      inertiaApproxKgM2: [1.8, 0.15, 1.2],
      frictionStatic: 0.48,
      frictionDynamic: 0.4,
      restitution: 0.08,
      collisionMarginMm: 0.25,
    },
  },
  {
    id: "prop-gooseneck-kettle",
    name: "Gooseneck kettle (stainless)",
    category: "tableware",
    tag: "manipulation",
    simReady: "certified",
    massKg: 1.05,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Brushed stainless",
    thumbnailUrl: propThumbnail("prop-gooseneck-kettle"),
    previewUrls: propPreviewUrls("prop-gooseneck-kettle"),
    dimensionsMm: { w: 220, h: 260, d: 160 },
    densityKgM3: 7900,
    physics: {
      inertiaApproxKgM2: [0.008, 0.012, 0.006],
      frictionStatic: 0.55,
      frictionDynamic: 0.45,
      restitution: 0.15,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-mixing-bowl",
    name: "Stainless prep bowl",
    category: "tableware",
    tag: "manipulation",
    simReady: "certified",
    massKg: 0.55,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Stainless steel",
    thumbnailUrl: propThumbnail("prop-mixing-bowl"),
    previewUrls: propPreviewUrls("prop-mixing-bowl"),
    dimensionsMm: { w: 240, h: 120, d: 240 },
    densityKgM3: 7900,
    physics: {
      inertiaApproxKgM2: [0.002, 0.0015, 0.002],
      frictionStatic: 0.74,
      frictionDynamic: 0.57,
      restitution: 0.25,
      collisionMarginMm: 0.1,
    },
  },
  {
    id: "prop-mortar",
    name: "Marble mortar & pestle",
    category: "tableware",
    tag: "manipulation",
    simReady: "certified",
    massKg: 1.4,
    collision: "convex_hull",
    collisionLabel: "convexHull",
    articulationJoints: 0,
    articulationType: "compound",
    materialType: "Marble",
    thumbnailUrl: propThumbnail("prop-mortar"),
    previewUrls: propPreviewUrls("prop-mortar"),
    dimensionsMm: { w: 140, h: 100, d: 140 },
    densityKgM3: 2710,
    physics: {
      inertiaApproxKgM2: [0.008, 0.006, 0.008],
      frictionStatic: 0.75,
      frictionDynamic: 0.5,
      restitution: 0.12,
      collisionMarginMm: 0.15,
    },
  },
];

export const MOCK_MATERIALS: MaterialRecord[] = [
  {
    id: "mat-oak-wood",
    name: "Shaker oak — vertical grain",
    type: "wood",
    staticFriction: 0.54,
    dynamicFriction: 0.32,
    restitution: 0.5,
    densityKgM3: 720,
    thumbnailUrl: materialThumbnail("mat-oak-wood"),
  },
  {
    id: "mat-pine-wood",
    name: "Whitewash pine trim",
    type: "wood",
    staticFriction: 0.5,
    dynamicFriction: 0.3,
    restitution: 0.45,
    densityKgM3: 510,
    thumbnailUrl: materialThumbnail("mat-pine-wood"),
  },
  {
    id: "mat-walnut-wood",
    name: "Espresso cabinet stain",
    type: "wood",
    staticFriction: 0.52,
    dynamicFriction: 0.31,
    restitution: 0.48,
    densityKgM3: 650,
    thumbnailUrl: materialThumbnail("mat-walnut-wood"),
  },
  {
    id: "mat-stainless-steel",
    name: "Brushed stainless (appliances)",
    type: "metal",
    staticFriction: 0.74,
    dynamicFriction: 0.57,
    restitution: 0.6,
    densityKgM3: 7900,
    thumbnailUrl: materialThumbnail("mat-stainless-steel"),
  },
  {
    id: "mat-brushed-brass",
    name: "Brushed brass hardware",
    type: "metal",
    staticFriction: 0.61,
    dynamicFriction: 0.47,
    restitution: 0.55,
    densityKgM3: 8700,
    thumbnailUrl: materialThumbnail("mat-brushed-brass"),
  },
  {
    id: "mat-cast-iron",
    name: "Cast Iron",
    type: "metal",
    staticFriction: 0.7,
    dynamicFriction: 0.52,
    restitution: 0.5,
    densityKgM3: 7200,
    thumbnailUrl: materialThumbnail("mat-cast-iron"),
  },
  {
    id: "mat-clear-glass",
    name: "Clear glass (cabinet / pendant)",
    type: "glass",
    staticFriction: 0.94,
    dynamicFriction: 0.4,
    restitution: 0.65,
    densityKgM3: 2500,
    thumbnailUrl: materialThumbnail("mat-clear-glass"),
  },
  {
    id: "mat-frosted-glass",
    name: "Frosted glass panel",
    type: "glass",
    staticFriction: 0.9,
    dynamicFriction: 0.42,
    restitution: 0.6,
    densityKgM3: 2500,
    thumbnailUrl: materialThumbnail("mat-frosted-glass"),
  },
  {
    id: "mat-carrara-marble",
    name: "White quartz / Carrara-look countertop",
    type: "stone",
    staticFriction: 0.75,
    dynamicFriction: 0.5,
    restitution: 0.5,
    densityKgM3: 2710,
    thumbnailUrl: materialThumbnail("mat-carrara-marble"),
  },
  {
    id: "mat-granite",
    name: "Travertine floor tile",
    type: "stone",
    staticFriction: 0.7,
    dynamicFriction: 0.48,
    restitution: 0.45,
    densityKgM3: 2690,
    thumbnailUrl: materialThumbnail("mat-granite"),
  },
  {
    id: "mat-ceramic-tile",
    name: "Subway tile — white / grey grout",
    type: "tile",
    staticFriction: 0.8,
    dynamicFriction: 0.6,
    restitution: 0.56,
    densityKgM3: 2300,
    thumbnailUrl: materialThumbnail("mat-ceramic-tile"),
  },
  {
    id: "mat-porcelain",
    name: "Porcelain field tile",
    type: "tile",
    staticFriction: 0.78,
    dynamicFriction: 0.58,
    restitution: 0.52,
    densityKgM3: 2400,
    thumbnailUrl: materialThumbnail("mat-porcelain"),
  },
];

const MOCK_ENVIRONMENTS: EnvironmentEntity[] = [
  {
    id: "env-kitchen-v2",
    name: "Kitchen",
    parameterCount: 13,
    totalCombinations: 3_800_000,
    lastGeneratedAt: new Date(Date.now() - 3600_000).toISOString(),
    status: "active",
  },
  {
    id: "env-living-soon",
    name: "Living Room",
    parameterCount: 9,
    totalCombinations: 420_000,
    lastGeneratedAt: "",
    status: "soon",
  },
];

let jobsStore: GenerationJob[] = [
  {
    id: "job-9821",
    name: "Kitchen batch #B-0982",
    status: "completed",
    progress: 100,
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
    updatedAt: new Date(Date.now() - 86000_000).toISOString(),
    outputUsdUri: "s3://imagine-exports/job-9821/package.usdz",
  },
  {
    id: "job-9822",
    name: "Kitchen single scene",
    status: "running",
    progress: 62,
    createdAt: new Date(Date.now() - 120_000).toISOString(),
    updatedAt: new Date(Date.now() - 10_000).toISOString(),
  },
];

let apiKeysStore: ApiKeyRecord[] = [
  {
    id: "key-1",
    label: "sim-prod-client",
    prefix: "pk_live_",
    createdAt: new Date(Date.now() - 10 * 86400_000).toISOString(),
    lastUsedAt: new Date(Date.now() - 180_000).toISOString(),
  },
  {
    id: "key-2",
    label: "ci-pipeline",
    prefix: "pk_live_",
    createdAt: new Date(Date.now() - 60 * 86400_000).toISOString(),
    lastUsedAt: new Date(Date.now() - 3600_000).toISOString(),
  },
];

const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    at: new Date(Date.now() - 120_000).toISOString(),
    kind: "scene_generated",
    message: "Scene KCH-412 exported (OpenUSD)",
    meta: "checksum sha256:9f3c…",
  },
  {
    id: "a2",
    at: new Date(Date.now() - 400_000).toISOString(),
    kind: "batch_completed",
    message: "Batch job job-9821 completed — 96 valid scenes",
  },
  {
    id: "a3",
    at: new Date(Date.now() - 900_000).toISOString(),
    kind: "api_key_created",
    message: "API key created: ci-pipeline",
  },
];

export async function fetchSystemOverview(): Promise<SystemOverview> {
  await delay(400);
  return {
    environments: {
      activeCount: 1,
      parameterCount: 13,
      availableCombinations: "3.8M",
      lastGeneratedAt: new Date(Date.now() - 3600_000).toISOString(),
    },
    assets: {
      propsCount: 842,
      materialsCount: 128,
      simReadyPercent: 94,
      articulatedCount: 216,
    },
    generation: {
      jobsCompleted: 1284,
      jobsRunning: 2,
      jobsFailed: 3,
      lastJobStatus: "running",
    },
    api: {
      status: "operational",
      keyCount: apiKeysStore.length,
      usageSummary: "612k req / 30d",
    },
  };
}

export async function fetchActivity(): Promise<ActivityItem[]> {
  await delay(300);
  return [...ACTIVITY].sort((a, b) => (a.at < b.at ? 1 : -1));
}

export interface AssetQuery {
  q?: string;
  category?: string;
  simReady?: string;
  articulation?: string;
}

export async function fetchAssets(query: AssetQuery): Promise<PropAsset[]> {
  await delay(450);
  let list = [...MOCK_PROPS];
  if (query.q) {
    const s = query.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s) ||
        p.category.includes(s),
    );
  }
  if (query.category && query.category !== "all") {
    list = list.filter((p) => p.category === query.category);
  }
  if (query.simReady && query.simReady !== "all") {
    list = list.filter((p) => p.simReady === query.simReady);
  }
  if (query.articulation && query.articulation !== "all") {
    list = list.filter((p) => p.articulationType === query.articulation);
  }
  return list;
}

export interface MaterialQuery {
  q?: string;
  type?: string;
}

export async function fetchMaterials(query: MaterialQuery): Promise<MaterialRecord[]> {
  await delay(400);
  let list = [...MOCK_MATERIALS];
  if (query.q) {
    const s = query.q.toLowerCase();
    list = list.filter((m) => m.name.toLowerCase().includes(s) || m.type.includes(s));
  }
  if (query.type && query.type !== "all") {
    list = list.filter((m) => m.type === query.type);
  }
  return list;
}

export async function fetchEnvironments(): Promise<EnvironmentEntity[]> {
  await delay(350);
  return [...MOCK_ENVIRONMENTS];
}

export async function fetchPropById(id: string): Promise<PropAsset | null> {
  await delay(200);
  return MOCK_PROPS.find((p) => p.id === id) ?? null;
}

export async function fetchMaterialById(id: string): Promise<MaterialRecord | null> {
  await delay(200);
  return MOCK_MATERIALS.find((m) => m.id === id) ?? null;
}

export async function generateScene(
  params: Record<string, string>,
  options?: { fail?: boolean },
): Promise<SceneGenerationResult> {
  await delay(900);
  if (options?.fail) {
    throw new Error("GENERATION_FAILED: pipeline unreachable (mock)");
  }
  return {
    sceneId: `scn_${Math.random().toString(36).slice(2, 10)}`,
    usdPath: `s3://imagine-scenes/${Date.now()}/kitchen.usda`,
    checksum: "sha256:" + "a".repeat(64),
    parametersResolved: params,
  };
}

const RULES: { test: (sel: Record<string, string[]>) => boolean; message: string }[] = [
  {
    test: (sel) => {
      const layout = sel["Layout"] ?? [];
      const island = sel["Island"] ?? [];
      return layout.includes("U-Shape") && island.includes("true");
    },
    message: "U-Shape + island violates clearance rule CR-09",
  },
];

export async function runBatchJob(req: BatchJobRequest): Promise<BatchJobResult> {
  await delay(700);
  const invalidRules: string[] = [];
  for (const r of RULES) {
    if (r.test(req.selections)) invalidRules.push(r.message);
  }
  let product = 1;
  for (const vals of Object.values(req.selections)) {
    const c = vals.length;
    product *= Math.max(1, c);
  }
  const validCombinations = invalidRules.length ? 0 : product;
  const jobId = `job_${Math.random().toString(36).slice(2, 10)}`;
  const job: GenerationJob = {
    id: jobId,
    name: `Batch ${jobId}`,
    status: invalidRules.length ? "failed" : "queued",
    progress: invalidRules.length ? 0 : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    errorCode: invalidRules.length ? "RULE_VIOLATION" : undefined,
  };
  jobsStore = [job, ...jobsStore];
  return {
    jobId,
    validCombinations,
    invalidRules,
    status: job.status,
  };
}

export async function fetchJobs(): Promise<GenerationJob[]> {
  await delay(300);
  return [...jobsStore];
}

export async function fetchApiKeys(): Promise<ApiKeyRecord[]> {
  await delay(250);
  return [...apiKeysStore];
}

export async function createApiKey(label: string): Promise<ApiKeyRecord & { secret: string }> {
  await delay(500);
  const rec: ApiKeyRecord = {
    id: `key_${Math.random().toString(36).slice(2, 8)}`,
    label,
    prefix: "pk_live_",
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
  };
  apiKeysStore = [rec, ...apiKeysStore];
  return { ...rec, secret: `pk_live_${Math.random().toString(36).slice(2)}${"x".repeat(24)}` };
}

export async function revokeApiKey(id: string): Promise<void> {
  await delay(400);
  apiKeysStore = apiKeysStore.filter((k) => k.id !== id);
}

/** Simulated empty dataset for demo toggles */
export async function fetchAssetsEmpty(): Promise<PropAsset[]> {
  await delay(400);
  return [];
}
