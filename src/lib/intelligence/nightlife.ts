/**
 * Nightlife & bars accessor (pure, no I/O).
 *
 * Reads the editorial nightlife seed data and answers "what is the after-dark
 * scene like here" and "what spots match this kind or vibe". Deterministic +
 * unit-tested. Pair output with `NIGHTLIFE_DATA_NOTE` (re-exported) so it reads
 * as editorial background, not a live listings feed, and always verify a venue
 * before going.
 */
import {
  NIGHTLIFE_DATA_NOTE,
  nightlifeProfiles,
  type NightlifeKind,
  type NightlifeProfile,
  type NightlifeSpot,
  type Vibe,
} from "@/content/nightlife";

export { NIGHTLIFE_DATA_NOTE };
export type {
  NightlifeProfile,
  NightlifeSpot,
  NightlifeKind,
  Vibe,
} from "@/content/nightlife";

/** The nightlife profile for a destination, or null when none is catalogued. */
export function getNightlife(destinationId: string): NightlifeProfile | null {
  return nightlifeProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Spots of a given kind for a destination ([] for unknown destination). */
export function nightlifeByKind(
  destinationId: string,
  kind: NightlifeKind,
): readonly NightlifeSpot[] {
  return getNightlife(destinationId)?.spots.filter((s) => s.kind === kind) ?? [];
}

/** Spots of a given vibe for a destination ([] for unknown destination). */
export function nightlifeByVibe(
  destinationId: string,
  vibe: Vibe,
): readonly NightlifeSpot[] {
  return getNightlife(destinationId)?.spots.filter((s) => s.vibe === vibe) ?? [];
}
