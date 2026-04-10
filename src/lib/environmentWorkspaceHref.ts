import type { EnvironmentEntity } from "@/types";

/** When set, "View details" navigates to the interactive kitchen workspace. */
export function environmentWorkspaceHref(e: EnvironmentEntity): string | null {
  if (e.status !== "active") return null;
  if (e.id === "env-galley-kitchen" || e.id === "env-open-plan-kitchen") {
    return "/environments/kitchen/configure";
  }
  return null;
}
