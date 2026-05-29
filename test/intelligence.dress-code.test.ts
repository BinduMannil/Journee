import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getDressCode,
  dressGuidanceFor,
  venuesNeedingModesty,
  DRESS_CODE_NOTE,
} from "../src/lib/intelligence/dress-code";
import { dressCodeProfiles } from "../src/content/dress-code";

const VENUE_KINDS = [
  "religious_site",
  "fine_dining",
  "beach_pool",
  "nightlife",
  "general",
];
const STRICTNESS_LEVELS = ["relaxed", "moderate", "conservative", "strict"];

test("getDressCode returns a profile for a known destination, null otherwise", () => {
  assert.equal(getDressCode("kyoto")?.destinationId, "kyoto");
  assert.equal(getDressCode("atlantis"), null);
});

test("every profile has an overall note and well-formed guidance entries", () => {
  assert.ok(dressCodeProfiles.length > 0);
  for (const p of dressCodeProfiles) {
    assert.ok(p.overallNote.length > 0, `${p.destinationId} overallNote`);
    assert.ok(p.guidance.length > 0, `${p.destinationId} guidance`);
    for (const g of p.guidance) {
      assert.ok(VENUE_KINDS.includes(g.venue), `${p.destinationId} venue ${g.venue}`);
      assert.ok(STRICTNESS_LEVELS.includes(g.strictness), `${p.destinationId} strictness ${g.strictness}`);
      assert.ok(g.guidance && g.guidance.length > 0, `${p.destinationId} ${g.venue} guidance text`);
    }
  }
});

test("DRESS_CODE_NOTE carries a clear dress-guidance disclaimer", () => {
  assert.match(DRESS_CODE_NOTE, /vary|verify|check/i);
  assert.match(DRESS_CODE_NOTE, /dress|guidance/i);
});

test("dressGuidanceFor returns the first matching venue guidance; null otherwise", () => {
  const religious = dressGuidanceFor("marrakech", "religious_site");
  assert.equal(religious?.venue, "religious_site");
  assert.equal(religious?.strictness, "strict");
  assert.equal(dressGuidanceFor("marrakech", "nightlife"), null);
  assert.equal(dressGuidanceFor("atlantis", "general"), null);
});

test("venuesNeedingModesty returns conservative/strict venues; [] for unknown", () => {
  const marrakech = venuesNeedingModesty("marrakech");
  assert.ok(marrakech.includes("general"));
  assert.ok(marrakech.includes("religious_site"));
  assert.ok(
    marrakech.every((v) => {
      const g = dressGuidanceFor("marrakech", v);
      return g?.strictness === "conservative" || g?.strictness === "strict";
    }),
  );
  assert.deepEqual(venuesNeedingModesty("atlantis"), []);
});
