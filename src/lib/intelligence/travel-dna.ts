/**
 * Travel DNA — a lightweight traveler preference model (pure).
 *
 * Models a traveler's affinity for destination moods (0..1 each). Used to rank
 * destinations for adaptive personalization. Deterministic and unit-tested; a
 * learned/behavioral model can later produce the same `TravelDNA` shape without
 * changing consumers. See docs/architecture/intelligence-engine-architecture.md.
 */
export interface TravelDNA {
  /** Mood -> affinity 0..1. Missing moods are treated as neutral (0.5). */
  readonly moodAffinity: Readonly<Record<string, number>>;
}

export interface DestinationLike {
  readonly id: string;
  readonly mood: string;
}

export interface MatchResult {
  readonly id: string;
  /** 0..100. */
  readonly score: number;
  readonly reason: string;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Affinity for a single mood; neutral (0.5) when unknown to the traveler. */
export function affinityFor(dna: TravelDNA, mood: string): number {
  const a = dna.moodAffinity[mood];
  return a === undefined ? 0.5 : clamp01(a);
}

/** Rank destinations by how well they match the traveler DNA (desc). */
export function rankByDNA(
  dna: TravelDNA,
  destinations: readonly DestinationLike[],
): readonly MatchResult[] {
  return [...destinations]
    .map((d): MatchResult => {
      const a = affinityFor(dna, d.mood);
      return {
        id: d.id,
        score: Math.round(a * 100),
        reason: `${d.mood} affinity ${Math.round(a * 100)}`,
      };
    })
    .sort((x, y) => y.score - x.score || x.id.localeCompare(y.id));
}
