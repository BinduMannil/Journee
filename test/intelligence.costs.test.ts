import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCostProfile,
  dailyBudgetEstimateUsd,
  COSTS_DATA_NOTE,
} from "../src/lib/intelligence/costs";
import { costProfiles } from "../src/content/costs";

const AFFORDABILITY = ["budget", "moderate", "pricey", "expensive"];

test("getCostProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getCostProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getCostProfile("atlantis"), null);
});

test("every profile has a 3-letter currency, valid affordability and positive prices", () => {
  assert.ok(costProfiles.length > 0, "profiles exist");
  for (const p of costProfiles) {
    assert.match(p.currency, /^[A-Z]{3}$/, `${p.destinationId} currency`);
    assert.ok(AFFORDABILITY.includes(p.affordability), `${p.destinationId} affordability`);
    const { inexpensiveMealUsd, coffeeUsd, beerUsd, taxiStartUsd } = p.prices;
    assert.ok(inexpensiveMealUsd > 0, `${p.destinationId} meal`);
    assert.ok(coffeeUsd > 0, `${p.destinationId} coffee`);
    assert.ok(beerUsd > 0, `${p.destinationId} beer`);
    assert.ok(taxiStartUsd > 0, `${p.destinationId} taxi`);
    assert.ok(p.note.length > 0, `${p.destinationId} note`);
  }
  assert.match(COSTS_DATA_NOTE, /verify/i);
});

test("dailyBudgetEstimateUsd is a positive number for kyoto and null for unknown", () => {
  const kyoto = dailyBudgetEstimateUsd("kyoto");
  assert.equal(typeof kyoto, "number");
  assert.ok((kyoto ?? 0) > 0, "kyoto estimate positive");
  assert.equal(dailyBudgetEstimateUsd("atlantis"), null);
});
