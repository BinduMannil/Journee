/**
 * Tourist sites & attractions accessor (pure, no I/O).
 *
 * Reads the editorial attractions seed data and answers "what are the top sights
 * here", "which suit a given time of day", and "which are free". Deterministic +
 * unit-tested. Pair output with `ATTRACTIONS_DATA_NOTE` (re-exported) so it reads
 * as editorial seed, not a live availability feed, and never as a substitute for
 * the official source for current hours, prices and tickets.
 */
import {
  ATTRACTIONS_DATA_NOTE,
  attractionsProfiles,
  type Attraction,
  type AttractionsProfile,
  type TimeOfDay,
} from "@/content/attractions";

export { ATTRACTIONS_DATA_NOTE };
export type {
  Attraction,
  AttractionsProfile,
  CostBand,
  TimeOfDay,
  Busyness,
} from "@/content/attractions";

/** The attractions profile for a destination, or null when none is catalogued. */
export function getAttractions(destinationId: string): AttractionsProfile | null {
  return attractionsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Attractions best visited at the given time of day ([] for unknown destination). */
export function attractionsByBestTime(
  destinationId: string,
  timeOfDay: TimeOfDay,
): readonly Attraction[] {
  return (
    getAttractions(destinationId)?.attractions.filter(
      (a) => a.bestTimeOfDay === timeOfDay,
    ) ?? []
  );
}

/** Free attractions (costBand === "free") for a destination ([] for unknown). */
export function freeAttractions(destinationId: string): readonly Attraction[] {
  return (
    getAttractions(destinationId)?.attractions.filter(
      (a) => a.costBand === "free",
    ) ?? []
  );
}
