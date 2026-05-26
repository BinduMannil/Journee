import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregateTravelConfidence } from "../src/lib/intelligence/engines/confidence";
import { travelConfidenceWeights } from "../src/lib/intelligence/weights";
import type { IntelligenceScore } from "../src/lib/intelligence/types";

function s(score: number, confidence: number): IntelligenceScore {
  return { score, confidence, contributions: [], weightsVersion: "x" };
}

test("weights disruption more heavily than events", () => {
  // disruption low (0), events high (100); disruption weight 3 vs events 1.
  const agg = aggregateTravelConfidence(
    [
      { key: "disruption", result: s(0, 1) },
      { key: "events", result: s(100, 1) },
    ],
    travelConfidenceWeights,
  );
  // (0*3 + 1*1) / (3+1) = 0.25 -> 25
  assert.equal(agg.score, 25);
});

test("overall confidence is the mean of input confidences", () => {
  const agg = aggregateTravelConfidence(
    [
      { key: "disruption", result: s(80, 1) },
      { key: "destination", result: s(80, 0.5) },
    ],
    travelConfidenceWeights,
  );
  assert.equal(agg.confidence, 0.75);
});

test("empty input is safe", () => {
  const agg = aggregateTravelConfidence([], travelConfidenceWeights);
  assert.equal(agg.score, 0);
  assert.equal(agg.confidence, 0);
});

test("reports the aggregate weights version", () => {
  const agg = aggregateTravelConfidence(
    [{ key: "disruption", result: s(50, 1) }],
    travelConfidenceWeights,
  );
  assert.equal(agg.weightsVersion, "travel-confidence-v2");
});

test("safety is weighted as heavily as disruption in the aggregate", () => {
  // safety low (0), destination high (100); safety weight 3 vs destination 2.
  const agg = aggregateTravelConfidence(
    [
      { key: "safety", result: s(0, 1) },
      { key: "destination", result: s(100, 1) },
    ],
    travelConfidenceWeights,
  );
  // (0*3 + 1*2) / (3+2) = 0.4 -> 40
  assert.equal(agg.score, 40);
});
