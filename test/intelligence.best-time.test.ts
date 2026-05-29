import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getBestTimeProfile,
  monthAssessment,
  idealMonths,
  BEST_TIME_DATA_NOTE,
} from "../src/lib/intelligence/best-time";
import { bestTimeProfiles } from "../src/content/best-time";

const SEASON_RATINGS = ["ideal", "good", "fair", "avoid"];
const MONTHS_1_TO_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

test("getBestTimeProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getBestTimeProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getBestTimeProfile("atlantis"), null);
});

test("every profile has a summary and exactly 12 well-formed months 1..12 in order", () => {
  assert.ok(bestTimeProfiles.length > 0);
  for (const p of bestTimeProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.equal(p.months.length, 12, `${p.destinationId} month count`);
    assert.deepEqual(
      p.months.map((m) => m.month),
      MONTHS_1_TO_12,
      `${p.destinationId} months ascending 1..12`,
    );
    for (const m of p.months) {
      assert.ok(SEASON_RATINGS.includes(m.rating), `${p.destinationId} month ${m.month} rating ${m.rating}`);
      assert.ok(m.note && m.note.length > 0, `${p.destinationId} month ${m.month} note`);
    }
  }
});

test("BEST_TIME_DATA_NOTE carries a clear, non-predictive disclaimer", () => {
  assert.match(BEST_TIME_DATA_NOTE, /vary|verify|forecast/i);
  assert.match(BEST_TIME_DATA_NOTE, /season|time/i);
});

test("monthAssessment returns the month for valid input; null out-of-range/unknown", () => {
  const apr = monthAssessment("kyoto", 4);
  assert.equal(apr?.month, 4);
  assert.ok(SEASON_RATINGS.includes(apr?.rating ?? ""));
  assert.equal(monthAssessment("kyoto", 0), null);
  assert.equal(monthAssessment("kyoto", 13), null);
  assert.equal(monthAssessment("atlantis", 4), null);
});

test("idealMonths is a subset of 1..12; [] for unknown", () => {
  for (const p of bestTimeProfiles) {
    const ideal = idealMonths(p.destinationId);
    assert.ok(ideal.length > 0, `${p.destinationId} has at least one ideal month`);
    assert.ok(ideal.every((m) => MONTHS_1_TO_12.includes(m)), `${p.destinationId} ideal months in range`);
  }
  assert.deepEqual(idealMonths("atlantis"), []);
});
