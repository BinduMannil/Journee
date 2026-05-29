/**
 * FX provider selection.
 *
 * Returns the first available provider in priority order. The seed adapter is
 * always available (indicative static rates), so callers always get a usable
 * table; a live adapter, when added, takes precedence. To add a live vendor,
 * implement `FxProvider` and put it ahead of the seed adapter here.
 */
import type { FxProvider, FxRates } from "./types";
import { seedFxProvider } from "./seed";

const providers: readonly FxProvider[] = [seedFxProvider];

export async function getFxProvider(): Promise<FxProvider> {
  for (const p of providers) {
    if (await p.isAvailable()) return p;
  }
  return seedFxProvider;
}

/** Convenience: resolve current rates for a base currency. */
export async function getFxRates(base = "USD"): Promise<FxRates> {
  return (await getFxProvider()).getRates(base);
}

export { convert, availableCurrencies } from "./convert";
export type { FxProvider, FxRates, FxSource } from "./types";
