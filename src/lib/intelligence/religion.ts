/**
 * Religious orientation accessor (pure, no I/O).
 *
 * Reads the editorial religion seed data and answers "what's the religious
 * context here" and "where are the places of worship of a given kind".
 * Deterministic + unit-tested. Pair output with `RELIGION_DATA_NOTE`
 * (re-exported) so access and etiquette are verified locally.
 */
import {
  RELIGION_DATA_NOTE,
  religionProfiles,
  type Religion,
  type PlaceOfWorship,
  type PlaceOfWorshipKind,
} from "@/content/religion";

export { RELIGION_DATA_NOTE };
export type { Religion, PlaceOfWorship, PlaceOfWorshipKind } from "@/content/religion";

/** The religion profile for a destination, or null when none is catalogued. */
export function getReligionProfile(destinationId: string): Religion | null {
  return religionProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Places of worship of a given kind for a destination ([] for unknown). */
export function placesOfWorshipByKind(
  destinationId: string,
  kind: PlaceOfWorshipKind,
): readonly PlaceOfWorship[] {
  return getReligionProfile(destinationId)?.placesOfWorship.filter((p) => p.kind === kind) ?? [];
}
