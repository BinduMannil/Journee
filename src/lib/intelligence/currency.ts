/**
 * Multi-currency normalization (pure, no network).
 *
 * Converts the app's approximate USD cost anchors into other currencies using
 * the indicative SEED FX table (`content/fx.ts`). Cross-currency conversion goes
 * via USD. Every result is *indicative* — pair output with `FX_DATA_NOTE` (re-
 * exported) so figures are never read as a live quote. Deterministic + tested.
 *
 * A live FX provider (⛔ egress) would slot in ahead of the seed table without
 * changing these signatures.
 */
import { FX_DATA_NOTE, FX_MODEL_VERSION, FX_AS_OF, seedFxRates } from "@/content/fx";
import { getCostProfile } from "./costs";

export { FX_DATA_NOTE, FX_MODEL_VERSION, FX_AS_OF };
export type { FxRate } from "@/content/fx";

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Currencies the seed table can convert to/from, in catalogue order. */
export function supportedCurrencies(): readonly string[] {
  return seedFxRates.map((r) => r.currency);
}

/** Units of `currency` per 1 USD, or null when the currency isn't catalogued. */
export function fxRate(currency: string): number | null {
  return seedFxRates.find((r) => r.currency === currency)?.perUsd ?? null;
}

/**
 * Convert a USD amount into `toCurrency` (rounded to 2 dp). Returns null when
 * the target currency is unknown or the amount is non-finite.
 */
export function convertUsd(amountUsd: number, toCurrency: string): number | null {
  if (!Number.isFinite(amountUsd)) return null;
  const rate = fxRate(toCurrency);
  if (rate === null) return null;
  return round2(amountUsd * rate);
}

/**
 * Convert between two catalogued currencies via USD (rounded to 2 dp). Returns
 * null when either currency is unknown or the amount is non-finite.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number | null {
  if (!Number.isFinite(amount)) return null;
  const fromRate = fxRate(fromCurrency);
  const toRate = fxRate(toCurrency);
  if (fromRate === null || toRate === null || fromRate === 0) return null;
  return round2((amount / fromRate) * toRate);
}

/** The cost anchors for a destination expressed in `currency`. */
export interface NormalizedCostPrices {
  readonly destinationId: string;
  readonly currency: string;
  readonly inexpensiveMeal: number;
  readonly coffee: number;
  readonly beer: number;
  readonly taxiStart: number;
}

/**
 * Convert a destination's USD cost anchors into `currency`. Returns null when
 * the destination has no cost profile or the currency isn't catalogued. The
 * figures are indicative — surface `FX_DATA_NOTE` alongside them.
 */
export function costPricesIn(
  destinationId: string,
  currency: string,
): NormalizedCostPrices | null {
  const profile = getCostProfile(destinationId);
  if (profile === null) return null;
  const rate = fxRate(currency);
  if (rate === null) return null;
  const { inexpensiveMealUsd, coffeeUsd, beerUsd, taxiStartUsd } = profile.prices;
  return {
    destinationId,
    currency,
    inexpensiveMeal: round2(inexpensiveMealUsd * rate),
    coffee: round2(coffeeUsd * rate),
    beer: round2(beerUsd * rate),
    taxiStart: round2(taxiStartUsd * rate),
  };
}
