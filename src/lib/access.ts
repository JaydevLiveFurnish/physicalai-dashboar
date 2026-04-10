/**
 * Access model: Explore (browse, configure, preview) vs Full (generate jobs, export, API keys).
 * Persisted locally for the demo; production would resolve org entitlements.
 */

export type AccessTier = "explore" | "full";

export const ACCESS_STORAGE_KEY = "imagine.dashboard.accessTier";

export type GatedFeature = "api_keys_write" | "batch_submit" | "full_export";

/** Single tooltip for locks and disabled gated actions */
export const FULL_ACCESS_TOOLTIP = "Requires full access";

export function readAccessTier(): AccessTier {
  try {
    const v = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (v === "full") return "full";
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

/** Migrate legacy `standard` tier on read */
export function migrateAccessTierStorage() {
  try {
    const v = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (v === "standard") {
      localStorage.setItem(ACCESS_STORAGE_KEY, "explore");
    }
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
  apiKeysGated:
    "API keys enable programmatic access to scene generation and exports. Issuing keys requires full access.",
  apiModalIntro:
    "Provisioning enables workspace-scoped credentials for authenticated requests to the Physical AI HTTP API.",
  batchGated:
    "You can select parameters and review combinations. Running batch jobs requires full access.",
  batchModalIntro: "Full access enables your workspace to run variation jobs on the cluster, including:",
} as const;
