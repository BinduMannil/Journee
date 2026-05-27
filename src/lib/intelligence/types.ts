/**
 * Shared intelligence contracts.
 *
 * Every intelligence engine (destination, events, disruption, weather, ...)
 * reduces its domain inputs to a set of normalized **signals**, then combines
 * them through the shared, explainable scoring core (scoring.ts). Weights are
 * VERSIONED CONFIG, never code constants, so scores are tunable, auditable, and
 * explainable. See docs/architecture/intelligence-engine-architecture.md and
 * ADR-006.
 *
 * Note on maturity: the scoring core and signal model are implemented and
 * testable today. The *data sources* that produce real signals (live weather,
 * event feeds, advisories) are roadmap; engines accept injected inputs so they
 * are exercisable without those integrations.
 */

/** A single normalized input to a score. `value` is 0..1, 1 = most favorable. */
export interface IntelligenceSignal {
  readonly key: string;
  readonly value: number;
  /** Optional human-readable rationale, surfaced in explanations. */
  readonly note?: string;
}

/** Versioned weighting configuration. Sourced from config/DB, not hardcoded. */
export interface ScoringWeights {
  readonly version: string;
  readonly weights: Readonly<Record<string, number>>;
  /** Applied to any signal key not present in `weights`. */
  readonly defaultWeight: number;
}

export interface ScoreContribution {
  readonly key: string;
  readonly value: number;
  readonly weight: number;
  readonly weighted: number;
  readonly note?: string;
}

/** An explainable score: the number plus exactly how it was derived. */
export interface IntelligenceScore {
  /** 0..100. */
  readonly score: number;
  /** 0..1 — proportion of expected signals actually present. */
  readonly confidence: number;
  readonly contributions: readonly ScoreContribution[];
  readonly weightsVersion: string;
}

/** Contract every engine implements. `TInput` is the engine's domain payload. */
export interface IntelligenceEngine<TInput> {
  readonly id: string;
  readonly name: string;
  /** Map domain input to normalized signals (pure). */
  toSignals(input: TInput): readonly IntelligenceSignal[];
}
