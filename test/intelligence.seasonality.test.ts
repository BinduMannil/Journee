import { test } from "node:test";
import assert from "node:assert/strict";
import {
  monthDistance,
  monthSuitability,
  isInSeason,
  rankForMonth,
} from "../src/lib/intelligence/seasonality";

test("monthDistance is cyclic (Dec adjacent to Jan)", () => {
  assert.equal(monthDistance(12, 1), 1);
  assert.equal(monthDistance(1, 12), 1);
  assert.equal(monthDistance(3, 3), 0);
  assert.equal(monthDistance(1, 7), 6);
});

test("monthSuitability: in season=1, shoulder=0.5, off=0.15", () => {
  assert.equal(monthSuitability([4, 11], 4), 1);
  assert.equal(monthSuitability([4, 11], 5), 0.5); // adjacent
  assert.equal(monthSuitability([4, 11], 7), 0.15);
});

test("monthSuitability: no guidance is neutral, not zero", () => {
  assert.equal(monthSuitability(undefined, 6), 0.5);
  assert.equal(monthSuitability([], 6), 0.5);
});

test("isInSeason reflects the recommended window", () => {
  assert.equal(isInSeason([11, 12, 1, 2, 3], 1), true);
  assert.equal(isInSeason([11, 12, 1, 2, 3], 7), false);
  assert.equal(isInSeason(undefined, 7), false);
});

test("rankForMonth orders destinations by suitability, stable by id", () => {
  const ranked = rankForMonth(
    [
      { id: "patagonia", bestMonths: [11, 12, 1, 2, 3] },
      { id: "kyoto", bestMonths: [4, 11] },
      { id: "santorini", bestMonths: [5, 6, 9] },
    ],
    1, // January
  );
  assert.equal(ranked[0]!.id, "patagonia");
  assert.equal(ranked[0]!.score, 100);
  assert.ok(ranked[0]!.inSeason);
  // ranked descending
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1]!.score >= ranked[i]!.score);
  }
});
