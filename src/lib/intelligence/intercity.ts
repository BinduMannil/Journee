/**
 * Best intercity options accessor (pure, no I/O).
 *
 * Reads the editorial intercity seed data and answers "how do I best travel
 * onward from here" — which nearby cities/hubs are reachable, by what mode, and
 * which option is recommended. Deterministic + unit-tested. Pair output with
 * `INTERCITY_DATA_NOTE` (re-exported) so it reads as editorial guidance, not a
 * live schedule or fare feed.
 */
import {
  INTERCITY_DATA_NOTE,
  intercityProfiles,
  type IntercityMode,
  type IntercityProfile,
  type IntercityRoute,
} from "@/content/intercity";

export { INTERCITY_DATA_NOTE };
export type {
  IntercityMode,
  IntercityProfile,
  IntercityRoute,
} from "@/content/intercity";

/** The intercity profile for a destination, or null when none is catalogued. */
export function getIntercityOptions(destinationId: string): IntercityProfile | null {
  return intercityProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Onward routes flagged as recommended ([] for unknown destination). */
export function recommendedRoutes(destinationId: string): readonly IntercityRoute[] {
  return getIntercityOptions(destinationId)?.routes.filter((r) => r.recommended) ?? [];
}

/** Onward routes that use the given travel mode ([] for unknown destination). */
export function routesByMode(
  destinationId: string,
  mode: IntercityMode,
): readonly IntercityRoute[] {
  return getIntercityOptions(destinationId)?.routes.filter((r) => r.mode === mode) ?? [];
}
