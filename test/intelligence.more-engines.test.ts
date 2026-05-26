import { test } from "node:test";
import assert from "node:assert/strict";
import { score } from "../src/lib/intelligence/scoring";
import { safetyEngine, SAFETY_SIGNAL_KEYS } from "../src/lib/intelligence/engines/safety";
import { visaEngine, VISA_SIGNAL_KEYS } from "../src/lib/intelligence/engines/visa";
import { cultureEngine, CULTURE_SIGNAL_KEYS } from "../src/lib/intelligence/engines/culture";
import { safetyWeights, visaWeights, cultureWeights } from "../src/lib/intelligence/weights";

test("safety engine: full context scores in range with full confidence", () => {
  const signals = safetyEngine.toSignals({
    scamSafety: 0.8,
    crowdSafety: 0.7,
    emergencyReadiness: 0.9,
    healthSafety: 0.85,
  });
  const r = score(signals, safetyWeights, [...SAFETY_SIGNAL_KEYS]);
  assert.ok(r.score > 0 && r.score <= 100);
  assert.equal(r.confidence, 1);
  assert.equal(r.weightsVersion, "safety-v1");
});

test("visa engine: partial context lowers confidence", () => {
  const r = score(visaEngine.toSignals({ entryEase: 1 }), visaWeights, [...VISA_SIGNAL_KEYS]);
  assert.equal(r.confidence, 0.25);
  assert.equal(r.weightsVersion, "visa-v1");
});

test("culture engine: empty context is safe", () => {
  const r = score(cultureEngine.toSignals({}), cultureWeights, [...CULTURE_SIGNAL_KEYS]);
  assert.equal(r.score, 0);
  assert.equal(r.confidence, 0);
});

test("engine ids are stable and distinct", () => {
  const ids = [safetyEngine.id, visaEngine.id, cultureEngine.id];
  assert.deepEqual(ids, ["safety-intelligence", "visa-intelligence", "culture-intelligence"]);
  assert.equal(new Set(ids).size, 3);
});
