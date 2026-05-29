/**
 * Seasonality model (pure, no network).
 *
 * Turns a destination's structured `bestMonths` (1–12) into a 0..1 suitability
 * score for any given month, and ranks destinations for "where to go this
 * month". Deterministic and unit-tested; no I/O. Months wrap cyclically so
 * December is adjacent to January.
 *
 * This is editorial guidance derived from each destination's `bestTime` prose,
 * not a live climate feed — a weather/seasonality data source can later replace
 * the static `bestMonths` without changing this logic or its consumers.
 */

export interface SeasonalLike {
  readonly id: string;
  /** Recommended months 1–12. */
  readonly bestMonths?: readonly number[];
}

export interface SeasonMatch {
  readonly id: string;
  /** 0..100 suitability for the queried month. */
  readonly score: number;
  /** `true` when the month is squarely in the recommended window. */
  readonly inSeason: boolean;
}

/** Smallest cyclic distance between two months (1–12). 0..6. */
export function monthDistance(a: number, b: number): number {
  const raw = Math.abs(a - b) % 12;
  return Math.min(raw, 12 - raw);
}

/**
 * 0..1 suitability of `month` (1–12) for a destination's best months:
 * 1 in season, 0.5 in the adjacent shoulder month, else a low baseline. With no
 * structured guidance, returns a neutral 0.5 rather than pretending to know.
 */
export function monthSuitability(
  bestMonths: readonly number[] | undefined,
  month: number,
): number {
  if (!bestMonths || bestMonths.length === 0) return 0.5;
  const nearest = Math.min(...bestMonths.map((m) => monthDistance(m, month)));
  if (nearest === 0) return 1;
  if (nearest === 1) return 0.5;
  return 0.15;
}

/** Whether a month falls within the recommended window. */
export function isInSeason(
  bestMonths: readonly number[] | undefined,
  month: number,
): boolean {
  return !!bestMonths && bestMonths.includes(month);
}

/** Rank destinations by suitability for a given month (desc, stable by id). */
export function rankForMonth(
  destinations: readonly SeasonalLike[],
  month: number,
): readonly SeasonMatch[] {
  return [...destinations]
    .map((d): SeasonMatch => ({
      id: d.id,
      score: Math.round(monthSuitability(d.bestMonths, month) * 100),
      inSeason: isInSeason(d.bestMonths, month),
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
