import { test } from "node:test";
import assert from "node:assert/strict";
import { score } from "../src/lib/intelligence/scoring";
import { eventEngine } from "../src/lib/intelligence/engines/events";
import { disruptionEngine } from "../src/lib/intelligence/engines/disruption";
import { eventWeights, disruptionWeights } from "../src/lib/intelligence/weights";
import { mockEventContext, mockDisruptionContext } from "../src/lib/intelligence/mock";

test("event engine scores mock context within range and full confidence", () => {
  const ctx = mockEventContext("kyoto");
  const signals = eventEngine.toSignals(ctx);
  const result = score(signals, eventWeights, [
    "festival_intensity",
    "cultural_significance",
    "operational_accessibility",
    "crowd_comfort",
  ]);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.confidence, 1); // all four signals present
  assert.equal(result.weightsVersion, "event-v1");
});

test("disruption engine scores mock context within range", () => {
  const ctx = mockDisruptionContext("marrakech");
  const result = score(disruptionEngine.toSignals(ctx), disruptionWeights);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.weightsVersion, "disruption-v1");
});

test("mock contexts are deterministic per seed and vary across seeds", () => {
  assert.deepEqual(mockEventContext("a"), mockEventContext("a"));
  assert.notDeepEqual(mockEventContext("a"), mockEventContext("b"));
});

test("partial disruption context lowers confidence", () => {
  const result = score(
    disruptionEngine.toSignals({ advisoryConfidence: 0.9 }),
    disruptionWeights,
    ["advisory", "civil_stability", "transport", "hazard", "weather_severity"],
  );
  assert.equal(result.confidence, 0.2); // 1 of 5
});
