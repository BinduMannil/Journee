/**
 * Packing guidance accessor (pure, no I/O).
 *
 * Reads the editorial packing seed data and answers "what should I pack here"
 * and "what should I pack for this season". Deterministic + unit-tested. Pair
 * output with `PACKING_DATA_NOTE` (re-exported) so it reads as general guidance,
 * not a substitute for checking the live forecast or any visa/medical needs.
 */
import {
  PACKING_DATA_NOTE,
  packingProfiles,
  type PackingItem,
  type PackingProfile,
  type Season,
} from "@/content/packing";

export { PACKING_DATA_NOTE };
export type {
  PackingProfile,
  PackingItem,
  SeasonalPacking,
  Season,
  PackingPriority,
} from "@/content/packing";

/** The packing profile for a destination, or null when none is catalogued. */
export function getPackingProfile(destinationId: string): PackingProfile | null {
  return packingProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Year-round essentials merged with that season's items ([] for unknown destination). */
export function packingForSeason(
  destinationId: string,
  season: Season,
): readonly PackingItem[] {
  const profile = getPackingProfile(destinationId);
  if (!profile) return [];
  const seasonal = profile.seasonal.find((s) => s.season === season)?.items ?? [];
  return [...profile.yearRound, ...seasonal];
}

/** Names of the "essential" items to pack for a destination and season. */
export function essentialItems(
  destinationId: string,
  season: Season,
): readonly string[] {
  return packingForSeason(destinationId, season)
    .filter((i) => i.priority === "essential")
    .map((i) => i.item);
}
