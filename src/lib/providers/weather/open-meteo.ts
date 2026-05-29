import { z } from "zod";
import type { WeatherProvider } from "./types";
import type { ComfortInput } from "@/lib/intelligence/comfort";
import { isFeatureEnabled } from "@/lib/config/flags";

/**
 * Open-Meteo live weather provider (keyless, free).
 *
 * Gated by the `live-weather` flag, so it is inert until deliberately enabled.
 * NOTE: it also needs the host (`api.open-meteo.com`) on the environment's
 * network allow-list — outbound egress to it is currently blocked, so this
 * adapter is verified against Open-Meteo's documented response shape (with a
 * mocked fetch) rather than a live call. See docs/runbooks/hosted-enablement.md.
 * Falls back to the mock/none via `getWeatherProvider` when not available.
 */
const ENDPOINT = "https://api.open-meteo.com/v1/forecast";
/** Abort a slow/hung upstream so it can't hang the request. */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Open-Meteo `current` block (defaults: °C, %, km/h — matching `ComfortInput`).
 * Humidity/wind are optional so a partial response still yields a usable score.
 */
const responseSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    relative_humidity_2m: z.number().optional(),
    wind_speed_10m: z.number().optional(),
  }),
});

/** Map a validated Open-Meteo response to `ComfortInput`, or throw on bad shape. */
export function parseOpenMeteo(json: unknown): ComfortInput {
  const { current } = responseSchema.parse(json);
  return {
    temperatureC: current.temperature_2m,
    humidityPct: current.relative_humidity_2m,
    windKph: current.wind_speed_10m,
  };
}

export const openMeteoWeatherProvider: WeatherProvider = {
  id: "open-meteo",
  isAvailable: () => isFeatureEnabled("live-weather"),
  fetchCurrent: async (lat: number, lon: number): Promise<ComfortInput> => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new Error(`Open-Meteo: non-finite coordinates (${lat}, ${lon})`);
    }
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
    });
    const url = `${ENDPOINT}?${params.toString()}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Open-Meteo API error ${res.status}`);
      return parseOpenMeteo(await res.json());
    } finally {
      clearTimeout(timer);
    }
  },
};
