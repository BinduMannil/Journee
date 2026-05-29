/**
 * Itinerary combos accessor (pure, no I/O).
 *
 * Reads the editorial combos seed data and answers "what places pair well with
 * this destination on one trip" and "how long should a combined trip run".
 * Deterministic + unit-tested. Pair output with `COMBOS_DATA_NOTE` (re-exported)
 * so it reads as a starting point for planning, not a prescriptive itinerary.
 */
import {
  COMBOS_DATA_NOTE,
  combosProfiles,
  type ComboPlace,
  type ComboReason,
  type CombosProfile,
} from "@/content/itinerary-combos";

export { COMBOS_DATA_NOTE };
export type {
  CombosProfile,
  ComboPlace,
  ComboReason,
} from "@/content/itinerary-combos";

/** The combos profile for a destination, or null when none is catalogued. */
export function getCombos(destinationId: string): CombosProfile | null {
  return combosProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Pairs whose reasons include the given reason ([] for unknown destination). */
export function pairsForReason(
  destinationId: string,
  reason: ComboReason,
): readonly ComboPlace[] {
  return (
    getCombos(destinationId)?.pairsWith.filter((p) =>
      p.reasons.includes(reason),
    ) ?? []
  );
}

/** Suggested total days for a combined trip, or null for unknown destination. */
export function suggestedTripLength(destinationId: string): number | null {
  return getCombos(destinationId)?.suggestedTripDays ?? null;
}
