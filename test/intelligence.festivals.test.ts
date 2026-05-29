import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFestivals,
  festivalsInMonth,
  joinableFestivals,
  FESTIVALS_DATA_NOTE,
} from "../src/lib/intelligence/festivals";
import { festivalsProfiles } from "../src/content/festivals";

test("getFestivals returns festivals for a known destination, null otherwise", () => {
  assert.equal(getFestivals("kyoto")?.destinationId, "kyoto");
  assert.equal(getFestivals("atlantis"), null);
});

test("every festival has significance, what-to-expect, a kind and valid months", () => {
  for (const p of festivalsProfiles) {
    assert.ok(p.festivals.length > 0, `${p.destinationId} festivals`);
    for (const f of p.festivals) {
      assert.ok(f.significance && f.whatToExpect, `${f.name} text`);
      assert.ok(["festival", "public_holiday", "religious"].includes(f.kind), `${f.name} kind`);
      for (const m of f.months) assert.ok(m >= 1 && m <= 12, `${f.name} month ${m}`);
    }
  }
  assert.match(FESTIVALS_DATA_NOTE, /confirm exact dates/i);
});

test("festivalsInMonth filters by month; joinableFestivals excludes observe-only", () => {
  assert.ok(festivalsInMonth("kyoto", 7).some((f) => /Gion/.test(f.name)));
  assert.deepEqual(festivalsInMonth("atlantis", 1), []);
  // Marrakech's Ramadan/Eid are visitorsCanJoin:false → excluded from joinable.
  const joinable = joinableFestivals("marrakech");
  assert.ok(joinable.every((f) => f.visitorsCanJoin));
  assert.equal(joinable.some((f) => /Ramadan/.test(f.name)), false);
});
