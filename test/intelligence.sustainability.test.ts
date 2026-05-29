import { test } from "node:test";
import assert from "node:assert/strict";
import { score } from "../src/lib/intelligence/scoring";
import {
  sustainabilityEngine,
  SUSTAINABILITY_SIGNAL_KEYS,
} from "../src/lib/intelligence/engines/sustainability";
import { sustainabilityWeights } from "../src/lib/intelligence/weights";
import {
  estimateLeg,
  estimateTripFootprint,
  estimateRouteFootprint,
  flightModeFor,
  footprintToTransportSignal,
  SHORT_HAUL_THRESHOLD_KM,
} from "../src/lib/intelligence/carbon";

test("sustainability engine: full context scores in range with full confidence", () => {
  const signals = sustainabilityEngine.toSignals({
    transport: 0.8,
    overtourism: 0.6,
    conservation: 0.7,
    localBenefit: 0.9,
    resourceResilience: 0.5,
  });
  const r = score(signals, sustainabilityWeights, [...SUSTAINABILITY_SIGNAL_KEYS]);
  assert.ok(r.score > 0 && r.score <= 100);
  assert.equal(r.confidence, 1);
  assert.equal(r.weightsVersion, "sustainability-v1");
});

test("sustainability engine: partial context lowers confidence", () => {
  const r = score(
    sustainabilityEngine.toSignals({ transport: 1 }),
    sustainabilityWeights,
    [...SUSTAINABILITY_SIGNAL_KEYS],
  );
  assert.equal(r.confidence, 0.2); // 1 of 5
  assert.equal(r.weightsVersion, "sustainability-v1");
});

test("sustainability engine: empty context is safe", () => {
  const r = score(
    sustainabilityEngine.toSignals({}),
    sustainabilityWeights,
    [...SUSTAINABILITY_SIGNAL_KEYS],
  );
  assert.equal(r.score, 0);
  assert.equal(r.confidence, 0);
});

test("sustainability engine id is stable", () => {
  assert.equal(sustainabilityEngine.id, "sustainability-intelligence");
});

test("carbon: short vs long haul flight class by distance", () => {
  assert.equal(flightModeFor(SHORT_HAUL_THRESHOLD_KM - 1), "plane_short");
  assert.equal(flightModeFor(SHORT_HAUL_THRESHOLD_KM + 1), "plane_long");
});

test("carbon: a train leg is far lower impact than the same distance flown", () => {
  const flown = estimateLeg(1000, "plane_short");
  const railed = estimateLeg(1000, "train");
  assert.ok(railed.kgCO2e < flown.kgCO2e);
  assert.ok(railed.kgCO2e > 0);
});

test("carbon: trip footprint sums its legs and stays approximate", () => {
  const trip = estimateTripFootprint([
    { distanceKm: 500, mode: "train" },
    { distanceKm: 800, mode: "bus" },
  ]);
  assert.equal(trip.legs.length, 2);
  assert.equal(trip.approximate, true);
  const summed = trip.legs.reduce((s, l) => s + l.kgCO2e, 0);
  assert.ok(Math.abs(trip.totalKgCO2e - summed) < 1);
});

test("carbon: route footprint is round-trip from home and zero with no stops", () => {
  const home = { lat: 51.47, lon: -0.45 }; // London
  const empty = estimateRouteFootprint(home, []);
  assert.equal(empty.totalKgCO2e, 0);
  assert.equal(empty.legs.length, 0);

  const oneStop = estimateRouteFootprint(home, [{ lat: 35.01, lon: 135.77 }]); // Kyoto
  assert.equal(oneStop.legs.length, 2); // out and back
  assert.ok(oneStop.totalKgCO2e > 0);
});

test("carbon: footprint maps to a 0..1 transport signal (low impact = 1)", () => {
  assert.equal(footprintToTransportSignal(0), 1);
  assert.equal(footprintToTransportSignal(2000, 2000), 0);
  const mid = footprintToTransportSignal(1000, 2000);
  assert.ok(mid > 0 && mid < 1);
  assert.equal(footprintToTransportSignal(9999, 2000), 0); // clamped
});

test("carbon signal feeds the sustainability engine transport input end-to-end", () => {
  const trip = estimateTripFootprint([{ distanceKm: 300, mode: "train" }]);
  const transport = footprintToTransportSignal(trip.totalKgCO2e);
  const r = score(
    sustainabilityEngine.toSignals({ transport }),
    sustainabilityWeights,
    [...SUSTAINABILITY_SIGNAL_KEYS],
  );
  assert.ok(r.score > 0); // a low-carbon train trip yields a favourable transport signal
});
