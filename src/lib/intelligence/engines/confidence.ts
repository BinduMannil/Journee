/**
 * Travel Confidence Engine (aggregate).
 *
 * Combines the scores of other engines (destination, events, disruption, ...)
 * into a single 0..100 travel-confidence value using versioned weights. Pure
 * and composable: it treats each sub-engine's normalized score as a signal, so
 * it reuses the shared scoring core. Overall `confidence` is the mean of the
 * inputs' confidences (i.e. how much real data backs the aggregate), not just
 * key coverage. See docs/architecture/intelligence-engine-architecture.md.
 */
import { score } from "../scoring";
import type { IntelligenceScore, ScoringWeights } from "../types";

export interface EngineResult {
  /** Stable key, e.g. "destination" | "events" | "disruption". */
  readonly key: string;
  readonly result: IntelligenceScore;
}

export function aggregateTravelConfidence(
  results: readonly EngineResult[],
  weights: ScoringWeights,
): IntelligenceScore {
  const base = score(
    results.map((r) => ({ key: r.key, value: r.result.score / 100 })),
    weights,
    results.map((r) => r.key),
  );
  const meanConfidence =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.result.confidence, 0) / results.length
      : 0;
  return { ...base, confidence: meanConfidence };
}
