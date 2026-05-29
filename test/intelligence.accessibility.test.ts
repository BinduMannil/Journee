import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAccessibilityProfile,
  accessAspectFor,
  challengingFacets,
  ACCESSIBILITY_DATA_NOTE,
} from "../src/lib/intelligence/accessibility";
import { accessibilityProfiles } from "../src/content/accessibility";

const ACCESS_FACETS = ["getting_around", "attractions", "lodging", "terrain"];
const ACCESS_LEVELS = ["good", "moderate", "limited", "challenging"];

test("getAccessibilityProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getAccessibilityProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getAccessibilityProfile("atlantis"), null);
});

test("every profile has a valid overall level, summary and well-formed aspects", () => {
  assert.ok(accessibilityProfiles.length > 0);
  for (const p of accessibilityProfiles) {
    assert.ok(ACCESS_LEVELS.includes(p.overallLevel), `${p.destinationId} overallLevel`);
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.aspects.length > 0, `${p.destinationId} aspects`);
    for (const a of p.aspects) {
      assert.ok(ACCESS_FACETS.includes(a.facet), `${p.destinationId} facet ${a.facet}`);
      assert.ok(ACCESS_LEVELS.includes(a.level), `${p.destinationId} level ${a.level}`);
      assert.ok(a.note && a.note.length > 0, `${p.destinationId} ${a.facet} note`);
    }
  }
});

test("ACCESSIBILITY_DATA_NOTE carries a strong, non-guaranteeing disclaimer", () => {
  assert.match(ACCESSIBILITY_DATA_NOTE, /vary|confirm|not a guarantee/i);
  assert.match(ACCESSIBILITY_DATA_NOTE, /access/i);
});

test("accessAspectFor returns the matching aspect; null for unknown facet/destination", () => {
  const ga = accessAspectFor("kyoto", "getting_around");
  assert.equal(ga?.facet, "getting_around");
  assert.ok(ACCESS_LEVELS.includes(ga?.level ?? ""));
  assert.equal(accessAspectFor("atlantis", "terrain"), null);
});

test("challengingFacets returns limited/challenging facets; [] for unknown", () => {
  const santorini = challengingFacets("santorini");
  assert.ok(santorini.length > 0);
  assert.ok(
    santorini.every((f) => {
      const a = accessAspectFor("santorini", f);
      return a?.level === "limited" || a?.level === "challenging";
    }),
  );
  assert.deepEqual(challengingFacets("atlantis"), []);
});
