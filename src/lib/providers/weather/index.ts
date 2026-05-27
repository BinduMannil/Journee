import type { WeatherProvider } from "./types";
import { openMeteoWeatherProvider } from "./open-meteo";
import { mockWeatherProvider } from "./mock";
import { comfortScore } from "@/lib/intelligence/comfort";

/**
 * Weather provider selection + the destination comfort signal.
 *
 * The live Open-Meteo provider is preferred (gated by the `live-weather` flag +
 * an allow-listed host), falling back to the deterministic mock (`mock-weather`
 * flag) and then to null — so callers render no weather signal rather than
 * fabricating one. To add a vendor, implement `WeatherProvider` and list it in
 * priority order here.
 */
const providers: readonly WeatherProvider[] = [
  openMeteoWeatherProvider,
  mockWeatherProvider,
];

export async function getWeatherProvider(): Promise<WeatherProvider | null> {
  for (const p of providers) {
    if (await p.isAvailable()) return p;
  }
  return null;
}

export interface ComfortResult {
  readonly providerId: string;
  readonly comfort: number;
}

/** 0..1 comfort for a coordinate, or null when no weather provider is available. */
export async function getDestinationComfort(
  lat: number,
  lon: number,
  now?: Date,
): Promise<ComfortResult | null> {
  const provider = await getWeatherProvider();
  if (!provider) return null;
  const input = await provider.fetchCurrent(lat, lon, now);
  return { providerId: provider.id, comfort: comfortScore(input) };
}
