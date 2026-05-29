import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getBeaches,
  swimmableSpots,
  spotsByWaterType,
  BEACHES_DATA_NOTE,
} from "../src/lib/intelligence/beaches";
import { beachesProfiles } from "../src/content/beaches";

const WATER_TYPES = ["sea", "lake", "river", "pool_complex", "none"];
const BEACH_VIBES = ["lively", "quiet", "family", "scenic", "party", "remote"];

test("getBeaches returns a profile for a known destination, null otherwise", () => {
  assert.equal(getBeaches("kyoto")?.destinationId, "kyoto");
  assert.equal(getBeaches("atlantis"), null);
});

test("every profile has a non-empty summary, boolean hasCoast and well-formed spots", () => {
  assert.ok(beachesProfiles.length > 0);
  for (const p of beachesProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.equal(typeof p.hasCoast, "boolean", `${p.destinationId} hasCoast`);
    assert.ok(p.spots.length >= 2, `${p.destinationId} spots`);
    for (const s of p.spots) {
      assert.ok(s.name.length > 0, `${p.destinationId} spot name`);
      assert.ok(s.note.length > 0, `${p.destinationId} ${s.name} note`);
      assert.ok(WATER_TYPES.includes(s.waterType), `${p.destinationId} ${s.name} waterType ${s.waterType}`);
      assert.ok(BEACH_VIBES.includes(s.vibe), `${p.destinationId} ${s.name} vibe ${s.vibe}`);
      assert.equal(typeof s.swimmable, "boolean", `${p.destinationId} ${s.name} swimmable`);
    }
  }
});

test("landlocked cities are honestly marked, coastal ones too", () => {
  assert.equal(getBeaches("kyoto")?.hasCoast, false);
  assert.equal(getBeaches("marrakech")?.hasCoast, false);
  assert.equal(getBeaches("santorini")?.hasCoast, true);
});

test("BEACHES_DATA_NOTE carries a strong, non-live-feed disclaimer", () => {
  assert.match(BEACHES_DATA_NOTE, /not a live|verify|heed|warning|change/i);
  assert.match(BEACHES_DATA_NOTE, /swim|beach|water|condition/i);
});

test("swimmableSpots returns only swimmable spots; [] for unknown", () => {
  const santorini = swimmableSpots("santorini");
  assert.ok(santorini.length > 0);
  assert.ok(santorini.every((s) => s.swimmable === true));
  // Patagonia has non-swimmable glacial spots that must be filtered out.
  const patagonia = swimmableSpots("patagonia");
  assert.ok(patagonia.every((s) => s.swimmable === true));
  assert.ok(patagonia.length < (getBeaches("patagonia")?.spots.length ?? 0));
  assert.deepEqual(swimmableSpots("atlantis"), []);
});

test("spotsByWaterType filters by water type; [] for unknown", () => {
  const lakes = spotsByWaterType("kyoto", "lake");
  assert.ok(lakes.length > 0);
  assert.ok(lakes.every((s) => s.waterType === "lake"));
  const pools = spotsByWaterType("marrakech", "pool_complex");
  assert.ok(pools.length > 0);
  assert.ok(pools.every((s) => s.waterType === "pool_complex"));
  assert.deepEqual(spotsByWaterType("atlantis", "sea"), []);
});
