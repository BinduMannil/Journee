"use client";

import { useMemo, useState } from "react";
import { DestinationCard } from "./DestinationCard";
import type { Destination } from "@/content/destinations";

/**
 * Mood-first discovery: filter the destination grid by mood. Moods are derived
 * from the data (no hardcoded list), so the filters grow with the catalog. A
 * first concrete step toward the Pathfinder discovery engine.
 */
const ALL = "All";

export function DestinationExplorer({
  destinations,
}: {
  destinations: readonly Destination[];
}) {
  const moods = useMemo(
    () => [ALL, ...Array.from(new Set(destinations.map((d) => d.mood))).sort()],
    [destinations],
  );
  const [active, setActive] = useState<string>(ALL);

  const visible =
    active === ALL ? destinations : destinations.filter((d) => d.mood === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => setActive(mood)}
            aria-pressed={active === mood}
            className={
              active === mood
                ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
                : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 transition-colors hover:border-gold/50 hover:text-gold-bright"
            }
          >
            {mood}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {visible.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
