/**
 * Shared source-attribution model for travel-data providers.
 *
 * Every travel-data response carries a `SourceMetadata` describing where the
 * data came from, how confident we are in it, and when it was fetched / when it
 * expires. This is the seam that lets the system stay HONEST: a seed/mock
 * response is labeled as such and is never presentable as a live observation.
 *
 * `sourceType` captures both the declared nature of a source (`seed`, `mock`,
 * `live`) and runtime states derived from freshness (`stale`, `unavailable`).
 * See docs/architecture/provider-architecture.md.
 */

/** Full set of source states, including runtime-derived ones. */
export type SourceType = "seed" | "mock" | "live" | "stale" | "unavailable";

/**
 * The subset a provider may *declare* about itself. Runtime states (`stale`,
 * `unavailable`) are computed from freshness/availability, never declared.
 */
export type ProviderSourceClass = Extract<SourceType, "seed" | "mock" | "live">;

export interface SourceMetadata {
  /** Human-readable source name, e.g. "Journee Seed Catalog". */
  readonly sourceName: string;
  /** Declared/derived nature of the source. */
  readonly sourceType: SourceType;
  /** Stable id of the provider that produced this data. */
  readonly providerId: string;
  /** 0..1 — how much real signal backs this data (normalized). */
  readonly confidence: number;
  /** ISO timestamp the data was produced/fetched, when known. */
  readonly fetchedAt?: string;
  /** ISO timestamp after which the data should be treated as stale, when known. */
  readonly expiresAt?: string;
  /** Public attribution URL, where the source provides one. */
  readonly attributionUrl?: string;
}

export interface SourceMetadataInput {
  readonly sourceName: string;
  readonly sourceType: ProviderSourceClass;
  readonly providerId: string;
  readonly confidence: number;
  readonly fetchedAt?: Date | string;
  /** Time-to-live in milliseconds; sets `expiresAt = fetchedAt + ttlMs`. */
  readonly ttlMs?: number;
  readonly attributionUrl?: string;
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Build a `SourceMetadata`, deriving `expiresAt` from an optional TTL.
 * Confidence is clamped into 0..1 so callers cannot smuggle out-of-range values.
 */
export function makeSourceMetadata(input: SourceMetadataInput): SourceMetadata {
  const fetchedAt = input.fetchedAt ? toIso(input.fetchedAt) : undefined;
  let expiresAt: string | undefined;
  if (input.ttlMs !== undefined && fetchedAt) {
    expiresAt = new Date(new Date(fetchedAt).getTime() + input.ttlMs).toISOString();
  }
  return {
    sourceName: input.sourceName,
    sourceType: input.sourceType,
    providerId: input.providerId,
    confidence: clampConfidence(input.confidence),
    fetchedAt,
    expiresAt,
    attributionUrl: input.attributionUrl,
  };
}

/** Metadata for an unavailable source — confidence is always 0. */
export function unavailableSource(
  providerId: string,
  sourceName: string,
): SourceMetadata {
  return {
    sourceName,
    sourceType: "unavailable",
    providerId,
    confidence: 0,
  };
}

/**
 * Clamp an arbitrary number into the 0..1 confidence range. `NaN` → 0;
 * `±Infinity` clamp to the bounds via min/max (+∞ → 1, -∞ → 0).
 */
export function clampConfidence(raw: number): number {
  if (Number.isNaN(raw)) return 0;
  return Math.min(1, Math.max(0, raw));
}
