/**
 * City vibe accessor (pure, no I/O).
 *
 * Reads the editorial city-vibe seed data and exposes it per destination, with a
 * small helper that flags a likely language barrier. Deterministic +
 * unit-tested. Pair output with `CITY_VIBE_NOTE` (re-exported) so it reads as a
 * generalization, not a verdict.
 */
import { CITY_VIBE_NOTE, cityVibes, type CityVibe } from "@/content/city-vibe";

export { CITY_VIBE_NOTE };
export type { CityVibe, TouristEase } from "@/content/city-vibe";

/** The vibe profile for a destination, or null when none is catalogued. */
export function getCityVibe(destinationId: string): CityVibe | null {
  return cityVibes.find((v) => v.destinationId === destinationId) ?? null;
}

/**
 * Whether a traveller should expect a language barrier: true when English is not
 * widely spoken and getting around is at least moderately involved. Null when
 * the destination isn't catalogued.
 */
export function expectLanguageBarrier(destinationId: string): boolean | null {
  const v = getCityVibe(destinationId);
  if (!v) return null;
  return !v.englishWidelySpoken && (v.touristEase === "moderate" || v.touristEase === "challenging");
}
