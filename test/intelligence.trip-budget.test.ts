import { test } from "node:test";
import assert from "node:assert/strict";
import {
  estimateTripBudget,
  LODGING_DATA_NOTE,
  LODGING_MODEL_VERSION,
} from "../src/lib/intelligence/trip-budget";
import { getCostProfile } from "../src/lib/intelligence/costs";

function expectedGroundPerPerson(destinationId: string): number {
  const p = getCostProfile(destinationId)!;
  const { inexpensiveMealUsd, coffeeUsd, beerUsd, taxiStartUsd } = p.prices;
  return 2 * inexpensiveMealUsd + 2 * coffeeUsd + beerUsd + 2 * taxiStartUsd;
}

test("computes lodging + on-the-ground spend per stop with defaults", () => {
  const b = estimateTripBudget([{ destinationId: "kyoto", nights: 3 }]);
  const stop = b.stops[0]!;
  assert.equal(stop.stayCostTier, "moderate"); // default
  assert.equal(stop.lodgingUsd, 130 * 3); // moderate nightly 130
  assert.equal(stop.dailyPerPersonUsd, expectedGroundPerPerson("kyoto"));
  assert.equal(stop.groundUsd, expectedGroundPerPerson("kyoto") * 1 * 3);
  assert.equal(stop.subtotalUsd, stop.lodgingUsd + stop.groundUsd);
  assert.equal(stop.hasCostData, true);
  assert.equal(b.totalNights, 3);
  assert.equal(b.confidence, 1);
  assert.equal(b.currency, "USD");
  assert.equal(b.total, b.totalUsd);
});

test("travelers scale on-the-ground spend but not lodging", () => {
  const one = estimateTripBudget([{ destinationId: "kyoto", nights: 2 }], { travelers: 1 });
  const four = estimateTripBudget([{ destinationId: "kyoto", nights: 2 }], { travelers: 4 });
  assert.equal(one.stops[0]!.lodgingUsd, four.stops[0]!.lodgingUsd); // lodging unchanged
  assert.equal(four.stops[0]!.groundUsd, one.stops[0]!.groundUsd * 4);
});

test("stay-cost tier picks the lodging rate", () => {
  const budget = estimateTripBudget([{ destinationId: "kyoto", nights: 1, stayCostTier: "budget" }]);
  const luxury = estimateTripBudget([{ destinationId: "kyoto", nights: 1, stayCostTier: "luxury" }]);
  assert.equal(budget.stops[0]!.lodgingUsd, 60);
  assert.equal(luxury.stops[0]!.lodgingUsd, 600);
});

test("unknown destination has no cost data and lowers confidence", () => {
  const b = estimateTripBudget([
    { destinationId: "kyoto", nights: 1 },
    { destinationId: "atlantis", nights: 1 },
  ]);
  const atlantis = b.stops.find((s) => s.destinationId === "atlantis")!;
  assert.equal(atlantis.hasCostData, false);
  assert.equal(atlantis.groundUsd, 0);
  assert.equal(atlantis.lodgingUsd, 130); // lodging still estimated from tier
  assert.equal(b.confidence, 0.5);
});

test("converts the total to a catalogued currency, falls back to USD otherwise", () => {
  const jpy = estimateTripBudget([{ destinationId: "kyoto", nights: 2 }], { currency: "JPY" });
  assert.equal(jpy.currency, "JPY");
  assert.equal(jpy.total, jpy.totalUsd * 150); // seed FX JPY 150/USD

  const bogus = estimateTripBudget([{ destinationId: "kyoto", nights: 2 }], { currency: "XYZ" });
  assert.equal(bogus.currency, "USD");
  assert.equal(bogus.total, bogus.totalUsd);
});

test("clamps negative nights/travelers and handles an empty trip", () => {
  const neg = estimateTripBudget([{ destinationId: "kyoto", nights: -3 }], { travelers: -2 });
  assert.equal(neg.stops[0]!.nights, 0);
  assert.equal(neg.travelers, 1);
  assert.equal(neg.totalUsd, 0);

  const empty = estimateTripBudget([]);
  assert.equal(empty.totalUsd, 0);
  assert.equal(empty.confidence, 0);
});

test("the note labels the figures as estimates and the model is versioned", () => {
  assert.match(LODGING_DATA_NOTE, /estimate|not live/i);
  assert.equal(LODGING_MODEL_VERSION, "lodging-seed-v1");
});
