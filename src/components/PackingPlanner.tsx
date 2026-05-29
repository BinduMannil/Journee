"use client";

import { useMemo, useState } from "react";
import {
  generatePackingList,
  type Activity,
  type TempBand,
} from "@/lib/intelligence/packing";

/**
 * Packing planner: the traveller supplies the expected climate and activities
 * (honest — no fabricated weather feed), and the pure `generatePackingList`
 * engine returns a categorized checklist. When a live weather feed lands
 * (Phase 2) the climate can be pre-filled from the destination + dates; the
 * engine and this UI don't change.
 */

// Representative temperature (°C) per band — the engine takes a number, the UI
// offers human-friendly bands.
const BAND_TEMP: Readonly<Record<TempBand, number>> = {
  freezing: -5,
  cold: 9,
  mild: 18,
  warm: 25,
  hot: 32,
};
const BANDS: { value: TempBand; label: string }[] = [
  { value: "freezing", label: "Freezing" },
  { value: "cold", label: "Cold" },
  { value: "mild", label: "Mild" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
];
const ACTIVITIES: { value: Activity; label: string }[] = [
  { value: "beach", label: "Beach" },
  { value: "swimming", label: "Swimming" },
  { value: "hiking", label: "Hiking" },
  { value: "city", label: "City" },
  { value: "winter_sports", label: "Winter sports" },
  { value: "formal_dining", label: "Fine dining" },
  { value: "business", label: "Business" },
  { value: "photography", label: "Photography" },
];

export function PackingPlanner() {
  const [band, setBand] = useState<TempBand>("mild");
  const [rain, setRain] = useState(false);
  const [days, setDays] = useState(5);
  const [activities, setActivities] = useState<readonly Activity[]>([]);

  const toggleActivity = (a: Activity) =>
    setActivities((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const list = useMemo(
    () =>
      generatePackingList({
        conditions: { temperatureC: BAND_TEMP[band] },
        rainChance: rain ? 0.6 : 0,
        activities,
        durationDays: days,
      }),
    [band, rain, days, activities],
  );

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">Conditions</p>

        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone">Climate</label>
        <div className="mb-6 flex flex-wrap gap-2">
          {BANDS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBand(b.value)}
              aria-pressed={band === b.value}
              className={
                band === b.value
                  ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
                  : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 hover:border-gold/50"
              }
            >
              {b.label}
            </button>
          ))}
        </div>

        <label className="mb-4 flex items-center gap-3 text-sand">
          <input type="checkbox" checked={rain} onChange={(e) => setRain(e.target.checked)} className="accent-gold" />
          Rain likely
        </label>

        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone">
          Trip length: {days} {days === 1 ? "day" : "days"}
        </label>
        <input
          type="range"
          min={1}
          max={21}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mb-6 w-full accent-gold"
          aria-label="Trip length in days"
        />

        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone">Activities</label>
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => toggleActivity(a.value)}
              aria-pressed={activities.includes(a.value)}
              className={
                activities.includes(a.value)
                  ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
                  : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 hover:border-gold/50"
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">What to pack</p>
        <div className="space-y-5">
          {list.map((cat) => (
            <div key={cat.category}>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone">{cat.category}</p>
              <ul className="space-y-1 text-sand/80">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-gold/70">·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
