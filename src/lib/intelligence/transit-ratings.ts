/**
 * Airport & airline ratings accessor (pure, no I/O).
 *
 * Reads the editorial transit ratings seed data and exposes airport service
 * ratings (by IATA code or destination) and airline ratings (by name, per cabin
 * class), plus an `overallScore` (mean of the four dimensions). Deterministic +
 * unit-tested. Pair output with `TRANSIT_RATINGS_NOTE` (re-exported).
 */
import {
  TRANSIT_RATINGS_NOTE,
  airportServiceRatings,
  airlineRatings,
  type AirlineRating,
  type AirportServiceRating,
  type CabinClass,
  type DimensionRatings,
} from "@/content/transit-ratings";

export { TRANSIT_RATINGS_NOTE };
export type {
  AirportServiceRating,
  AirlineRating,
  AirlineClassRating,
  DimensionRatings,
  ServiceDimension,
  CabinClass,
} from "@/content/transit-ratings";

/** Mean of the four service dimensions, 0..5 (rounded to 2 dp). */
export function overallScore(ratings: DimensionRatings): number {
  const mean = (ratings.staff + ratings.cleanliness + ratings.comfort + ratings.value) / 4;
  return Math.round(mean * 100) / 100;
}

/** Airport service rating by IATA code, or null. */
export function getAirportServiceRating(code: string): AirportServiceRating | null {
  return airportServiceRatings.find((a) => a.code === code) ?? null;
}

/** All airport service ratings for a destination ([] when none). */
export function airportRatingsForDestination(destinationId: string): readonly AirportServiceRating[] {
  return airportServiceRatings.filter((a) => a.destinationId === destinationId);
}

/** Airline rating by name or IATA code (case-insensitive), or null. */
export function getAirlineRating(nameOrIata: string): AirlineRating | null {
  const q = nameOrIata.trim().toLowerCase();
  return (
    airlineRatings.find((a) => a.name.toLowerCase() === q || a.iata.toLowerCase() === q) ?? null
  );
}

/** The ratings for a specific cabin class of an airline, or null. */
export function airlineClassRatings(
  nameOrIata: string,
  cabin: CabinClass,
): DimensionRatings | null {
  return getAirlineRating(nameOrIata)?.byClass.find((c) => c.cabin === cabin)?.ratings ?? null;
}
