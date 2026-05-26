import type { WeatherProvider } from "./types";
import { mockWeatherProvider } from "./mock";
import { comfortScore } from "@/lib/intelligence/comfort";

/**
 * Weather provider selection + the destination comfort signal.
 *
 * Today only the mock provider exists (flag-gated). A live provider would be
 * registered here ahead of the mock. Returns null when no provider is
 * available so callers render no weather signal rather than fabricating one.
 */
const providers: readonly WeatherProvider[] = [mockWeatherProvider];

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
