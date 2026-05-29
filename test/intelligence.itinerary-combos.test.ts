import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCombos,
  pairsForReason,
  suggestedTripLength,
  COMBOS_DATA_NOTE,
} from "../src/lib/intelligence/itinerary-combos";
import { combosProfiles } from "../src/content/itinerary-combos";

const COMBO_REASONS = [
  "same_region",
  "easy_transport",
  "complementary_vibe",
  "common_route",
  "logical_extension",
];

test("getCombos returns a profile for a known destination, null otherwise", () => {
  assert.equal(getCombos("kyoto")?.destinationId, "kyoto");
  assert.equal(getCombos("atlantis"), null);
});

test("every profile has a summary, sensible trip length and well-formed pairs", () => {
  assert.ok(combosProfiles.length > 0);
  for (const p of combosProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.suggestedTripDays >= 1, `${p.destinationId} suggestedTripDays`);
    assert.ok(p.pairsWith.length >= 3, `${p.destinationId} pairsWith count`);
    for (const c of p.pairsWith) {
      assert.ok(c.name.length > 0, `${p.destinationId} pair name`);
      assert.ok(c.reasons.length >= 1, `${p.destinationId} ${c.name} reasons`);
      for (const r of c.reasons) {
        assert.ok(COMBO_REASONS.includes(r), `${p.destinationId} ${c.name} reason ${r}`);
      }
      assert.ok(c.suggestedDays >= 1, `${p.destinationId} ${c.name} suggestedDays`);
      assert.ok(c.note.length > 0, `${p.destinationId} ${c.name} note`);
    }
  }
});

test("COMBOS_DATA_NOTE carries a non-prescriptive, starting-point disclaimer", () => {
  assert.match(COMBOS_DATA_NOTE, /suggestion|starting point|vary|not prescriptive/i);
});

test("pairsForReason returns matching pairs; [] for unknown", () => {
  const sameRegion = pairsForReason("santorini", "same_region");
  assert.ok(sameRegion.length > 0);
  assert.ok(sameRegion.every((p) => p.reasons.includes("same_region")));
  const names = sameRegion.map((p) => p.name).sort();
  assert.deepEqual(names, ["Crete", "Mykonos", "Naxos / Paros"]);
  assert.deepEqual(pairsForReason("atlantis", "same_region"), []);
});

test("suggestedTripLength returns the profile's trip days; null for unknown", () => {
  assert.equal(suggestedTripLength("kyoto"), 10);
  assert.equal(suggestedTripLength("atlantis"), null);
});
