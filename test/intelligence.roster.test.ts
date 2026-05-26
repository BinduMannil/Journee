import { test } from "node:test";
import assert from "node:assert/strict";
import { score } from "../src/lib/intelligence/scoring";
import { conditionsEngine, CONDITIONS_SIGNAL_KEYS } from "../src/lib/intelligence/engines/conditions";
import { cityEnergyEngine, CITY_ENERGY_SIGNAL_KEYS } from "../src/lib/intelligence/engines/city-energy";
import { memoryEngine, MEMORY_SIGNAL_KEYS } from "../src/lib/intelligence/engines/memory";
import {
  conditionsWeights,
  cityEnergyWeights,
  memoryWeights,
} from "../src/lib/intelligence/weights";

test("conditions engine scores full context with full confidence", () => {
  const r = score(
    conditionsEngine.toSignals({ airportFlow: 0.9, transitFlow: 0.8, accessOpen: 1, surgeComfort: 0.7 }),
    conditionsWeights,
    [...CONDITIONS_SIGNAL_KEYS],
  );
  assert.ok(r.score > 0 && r.score <= 100);
  assert.equal(r.confidence, 1);
  assert.equal(r.weightsVersion, "conditions-v1");
});

test("city energy engine maps vibe signals", () => {
  const signals = cityEnergyEngine.toSignals({ festivity: 1, calmness: 0 });
  assert.deepEqual(signals.map((s) => s.key).sort(), ["calmness", "festivity"]);
  const r = score(signals, cityEnergyWeights, [...CITY_ENERGY_SIGNAL_KEYS]);
  assert.equal(r.confidence, 0.5); // 2 of 4
});

test("memory engine scores in range; empty is safe", () => {
  const full = score(
    memoryEngine.toSignals({ emotionalPeak: 1, novelty: 0.8, connection: 0.6, sensoryRichness: 0.9 }),
    memoryWeights,
  );
  assert.ok(full.score > 0 && full.score <= 100);
  const empty = score(memoryEngine.toSignals({}), memoryWeights, [...MEMORY_SIGNAL_KEYS]);
  assert.equal(empty.score, 0);
  assert.equal(empty.confidence, 0);
});

test("roster engine ids are distinct", () => {
  const ids = [conditionsEngine.id, cityEnergyEngine.id, memoryEngine.id];
  assert.equal(new Set(ids).size, 3);
});
