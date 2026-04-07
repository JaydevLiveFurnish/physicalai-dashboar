/**
 * Dashboard product-window model: users explore deeply; some write paths stay gated until access is granted.
 * Persisted locally for the demo; a real app would resolve from org entitlements.
 */

/** `full` = FULL_ACCESS — API credentials, batch jobs, export pipelines, etc. */
export type AccessTier = "explore" | "standard" | "full";

export const ACCESS_STORAGE_KEY = "imagine.dashboard.accessTier";

export type GatedFeature = "api_keys_write" | "batch_submit" | "full_export";

export function readAccessTier(): AccessTier {
  try {
    const v = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (v === "full") return "full";
    if (v === "standard") return "standard";
    return "explore";
  } catch {
    return "explore";
  }
}

export function writeAccessTier(tier: AccessTier) {
  try {
    localStorage.setItem(ACCESS_STORAGE_KEY, tier);
  } catch {
    /* ignore */
  }
}

export function canUseFeature(tier: AccessTier, feature: GatedFeature): boolean {
  switch (feature) {
    case "api_keys_write":
    case "batch_submit":
    case "full_export":
      return tier === "full";
  }
}

export const ACCESS_COPY = {
  exploreBanner:
    "Explore mode: browse the full surface area. Sensitive write actions stay simulated until your workspace is provisioned.",
  apiKeysGated:
    "HTTP reference and examples below are readable without credentials. Issuing or revoking API keys requires Full access.",
  apiModalIntro:
    "Provisioning enables workspace-scoped credentials for authenticated requests against the Physical AI HTTP API:",
  exportModalIntro:
    "Export entitlements unlock artifact retrieval from the generation and asset pipelines:",
  batchGated:
    "Queueing batch jobs requires Full access. You can still explore parameters, combinations, and validation below.",
  batchModalIntro:
    "Full access enables your workspace to run generation jobs on the cluster, including:",
} as const;
