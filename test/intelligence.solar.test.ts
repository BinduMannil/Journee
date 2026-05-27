import { test } from "node:test";
import assert from "node:assert/strict";
import {
  solarAltitudeDeg,
  lightPhase,
  isDaytime,
  goldenHourProximity,
  sunTimes,
  formatSolarTime,
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

test("sunTimes at the equator on the equinox ~ 06:00 / 18:00, 12h day", () => {
  const t = sunTimes(new Date("2026-03-20T00:00:00Z"), 0);
  assert.equal(t.condition, "normal");
  assert.ok(Math.abs((t.sunrise ?? 0) - 6) < 0.2, `sunrise ${t.sunrise}`);
  assert.ok(Math.abs((t.sunset ?? 0) - 18) < 0.2, `sunset ${t.sunset}`);
  assert.ok(Math.abs(t.dayLengthHours - 12) < 0.4, `day ${t.dayLengthHours}`);
  // evening golden window straddles sunset and has positive duration
  assert.ok(t.eveningGolden && t.eveningGolden.start < 18 && t.eveningGolden.end > 18);
});

test("high latitude in summer is midnight sun; in winter is polar night", () => {
  const summer = sunTimes(new Date("2026-06-21T00:00:00Z"), 80);
  assert.equal(summer.condition, "midnight-sun");
  assert.equal(summer.dayLengthHours, 24);
  assert.equal(summer.sunrise, null);

  const winter = sunTimes(new Date("2026-12-21T00:00:00Z"), 80);
  assert.equal(winter.condition, "polar-night");
  assert.equal(winter.dayLengthHours, 0);
  assert.equal(winter.sunset, null);
});

test("southern hemisphere has a longer day than northern at the same |lat| in December", () => {
  const south = sunTimes(new Date("2026-12-21T00:00:00Z"), -45);
  const north = sunTimes(new Date("2026-12-21T00:00:00Z"), 45);
  assert.ok(south.dayLengthHours > north.dayLengthHours);
});

test("formatSolarTime renders HH:MM and wraps at 24h", () => {
  assert.equal(formatSolarTime(18.5), "18:30");
  assert.equal(formatSolarTime(6), "06:00");
  assert.equal(formatSolarTime(0), "00:00");
  assert.equal(formatSolarTime(24), "00:00");
  assert.equal(formatSolarTime(23.999), "00:00"); // rounds up + wraps
});
