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
  type Experience,
  type TimeOfDay,
} from "@/content/attractions";

export { ATTRACTIONS_DATA_NOTE };
export type {
  Attraction,
  AttractionsProfile,
  CostBand,
  TimeOfDay,
  Busyness,
  Experience,
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

/**
 * Best sites for a chosen experience: attractions tagged with the given
 * experience, ordered by how prominently they match (an exact-experience match
 * keeps catalogue order; ties broken by name). [] for an unknown destination or
 * a destination with no matching sites.
 */
export function sitesForExperience(
  destinationId: string,
  experience: Experience,
): readonly Attraction[] {
  return (
    getAttractions(destinationId)?.attractions.filter((a) =>
      a.experienceTags.includes(experience),
    ) ?? []
  );
}

/** The set of experiences offered across a destination's sites ([] for unknown). */
export function experiencesAvailable(destinationId: string): readonly Experience[] {
  const profile = getAttractions(destinationId);
  if (profile === null) return [];
  const seen = new Set<Experience>();
  for (const a of profile.attractions) for (const e of a.experienceTags) seen.add(e);
  return [...seen].sort();
}
