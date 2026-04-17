export type SimReadyTier = "certified" | "pending" | "unsupported";

export type CollisionType = "convex_hull" | "sdf" | "convex_decomposition";

export type ArticulationType = "fixed" | "revolute" | "prismatic" | "compound";

/** Card / modal tag row (reference UI) */
export type PropTagKind = "manipulation" | "articulated" | "navigation";

export interface PropAsset {
  id: string;
  name: string;
  category: string;
  simReady: SimReadyTier;
  /** Top tag on cards (Manipulation / Articulated / Navigation) */
  tag: PropTagKind;
  massKg: number;
  collision: CollisionType;
  /** Human-readable collision label for detail modal */
  collisionLabel: string;
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
  /** Bounding box in mm for modal */
  dimensionsMm: { w: number; h: number; d: number };
  /** Density kg/m³ for modal */
  densityKgM3: number;
  /**
   * When set, card opens the detail modal and the left pane loads this glTF/GLB for orbit + zoom.
   * Items without a URL are locked in the library until a preview model is published.
   */
  previewModelUrl?: string | null;
  /** When true, downloads stay gated; interactive preview may still be available when a GLB exists. */
  libraryLocked?: boolean;
  /** When true, the card shows a lock overlay and is not clickable. Drives the library lock UI. */
  isLocked?: boolean;
}

export interface MaterialRecord {
  id: string;
  name: string;
  type: string;
  /** Shelf label, e.g. Wood / Metal (capitalized in UI when absent) */
  categoryLabel?: string;
  staticFriction: number;
  dynamicFriction: number;
  restitution: number;
  densityKgM3: number;
  /** Optional preview for library cards */
  thumbnailUrl?: string;
  /** When set, card + detail show this instead of the friction line */
  physicsLineOverride?: string;
  /**
   * Optional glTF/GLB for interactive preview in the detail modal (same rules as props).
   * Most materials are 2D swatches until a preview mesh is attached.
   */
  previewModelUrl?: string | null;
}

export interface EnvironmentEntity {
  id: string;
  name: string;
  parameterCount: number;
  totalCombinations: number;
  lastGeneratedAt: string;
  status: "active" | "maintenance" | "soon";
  /** Library overview card — hero icon (Material Symbols name) */
  catalogIcon?: string;
  /** Short stats line under the title (active environments) */
  catalogEyebrow?: string;
  /** Body copy on the library card */
  catalogDescription?: string;
  /** Environment thumbnail image shown on library cards */
  catalogThumbnailUrl?: string;
  /** Category pill (e.g. Kitchen, Retail) on catalog rows */
  catalogCategory?: string;
  /** Stats row — models */
  catalogModelsLabel?: string;
  /** Stats row — joints */
  catalogJointsLabel?: string;
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
  /** Obfuscated key for display, e.g. imag_sk_live_7f3a…b2e1 */
  maskedKey: string;
  createdAt: string;
  lastUsedAt: string | null;
  requestsThisMonth: number;
  environment: "live" | "test";
}
