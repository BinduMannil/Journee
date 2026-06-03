import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPriceMinor, minorUnitDivisor } from "../src/lib/billing/format";
import { creditPackages } from "../src/content/pricing";

test("USD minor units use a 100 divisor (2 decimals)", () => {
  assert.equal(minorUnitDivisor("USD"), 100);
});

test("zero-decimal currencies use a 1 divisor", () => {
  // JPY has no minor unit, so 500 minor === ¥500, not ¥5.00.
  assert.equal(minorUnitDivisor("JPY"), 1);
});

test("formats minor units as localized currency (symbol from Intl, not hardcoded)", () => {
  const usd = formatPriceMinor(500, "USD", "en-US");
  assert.equal(usd, "$5.00");
  // Currency is honored, not assumed: a different code yields a different format.
  assert.notEqual(formatPriceMinor(500, "EUR", "en-US"), usd);
});

test("every seed credit package formats without throwing", () => {
  for (const pack of creditPackages) {
    const formatted = formatPriceMinor(pack.priceMinor, pack.currency);
    assert.equal(typeof formatted, "string");
    assert.ok(formatted.length > 0);
  }
});
