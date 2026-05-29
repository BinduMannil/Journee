/**
 * Beaches & swimming spots accessor (pure, no I/O).
 *
 * Reads the editorial beaches seed data and answers "where can I swim here"
 * and "what's swimmable / what kind of water". Deterministic + unit-tested.
 * Pair output with `BEACHES_DATA_NOTE` (re-exported) so it reads as editorial
 * background, not a live conditions feed, and never as a substitute for local
 * flags, warnings and lifeguards.
 */
import {
  BEACHES_DATA_NOTE,
  beachesProfiles,
  type BeachesProfile,
  type SwimSpot,
  type WaterType,
} from "@/content/beaches";

export { BEACHES_DATA_NOTE };
export type {
  BeachesProfile,
  SwimSpot,
  WaterType,
  BeachVibe,
} from "@/content/beaches";

/** The beaches profile for a destination, or null when none is catalogued. */
export function getBeaches(destinationId: string): BeachesProfile | null {
  return beachesProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Spots where swimming is realistic / reasonably safe ([] for unknown destination). */
export function swimmableSpots(destinationId: string): readonly SwimSpot[] {
  return getBeaches(destinationId)?.spots.filter((s) => s.swimmable) ?? [];
}

/** Spots matching a given water type ([] for unknown destination). */
export function spotsByWaterType(
  destinationId: string,
  waterType: WaterType,
): readonly SwimSpot[] {
  return getBeaches(destinationId)?.spots.filter((s) => s.waterType === waterType) ?? [];
}
