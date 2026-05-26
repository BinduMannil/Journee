"use client";

import { useEffect, useState } from "react";
import {
  score,
  aggregateTravelConfidence,
  destinationEngine,
  destinationWeights,
  DESTINATION_SIGNAL_KEYS,
  eventEngine,
  eventWeights,
  disruptionEngine,
  disruptionWeights,
  travelConfidenceWeights,
  type IntelligenceScore,
} from "@/lib/intelligence";
import { mockEventContext, mockDisruptionContext } from "@/lib/intelligence/mock";
import { solarAltitudeDeg, goldenHourProximity } from "@/lib/intelligence/solar";

interface Computed {
  overall: IntelligenceScore;
  parts: { key: string; result: IntelligenceScore }[];
}

/**
 * Gated preview (flag `mock-intelligence`) that runs the engines through the
 * Travel Confidence aggregate. The destination/light signal is REAL (solar);
 * events + disruption use clearly-labeled SAMPLE data, so this is honestly
 * marked "preview" — it demonstrates the explainable aggregate, not live intel.
 */
export function TravelReadiness({
  destinationId,
  lat,
  lon,
}: {
  destinationId: string;
  lat: number;
  lon: number;
}) {
  const [computed, setComputed] = useState<Computed | null>(null);

  useEffect(() => {
    const run = () => {
      const altitude = solarAltitudeDeg(new Date(), lat, lon);
      const destination = score(
        destinationEngine.toSignals({ goldenHourProximity: goldenHourProximity(altitude) }),
        destinationWeights,
        [...DESTINATION_SIGNAL_KEYS],
      );
      const events = score(eventEngine.toSignals(mockEventContext(destinationId)), eventWeights);
      const disruption = score(
        disruptionEngine.toSignals(mockDisruptionContext(destinationId)),
        disruptionWeights,
      );
      const parts = [
        { key: "destination", result: destination },
        { key: "events", result: events },
        { key: "disruption", result: disruption },
      ];
      setComputed({ overall: aggregateTravelConfidence(parts, travelConfidenceWeights), parts });
    };
    run();
    const id = setInterval(run, 60_000);
    return () => clearInterval(id);
  }, [destinationId, lat, lon]);

  if (!computed) return null;

  return (
    <div className="mt-12 rounded-2xl border border-sand/10 p-7">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Travel readiness</p>
        <span className="rounded-full border border-sand/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-stone">
          Preview · sample signals
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-semibold text-gold-bright">
          {computed.overall.score}
        </span>
        <span className="text-sm uppercase tracking-[0.25em] text-stone">
          confidence {Math.round(computed.overall.confidence * 100)}%
        </span>
      </div>
      <ul className="mt-4 space-y-1 text-sm text-sand/75">
        {computed.parts.map((p) => (
          <li key={p.key} className="flex justify-between gap-4">
            <span className="capitalize">{p.key}</span>
            <span className="text-stone">{p.result.score}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-sand/50">
        Light is real (solar position); events &amp; disruption are sample data
        until live feeds are wired.
      </p>
    </div>
  );
}
