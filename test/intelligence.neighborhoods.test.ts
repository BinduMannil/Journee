import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getNeighborhoods,
  neighborhoodsByType,
  neighborhoodsByCostTier,
  areasWithinBudget,
  STAY_COST_ORDER,
  NEIGHBORHOODS_DATA_NOTE,
} from "../src/lib/intelligence/neighborhoods";
import { neighborhoodsProfiles } from "../src/content/neighborhoods";

const AREA_TYPES = [
  "historic",
  "tourist_hub",
  "nightlife",
  "beach",
  "scenic",
  "shopping",
  "business",
  "residential",
  "quiet",
  "trekking_base",
];

test("getNeighborhoods returns a profile for a known destination, null otherwise", () => {
  assert.equal(getNeighborhoods("kyoto")?.destinationId, "kyoto");
  assert.equal(getNeighborhoods("atlantis"), null);
});

test("every profile has a summary and well-formed neighborhoods", () => {
  assert.ok(neighborhoodsProfiles.length > 0);
  for (const p of neighborhoodsProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.neighborhoods.length > 0, `${p.destinationId} neighborhoods`);
    for (const n of p.neighborhoods) {
      assert.ok(n.name.length > 0, `${p.destinationId} name`);
      assert.ok(n.description.length > 0, `${p.destinationId} ${n.name} description`);
      assert.ok(n.bestFor.length > 0, `${p.destinationId} ${n.name} bestFor`);
      assert.ok(n.types.length > 0, `${p.destinationId} ${n.name} types`);
      assert.ok(n.types.every((t) => AREA_TYPES.includes(t)), `${p.destinationId} ${n.name} type`);
      assert.ok(STAY_COST_ORDER.includes(n.stayCostTier), `${p.destinationId} ${n.name} tier`);
    }
  }
});

test("NEIGHBORHOODS_DATA_NOTE makes cost tiers relative, not a quote", () => {
  assert.match(NEIGHBORHOODS_DATA_NOTE, /relative/i);
  assert.match(NEIGHBORHOODS_DATA_NOTE, /not (live|a quote)|quotes/i);
});

test("neighborhoodsByType filters by character; [] for unknown", () => {
  const beach = neighborhoodsByType("santorini", "beach");
  assert.ok(beach.length > 0);
  assert.ok(beach.every((n) => n.types.includes("beach")));
  assert.deepEqual(neighborhoodsByType("atlantis", "beach"), []);
});

test("neighborhoodsByCostTier filters by exact tier", () => {
  const luxury = neighborhoodsByCostTier("santorini", "luxury");
  assert.ok(luxury.every((n) => n.stayCostTier === "luxury"));
  assert.ok(luxury.some((n) => n.name === "Oia"));
});

test("areasWithinBudget returns areas at/below a tier, cheapest first; [] for unknown", () => {
  const affordable = areasWithinBudget("santorini", "moderate");
  assert.ok(affordable.length > 0);
  assert.ok(
    affordable.every(
      (n) => STAY_COST_ORDER.indexOf(n.stayCostTier) <= STAY_COST_ORDER.indexOf("moderate"),
    ),
  );
  // sorted cheapest first
  for (let i = 1; i < affordable.length; i++) {
    assert.ok(
      STAY_COST_ORDER.indexOf(affordable[i - 1]!.stayCostTier) <=
        STAY_COST_ORDER.indexOf(affordable[i]!.stayCostTier),
    );
  }
  assert.deepEqual(areasWithinBudget("atlantis", "luxury"), []);
});
