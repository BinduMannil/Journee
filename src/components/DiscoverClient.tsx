"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pathfind } from "@/lib/intelligence/pathfinder";
import { LightBadge } from "./LightBadge";
import type { Destination } from "@/content/destinations";

/**
 * Pathfinder discovery UI: pick a vibe you're chasing and moods to avoid, then
 * see destinations ranked with the engine's explainable match reason. Surfaces
 * both arms of the pure `pathfind` query (vibe + avoid); ranking is computed in
 * render so it is present in the server-rendered markup, not just after hydration.
 */
export function DiscoverClient({ destinations }: { destinations: readonly Destination[] }) {
  const vibes = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.mood))).sort(),
    [destinations],
  );
  const [vibe, setVibe] = useState<string | null>(null);
  const [avoid, setAvoid] = useState<readonly string[]>([]);

  // A mood can't be both chased and avoided — selecting one clears the other.
  const chooseVibe = (v: string) => {
    setVibe((cur) => (cur === v ? null : v));
    setAvoid((cur) => cur.filter((m) => m !== v));
  };
  const toggleAvoid = (v: string) => {
    setAvoid((cur) => (cur.includes(v) ? cur.filter((m) => m !== v) : [...cur, v]));
    setVibe((cur) => (cur === v ? null : cur));
  };

  const ranked = pathfind(
    destinations.map((d) => ({ id: d.id, mood: d.mood })),
    { vibe: vibe ?? undefined, avoid },
  );
  const byId = new Map(destinations.map((d) => [d.id, d]));

  return (
    <div>
      <fieldset className="mb-8">
        <legend className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
          Chasing
        </legend>
        <div className="flex flex-wrap gap-3">
          {vibes.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => chooseVibe(v)}
              aria-pressed={vibe === v}
              className={
                vibe === v
                  ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
                  : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 hover:border-gold/50 hover:text-gold-bright"
              }
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-10">
        <legend className="mb-3 text-xs uppercase tracking-[0.3em] text-stone">
          Not feeling
        </legend>
        <div className="flex flex-wrap gap-3">
          {vibes.map((v) => {
            const active = avoid.includes(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggleAvoid(v)}
                aria-pressed={active}
                className={
                  active
                    ? "rounded-full border border-stone bg-stone/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-stone line-through"
                    : "rounded-full border border-sand/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/70 hover:border-stone hover:text-stone"
                }
              >
                {v}
              </button>
            );
          })}
        </div>
      </fieldset>

      <ol className="space-y-3">
        {ranked.map((r) => {
          const d = byId.get(r.id);
          if (!d) return null;
          return (
            <li key={r.id}>
              <Link
                href={`/destinations/${r.id}`}
                className="flex items-center gap-4 rounded-xl border border-sand/15 px-5 py-4 transition-colors hover:border-gold/40"
              >
                <span className="font-display text-2xl text-gold-bright">{r.score}</span>
                <span className="flex-1">
                  <span className="font-display text-xl text-sand">{d.name}</span>
                  <span className="ml-2 text-xs uppercase tracking-[0.2em] text-stone">
                    {d.mood}
                  </span>
                  {d.coordinates && (
                    <span className="ml-2 align-middle">
                      <LightBadge lat={d.coordinates.lat} lon={d.coordinates.lon} />
                    </span>
                  )}
                </span>
                <span className="text-sm text-sand/50">{r.reason}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
