import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFruitsProfile,
  inSeasonFruits,
  mustTryFruits,
  FRUITS_DATA_NOTE,
} from "../src/lib/intelligence/fruits";
import { fruitsProfiles } from "../src/content/fruits";

test("getFruitsProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getFruitsProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getFruitsProfile("atlantis"), null);
});

test("fruit ratings are within 0..5 and seasons are valid months", () => {
  for (const p of fruitsProfiles) {
    assert.ok(p.fruits.length > 0, `${p.destinationId} has fruits`);
    for (const f of p.fruits) {
      assert.ok(f.tasteRating >= 0 && f.tasteRating <= 5, `${f.name} taste`);
      assert.ok(f.productionRating >= 0 && f.productionRating <= 5, `${f.name} production`);
      assert.ok(f.seasonMonths.length > 0, `${f.name} season`);
      for (const m of f.seasonMonths) assert.ok(m >= 1 && m <= 12, `${f.name} month ${m}`);
    }
  }
  assert.match(FRUITS_DATA_NOTE, /verify locally/i);
});

test("inSeasonFruits filters by month; unknown dest → []", () => {
  // Marrakech oranges are in season in January (month 1).
  const jan = inSeasonFruits("marrakech", 1).map((f) => f.name);
  assert.ok(jan.some((n) => /Oranges/.test(n)));
  // Patagonia cherries (southern-hemisphere summer) are in season in December.
  assert.ok(inSeasonFruits("patagonia", 12).some((f) => /Cherries/.test(f.name)));
  assert.deepEqual(inSeasonFruits("atlantis", 6), []);
});

test("mustTryFruits returns only must-tries; unknown dest → []", () => {
  const kyoto = mustTryFruits("kyoto");
  assert.ok(kyoto.length > 0 && kyoto.every((f) => f.mustTry));
  assert.deepEqual(mustTryFruits("atlantis"), []);
});
