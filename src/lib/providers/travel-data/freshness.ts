/**
 * Pure freshness, confidence and source-quality helpers (no I/O).
 *
 * These are the backend rules that decide whether travel data is still
 * trustworthy, how to rank competing sources, and how to classify the quality
 * of a provider result. Kept pure + deterministic so they are fully unit
 * testable and reusable across every travel-data contract.
 */
import type { SourceMetadata, SourceType } from "./source";
import { clampConfidence } from "./source";

/** Coarse freshness state derived from a source's timestamps. */
export type FreshnessState = "fresh" | "stale" | "unknown";

/** Categorical confidence band, derived from a normalized confidence score. */
export type ConfidenceLevel = "high" | "medium" | "low";

/** Quality classification of a provider result, for routing/display decisions. */
export type ResultQuality = "high" | "medium" | "low" | "none";

/**
 * Compute freshness from a source's `expiresAt`/`fetchedAt`.
 * - `unknown` when there is no expiry to compare against.
 * - `fresh` when now is at/before expiry.
 * - `stale` when now is past expiry.
 */
export function computeFreshness(
  source: Pick<SourceMetadata, "fetchedAt" | "expiresAt">,
  now: Date = new Date(),
): FreshnessState {
  if (!source.expiresAt) return "unknown";
  const expires = new Date(source.expiresAt).getTime();
  if (Number.isNaN(expires)) return "unknown";
  return now.getTime() <= expires ? "fresh" : "stale";
}

/** True when a source has a known expiry that is now in the past. */
export function isStale(
  source: Pick<SourceMetadata, "fetchedAt" | "expiresAt">,
  now: Date = new Date(),
): boolean {
  return computeFreshness(source, now) === "stale";
}

/** Clamp/normalize a raw confidence value into 0..1 (NaN → 0). */
export function normalizeConfidence(raw: number): number {
  return clampConfidence(raw);
}

/** Map a normalized confidence score to a coarse band. */
export function confidenceLevel(score: number): ConfidenceLevel {
  const c = normalizeConfidence(score);
  if (c >= 0.7) return "high";
  if (c >= 0.4) return "medium";
  return "low";
}

/**
 * Relative trust weighting per source type. Live data is most trusted; seed and
 * mock are stand-ins; stale/unavailable rank lowest so they sink in ranking.
 */
const SOURCE_TYPE_RANK: Readonly<Record<SourceType, number>> = {
  live: 4,
  seed: 3,
  mock: 2,
  stale: 1,
  unavailable: 0,
};

/**
 * Effective source type after applying freshness: a `live`/`seed`/`mock` source
 * whose data has expired is reported as `stale`. Lets ranking and quality
 * classification react to age without mutating the original metadata.
 */
export function effectiveSourceType(
  source: SourceMetadata,
  now: Date = new Date(),
): SourceType {
  if (source.sourceType === "unavailable") return "unavailable";
  return isStale(source, now) ? "stale" : source.sourceType;
}

/**
 * Rank sources best-first. Orders by effective source type, then confidence,
 * then most-recent `fetchedAt`. Pure: returns a new array, input untouched.
 */
export function rankSources(
  sources: readonly SourceMetadata[],
  now: Date = new Date(),
): readonly SourceMetadata[] {
  return [...sources].sort((a, b) => {
    const typeDelta =
      SOURCE_TYPE_RANK[effectiveSourceType(b, now)] -
      SOURCE_TYPE_RANK[effectiveSourceType(a, now)];
    if (typeDelta !== 0) return typeDelta;
    const confDelta = b.confidence - a.confidence;
    if (confDelta !== 0) return confDelta;
    const aTime = a.fetchedAt ? new Date(a.fetchedAt).getTime() : 0;
    const bTime = b.fetchedAt ? new Date(b.fetchedAt).getTime() : 0;
    return bTime - aTime;
  });
}

/**
 * Classify the quality of a source for downstream routing/display:
 * - `none` — unavailable source (no usable data).
 * - otherwise blend effective source type with the confidence band.
 *
 * Stale data is demoted by one band; an unknown-freshness seed/mock keeps its
 * confidence band. This is the single place "is this good enough?" is decided.
 */
export function classifySourceQuality(
  source: SourceMetadata,
  now: Date = new Date(),
): ResultQuality {
  const effective = effectiveSourceType(source, now);
  if (effective === "unavailable") return "none";

  const band = confidenceLevel(source.confidence);
  if (effective === "stale") {
    // Demote one band; never report stale data as high quality.
    return band === "high" ? "medium" : band === "medium" ? "low" : "low";
  }
  return band;
}
