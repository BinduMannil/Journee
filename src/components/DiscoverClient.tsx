"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pathfind } from "@/lib/intelligence/pathfinder";
import type { Destination } from "@/content/destinations";

/**
 * Pathfinder discovery UI: pick a vibe, see destinations ranked toward it with
 * the engine's explainable match reason. Uses the pure `pathfind` directly.
 */
export function DiscoverClient({ destinations }: { destinations: readonly Destination[] }) {
  const vibes = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.mood))).sort(),
    [destinations],
  );
  const [vibe, setVibe] = useState<string | null>(null);

  const ranked = pathfind(
    destinations.map((d) => ({ id: d.id, mood: d.mood })),
    { vibe: vibe ?? undefined },
  );
  const byId = new Map(destinations.map((d) => [d.id, d]));

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {vibes.map((v) => (
          <button
            key={v}
            onClick={() => setVibe((cur) => (cur === v ? null : v))}
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
