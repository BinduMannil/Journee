/**
 * Score explanation (pure, no I/O).
 *
 * Turns an `IntelligenceScore` (which already carries its full contribution
 * breakdown) into a ranked, human-readable explanation: which signals drove the
 * number most (their share of the weighted total), what's boosting vs. dragging
 * it, and a one-line summary. This is the "why this ranking?" view required by
 * the explainability-first policy (see scoring.ts / ADR-006). Deterministic +
 * unit-tested.
 */
import type { IntelligenceScore } from "./types";

export type DriverImpact = "boosts" | "drags" | "neutral";

export interface ExplainedContribution {
  readonly key: string;
  /** 0..1 normalized signal value. */
  readonly value: number;
  readonly weight: number;
  /** value * weight (raw contribution before normalization). */
  readonly weighted: number;
  /** This contribution's share of the total weighted sum, 0..1. */
  readonly share: number;
  /** Whether the signal value pulls the score up, down, or is middling. */
  readonly impact: DriverImpact;
  readonly note?: string;
}

export interface ScoreExplanation {
  readonly score: number;
  readonly confidence: number;
  readonly weightsVersion: string;
  /** Contributions sorted by descending share (then key for stability). */
  readonly drivers: readonly ExplainedContribution[];
  /** Largest positive contributor (by share), or null when no signals. */
  readonly topDriver: ExplainedContribution | null;
  /** Lowest-value present signal — "what's holding it back" — or null. */
  readonly weakest: ExplainedContribution | null;
  readonly summary: string;
}

/** Value at/above which a signal is read as boosting the score. */
const BOOST_AT = 0.66;
/** Value at/below which a signal is read as dragging the score. */
const DRAG_AT = 0.33;

function impactOf(value: number): DriverImpact {
  if (value >= BOOST_AT) return "boosts";
  if (value <= DRAG_AT) return "drags";
  return "neutral";
}

const pct = (n: number): number => Math.round(n * 100);

export function explainScore(score: IntelligenceScore): ScoreExplanation {
  const totalWeighted = score.contributions.reduce((sum, c) => sum + c.weighted, 0);

  const drivers: ExplainedContribution[] = score.contributions
    .map((c) => ({
      key: c.key,
      value: c.value,
      weight: c.weight,
      weighted: c.weighted,
      share: totalWeighted > 0 ? c.weighted / totalWeighted : 0,
      impact: impactOf(c.value),
      ...(c.note !== undefined ? { note: c.note } : {}),
    }))
    .sort((a, b) => b.share - a.share || a.key.localeCompare(b.key));

  const topDriver = drivers[0] ?? null;
  const weakest =
    drivers.length > 0
      ? [...drivers].sort((a, b) => a.value - b.value || a.key.localeCompare(b.key))[0]!
      : null;

  const summary = buildSummary(score, drivers.length, topDriver, weakest);

  return {
    score: score.score,
    confidence: score.confidence,
    weightsVersion: score.weightsVersion,
    drivers,
    topDriver,
    weakest,
    summary,
  };
}

function buildSummary(
  score: IntelligenceScore,
  driverCount: number,
  top: ExplainedContribution | null,
  weakest: ExplainedContribution | null,
): string {
  if (driverCount === 0 || top === null) {
    return `Scored ${score.score}/100, but no signals were available to explain it (${score.weightsVersion}).`;
  }
  const parts = [
    `Scored ${score.score}/100 at ${pct(score.confidence)}% confidence (${score.weightsVersion}).`,
    `The strongest contributor is "${top.key}" (${pct(top.share)}% of the weighted total).`,
  ];
  if (weakest && weakest.key !== top.key && weakest.impact === "drags") {
    parts.push(`"${weakest.key}" is the weakest signal at ${weakest.value.toFixed(2)}, holding the score down.`);
  }
  return parts.join(" ");
}
