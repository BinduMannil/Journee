import { test } from "node:test";
import assert from "node:assert/strict";
import {
  groupRatingsByTarget,
  aggregateTarget,
  rankTargets,
  recommendTargets,
  type Rating,
} from "../src/lib/social/recommendations";

const ratings: readonly Rating[] = [
  { raterId: "u1", targetId: "postA", targetKind: "post", value: 5 },
  { raterId: "u2", targetId: "postA", targetKind: "post", value: 4 },
  { raterId: "u1", targetId: "postA", targetKind: "post", value: 3 }, // u1 re-rates A: latest (3) wins
  { raterId: "u3", targetId: "postB", targetKind: "post", value: 5 },
  { raterId: "u1", targetId: "placeX", targetKind: "place", value: 2 },
];

test("groupRatingsByTarget de-dupes per rater (latest wins) and can filter by kind", () => {
  const posts = groupRatingsByTarget(ratings, "post");
  // postA: u1's latest (3) + u2 (4) => two values
  assert.deepEqual([...(posts.get("postA") ?? [])].sort(), [3, 4]);
  assert.deepEqual([...(posts.get("postB") ?? [])], [5]);
  assert.equal(posts.has("placeX"), false); // filtered out (place)
});

test("aggregateTarget uses the Bayesian core (count reflects de-dupe)", () => {
  const agg = aggregateTarget(ratings, "postA");
  assert.equal(agg.count, 2); // u1 (latest) + u2
  assert.equal(agg.mean, 3.5); // (3 + 4) / 2
  assert.equal(agg.version, "rating-v1");
});

test("rankTargets orders by weighted (Bayesian) score across all kinds", () => {
  const ranked = rankTargets(ratings);
  // weighted = (sum + 3.5*5) / (n + 5):
  //   postB [5]   -> 22.5/6 = 3.75
  //   postA [3,4] -> 24.5/7 = 3.50 (its mean equals the prior, so no lift)
  //   placeX [2]  -> 19.5/6 = 3.25
  assert.deepEqual(ranked.map((r) => r.id), ["postB", "postA", "placeX"]);
});

test("recommendTargets filters by minCount/minConfidence and honours limit", () => {
  const onlyMultiRated = recommendTargets(ratings, { kind: "post", minCount: 2 });
  assert.deepEqual(onlyMultiRated.map((r) => r.id), ["postA"]);

  const limited = recommendTargets(ratings, { limit: 1 });
  assert.equal(limited.length, 1);

  const none = recommendTargets(ratings, { minConfidence: 0.99 });
  assert.deepEqual(none, []);
});
