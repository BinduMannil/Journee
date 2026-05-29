import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTouristPrices,
  pricesByCategory,
  fairPriceRange,
  TOURIST_PRICES_NOTE,
} from "../src/lib/intelligence/tourist-prices";
import { touristPricesProfiles } from "../src/content/tourist-prices";

const ITEM_CATEGORIES = [
  "souvenir",
  "food_drink",
  "transport",
  "attraction",
  "essentials",
];

test("getTouristPrices returns a profile for a known destination, null otherwise", () => {
  assert.equal(getTouristPrices("kyoto")?.destinationId, "kyoto");
  assert.equal(getTouristPrices("atlantis"), null);
});

test("every profile has a summary, bargaining flag and well-formed items", () => {
  assert.ok(touristPricesProfiles.length > 0);
  for (const p of touristPricesProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.equal(typeof p.bargainingExpected, "boolean", `${p.destinationId} bargainingExpected`);
    assert.ok(p.items.length >= 3, `${p.destinationId} items count`);
    for (const i of p.items) {
      assert.ok(i.item.length > 0, `${p.destinationId} item name`);
      assert.ok(ITEM_CATEGORIES.includes(i.category), `${p.destinationId} category ${i.category}`);
      assert.ok(Number.isFinite(i.fairLowUsd), `${p.destinationId} ${i.item} fairLowUsd finite`);
      assert.ok(Number.isFinite(i.fairHighUsd), `${p.destinationId} ${i.item} fairHighUsd finite`);
      assert.ok(i.fairLowUsd <= i.fairHighUsd, `${p.destinationId} ${i.item} low<=high`);
      assert.ok(i.note.length > 0, `${p.destinationId} ${i.item} note`);
    }
  }
});

test("TOURIST_PRICES_NOTE carries a clear approximate, non-quote disclaimer", () => {
  assert.match(TOURIST_PRICES_NOTE, /approximate|not live|vary|verify/i);
  assert.match(TOURIST_PRICES_NOTE, /price/i);
});

test("pricesByCategory returns matching items; [] for unknown destination/category", () => {
  const souvenirs = pricesByCategory("marrakech", "souvenir");
  assert.ok(souvenirs.length > 0);
  assert.ok(souvenirs.every((i) => i.category === "souvenir"));
  assert.deepEqual(pricesByCategory("atlantis", "souvenir"), []);
});

test("fairPriceRange matches case-insensitively; null for unknown", () => {
  const range = fairPriceRange("kyoto", "ramen bowl");
  assert.ok(range !== null);
  assert.ok(range.low <= range.high);
  assert.equal(fairPriceRange("kyoto", "spaceship"), null);
  assert.equal(fairPriceRange("atlantis", "ramen bowl"), null);
});
