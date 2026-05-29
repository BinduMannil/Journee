/**
 * Neighborhoods & where-to-stay accessor (pure, no I/O).
 *
 * Reads the editorial neighborhoods seed data and answers "what areas are there
 * and what are they like", "which areas suit a given vibe", and "which areas fit
 * my budget" (using the *relative* cost tier). Deterministic + unit-tested. Pair
 * output with `NEIGHBORHOODS_DATA_NOTE` (re-exported) so the cost tier reads as a
 * relative comparison within the destination, never a live lodging quote.
 */
import {
  NEIGHBORHOODS_DATA_NOTE,
  STAY_COST_ORDER,
  neighborhoodsProfiles,
  type AreaType,
  type Neighborhood,
  type NeighborhoodsProfile,
  type StayCostTier,
} from "@/content/neighborhoods";

export { NEIGHBORHOODS_DATA_NOTE, STAY_COST_ORDER };
export type {
  NeighborhoodsProfile,
  Neighborhood,
  AreaType,
  StayCostTier,
} from "@/content/neighborhoods";

/** The neighborhoods profile for a destination, or null when none is catalogued. */
export function getNeighborhoods(destinationId: string): NeighborhoodsProfile | null {
  return neighborhoodsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Neighborhoods tagged with a given character ([] for unknown destination/type). */
export function neighborhoodsByType(
  destinationId: string,
  type: AreaType,
): readonly Neighborhood[] {
  return getNeighborhoods(destinationId)?.neighborhoods.filter((n) => n.types.includes(type)) ?? [];
}

/** Neighborhoods at exactly the given cost tier ([] for unknown destination). */
export function neighborhoodsByCostTier(
  destinationId: string,
  tier: StayCostTier,
): readonly Neighborhood[] {
  return getNeighborhoods(destinationId)?.neighborhoods.filter((n) => n.stayCostTier === tier) ?? [];
}

/**
 * Neighborhoods at or below a maximum cost tier, cheapest first ([] for unknown
 * destination). Uses `STAY_COST_ORDER` so "budget ≤ moderate ≤ upscale ≤ luxury".
 */
export function areasWithinBudget(
  destinationId: string,
  maxTier: StayCostTier,
): readonly Neighborhood[] {
  const ceiling = STAY_COST_ORDER.indexOf(maxTier);
  const profile = getNeighborhoods(destinationId);
  if (profile === null || ceiling < 0) return [];
  return [...profile.neighborhoods]
    .filter((n) => STAY_COST_ORDER.indexOf(n.stayCostTier) <= ceiling)
    .sort(
      (a, b) =>
        STAY_COST_ORDER.indexOf(a.stayCostTier) - STAY_COST_ORDER.indexOf(b.stayCostTier) ||
        a.name.localeCompare(b.name),
    );
}
