/**
 * Common scams & safety tips accessor (pure, no I/O).
 *
 * Reads the editorial safety seed data and answers "what should I watch for
 * here" and "what are the common scams". Deterministic + unit-tested. Pair
 * output with `SAFETY_TIPS_DATA_NOTE` (re-exported) so it reads as guidance.
 */
import {
  SAFETY_TIPS_DATA_NOTE,
  safetyTipsProfiles,
  type SafetyTipsProfile,
} from "@/content/safety-tips";

export { SAFETY_TIPS_DATA_NOTE };
export type { SafetyTipsProfile, ScamTip } from "@/content/safety-tips";

/** The safety profile for a destination, or null when none is catalogued. */
export function getSafetyTips(destinationId: string): SafetyTipsProfile | null {
  return safetyTipsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Names of the common scams for a destination ([] for unknown destination). */
export function scamNames(destinationId: string): readonly string[] {
  return getSafetyTips(destinationId)?.commonScams.map((s) => s.name) ?? [];
}
