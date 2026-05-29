/**
 * Seasonal fruits accessor (pure, no I/O).
 *
 * Reads the editorial fruit seed data and answers "what's in season now", "what
 * are the must-tries", and exposes the per-fruit global taste/production
 * ratings. Deterministic + unit-tested. Pair output with `FRUITS_DATA_NOTE`
 * (re-exported) so ratings read as an editorial view, not fact.
 */
import {
  FRUITS_DATA_NOTE,
  fruitsProfiles,
  type FruitsProfile,
  type SeasonalFruit,
} from "@/content/fruits";

export { FRUITS_DATA_NOTE };
export type { FruitsProfile, SeasonalFruit } from "@/content/fruits";

/** The fruit profile for a destination, or null when none is catalogued. */
export function getFruitsProfile(destinationId: string): FruitsProfile | null {
  return fruitsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Fruits in season for a given month (1=Jan … 12=Dec); [] for unknown dest. */
export function inSeasonFruits(destinationId: string, month: number): readonly SeasonalFruit[] {
  const profile = getFruitsProfile(destinationId);
  if (!profile) return [];
  return profile.fruits.filter((f) => f.seasonMonths.includes(month));
}

/** The must-try fruits for a destination ([] for unknown dest). */
export function mustTryFruits(destinationId: string): readonly SeasonalFruit[] {
  return getFruitsProfile(destinationId)?.fruits.filter((f) => f.mustTry) ?? [];
}
