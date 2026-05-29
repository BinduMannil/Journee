/**
 * Rating aggregation (pure, no I/O).
 *
 * The shared core for user ratings & recommendations (restaurants, places, and
 * eventually posts/profiles). Beyond a naive average it computes a
 * **confidence-weighted (Bayesian) score** that shrinks toward a prior until
 * enough ratings accumulate — so "one five-star review" doesn't outrank a
 * well-reviewed favourite. Prior + scale are versioned CONFIG (`rating-v1`),
 * mirroring the scoring-weights seam (ADR-006). Deterministic + unit-tested.
 *
 * This is the algorithm only. Persisting user ratings and surfacing them needs
 * auth + storage + UI, which are out of scope here (see docs/roadmap.md).
 */

export interface RatingModel {
  readonly version: string;
  /** Prior mean the weighted score shrinks toward with few ratings. */
  readonly priorMean: number;
  /** Strength of the prior, in "virtual ratings" (higher = more shrinkage). */
  readonly priorWeight: number;
  /** Top of the rating scale (e.g. 5). Values are clamped to [0, scaleMax]. */
  readonly scaleMax: number;
}

export const ratingModelV1: RatingModel = {
  version: "rating-v1",
  priorMean: 3.5,
  priorWeight: 5,
  scaleMax: 5,
};

export interface RatingAggregate {
  readonly version: string;
  /** Number of valid ratings counted. */
  readonly count: number;
  /** Naive arithmetic mean (0 when there are no ratings). */
  readonly mean: number;
  /** Confidence-weighted (Bayesian) score: (sum + priorMean·priorWeight) / (n + priorWeight). */
  readonly weighted: number;
  /** 0..1 — how much real signal backs the score: n / (n + priorWeight). */
  readonly confidence: number;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/**
 * Aggregate raw rating values into count + mean + weighted score + confidence.
 * Non-finite values are ignored; finite values are clamped to [0, scaleMax].
 * With zero ratings, `mean` is 0, `weighted` equals the prior mean, and
 * `confidence` is 0 — an honest "we don't really know yet".
 */
export function aggregateRatings(
  values: readonly number[],
  model: RatingModel = ratingModelV1,
): RatingAggregate {
  const valid = values
    .filter((v) => Number.isFinite(v))
    .map((v) => clamp(v, 0, model.scaleMax));
  const count = valid.length;
  const sum = valid.reduce((a, b) => a + b, 0);
  const mean = count > 0 ? sum / count : 0;
  const weighted = (sum + model.priorMean * model.priorWeight) / (count + model.priorWeight);
  const confidence = count / (count + model.priorWeight);
  return {
    version: model.version,
    count,
    mean: round2(mean),
    weighted: round2(weighted),
    confidence: round2(confidence),
  };
}

export interface RatedItem {
  readonly id: string;
  readonly ratings: readonly number[];
}

export interface RankedItem {
  readonly id: string;
  readonly aggregate: RatingAggregate;
}

/**
 * Rank items by their weighted rating (descending), tie-breaking by confidence
 * then id for determinism. Uses the weighted score so sparsely-rated items don't
 * unfairly top well-reviewed ones.
 */
export function rankByRating(
  items: readonly RatedItem[],
  model: RatingModel = ratingModelV1,
): readonly RankedItem[] {
  return items
    .map((it) => ({ id: it.id, aggregate: aggregateRatings(it.ratings, model) }))
    .sort((a, b) => {
      if (b.aggregate.weighted !== a.aggregate.weighted) return b.aggregate.weighted - a.aggregate.weighted;
      if (b.aggregate.confidence !== a.aggregate.confidence) return b.aggregate.confidence - a.aggregate.confidence;
      return a.id.localeCompare(b.id);
    });
}
