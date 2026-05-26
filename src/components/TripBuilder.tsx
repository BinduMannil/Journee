"use client";

import { useMemo, useState } from "react";
import { buildItinerary, type Pacing } from "@/lib/intelligence/itinerary";

export interface PlannableDestination {
  readonly id: string;
  readonly name: string;
  readonly mood: string;
  readonly intensity: number;
}

const PACINGS: Pacing[] = ["relaxed", "balanced", "packed"];

/**
 * Trip planner: pick destinations and a pace; see a fatigue-aware day-by-day
 * plan built by the dynamic-itinerary engine (pure `buildItinerary`). Intensity
 * comes from config (mood → intensity), not hardcoded here.
 */
export function TripBuilder({ destinations }: { destinations: readonly PlannableDestination[] }) {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [pacing, setPacing] = useState<Pacing>("balanced");

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const itinerary = useMemo(() => {
    const items = destinations
      .filter((d) => selected.includes(d.id))
      .map((d) => ({ id: d.id, title: d.name, intensity: d.intensity }));
    return buildItinerary(items, pacing);
  }, [destinations, selected, pacing]);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">Choose places</p>
        <ul className="space-y-2">
          {destinations.map((d) => (
            <li key={d.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-sand/15 px-4 py-3 hover:border-gold/40">
                <input
                  type="checkbox"
                  checked={selected.includes(d.id)}
                  onChange={() => toggle(d.id)}
                  className="accent-gold"
                />
                <span className="text-sand">{d.name}</span>
                <span className="ml-auto text-xs uppercase tracking-[0.2em] text-stone">
                  {d.mood}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          {PACINGS.map((p) => (
            <button
              key={p}
              onClick={() => setPacing(p)}
              aria-pressed={pacing === p}
              className={
                pacing === p
                  ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
                  : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 hover:border-gold/50"
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Your plan</p>
          {itinerary.days.length > 0 && (
            <p className="text-xs uppercase tracking-[0.2em] text-stone">
              {itinerary.days.length}{" "}
              {itinerary.days.length === 1 ? "day" : "days"} · {itinerary.pacing} ·
              budget {itinerary.budget}/day
            </p>
          )}
        </div>
        {itinerary.days.length === 0 ? (
          <p className="text-sand/60">Select destinations to build a paced itinerary.</p>
        ) : (
          <ol className="space-y-4">
            {itinerary.days.map((day, i) => {
              const fill = Math.min(100, Math.round((day.load / itinerary.budget) * 100));
              return (
                <li key={i} className="rounded-2xl border border-sand/10 p-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="font-display text-2xl text-sand">Day {i + 1}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone">
                      load {day.load} / {itinerary.budget}
                    </span>
                  </div>
                  <div
                    className="mb-3 h-1 overflow-hidden rounded-full bg-sand/10"
                    role="meter"
                    aria-valuenow={day.load}
                    aria-valuemin={0}
                    aria-valuemax={itinerary.budget}
                    aria-label={`Day ${i + 1} intensity load`}
                  >
                    <div className="h-full bg-gold" style={{ width: `${fill}%` }} />
                  </div>
                  <ul className="text-sand/80">
                    {day.items.map((it) => (
                      <li key={it.id}>{it.title}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
