export type SimReadyTier = "certified" | "pending" | "unsupported";

export type CollisionType = "convex_hull" | "sdf";

export type ArticulationType = "fixed" | "revolute" | "prismatic" | "compound";

export interface PropAsset {
  id: string;
  name: string;
  category: string;
  simReady: SimReadyTier;
  massKg: number;
  collision: CollisionType;
  articulationJoints: number;
  articulationType: ArticulationType;
  materialType: string;
  thumbnailUrl: string;
  previewUrls: string[];
  physics: {
    inertiaApproxKgM2: [number, number, number];
    frictionStatic: number;
    frictionDynamic: number;
    restitution: number;
    collisionMarginMm: number;
  };
}

export interface MaterialRecord {
  id: string;
  name: string;
  type: string;
  staticFriction: number;
  dynamicFriction: number;
  restitution: number;
  densityKgM3: number;
}

export interface EnvironmentEntity {
  id: string;
  name: string;
  parameterCount: number;
  totalCombinations: number;
  lastGeneratedAt: string;
  status: "active" | "maintenance" | "soon";
}

export interface SystemOverview {
  environments: {
    activeCount: number;
    parameterCount: number;
    availableCombinations: string;
    lastGeneratedAt: string;
  };
  assets: {
    propsCount: number;
    materialsCount: number;
    simReadyPercent: number;
    articulatedCount: number;
  };
  generation: {
    jobsCompleted: number;
    jobsRunning: number;
    jobsFailed: number;
    lastJobStatus: "completed" | "running" | "failed" | "idle";
  };
  api: {
    status: "operational" | "degraded";
    keyCount: number;
    usageSummary: string;
  };
}

export type ActivityKind =
  | "scene_generated"
  | "batch_completed"
  | "api_key_created"
  | "download"
  | "error";

export interface ActivityItem {
  id: string;
  at: string;
  kind: ActivityKind;
  message: string;
  meta?: string;
}

export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface GenerationJob {
  id: string;
  name: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  outputUsdUri?: string;
  errorCode?: string;
}

export interface SceneGenerationResult {
  sceneId: string;
  usdPath: string;
  checksum: string;
  parametersResolved: Record<string, string>;
}

export interface BatchJobRequest {
  environmentId: string;
  selections: Record<string, string[]>;
}

export interface BatchJobResult {
  jobId: string;
  validCombinations: number;
  invalidRules: string[];
  status: JobStatus;
}

export interface ApiKeyRecord {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}
