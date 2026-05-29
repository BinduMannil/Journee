/**
 * Pure currency conversion over a rate table (no network).
 *
 * Rates are expressed as "units of currency per 1 unit of base". Conversion
 * goes through the base, so any pair in the table is convertible. Deterministic
 * and unit-tested.
 */
import type { FxRates } from "./types";

/** All currencies convertible with this table (the base plus listed rates). */
export function availableCurrencies(rates: FxRates): readonly string[] {
  return [rates.base, ...Object.keys(rates.rates)].filter(
    (c, i, arr) => arr.indexOf(c) === i,
  );
}

/** Rate of one unit of `code` in base units (base itself is 1). `null` if unknown. */
function rateOf(rates: FxRates, code: string): number | null {
  if (code === rates.base) return 1;
  const r = rates.rates[code];
  return r !== undefined && r > 0 ? r : null;
}

/**
 * Convert `amount` from currency `from` to `to` using `rates`. Returns `null`
 * when either currency is not in the table (honest — no silent 1:1 guess).
 */
export function convert(
  amount: number,
  from: string,
  to: string,
  rates: FxRates,
): number | null {
  if (!Number.isFinite(amount)) return null;
  const fromRate = rateOf(rates, from);
  const toRate = rateOf(rates, to);
  if (fromRate === null || toRate === null) return null;
  // amount(from) -> base -> to : (amount / fromRate) * toRate
  const result = (amount / fromRate) * toRate;
  return Math.round(result * 100) / 100;
}
