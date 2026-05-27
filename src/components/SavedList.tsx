"use client";

import Link from "next/link";
import { useSaved } from "./useSaved";
import type { Destination } from "@/content/destinations";

/**
 * Renders the visitor's saved destinations from localStorage, mapped against
 * the full catalog passed from the server. Items can be removed inline (reusing
 * the tested toggle) so the collection is manageable without opening each page.
 */
export function SavedList({ destinations }: { destinations: readonly Destination[] }) {
  const { ids, toggle } = useSaved();
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
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-stone">
        {saved.length} saved
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {saved.map((d) => (
          <li
            key={d.id}
            className="flex items-center gap-3 rounded-xl border border-sand/15 px-5 py-4 transition-colors hover:border-gold/40"
          >
            <Link href={`/destinations/${d.id}`} className="flex-1">
              <span className="font-display text-2xl text-sand">{d.name}</span>
              <span className="ml-2 text-sm uppercase tracking-[0.2em] text-stone">
                {d.country}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => toggle(d.id)}
              aria-label={`Remove ${d.name} from saved`}
              className="rounded-full border border-sand/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone transition-colors hover:border-gold/50 hover:text-gold-bright"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
