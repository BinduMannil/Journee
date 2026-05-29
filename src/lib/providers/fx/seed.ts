/**
 * Seed FX adapter — indicative static reference rates.
 *
 * These are approximate, NOT live, and labelled `source: "seed"` with a fixed
 * `asOf` date so staleness is always visible (mirrors the travel-data seed
 * policy). It exists so the converter is usable and testable today; a live FX
 * feed implements the same `FxProvider` contract and replaces it without
 * touching the pure `convert` math or the UI.
 */
import type { FxProvider, FxRates } from "./types";

/** Units of currency per 1 USD. Indicative reference values, not live. */
const SEED_RATES_PER_USD: Readonly<Record<string, number>> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150,
  MAD: 10, // Moroccan dirham (Marrakech)
  CLP: 950, // Chilean peso (Patagonia)
  CHF: 0.88,
  AUD: 1.52,
  CAD: 1.36,
  INR: 83,
};

export const seedFxProvider: FxProvider = {
  id: "seed-fx",
  isAvailable: () => true,
  async getRates(base = "USD"): Promise<FxRates> {
    const baseRate = SEED_RATES_PER_USD[base];
    if (baseRate === undefined) {
      // Unknown base → return the USD table unchanged rather than guessing.
      return { base: "USD", rates: SEED_RATES_PER_USD, source: "seed", asOf: "2026-05-29" };
    }
    // Re-express per-USD rates against the requested base.
    const rates: Record<string, number> = {};
    for (const [code, perUsd] of Object.entries(SEED_RATES_PER_USD)) {
      rates[code] = Math.round((perUsd / baseRate) * 1e6) / 1e6;
    }
    return { base, rates, source: "seed", asOf: "2026-05-29" };
  },
};
