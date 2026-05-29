import { test } from "node:test";
import assert from "node:assert/strict";
import {
  supportedCurrencies,
  fxRate,
  convertUsd,
  convertCurrency,
  costPricesIn,
  FX_DATA_NOTE,
  FX_MODEL_VERSION,
} from "../src/lib/intelligence/currency";
import { seedFxRates } from "../src/content/fx";

test("supportedCurrencies includes USD anchored at 1 per USD", () => {
  const codes = supportedCurrencies();
  assert.ok(codes.includes("USD"));
  assert.equal(fxRate("USD"), 1);
  assert.equal(codes.length, seedFxRates.length);
});

test("every seed rate is a positive number with a 3-letter ISO code", () => {
  for (const r of seedFxRates) {
    assert.match(r.currency, /^[A-Z]{3}$/, r.currency);
    assert.ok(Number.isFinite(r.perUsd) && r.perUsd > 0, `${r.currency} perUsd`);
  }
});

test("fxRate returns null for an unknown currency", () => {
  assert.equal(fxRate("XYZ"), null);
});

test("convertUsd uses the seed rate, rounds to 2dp, null for unknown/non-finite", () => {
  assert.equal(convertUsd(10, "USD"), 10);
  assert.equal(convertUsd(10, "EUR"), 9.2); // 10 * 0.92
  assert.equal(convertUsd(2, "JPY"), 300); // 2 * 150
  assert.equal(convertUsd(10, "XYZ"), null);
  assert.equal(convertUsd(Number.NaN, "EUR"), null);
});

test("convertCurrency crosses via USD and is ~identity round-tripped", () => {
  // 92 EUR -> USD -> JPY: (92 / 0.92) * 150 = 15000
  assert.equal(convertCurrency(92, "EUR", "JPY"), 15000);
  assert.equal(convertCurrency(5, "USD", "USD"), 5);
  assert.equal(convertCurrency(5, "EUR", "XYZ"), null);
  assert.equal(convertCurrency(Number.POSITIVE_INFINITY, "EUR", "JPY"), null);
});

test("costPricesIn converts a destination's USD anchors; null for unknown inputs", () => {
  const kyotoJpy = costPricesIn("kyoto", "JPY");
  assert.ok(kyotoJpy);
  assert.equal(kyotoJpy.currency, "JPY");
  assert.equal(kyotoJpy.coffee, 600); // kyoto coffeeUsd 4 * 150
  assert.equal(kyotoJpy.inexpensiveMeal, 1350); // 9 * 150
  assert.equal(costPricesIn("atlantis", "JPY"), null);
  assert.equal(costPricesIn("kyoto", "XYZ"), null);
});

test("FX_DATA_NOTE makes the seed/indicative, non-live nature explicit", () => {
  assert.match(FX_DATA_NOTE, /seed/i);
  assert.match(FX_DATA_NOTE, /not live/i);
  assert.equal(FX_MODEL_VERSION, "fx-seed-v1");
});
