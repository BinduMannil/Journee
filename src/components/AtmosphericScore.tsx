"use client";

import { useEffect, useState } from "react";
import {
  score,
  destinationEngine,
  destinationWeights,
  DESTINATION_SIGNAL_KEYS,
  type IntelligenceScore,
} from "@/lib/intelligence";
import { solarAltitudeDeg, goldenHourProximity } from "@/lib/intelligence/solar";

/**
 * Runs the destination engine + scoring core on a *real* live input (golden-hour
 * proximity from solar position) and renders the explainable result. Crucially,
 * it shows honest confidence: only 1 of the engine's 5 signals has live data
 * today, so confidence is ~20% and that is displayed, not hidden. This is the
 * explainability contract (ADR-006) made visible.
 */
export function AtmosphericScore({ lat, lon }: { lat: number; lon: number }) {
  const [result, setResult] = useState<IntelligenceScore | null>(null);

  useEffect(() => {
    const compute = () => {
      const altitude = solarAltitudeDeg(new Date(), lat, lon);
      const signals = destinationEngine.toSignals({
        goldenHourProximity: goldenHourProximity(altitude),
      });
      setResult(score(signals, destinationWeights, [...DESTINATION_SIGNAL_KEYS]));
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [lat, lon]);

  if (!result) return null;

  const confidencePct = Math.round(result.confidence * 100);
  const liveSignals = result.contributions.length;

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-semibold text-gold-bright">
          {result.score}
        </span>
        <span className="text-sm uppercase tracking-[0.25em] text-stone">
          atmosphere
        </span>
      </div>
      <p className="mt-2 text-sm text-sand/60">
        Confidence {confidencePct}% — based on {liveSignals} of{" "}
        {DESTINATION_SIGNAL_KEYS.length} live signals (weights{" "}
        {result.weightsVersion}). More signals arrive as weather, crowd, and
        seasonal feeds are wired.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-sand/75">
        {result.contributions.map((c) => (
          <li key={c.key} className="flex justify-between gap-4">
            <span>{c.note ?? c.key}</span>
            <span className="text-stone">{Math.round(c.value * 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
