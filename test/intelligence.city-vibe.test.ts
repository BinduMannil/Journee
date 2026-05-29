import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCityVibe,
  expectLanguageBarrier,
  CITY_VIBE_NOTE,
} from "../src/lib/intelligence/city-vibe";
import { cityVibes } from "../src/content/city-vibe";

test("getCityVibe returns a profile for a known destination, null otherwise", () => {
  assert.equal(getCityVibe("kyoto")?.destinationId, "kyoto");
  assert.equal(getCityVibe("atlantis"), null);
});

test("friendliness is 0..5, vibes non-empty, and the note is a generalization", () => {
  for (const v of cityVibes) {
    assert.ok(v.friendliness >= 0 && v.friendliness <= 5, `${v.destinationId} friendliness`);
    assert.ok(v.vibes.length > 0, `${v.destinationId} vibes`);
    assert.ok(v.summary.length > 0, `${v.destinationId} summary`);
  }
  assert.match(CITY_VIBE_NOTE, /never a judgement/i);
});

test("expectLanguageBarrier reflects English + tourist-ease; null for unknown", () => {
  // Santorini: English widely spoken, very_easy → no barrier.
  assert.equal(expectLanguageBarrier("santorini"), false);
  // Marrakech: English not widely spoken + moderate → barrier likely.
  assert.equal(expectLanguageBarrier("marrakech"), true);
  assert.equal(expectLanguageBarrier("atlantis"), null);
});
