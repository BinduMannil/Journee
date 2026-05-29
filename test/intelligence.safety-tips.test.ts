import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getSafetyTips,
  scamNames,
  SAFETY_TIPS_DATA_NOTE,
} from "../src/lib/intelligence/safety-tips";
import { safetyTipsProfiles } from "../src/content/safety-tips";

test("getSafetyTips returns a profile for a known destination, null otherwise", () => {
  assert.equal(getSafetyTips("marrakech")?.destinationId, "marrakech");
  assert.equal(getSafetyTips("atlantis"), null);
});

test("every profile has commonScams (name/how/avoid) and generalTips", () => {
  for (const p of safetyTipsProfiles) {
    assert.ok(p.commonScams.length > 0, `${p.destinationId} commonScams`);
    assert.ok(p.generalTips.length > 0, `${p.destinationId} generalTips`);
    for (const s of p.commonScams) {
      assert.ok(s.name, `${p.destinationId} scam name`);
      assert.ok(s.how, `${s.name} how`);
      assert.ok(s.avoid, `${s.name} avoid`);
    }
    for (const t of p.generalTips) assert.ok(t, `${p.destinationId} tip text`);
  }
  assert.match(SAFETY_TIPS_DATA_NOTE, /verify|aware/i);
});

test("scamNames returns names for marrakech and [] for unknown", () => {
  const names = scamNames("marrakech");
  assert.ok(names.length > 0);
  assert.ok(names.some((n) => /guide/i.test(n)));
  assert.deepEqual(scamNames("atlantis"), []);
});
