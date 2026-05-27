"use client";

import { useEffect, useState } from "react";
import { solarAltitudeDeg, lightPhase, type LightPhase } from "@/lib/intelligence/solar";

/**
 * Live atmospheric signal: shows the current light phase at a destination,
 * computed client-side from real coordinates + the live clock (real solar math,
 * no network). Updates over time. This is a genuine, honest intelligence
 * signal — not fabricated data.
 */
const LABELS: Record<LightPhase, string> = {
  night: "Night",
  golden: "Golden hour",
  daylight: "Daylight",
};

export function LightBadge({ lat, lon }: { lat: number; lon: number }) {
  const [phase, setPhase] = useState<LightPhase | null>(null);

  useEffect(() => {
    const update = () => setPhase(lightPhase(solarAltitudeDeg(new Date(), lat, lon)));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [lat, lon]);

  if (phase === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sand/90 backdrop-blur-sm"
      title="Live light phase, computed from local solar position"
    >
      <span
        aria-hidden
        className={
          phase === "golden"
            ? "h-1.5 w-1.5 rounded-full bg-gold-bright"
            : phase === "daylight"
              ? "h-1.5 w-1.5 rounded-full bg-sand"
              : "h-1.5 w-1.5 rounded-full bg-stone"
        }
      />
      {LABELS[phase]}
    </span>
  );
}
