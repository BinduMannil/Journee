import type { ReactNode } from "react";
import type { IntelligenceScore } from "@/lib/intelligence";
import { cn } from "./cn";

/**
 * Presentational renderer for any explainable `IntelligenceScore` (ADR-006):
 * the headline number, an honest confidence line (how many of the expected
 * signals were actually live, and the weights version), and the per-signal
 * contribution breakdown.
 *
 * Every intelligence engine emits the same `IntelligenceScore` shape, so this
 * one widget serves them all (atmosphere, safety, confidence, …). Pure props —
 * the caller computes the score; this only displays it.
 */
export function ScorePanel({
  score,
  label,
  totalSignals,
  note,
  className,
}: {
  readonly score: IntelligenceScore;
  /** Metric name shown beside the number, e.g. "atmosphere". */
  readonly label: string;
  /** Expected signal count, for the "N of M live signals" honesty line. */
  readonly totalSignals: number;
  /** Optional trailing explanation (e.g. which feeds are still roadmap). */
  readonly note?: ReactNode;
  readonly className?: string;
}) {
  const confidencePct = Math.round(score.confidence * 100);
  const liveSignals = score.contributions.length;

  return (
    <div className={cn(className)}>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-semibold text-gold-bright">
          {score.score}
        </span>
        <span className="text-sm uppercase tracking-[0.25em] text-stone">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm text-sand/60">
        Confidence {confidencePct}% — based on {liveSignals} of {totalSignals}{" "}
        live signals (weights {score.weightsVersion}).
        {note ? <> {note}</> : null}
      </p>
      <ul className="mt-4 space-y-1 text-sm text-sand/75">
        {score.contributions.map((c) => (
          <li key={c.key} className="flex justify-between gap-4">
            <span>{c.note ?? c.key}</span>
            <span className="text-stone">{Math.round(c.value * 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
