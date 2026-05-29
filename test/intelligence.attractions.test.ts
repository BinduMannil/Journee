import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAttractions,
  attractionsByBestTime,
  freeAttractions,
  ATTRACTIONS_DATA_NOTE,
} from "../src/lib/intelligence/attractions";
import { attractionsProfiles } from "../src/content/attractions";

const COST_BANDS = ["free", "low", "moderate", "high"];
const TIMES_OF_DAY = [
  "early_morning",
  "morning",
  "midday",
  "afternoon",
  "sunset",
  "evening",
];
const BUSYNESS = ["quiet", "moderate", "busy", "very_busy"];

test("getAttractions returns a profile for a known destination, null otherwise", () => {
  assert.equal(getAttractions("kyoto")?.destinationId, "kyoto");
  assert.equal(getAttractions("atlantis"), null);
});

test("every profile has a summary and well-formed attractions", () => {
  assert.ok(attractionsProfiles.length > 0);
  for (const p of attractionsProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.attractions.length >= 3, `${p.destinationId} attractions count`);
    for (const a of p.attractions) {
      assert.ok(a.name.length > 0, `${p.destinationId} name`);
      assert.ok(COST_BANDS.includes(a.costBand), `${p.destinationId} ${a.name} costBand`);
      assert.ok(TIMES_OF_DAY.includes(a.bestTimeOfDay), `${p.destinationId} ${a.name} bestTimeOfDay`);
      assert.ok(a.bestTimeReason.length > 0, `${p.destinationId} ${a.name} bestTimeReason`);
      assert.ok(BUSYNESS.includes(a.typicalBusyness), `${p.destinationId} ${a.name} typicalBusyness`);
      assert.ok(a.typicalHours.length > 0, `${p.destinationId} ${a.name} typicalHours`);
      assert.ok(a.bookingNote.length > 0, `${p.destinationId} ${a.name} bookingNote`);
      // Honesty rule: no fabricated URLs in booking notes.
      assert.ok(!/http/i.test(a.bookingNote), `${p.destinationId} ${a.name} bookingNote must not contain a URL`);
    }
  }
});

test("ATTRACTIONS_DATA_NOTE carries an honest 'check the official source' disclaimer", () => {
  assert.match(ATTRACTIONS_DATA_NOTE, /check|verify|official|change|vary/i);
  assert.match(ATTRACTIONS_DATA_NOTE, /hour|price|ticket/i);
});

test("attractionsByBestTime filters by time of day; [] for unknown", () => {
  const kyotoEarly = attractionsByBestTime("kyoto", "early_morning");
  assert.ok(kyotoEarly.length >= 2);
  assert.ok(kyotoEarly.every((a) => a.bestTimeOfDay === "early_morning"));
  assert.deepEqual(attractionsByBestTime("atlantis", "morning"), []);
});

test("freeAttractions returns only free attractions; [] for unknown", () => {
  const kyotoFree = freeAttractions("kyoto");
  assert.ok(kyotoFree.length > 0);
  assert.ok(kyotoFree.every((a) => a.costBand === "free"));
  assert.deepEqual(freeAttractions("atlantis"), []);
});
