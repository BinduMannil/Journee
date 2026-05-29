import Link from "next/link";

export interface SimilarItem {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly reason: string;
}

/**
 * "If you liked here, try…" — presentational. The ranking is computed upstream
 * (intelligence/similar.ts) and passed in resolved, so this component stays
 * data-via-props with no logic of its own.
 */
export function SimilarDestinations({ items }: { items: readonly SimilarItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-12">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">You might also love</p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {items.map((d) => (
          <li key={d.id}>
            <Link
              href={`/destinations/${d.id}`}
              className="block h-full rounded-2xl border border-sand/10 p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-display text-2xl text-sand">{d.name}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-stone">
                {d.country}
              </span>
              <span className="mt-3 block text-sm text-sand/70">{d.reason}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
