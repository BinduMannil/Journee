import type { ComfortInput } from "@/lib/intelligence/comfort";

/**
 * Weather provider contract.
 *
 * Weather is parameterized by coordinate (not a single global capability), so
 * it has its own small contract rather than going through the registry. Any
 * real adapter (e.g. Open-Meteo, once egress is permitted) implements this
 * exact shape, so swapping the mock for a live source is a drop-in. Returns the
 * `ComfortInput` the pure comfort scorer consumes.
 */
export interface WeatherProvider {
  readonly id: string;
  isAvailable(): boolean | Promise<boolean>;
  fetchCurrent(lat: number, lon: number, now?: Date): Promise<ComfortInput>;
}
