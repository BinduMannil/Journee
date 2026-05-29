/**
 * Airport intelligence accessor (pure, no I/O).
 *
 * Reads the editorial airport seed data and exposes it per destination, with a
 * helper for the primary airport. Deterministic + unit-tested. Pair output with
 * `AIRPORTS_DATA_NOTE` (re-exported) so it reads as planning guidance.
 */
import {
  AIRPORTS_DATA_NOTE,
  airportsProfiles,
  type AirportInfo,
  type AirportsProfile,
} from "@/content/airports";

export { AIRPORTS_DATA_NOTE };
export type {
  AirportsProfile,
  AirportInfo,
  TransferMode,
  BoardingMethod,
  CityAccessMode,
} from "@/content/airports";

/** The airports serving a destination, or null when none is catalogued. */
export function getAirportsProfile(destinationId: string): AirportsProfile | null {
  return airportsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The primary (first-listed) airport for a destination, or null. */
export function primaryAirport(destinationId: string): AirportInfo | null {
  return getAirportsProfile(destinationId)?.airports[0] ?? null;
}
