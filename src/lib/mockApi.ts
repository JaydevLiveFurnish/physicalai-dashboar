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

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const img = (seed: string, w = 160, h = 100) =>
  `https://placehold.co/${w}x${h}/1a1a1a/e5e5e5/png?text=${encodeURIComponent(seed)}`;

export const MOCK_PROPS: PropAsset[] = [
  {
    id: "prop-cab-upper-01",
    name: "Upper Cabinet 600mm",
    category: "cabinetry",
    simReady: "certified",
    massKg: 18.4,
    collision: "convex_hull",
    articulationJoints: 2,
    articulationType: "revolute",
    materialType: "MDF + laminate",
    thumbnailUrl: img("CAB-U"),
    previewUrls: [img("CAB-U1"), img("CAB-U2")],
    physics: {
      inertiaApproxKgM2: [0.42, 0.38, 0.12],
      frictionStatic: 0.45,
      frictionDynamic: 0.38,
      restitution: 0.02,
      collisionMarginMm: 0.2,
    },
  },
  {
    id: "prop-dw-24",
    name: "Dishwasher 24in",
    category: "appliance",
    simReady: "certified",
    massKg: 36.2,
    collision: "sdf",
    articulationJoints: 1,
    articulationType: "revolute",
    materialType: "Steel + polymer",
    thumbnailUrl: img("DW"),
    previewUrls: [img("DW1")],
    physics: {
      inertiaApproxKgM2: [1.1, 0.95, 0.4],
      frictionStatic: 0.35,
      frictionDynamic: 0.3,
      restitution: 0.05,
      collisionMarginMm: 0.5,
    },
  },
  {
    id: "prop-island-01",
    name: "Island Base 2100",
    category: "cabinetry",
    simReady: "pending",
    massKg: 52.0,
    collision: "convex_hull",
    articulationJoints: 0,
    articulationType: "fixed",
    materialType: "Plywood + quartz top",
    thumbnailUrl: img("ISL"),
    previewUrls: [img("ISL1")],
    physics: {
      inertiaApproxKgM2: [2.4, 2.1, 0.6],
      frictionStatic: 0.5,
      frictionDynamic: 0.42,
      restitution: 0.01,
      collisionMarginMm: 0.3,
    },
  },
  {
    id: "prop-stool-01",
    name: "Bar Stool",
    category: "seating",
    simReady: "certified",
    massKg: 4.8,
    collision: "convex_hull",
    articulationJoints: 1,
    articulationType: "revolute",
    materialType: "Steel + polymer seat",
    thumbnailUrl: img("STOOL"),
    previewUrls: [img("ST1")],
    physics: {
      inertiaApproxKgM2: [0.08, 0.08, 0.02],
      frictionStatic: 0.4,
      frictionDynamic: 0.35,
      restitution: 0.08,
      collisionMarginMm: 0.2,
    },
  },
];

export const MOCK_MATERIALS: MaterialRecord[] = [
  {
    id: "mat-laminate-01",
    name: "Laminate Matte Bone",
    type: "laminate",
    staticFriction: 0.42,
    dynamicFriction: 0.36,
    restitution: 0.12,
    densityKgM3: 680,
  },
  {
    id: "mat-quartz-01",
    name: "Quartz Cloud",
    type: "stone_composite",
    staticFriction: 0.49,
    dynamicFriction: 0.44,
    restitution: 0.18,
    densityKgM3: 2410,
  },
  {
    id: "mat-steel-brushed",
    name: "Brushed Stainless",
    type: "metal",
    staticFriction: 0.58,
    dynamicFriction: 0.52,
    restitution: 0.21,
    densityKgM3: 7900,
  },
  {
    id: "mat-vinyl-01",
    name: "Vinyl Plank Warm",
    type: "polymer",
    staticFriction: 0.55,
    dynamicFriction: 0.48,
    restitution: 0.15,
    densityKgM3: 1200,
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
  {
    id: "a4",
    at: new Date(Date.now() - 1200_000).toISOString(),
    kind: "download",
    message: "Download ready: package.usdz (184 MB)",
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
