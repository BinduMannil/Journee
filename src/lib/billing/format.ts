/**
 * Currency formatting for prices stored in minor units (e.g. cents).
 *
 * Nothing about the currency is hardcoded: the symbol, decimal placement, and
 * minor-unit exponent all come from `Intl.NumberFormat` for the package's own
 * ISO-4217 code. So a USD pack renders "$5.00" and a JPY pack "¥500" with no
 * per-currency branching in the UI.
 */

/** 10^(minor-unit digits) for a currency, e.g. 100 for USD, 1 for JPY. */
export function minorUnitDivisor(currency: string, locale = "en"): number {
  // `maximumFractionDigits` is always set for `style: "currency"`, but is typed
  // optional; default to the common 2-decimal case if absent.
  const digits =
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  return 10 ** digits;
}

/** Format an integer minor-unit amount as a localized currency string. */
export function formatPriceMinor(
  priceMinor: number,
  currency: string,
  locale = "en",
): string {
  const major = priceMinor / minorUnitDivisor(currency, locale);
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    major,
  );
}
