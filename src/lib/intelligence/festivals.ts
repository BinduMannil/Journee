/**
 * Festivals & holidays accessor (pure, no I/O).
 *
 * Reads the editorial festivals seed data and answers "what's on around this
 * month" and "what can I join". Deterministic + unit-tested. Pair output with
 * `FESTIVALS_DATA_NOTE` (re-exported) so dates read as typical, not exact.
 */
import {
  FESTIVALS_DATA_NOTE,
  festivalsProfiles,
  type Festival,
  type FestivalsProfile,
} from "@/content/festivals";

export { FESTIVALS_DATA_NOTE };
export type { FestivalsProfile, Festival, FestivalKind } from "@/content/festivals";

/** The festivals profile for a destination, or null when none is catalogued. */
export function getFestivals(destinationId: string): FestivalsProfile | null {
  return festivalsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Festivals/holidays that typically fall in a given month (1=Jan…12=Dec). */
export function festivalsInMonth(destinationId: string, month: number): readonly Festival[] {
  return getFestivals(destinationId)?.festivals.filter((f) => f.months.includes(month)) ?? [];
}

/** Festivals a visitor can respectfully join in ([] for unknown destination). */
export function joinableFestivals(destinationId: string): readonly Festival[] {
  return getFestivals(destinationId)?.festivals.filter((f) => f.visitorsCanJoin) ?? [];
}
