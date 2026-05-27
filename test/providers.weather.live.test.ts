import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import {
  openMeteoWeatherProvider,
  parseOpenMeteo,
} from "../src/lib/providers/weather/open-meteo";
import { getWeatherProvider } from "../src/lib/providers/weather";
import { resetEnvCache } from "../src/lib/config/env";
import { resetFlagsCache } from "../src/lib/config/flags";

/**
 * Covers the live Open-Meteo provider with the network boundary (`fetch`)
 * mocked — no egress needed. Egress to api.open-meteo.com is currently
 * allow-list-blocked, so this verifies the adapter against Open-Meteo's
 * documented response shape, not a live call.
 */
const realFetch = globalThis.fetch;
let lastUrl = "";
let lastInit: RequestInit | undefined;

// A representative Open-Meteo /v1/forecast `current` response.
const sample = {
  latitude: 35.0,
  longitude: 135.75,
  current: { time: "2026-05-27T06:00", temperature_2m: 21.4, relative_humidity_2m: 58, wind_speed_10m: 9.2 },
};

function mockFetch(impl: () => Response | Promise<Response>): void {
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    lastUrl = String(url);
    lastInit = init;
    return impl();
  }) as typeof fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function setFlags(value: string): void {
  process.env.JOURNEE_ENABLED_FEATURES = value;
  resetEnvCache();
  resetFlagsCache();
}

beforeEach(() => {
  setFlags("live-weather");
  lastUrl = "";
  lastInit = undefined;
  mockFetch(() => jsonResponse(sample));
});

after(() => {
  globalThis.fetch = realFetch;
});

test("isAvailable is gated by the live-weather flag", () => {
  assert.equal(openMeteoWeatherProvider.isAvailable(), true);
  setFlags("");
  assert.equal(openMeteoWeatherProvider.isAvailable(), false);
});

test("fetchCurrent maps the Open-Meteo response into a ComfortInput", async () => {
  const input = await openMeteoWeatherProvider.fetchCurrent(35.0, 135.75);
  assert.deepEqual(input, { temperatureC: 21.4, humidityPct: 58, windKph: 9.2 });
  // Hits the forecast endpoint for the given coordinate, with an abort signal.
  assert.ok(lastUrl.startsWith("https://api.open-meteo.com/v1/forecast?"));
  assert.ok(lastUrl.includes("latitude=35") && lastUrl.includes("longitude=135.75"));
  assert.ok(lastInit?.signal instanceof AbortSignal);
});

test("fetchCurrent throws on an upstream error (so callers fall back)", async () => {
  mockFetch(() => jsonResponse({}, 503));
  await assert.rejects(() => openMeteoWeatherProvider.fetchCurrent(0, 0));
});

test("parseOpenMeteo: valid maps fields; partial omits; bad shape throws", () => {
  assert.deepEqual(parseOpenMeteo(sample), { temperatureC: 21.4, humidityPct: 58, windKph: 9.2 });
  // humidity/wind are optional -> undefined when absent
  const partial = parseOpenMeteo({ current: { temperature_2m: 10 } });
  assert.equal(partial.temperatureC, 10);
  assert.equal(partial.humidityPct, undefined);
  assert.equal(partial.windKph, undefined);
  // missing `current` (or non-numeric temp) is a bad shape
  assert.throws(() => parseOpenMeteo({}));
  assert.throws(() => parseOpenMeteo({ current: { temperature_2m: "warm" } }));
});

test("getWeatherProvider prefers live, falls back to mock, else null", async () => {
  setFlags("live-weather");
  assert.equal((await getWeatherProvider())?.id, "open-meteo");
  setFlags("mock-weather");
  assert.equal((await getWeatherProvider())?.id, "mock-weather");
  setFlags("live-weather,mock-weather");
  assert.equal((await getWeatherProvider())?.id, "open-meteo");
  setFlags("");
  assert.equal(await getWeatherProvider(), null);
});
