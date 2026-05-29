/**
 * Day trips & excursions accessor (pure, no I/O).
 *
 * Reads the editorial day-trips seed data and answers "what's within reach of
 * here" and "what trips of a given type exist". Deterministic + unit-tested.
 * Pair output with `DAY_TRIPS_DATA_NOTE` (re-exported) so travel times read as
 * approximate, never as a live transit/tour feed.
 */
import {
  DAY_TRIPS_DATA_NOTE,
  dayTripsProfiles,
  type DayTrip,
  type DayTripType,
  type DayTripsProfile,
} from "@/content/day-trips";

export { DAY_TRIPS_DATA_NOTE };
export type { DayTripsProfile, DayTrip, DayTripType } from "@/content/day-trips";

/** The day-trips profile for a destination, or null when none is catalogued. */
export function getDayTrips(destinationId: string): DayTripsProfile | null {
  return dayTripsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Day trips tagged with a given type ([] for unknown destination/type). */
export function dayTripsByType(
  destinationId: string,
  type: DayTripType,
): readonly DayTrip[] {
  return getDayTrips(destinationId)?.trips.filter((t) => t.types.includes(type)) ?? [];
}
