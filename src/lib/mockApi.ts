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

import { MOCK_MATERIALS, MOCK_PROPS } from "@/data/mockCatalog";
import { ENVIRONMENT_CATALOG_PLACEHOLDERS } from "@/data/environmentCatalog";
import { getBrokenBatchRulesFromRequest } from "@/kitchen/params";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export { ENVIRONMENT_CATALOG_PLACEHOLDERS };

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
    maskedKey: "imag_sk_live_7f3a9c2d…b2e1",
    createdAt: new Date("2026-03-15T12:00:00.000Z").toISOString(),
    lastUsedAt: new Date("2026-03-31T10:00:00.000Z").toISOString(),
    requestsThisMonth: 1247,
    environment: "live",
  },
  {
    id: "key-2",
    label: "ci-pipeline",
    maskedKey: "imag_sk_test_9d2c1f4a…f4a8",
    createdAt: new Date("2026-03-20T09:00:00.000Z").toISOString(),
    lastUsedAt: new Date("2026-03-28T14:30:00.000Z").toISOString(),
    requestsThisMonth: 88,
    environment: "test",
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
  return [...ENVIRONMENT_CATALOG_PLACEHOLDERS];
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

export async function runBatchJob(req: BatchJobRequest): Promise<BatchJobResult> {
  await delay(700);
  const invalidRules = getBrokenBatchRulesFromRequest(req.selections);
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
  const tail = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  const secret = `imag_sk_live_${tail}`;
  const maskedKey = `${secret.slice(0, 18)}…${secret.slice(-4)}`;
  const rec: ApiKeyRecord = {
    id: `key_${Math.random().toString(36).slice(2, 8)}`,
    label,
    maskedKey,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    requestsThisMonth: 0,
    environment: "live",
  };
  apiKeysStore = [rec, ...apiKeysStore];
  return { ...rec, secret };
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
