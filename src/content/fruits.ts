/**
 * Seasonal fruits & must-tries (editorial seed data).
 *
 * Per-destination fruit guide: what's in season (by local month), which are
 * must-tries, and a global 0..5 regard for **taste** and **production scale**.
 * Seasons reflect the local hemisphere (e.g. Patagonia's summer is Dec–Feb).
 * **Editorial / subjective seed data** — ratings are an editorial view and
 * seasons shift with weather, so `FRUITS_DATA_NOTE` is surfaced with every
 * consumer. Mirrors the `culinary.ts` content pattern.
 */

export interface SeasonalFruit {
  readonly name: string;
  /** Months (1=Jan … 12=Dec) the fruit is locally in season. */
  readonly seasonMonths: readonly number[];
  readonly mustTry: boolean;
  /** Global regard for taste, 0..5 (editorial). */
  readonly tasteRating: number;
  /** Global production scale/significance, 0..5 (editorial). */
  readonly productionRating: number;
}

export interface FruitsProfile {
  readonly destinationId: string;
  readonly fruits: readonly SeasonalFruit[];
}

/** Shown with any fruit data so ratings read as an editorial view, not fact. */
export const FRUITS_DATA_NOTE =
  "Editorial guide; taste/production ratings are a subjective global view and " +
  "seasons shift with weather — verify locally.";

export const fruitsProfiles: readonly FruitsProfile[] = [
  {
    destinationId: "kyoto",
    fruits: [
      { name: "Mikan (satsuma)", seasonMonths: [11, 12, 1, 2], mustTry: true, tasteRating: 4.5, productionRating: 4.0 },
      { name: "Persimmon (kaki)", seasonMonths: [10, 11, 12], mustTry: true, tasteRating: 4.2, productionRating: 3.5 },
      { name: "Winter strawberry (amaou)", seasonMonths: [12, 1, 2, 3, 4], mustTry: true, tasteRating: 4.7, productionRating: 4.0 },
      { name: "Nashi pear", seasonMonths: [8, 9, 10], mustTry: false, tasteRating: 4.0, productionRating: 3.5 },
      { name: "Yuzu", seasonMonths: [11, 12, 1], mustTry: false, tasteRating: 4.0, productionRating: 3.0 },
    ],
  },
  {
    destinationId: "santorini",
    fruits: [
      { name: "Santorini cherry tomato", seasonMonths: [6, 7, 8], mustTry: true, tasteRating: 4.6, productionRating: 2.5 },
      { name: "Figs", seasonMonths: [7, 8, 9], mustTry: true, tasteRating: 4.4, productionRating: 3.5 },
      { name: "Assyrtiko grapes", seasonMonths: [8, 9], mustTry: true, tasteRating: 4.3, productionRating: 3.5 },
      { name: "Apricots", seasonMonths: [6, 7], mustTry: false, tasteRating: 4.3, productionRating: 3.5 },
      { name: "Watermelon", seasonMonths: [6, 7, 8], mustTry: false, tasteRating: 4.2, productionRating: 4.0 },
    ],
  },
  {
    destinationId: "marrakech",
    fruits: [
      { name: "Dates", seasonMonths: [9, 10, 11], mustTry: true, tasteRating: 4.7, productionRating: 4.5 },
      { name: "Oranges (fresh juice)", seasonMonths: [12, 1, 2, 3], mustTry: true, tasteRating: 4.6, productionRating: 4.0 },
      { name: "Pomegranate", seasonMonths: [9, 10, 11], mustTry: false, tasteRating: 4.4, productionRating: 3.5 },
      { name: "Prickly pear (cactus fig)", seasonMonths: [7, 8, 9], mustTry: true, tasteRating: 4.0, productionRating: 3.0 },
      { name: "Figs", seasonMonths: [7, 8, 9], mustTry: false, tasteRating: 4.3, productionRating: 3.5 },
    ],
  },
  {
    destinationId: "patagonia",
    fruits: [
      { name: "Cherries", seasonMonths: [12, 1], mustTry: true, tasteRating: 4.7, productionRating: 4.5 },
      { name: "Calafate berry", seasonMonths: [12, 1, 2], mustTry: true, tasteRating: 4.0, productionRating: 2.0 },
      { name: "Río Negro apples & pears", seasonMonths: [2, 3, 4], mustTry: false, tasteRating: 4.2, productionRating: 4.5 },
      { name: "Strawberries", seasonMonths: [11, 12, 1], mustTry: false, tasteRating: 4.3, productionRating: 3.5 },
      { name: "Raspberries", seasonMonths: [12, 1, 2], mustTry: true, tasteRating: 4.4, productionRating: 3.0 },
    ],
  },
];
