import { test } from "node:test";
import assert from "node:assert/strict";
import { convert, availableCurrencies } from "../src/lib/providers/fx/convert";
import { seedFxProvider } from "../src/lib/providers/fx/seed";
import { getFxProvider, getFxRates } from "../src/lib/providers/fx";
import type { FxRates } from "../src/lib/providers/fx/types";

const RATES: FxRates = {
  base: "USD",
  rates: { USD: 1, EUR: 0.92, JPY: 150 },
  source: "seed",
  asOf: "2026-05-29",
};

test("convert: base to a quoted currency", () => {
  assert.equal(convert(100, "USD", "EUR", RATES), 92);
  assert.equal(convert(2, "USD", "JPY", RATES), 300);
});

test("convert: from base identity and reverse", () => {
  assert.equal(convert(50, "USD", "USD", RATES), 50);
  // 92 EUR back to USD ≈ 100
  assert.equal(convert(92, "EUR", "USD", RATES), 100);
});

test("convert: cross pair goes through the base", () => {
  // 150 JPY -> USD (1) -> EUR (0.92)
  assert.equal(convert(150, "JPY", "EUR", RATES), 0.92);
});

test("convert: unknown currency returns null (no silent 1:1)", () => {
  assert.equal(convert(100, "USD", "XYZ", RATES), null);
  assert.equal(convert(100, "XYZ", "USD", RATES), null);
  assert.equal(convert(NaN, "USD", "EUR", RATES), null);
});

test("availableCurrencies includes the base and is deduped", () => {
  const cs = availableCurrencies(RATES);
  assert.ok(cs.includes("USD"));
  assert.ok(cs.includes("JPY"));
  assert.equal(new Set(cs).size, cs.length);
});

test("seed provider is always available and labelled seed", async () => {
  assert.equal(await seedFxProvider.isAvailable(), true);
  const r = await seedFxProvider.getRates("USD");
  assert.equal(r.source, "seed");
  assert.equal(r.base, "USD");
  assert.equal(r.rates.USD, 1);
});

test("seed provider re-bases rates correctly", async () => {
  const eurBase = await seedFxProvider.getRates("EUR");
  assert.equal(eurBase.base, "EUR");
  assert.equal(eurBase.rates.EUR, 1);
  // 1 EUR should be ~ 1/0.92 USD
  const usdPerEur = eurBase.rates.USD ?? 0;
  assert.ok(Math.abs(usdPerEur - 1 / 0.92) < 1e-3);
});

test("getFxProvider/getFxRates resolve the seed provider by default", async () => {
  assert.equal((await getFxProvider()).id, "seed-fx");
  const rates = await getFxRates("USD");
  assert.equal(rates.source, "seed");
});
