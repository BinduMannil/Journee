/**
 * Cost index — typical traveller prices per destination (editorial seed data).
 *
 * A rough sense of how far money goes at each destination: an affordability
 * band plus a few anchor prices (a cheap meal, a coffee, a beer, a taxi flag-
 * drop) expressed as **approximate USD equivalents**. This is an editorial
 * index for orientation, not live foreign-exchange data — figures are rounded
 * and drift with exchange rates and season, so `COSTS_DATA_NOTE` is surfaced
 * with every consumer. Mirrors the `festivals.ts` content pattern.
 */

export type Affordability = "budget" | "moderate" | "pricey" | "expensive";

export interface CostProfile {
  readonly destinationId: string;
  /** ISO 4217 currency code in everyday local use (e.g. "JPY"). */
  readonly currency: string;
  readonly affordability: Affordability;
  /** Anchor prices as approximate USD equivalents. */
  readonly prices: {
    readonly inexpensiveMealUsd: number;
    readonly coffeeUsd: number;
    readonly beerUsd: number;
    readonly taxiStartUsd: number;
  };
  readonly note: string;
}

/** Shown with any cost data so figures read as approximate, not exact. */
export const COSTS_DATA_NOTE =
  "Editorial approximate USD-equivalent figures that fluctuate with exchange " +
  "rates and season — verify before budgeting.";

export const costProfiles: readonly CostProfile[] = [
  {
    destinationId: "kyoto",
    currency: "JPY",
    affordability: "moderate",
    prices: { inexpensiveMealUsd: 9, coffeeUsd: 4, beerUsd: 5, taxiStartUsd: 6 },
    note: "Cheap, excellent set lunches and convenience-store meals offset pricier dinners and taxis.",
  },
  {
    destinationId: "santorini",
    currency: "EUR",
    affordability: "pricey",
    prices: { inexpensiveMealUsd: 18, coffeeUsd: 4, beerUsd: 6, taxiStartUsd: 5 },
    note: "Caldera-view dining and peak-summer demand push prices well above the Greek mainland.",
  },
  {
    destinationId: "marrakech",
    currency: "MAD",
    affordability: "budget",
    prices: { inexpensiveMealUsd: 6, coffeeUsd: 2, beerUsd: 5, taxiStartUsd: 2 },
    note: "Street food, mint tea and petits taxis are very cheap; alcohol is limited and comparatively dear.",
  },
  {
    destinationId: "patagonia",
    currency: "ARS",
    affordability: "moderate",
    prices: { inexpensiveMealUsd: 12, coffeeUsd: 3.5, beerUsd: 4, taxiStartUsd: 4 },
    note: "Prices straddle Argentine pesos (ARS) and Chilean pesos (CLP); remote logistics add up despite cheap basics.",
  },
];
