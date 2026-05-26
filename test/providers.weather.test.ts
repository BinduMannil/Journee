import { test } from "node:test";
import assert from "node:assert/strict";
import { mockWeatherProvider } from "../src/lib/providers/weather/mock";
import { comfortScore } from "../src/lib/intelligence/comfort";

test("mock weather is gated behind the mock-weather flag (off by default in tests)", async () => {
  assert.equal(await mockWeatherProvider.isAvailable(), false);
});

test("mock weather returns a valid ComfortInput and is deterministic", async () => {
  const a = await mockWeatherProvider.fetchCurrent(35.0, 135.0, new Date("2026-07-01T00:00:00Z"));
  const b = await mockWeatherProvider.fetchCurrent(35.0, 135.0, new Date("2026-07-01T00:00:00Z"));
  assert.deepEqual(a, b);
  assert.equal(typeof a.temperatureC, "number");
  assert.ok(a.humidityPct !== undefined && a.humidityPct >= 0 && a.humidityPct <= 100);
  assert.ok(a.windKph !== undefined && a.windKph >= 0);
  assert.ok(a.aqi !== undefined && a.aqi >= 0);
  // Feeds the comfort scorer cleanly.
  const score = comfortScore(a);
  assert.ok(score >= 0 && score <= 1);
});

test("equatorial latitudes are warmer than polar ones (sanity)", async () => {
  const when = new Date("2026-07-01T00:00:00Z");
  const equator = await mockWeatherProvider.fetchCurrent(0, 0, when);
  const polar = await mockWeatherProvider.fetchCurrent(80, 0, when);
  assert.ok(equator.temperatureC > polar.temperatureC);
});
