import { test } from "node:test";
import assert from "node:assert/strict";
import { haversineKm, routeDistanceKm } from "../src/lib/intelligence/geo";

test("distance from a point to itself is zero", () => {
  assert.equal(haversineKm({ lat: 35, lon: 135 }, { lat: 35, lon: 135 }), 0);
});

test("one degree of latitude is ~111 km", () => {
  const d = haversineKm({ lat: 0, lon: 0 }, { lat: 1, lon: 0 });
  assert.ok(Math.abs(d - 111.19) < 1, `got ${d}`);
});

test("one degree of longitude at the equator is ~111 km", () => {
  const d = haversineKm({ lat: 0, lon: 0 }, { lat: 0, lon: 1 });
  assert.ok(Math.abs(d - 111.19) < 1, `got ${d}`);
});

test("distance is symmetric", () => {
  const a = { lat: 35.0116, lon: 135.7681 };
  const b = { lat: 36.3932, lon: 25.4615 };
  assert.equal(haversineKm(a, b), haversineKm(b, a));
});

test("routeDistance sums legs and reports the longest", () => {
  const stops = [
    { lat: 0, lon: 0 },
    { lat: 0, lon: 1 }, // ~111 km
    { lat: 0, lon: 4 }, // ~333 km
  ];
  const r = routeDistanceKm(stops);
  assert.ok(Math.abs(r.totalKm - 445) <= 2, `total ${r.totalKm}`);
  assert.ok(Math.abs(r.longestLegKm - 334) <= 2, `longest ${r.longestLegKm}`);
});

test("routeDistance is zero for fewer than two stops", () => {
  assert.deepEqual(routeDistanceKm([]), { totalKm: 0, longestLegKm: 0 });
  assert.deepEqual(routeDistanceKm([{ lat: 1, lon: 1 }]), { totalKm: 0, longestLegKm: 0 });
});
