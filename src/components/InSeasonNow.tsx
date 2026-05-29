"use client";

import { useMemo } from "react";
import Link from "next/link";
import { rankForMonth, type SeasonalLike } from "@/lib/intelligence/seasonality";

export interface SeasonalDestination extends SeasonalLike {
  readonly name: string;
  readonly country: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/**
 * "Where to go this month" — ranks the catalog by seasonal suitability for the
 * viewer's current month (computed client-side so it's always live). Ranking is
 * the pure `rankForMonth`; this component only resolves ids to names and renders
 * the in-season picks.
 */
export function InSeasonNow({ destinations }: { destinations: readonly SeasonalDestination[] }) {
  const month = new Date().getMonth() + 1;
  const byId = useMemo(
    () => new Map(destinations.map((d) => [d.id, d])),
    [destinations],
  );
  const inSeason = useMemo(
    () => rankForMonth(destinations, month).filter((m) => m.inSeason),
    [destinations, month],
  );

  if (inSeason.length === 0) return null;

  return (
    <div className="mb-14 rounded-2xl border border-sand/10 p-7">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
        In season this {MONTHS[month - 1]}
      </p>
      <ul className="flex flex-wrap gap-3">
        {inSeason.map((m) => {
          const d = byId.get(m.id)!;
          return (
            <li key={m.id}>
              <Link
                href={`/destinations/${m.id}`}
                className="inline-flex items-baseline gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-sm text-sand transition-colors hover:bg-gold/10"
              >
                {d.name}
                <span className="text-xs uppercase tracking-[0.2em] text-stone">{d.country}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
