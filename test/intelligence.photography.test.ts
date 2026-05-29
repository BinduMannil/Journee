import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getPhotographyProfile,
  photoRuleFor,
  prohibitedSubjects,
  PHOTOGRAPHY_DATA_NOTE,
} from "../src/lib/intelligence/photography";
import { photographyProfiles } from "../src/content/photography";

const PHOTO_RULE_KINDS = [
  "people",
  "religious_site",
  "government_military",
  "museum_interior",
  "drone",
  "general",
];
const PERMISSIONS = ["generally_ok", "ask_first", "restricted", "prohibited"];

test("getPhotographyProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getPhotographyProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getPhotographyProfile("atlantis"), null);
});

test("every profile has a non-empty summary and well-formed rules", () => {
  assert.ok(photographyProfiles.length > 0);
  for (const p of photographyProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.rules.length >= 1, `${p.destinationId} rules`);
    for (const r of p.rules) {
      assert.ok(PHOTO_RULE_KINDS.includes(r.kind), `${p.destinationId} rule kind ${r.kind}`);
      assert.ok(PERMISSIONS.includes(r.permission), `${p.destinationId} permission ${r.permission}`);
      assert.ok(r.note && r.note.length > 0, `${p.destinationId} ${r.kind} note`);
    }
  }
});

test("PHOTOGRAPHY_DATA_NOTE carries an etiquette/not-legal-advice disclaimer", () => {
  assert.match(PHOTOGRAPHY_DATA_NOTE, /not legal advice|vary|verify|check/i);
  assert.match(PHOTOGRAPHY_DATA_NOTE, /photograph|drone/i);
});

test("photoRuleFor returns the matching rule; null for unknown destination or kind", () => {
  const droneMarrakech = photoRuleFor("marrakech", "drone");
  assert.equal(droneMarrakech?.kind, "drone");
  assert.ok(PERMISSIONS.includes(droneMarrakech?.permission ?? ""));
  assert.equal(photoRuleFor("atlantis", "drone"), null);
  assert.equal(photoRuleFor("santorini", "government_military"), null);
});

test("prohibitedSubjects returns prohibited/restricted kinds; [] for unknown", () => {
  const marrakech = prohibitedSubjects("marrakech");
  assert.ok(marrakech.includes("drone"), "marrakech prohibits drones");
  assert.ok(marrakech.includes("religious_site"), "marrakech restricts religious sites");
  const profile = getPhotographyProfile("marrakech");
  for (const kind of marrakech) {
    const rule = profile?.rules.find((r) => r.kind === kind);
    assert.ok(rule?.permission === "prohibited" || rule?.permission === "restricted");
  }
  assert.deepEqual(prohibitedSubjects("atlantis"), []);
});
