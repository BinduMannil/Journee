/**
 * Best time to visit accessor (pure, no I/O).
 *
 * Reads the editorial best-time seed data and answers "when should I go" — the
 * full month-by-month assessment, a single month's verdict, and the months
 * rated "ideal". Deterministic + unit-tested. Pair output with
 * `BEST_TIME_DATA_NOTE` (re-exported) so it reads as general seasonality
 * guidance, not a forecast.
 */
import {
  BEST_TIME_DATA_NOTE,
  bestTimeProfiles,
  type BestTimeProfile,
  type MonthAssessment,
} from "@/content/best-time";

export { BEST_TIME_DATA_NOTE };
export type {
  BestTimeProfile,
  MonthAssessment,
  SeasonRating,
} from "@/content/best-time";

/** The best-time profile for a destination, or null when none is catalogued. */
export function getBestTimeProfile(destinationId: string): BestTimeProfile | null {
  return bestTimeProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** A single month's assessment (1..12), or null for an unknown destination or out-of-range month. */
export function monthAssessment(
  destinationId: string,
  month: number,
): MonthAssessment | null {
  return getBestTimeProfile(destinationId)?.months.find((m) => m.month === month) ?? null;
}

/** Month numbers rated "ideal" to visit ([] for unknown destination). */
export function idealMonths(destinationId: string): readonly number[] {
  return (
    getBestTimeProfile(destinationId)
      ?.months.filter((m) => m.rating === "ideal")
      .map((m) => m.month) ?? []
  );
}
