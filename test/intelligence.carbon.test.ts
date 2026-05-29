import { test } from "node:test";
import assert from "node:assert/strict";
import {
  carbonModelV1,
  estimateTripCarbon,
  inferTravelMode,
} from "../src/lib/intelligence/carbon";
import { haversineKm } from "../src/lib/intelligence/geo";

test("inferTravelMode picks a mode by leg distance band", () => {
  assert.equal(inferTravelMode(50), "road"); // <=100
  assert.equal(inferTravelMode(100), "road"); // boundary inclusive
  assert.equal(inferTravelMode(300), "rail"); // <=700
  assert.equal(inferTravelMode(2000), "short_haul_flight"); // <=3700
  assert.equal(inferTravelMode(9000), "long_haul_flight"); // > 3700
});

test("a single-leg estimate equals distance × the mode factor", () => {
  const a = { lat: 0, lon: 0 };
  const b = { lat: 0, lon: 20 }; // ~2225 km → short-haul flight
  const km = haversineKm(a, b);
  const est = estimateTripCarbon([a, b]);
  assert.equal(est.version, "carbon-v1");
  assert.equal(est.legs.length, 1);
  assert.equal(est.legs[0]?.mode, "short_haul_flight");
  const expected = Math.round(km * carbonModelV1.factorsKgPerKm.short_haul_flight * 10) / 10;
  assert.ok(Math.abs(est.totalKgCO2e - expected) < 0.2, `total ${est.totalKgCO2e} vs ${expected}`);
});

test("multi-leg total is the sum of per-leg estimates", () => {
  const stops = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 0.5 }, // ~56 km → road
    { lat: 0, lon: 5 }, // ~500 km → rail
  ];
  const est = estimateTripCarbon(stops);
  assert.equal(est.legs.length, 2);
  assert.equal(est.legs[0]?.mode, "road");
  assert.equal(est.legs[1]?.mode, "rail");
  const sum = est.legs.reduce((s, l) => s + l.kgCO2e, 0);
  assert.ok(Math.abs(est.totalKgCO2e - sum) < 0.2);
});

test("passengers multiply the per-passenger total (integer, ≥1)", () => {
  const stops = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 20 },
  ];
  const one = estimateTripCarbon(stops);
  const four = estimateTripCarbon(stops, { passengers: 4 });
  assert.equal(four.passengers, 4);
  assert.ok(Math.abs(four.totalKgCO2e - one.totalKgCO2e * 4) < 0.5);
  // Non-positive / fractional passengers clamp to a sane integer ≥ 1.
  assert.equal(estimateTripCarbon(stops, { passengers: 0 }).passengers, 1);
  assert.equal(estimateTripCarbon(stops, { passengers: 2.9 }).passengers, 2);
});

test("a forced mode overrides per-leg inference", () => {
  const stops = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 20 }, // would infer short_haul_flight
  ];
  const railed = estimateTripCarbon(stops, { mode: "rail" });
  assert.equal(railed.legs[0]?.mode, "rail");
});

test("fewer than two stops → empty legs and a zero total", () => {
  assert.deepEqual(estimateTripCarbon([]).legs, []);
  assert.equal(estimateTripCarbon([{ lat: 1, lon: 1 }]).totalKgCO2e, 0);
});

test("the estimate is labeled as an estimate (honest, not a measured figure)", () => {
  const est = estimateTripCarbon([{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }]);
  assert.match(est.basis, /ESTIMATE/);
});
