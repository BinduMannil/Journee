/**
 * Tipping norms accessor (pure, no I/O).
 *
 * Reads the editorial tipping seed data and answers "do I tip here, and how
 * much" plus "is a service charge already on the bill". Deterministic +
 * unit-tested. Pair output with `TIPPING_DATA_NOTE` (re-exported) so norms read
 * as guidance, not rules.
 */
import {
  TIPPING_DATA_NOTE,
  tippingProfiles,
  type TippingProfile,
} from "@/content/tipping";

export { TIPPING_DATA_NOTE };
export type { TippingProfile, TippingExpectation } from "@/content/tipping";

/** The tipping profile for a destination, or null when none is catalogued. */
export function getTippingProfile(destinationId: string): TippingProfile | null {
  return tippingProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** One-line restaurant + service-charge summary derived from a profile. */
export function tippingSummaryLine(profile: TippingProfile): string {
  const pct = profile.restaurantPct ? ` (${profile.restaurantPct})` : "";
  const charge = profile.serviceChargeIncluded ? "included" : "not included";
  return `Restaurants: ${profile.restaurants}${pct}; service charge ${charge}.`;
}
