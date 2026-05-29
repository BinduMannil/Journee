import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aggregateRatings,
  rankByRating,
  ratingModelV1,
} from "../src/lib/intelligence/ratings";

test("no ratings → mean 0, weighted = prior mean, confidence 0", () => {
  const a = aggregateRatings([]);
  assert.equal(a.count, 0);
  assert.equal(a.mean, 0);
  assert.equal(a.weighted, ratingModelV1.priorMean);
  assert.equal(a.confidence, 0);
});

test("a single 5-star is pulled toward the prior, not left at 5", () => {
  const a = aggregateRatings([5]);
  assert.equal(a.mean, 5);
  // (5 + 3.5*5) / (1 + 5) = 22.5/6 = 3.75
  assert.equal(a.weighted, 3.75);
  assert.ok(a.weighted < a.mean);
  assert.ok(a.confidence > 0 && a.confidence < 0.2);
});

test("many consistent ratings pull the weighted score close to the mean, with high confidence", () => {
  const a = aggregateRatings(Array.from({ length: 50 }, () => 4.6));
  assert.ok(Math.abs(a.weighted - 4.6) < 0.15, `weighted ${a.weighted}`);
  assert.ok(a.confidence > 0.9, `confidence ${a.confidence}`);
});

test("non-finite values are ignored; out-of-range values are clamped", () => {
  const a = aggregateRatings([5, Number.NaN, Infinity, 9, -2]); // valid → [5, 5(clamped), 0(clamped)]
  assert.equal(a.count, 3);
  assert.ok(Math.abs(a.mean - (5 + 5 + 0) / 3) < 0.01);
});

test("rankByRating orders by weighted score; sparse high ratings don't top well-reviewed ones", () => {
  const ranked = rankByRating([
    { id: "sparse", ratings: [5] }, // weighted 3.75
    { id: "popular", ratings: Array.from({ length: 30 }, () => 4.5) }, // weighted ~4.36
    { id: "empty", ratings: [] }, // weighted 3.5
  ]);
  assert.deepEqual(ranked.map((r) => r.id), ["popular", "sparse", "empty"]);
});
