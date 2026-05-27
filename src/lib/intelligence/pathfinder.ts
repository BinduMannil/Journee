/**
 * Pathfinder discovery (pure).
 *
 * Query-time discovery: rank destinations toward a desired vibe (mood) and away
 * from moods to avoid, with explainable reasons. Complements Travel DNA
 * (persistent preference) — Pathfinder is the explicit, in-the-moment query.
 * Pure and unit-tested.
 */
import type { DestinationLike, MatchResult } from "./travel-dna";

export interface PathfinderQuery {
  /** Desired mood/vibe. */
  readonly vibe?: string;
  /** Moods to downrank. */
  readonly avoid?: readonly string[];
}

export function pathfind(
  destinations: readonly DestinationLike[],
  query: PathfinderQuery,
): readonly MatchResult[] {
  const avoid = new Set(query.avoid ?? []);
  return [...destinations]
    .map((d): MatchResult => {
      let value = 0.5;
      let reason = "neutral match";
      if (avoid.has(d.mood)) {
        value = 0;
        reason = `avoided mood ${d.mood}`;
      } else if (query.vibe && d.mood === query.vibe) {
        value = 1;
        reason = `matches vibe ${query.vibe}`;
      } else if (query.vibe) {
        value = 0.4;
        reason = `different vibe (${d.mood})`;
      }
      return { id: d.id, score: Math.round(value * 100), reason };
    })
    .sort((x, y) => y.score - x.score || x.id.localeCompare(y.id));
}
