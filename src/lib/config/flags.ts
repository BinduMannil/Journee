import { getEnv } from "./env";

/**
 * Feature flags.
 *
 * Flags are sourced from `JOURNEE_ENABLED_FEATURES` (comma-separated) via the
 * validated env boundary. This is the seam a remote flag service would later
 * replace without changing call sites. Keep the known-flag list explicit so
 * typos in flag names are caught at the type level.
 */
export const KNOWN_FLAGS = [
  "supabase-destinations",
  "affiliate-catalog",
  "mock-weather",
  "mock-intelligence",
  "pathfinder",
  "travel-dna",
] as const;

export type FeatureFlag = (typeof KNOWN_FLAGS)[number];

let cached: ReadonlySet<string> | null = null;

function enabledSet(): ReadonlySet<string> {
  if (cached) return cached;
  const raw = getEnv().JOURNEE_ENABLED_FEATURES ?? "";
  cached = new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return cached;
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return enabledSet().has(flag);
}
