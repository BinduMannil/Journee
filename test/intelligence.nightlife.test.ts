import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getNightlife,
  nightlifeByKind,
  nightlifeByVibe,
  NIGHTLIFE_DATA_NOTE,
} from "../src/lib/intelligence/nightlife";
import { nightlifeProfiles } from "../src/content/nightlife";

const NIGHTLIFE_KINDS = [
  "bar",
  "cocktail_bar",
  "club",
  "live_music",
  "rooftop",
  "pub",
  "cultural_evening",
  "night_market",
];
const VIBES = ["lively", "chill", "upscale", "local", "touristy"];

test("getNightlife returns a profile for a known destination, null otherwise", () => {
  assert.equal(getNightlife("kyoto")?.destinationId, "kyoto");
  assert.equal(getNightlife("atlantis"), null);
});

test("every profile has a non-empty summary, typicalHours and well-formed spots", () => {
  assert.ok(nightlifeProfiles.length > 0);
  for (const p of nightlifeProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.typicalHours.length > 0, `${p.destinationId} typicalHours`);
    assert.ok(p.spots.length >= 3, `${p.destinationId} spots >= 3`);
    for (const s of p.spots) {
      assert.ok(s.name.length > 0, `${p.destinationId} spot name`);
      assert.ok(s.area.length > 0, `${p.destinationId} spot area`);
      assert.ok(s.note.length > 0, `${p.destinationId} spot note`);
      assert.ok(NIGHTLIFE_KINDS.includes(s.kind), `${p.destinationId} kind ${s.kind}`);
      assert.ok(VIBES.includes(s.vibe), `${p.destinationId} vibe ${s.vibe}`);
    }
  }
});

test("NIGHTLIFE_DATA_NOTE carries a clear, verify-before-going disclaimer", () => {
  assert.match(NIGHTLIFE_DATA_NOTE, /not a live|verify|change/i);
  assert.match(NIGHTLIFE_DATA_NOTE, /venue|nightlife|bar/i);
});

test("nightlifeByKind returns matching spots; [] for unknown", () => {
  const kyotoBars = nightlifeByKind("kyoto", "bar");
  assert.ok(kyotoBars.length > 0);
  assert.ok(kyotoBars.every((s) => s.kind === "bar"));
  assert.deepEqual(nightlifeByKind("atlantis", "bar"), []);
});

test("nightlifeByVibe returns matching spots; [] for unknown", () => {
  const santoriniUpscale = nightlifeByVibe("santorini", "upscale");
  assert.ok(santoriniUpscale.length > 0);
  assert.ok(santoriniUpscale.every((s) => s.vibe === "upscale"));
  assert.deepEqual(nightlifeByVibe("atlantis", "chill"), []);
});
