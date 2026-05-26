"use client";

import Link from "next/link";
import { useSaved } from "./useSaved";
import type { Destination } from "@/content/destinations";

/**
 * Renders the visitor's saved destinations from localStorage, mapped against
 * the full catalog passed from the server.
 */
export function SavedList({ destinations }: { destinations: readonly Destination[] }) {
  const { ids } = useSaved();
  const saved = destinations.filter((d) => ids.includes(d.id));

  if (saved.length === 0) {
    return (
      <p className="text-sand/60">
        No saved destinations yet. Open a destination and tap{" "}
        <span className="text-gold-bright">Save</span>.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {saved.map((d) => (
        <li key={d.id}>
          <Link
            href={`/destinations/${d.id}`}
            className="block rounded-xl border border-sand/15 px-5 py-4 transition-colors hover:border-gold/40"
          >
            <span className="font-display text-2xl text-sand">{d.name}</span>
            <span className="ml-2 text-sm uppercase tracking-[0.2em] text-stone">
              {d.country}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
