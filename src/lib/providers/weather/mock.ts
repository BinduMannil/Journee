import type { WeatherProvider } from "./types";
import type { ComfortInput } from "@/lib/intelligence/comfort";
import { isFeatureEnabled } from "@/lib/config/flags";

/**
 * Deterministic MOCK weather provider for local development and tests.
 *
 * Derives plausible conditions from latitude (warmer near the equator), a
 * seasonal term (hemisphere-aware), and coordinate-seeded variation — NO
 * network, fully deterministic. Clearly a mock: it is gated behind the
 * `mock-weather` flag and must never be presented as real observations. It
 * exists so the intelligence pipeline (weather → comfort → score) is
 * exercisable end-to-end before a live feed is wired.
 */
export const mockWeatherProvider: WeatherProvider = {
  id: "mock-weather",
  isAvailable: () => isFeatureEnabled("mock-weather"),
  fetchCurrent: async (lat: number, lon: number, now: Date = new Date()): Promise<ComfortInput> => {
    const southern = lat < 0;
    const month = now.getUTCMonth();
    const seasonal = 8 * Math.cos(((month - (southern ? 1 : 7)) / 12) * 2 * Math.PI);
    const temperatureC = Math.round(30 - 0.55 * Math.abs(lat) + seasonal);
    const humidityPct = Math.min(95, Math.max(20, Math.round(60 - 0.2 * Math.abs(lat) + 10 * Math.sin(lon))));
    const windKph = Math.abs(Math.round(10 + 15 * Math.sin(lat + lon)));
    const aqi = Math.abs(Math.round(40 + 30 * Math.cos(lon)));
    return { temperatureC, humidityPct, windKph, aqi };
  },
};
