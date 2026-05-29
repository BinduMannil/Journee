/**
 * Tourist item base-price accessor (pure, no I/O).
 *
 * Reads the editorial tourist-price seed data and answers "what is a fair price
 * for this" and "what do tourists commonly overpay for here". Deterministic +
 * unit-tested. Pair output with `TOURIST_PRICES_NOTE` (re-exported) so figures
 * read as approximate orientation, not live quotes.
 */
import {
  TOURIST_PRICES_NOTE,
  touristPricesProfiles,
  type ItemCategory,
  type TouristItemPrice,
  type TouristPricesProfile,
} from "@/content/tourist-prices";

export { TOURIST_PRICES_NOTE };
export type { ItemCategory, TouristItemPrice, TouristPricesProfile };

/** The tourist-price profile for a destination, or null when none is catalogued. */
export function getTouristPrices(destinationId: string): TouristPricesProfile | null {
  return touristPricesProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The catalogued items in a given category for a destination; [] if none/unknown. */
export function pricesByCategory(
  destinationId: string,
  category: ItemCategory,
): readonly TouristItemPrice[] {
  const profile = getTouristPrices(destinationId);
  if (profile === null) return [];
  return profile.items.filter((i) => i.category === category);
}

/**
 * The fair USD price band for a named item, matched case-insensitively (exact,
 * trimmed). Returns null for an unknown destination or unrecognised item.
 */
export function fairPriceRange(
  destinationId: string,
  item: string,
): { low: number; high: number } | null {
  const profile = getTouristPrices(destinationId);
  if (profile === null) return null;
  const needle = item.trim().toLowerCase();
  const match = profile.items.find((i) => i.item.trim().toLowerCase() === needle);
  if (match === undefined) return null;
  return { low: match.fairLowUsd, high: match.fairHighUsd };
}
