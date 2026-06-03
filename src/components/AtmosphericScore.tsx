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
import { ScorePanel } from "@/components/ui";

/**
 * Runs the destination engine + scoring core on a *real* live input (golden-hour
 * proximity from solar position) and renders the explainable result via the
 * shared `ScorePanel`. Crucially, it shows honest confidence: only 1 of the
 * engine's 5 signals has live data today, so confidence is ~20% and that is
 * displayed, not hidden. This is the explainability contract (ADR-006) made
 * visible.
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

  return (
    <ScorePanel
      score={result}
      label="atmosphere"
      totalSignals={DESTINATION_SIGNAL_KEYS.length}
      note="More signals arrive as weather, crowd, and seasonal feeds are wired."
    />
  );
}
