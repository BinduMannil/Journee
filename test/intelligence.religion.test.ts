import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getReligionProfile,
  placesOfWorshipByKind,
  RELIGION_DATA_NOTE,
} from "../src/lib/intelligence/religion";
import { religionProfiles } from "../src/content/religion";

test("getReligionProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getReligionProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getReligionProfile("atlantis"), null);
});

test("every profile has predominant religions, a summary and valid places of worship", () => {
  const kinds = ["mosque", "temple", "church", "synagogue", "shrine"];
  for (const p of religionProfiles) {
    assert.ok(p.predominant.length > 0, `${p.destinationId} predominant`);
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.placesOfWorship.length > 0, `${p.destinationId} places`);
    for (const w of p.placesOfWorship) {
      assert.ok(w.name && w.area, `${w.name} text`);
      assert.ok(kinds.includes(w.kind), `${w.name} kind`);
    }
  }
  assert.match(RELIGION_DATA_NOTE, /verify/i);
});

test("placesOfWorshipByKind filters by kind; returns [] for unknown destination", () => {
  assert.ok(placesOfWorshipByKind("kyoto", "shrine").some((w) => /Fushimi/.test(w.name)));
  assert.ok(placesOfWorshipByKind("kyoto", "shrine").every((w) => w.kind === "shrine"));
  assert.ok(placesOfWorshipByKind("marrakech", "mosque").some((w) => /Koutoubia/.test(w.name)));
  assert.equal(placesOfWorshipByKind("marrakech", "synagogue").length, 1);
  assert.deepEqual(placesOfWorshipByKind("atlantis", "church"), []);
});
