import { test } from "node:test";
import assert from "node:assert/strict";
import { score } from "../src/lib/intelligence/scoring";
import { destinationEngine } from "../src/lib/intelligence/engines/destination";
import { destinationWeights } from "../src/lib/intelligence/weights";
import type { ScoringWeights } from "../src/lib/intelligence/types";

const flat: ScoringWeights = { version: "t", defaultWeight: 1, weights: {} };

test("all-favorable signals score 100", () => {
  const result = score(
    [
      { key: "a", value: 1 },
      { key: "b", value: 1 },
    ],
    flat,
  );
  assert.equal(result.score, 100);
});

test("all-zero signals score 0", () => {
  const result = score([{ key: "a", value: 0 }], flat);
  assert.equal(result.score, 0);
});

test("values are clamped to 0..1", () => {
  const result = score(
    [
      { key: "a", value: 5 },
      { key: "b", value: -3 },
    ],
    flat,
  );
  // a -> 1, b -> 0, equal weights => 50
  assert.equal(result.score, 50);
});

test("weights bias the result and are reported", () => {
  const weights: ScoringWeights = {
    version: "w1",
    defaultWeight: 1,
    weights: { important: 3, minor: 1 },
  };
  const result = score(
    [
      { key: "important", value: 1 },
      { key: "minor", value: 0 },
    ],
    weights,
  );
  // (1*3 + 0*1) / (3+1) = 0.75 -> 75
  assert.equal(result.score, 75);
  assert.equal(result.weightsVersion, "w1");
  assert.equal(result.contributions.length, 2);
});

test("confidence reflects coverage of expected keys", () => {
  const result = score([{ key: "a", value: 1 }], flat, ["a", "b", "c", "d"]);
  assert.equal(result.confidence, 0.25);
});

test("empty signals are safe (no NaN/throw)", () => {
  const result = score([], flat);
  assert.equal(result.score, 0);
  assert.equal(result.confidence, 0);
});

test("destination engine maps booleans and numbers to signals", () => {
  const signals = destinationEngine.toSignals({
    isOpenNow: true,
    crowdEmptiness: 0.8,
  });
  const keys = signals.map((s) => s.key);
  assert.deepEqual(keys, ["open_now", "crowd"]);
  const result = score(signals, destinationWeights);
  assert.ok(result.score > 0 && result.score <= 100);
});
