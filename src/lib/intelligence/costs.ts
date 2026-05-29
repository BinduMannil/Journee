/**
 * Cost index accessor (pure, no I/O).
 *
 * Reads the editorial cost seed data and answers "how affordable is this place"
 * and "roughly what will a day cost". Deterministic + unit-tested. Pair output
 * with `COSTS_DATA_NOTE` (re-exported) so figures read as approximate, not exact.
 */
import { COSTS_DATA_NOTE, costProfiles, type CostProfile } from "@/content/costs";

export { COSTS_DATA_NOTE };
export type { CostProfile, Affordability } from "@/content/costs";

/** The cost profile for a destination, or null when none is catalogued. */
export function getCostProfile(destinationId: string): CostProfile | null {
  return costProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/**
 * A rough per-day spend estimate in USD: 2 meals + 2 coffees + 1 beer +
 * 2 taxi starts, plus a 60% uplift for lodging/activities. Rounded; null for
 * an unknown destination.
 */
export function dailyBudgetEstimateUsd(destinationId: string): number | null {
  const profile = getCostProfile(destinationId);
  if (profile === null) return null;
  const { inexpensiveMealUsd, coffeeUsd, beerUsd, taxiStartUsd } = profile.prices;
  const base = 2 * inexpensiveMealUsd + 2 * coffeeUsd + beerUsd + 2 * taxiStartUsd;
  return Math.round(base * 1.6);
}
