import { test } from "node:test";
import assert from "node:assert/strict";
import {
  solarAltitudeDeg,
  lightPhase,
  isDaytime,
  goldenHourProximity,
} from "../src/lib/intelligence/solar";

test("sun is near overhead at equator solar noon (equinox)", () => {
  const alt = solarAltitudeDeg(new Date("2026-03-20T12:00:00Z"), 0, 0);
  assert.ok(alt > 80, `altitude was ${alt}`);
  assert.equal(isDaytime(alt), true);
  assert.equal(lightPhase(alt), "daylight");
});

test("sun is well below horizon at local midnight", () => {
  const alt = solarAltitudeDeg(new Date("2026-03-20T00:00:00Z"), 0, 0);
  assert.ok(alt < -80, `altitude was ${alt}`);
  assert.equal(isDaytime(alt), false);
  assert.equal(lightPhase(alt), "night");
});

test("longitude shifts solar noon (Tokyo ~135E around 03:00 UTC)", () => {
  const altNoonLocal = solarAltitudeDeg(new Date("2026-03-20T03:00:00Z"), 35.0, 135.0);
  const altMidnightLocal = solarAltitudeDeg(new Date("2026-03-20T15:00:00Z"), 35.0, 135.0);
  assert.ok(altNoonLocal > altMidnightLocal);
  assert.ok(altNoonLocal > 0 && altMidnightLocal < 0);
});

test("lightPhase bands", () => {
  assert.equal(lightPhase(-10), "night");
  assert.equal(lightPhase(0), "golden");
  assert.equal(lightPhase(3), "golden");
  assert.equal(lightPhase(30), "daylight");
});

test("goldenHourProximity peaks in the low-sun band and tapers", () => {
  assert.equal(goldenHourProximity(0), 1);
  assert.equal(goldenHourProximity(6), 1);
  assert.equal(goldenHourProximity(-12), 0);
  assert.equal(goldenHourProximity(18), 0);
  assert.ok(goldenHourProximity(12) > 0 && goldenHourProximity(12) < 1);
});
