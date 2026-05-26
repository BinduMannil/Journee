/**
 * Explainable weighted-scoring core (pure).
 *
 * Combines normalized signals (0..1) using versioned weights into a 0..100
 * score, returning the full breakdown of contributions plus a confidence
 * derived from signal coverage. Deterministic and unit-testable; no I/O.
 *
 * Why explainability is first-class: per the no-hardcoding/auditability policy,
 * a score must always be able to answer "why this number?" — so we return
 * contributions and the weights version alongside the value.
 */
import type {
  IntelligenceScore,
  IntelligenceSignal,
  ScoreContribution,
  ScoringWeights,
} from "./types";

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function score(
  signals: readonly IntelligenceSignal[],
  weights: ScoringWeights,
  /** Keys expected for full confidence; defaults to the provided signal keys. */
  expectedKeys?: readonly string[],
): IntelligenceScore {
  const contributions: ScoreContribution[] = signals.map((s) => {
    const weight = weights.weights[s.key] ?? weights.defaultWeight;
    const value = clamp01(s.value);
    return {
      key: s.key,
      value,
      weight,
      weighted: value * weight,
      note: s.note,
    };
  });

  const totalWeight = contributions.reduce((sum, c) => sum + c.weight, 0);
  const weightedSum = contributions.reduce((sum, c) => sum + c.weighted, 0);
  const normalized = totalWeight > 0 ? weightedSum / totalWeight : 0;

  const expected = expectedKeys ?? signals.map((s) => s.key);
  const present = new Set(signals.map((s) => s.key));
  const confidence =
    expected.length > 0
      ? expected.filter((k) => present.has(k)).length / expected.length
      : 0;

  return {
    score: Math.round(normalized * 100),
    confidence,
    contributions,
    weightsVersion: weights.version,
  };
}
