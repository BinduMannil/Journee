/**
 * Destination similarity (pure, no network).
 *
 * Ranks "if you liked X, try…" from the catalog's own attributes: shared mood
 * (the dominant driver), same country, and overlapping best-travel months. No
 * external model — deterministic and unit-tested. A learned embedding can later
 * produce the same `SimilarMatch[]` shape without changing consumers.
 */
import { monthDistance } from "./seasonality";

export interface SimilarLike {
  readonly id: string;
  readonly mood: string;
  readonly country: string;
  readonly bestMonths?: readonly number[];
}

export interface SimilarMatch {
  readonly id: string;
  /** 0..100 similarity to the target. */
  readonly score: number;
  /** Human-readable rationale, surfaced in the UI. */
  readonly reason: string;
}

const MOOD_WEIGHT = 0.6;
const COUNTRY_WEIGHT = 0.2;
const SEASON_WEIGHT = 0.2;

/** 0..1 seasonal overlap: 1 if any best months coincide, decaying with distance. */
function seasonOverlap(
  a: readonly number[] | undefined,
  b: readonly number[] | undefined,
): number {
  if (!a?.length || !b?.length) return 0;
  let best = Infinity;
  for (const m of a) for (const n of b) best = Math.min(best, monthDistance(m, n));
  if (best === Infinity) return 0;
  return Math.max(0, 1 - best / 6); // 0 distance → 1, 6 months apart → 0
}

/** Similarity 0..1 between two destinations. */
export function similarity(target: SimilarLike, other: SimilarLike): number {
  const mood = target.mood === other.mood ? 1 : 0;
  const country = target.country === other.country ? 1 : 0;
  const season = seasonOverlap(target.bestMonths, other.bestMonths);
  return mood * MOOD_WEIGHT + country * COUNTRY_WEIGHT + season * SEASON_WEIGHT;
}

function reasonFor(target: SimilarLike, other: SimilarLike): string {
  const parts: string[] = [];
  if (target.mood === other.mood) parts.push(`same ${other.mood.toLowerCase()} mood`);
  if (target.country === other.country) parts.push(`also in ${other.country}`);
  if (parts.length === 0 && seasonOverlap(target.bestMonths, other.bestMonths) > 0)
    parts.push("overlapping season");
  return parts.length > 0 ? parts.join(" · ") : "a different change of pace";
}

/**
 * Rank other destinations by similarity to `target` (desc, stable by id). The
 * target itself is always excluded. `limit` caps the result (default 3).
 */
export function similarDestinations(
  target: SimilarLike,
  all: readonly SimilarLike[],
  limit = 3,
): readonly SimilarMatch[] {
  return all
    .filter((d) => d.id !== target.id)
    .map((d): SimilarMatch => ({
      id: d.id,
      score: Math.round(similarity(target, d) * 100),
      reason: reasonFor(target, d),
    }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, Math.max(0, limit));
}
