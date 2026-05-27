/**
 * Dynamic itinerary builder (pure) — fatigue-aware pacing.
 *
 * Packs experiences into days under a per-day "intensity budget" set by the
 * chosen pacing, so plans don't cram exhausting days together. Deterministic
 * and unit-tested. A richer version can factor travel time, opening hours, and
 * weather (roadmap) without changing the call shape. See
 * docs/architecture/intelligence-engine-architecture.md.
 */
export interface ItineraryItem {
  readonly id: string;
  readonly title: string;
  /** Relative effort/fatigue, 0..1. */
  readonly intensity: number;
}

export type Pacing = "relaxed" | "balanced" | "packed";

export interface ItineraryDay {
  readonly items: readonly ItineraryItem[];
  /** Summed intensity for the day. */
  readonly load: number;
}

export interface Itinerary {
  readonly pacing: Pacing;
  /** Per-day intensity budget for the chosen pacing (so consumers can show how
   * full each day is without duplicating the config). */
  readonly budget: number;
  readonly days: readonly ItineraryDay[];
}

const DAILY_BUDGET: Record<Pacing, number> = {
  relaxed: 1.0,
  balanced: 1.8,
  packed: 2.6,
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildItinerary(
  items: readonly ItineraryItem[],
  pacing: Pacing,
): Itinerary {
  const budget = DAILY_BUDGET[pacing];
  const days: { items: ItineraryItem[]; load: number }[] = [];

  for (const raw of items) {
    const item = { ...raw, intensity: clamp01(raw.intensity) };
    const current = days[days.length - 1];
    // Start a new day if adding would exceed the budget (unless the current day
    // is empty — an oversized single item occupies its own day).
    if (!current || (current.items.length > 0 && current.load + item.intensity > budget)) {
      days.push({ items: [item], load: item.intensity });
    } else {
      current.items.push(item);
      current.load += item.intensity;
    }
  }

  return {
    pacing,
    budget,
    days: days.map((d) => ({ items: d.items, load: Math.round(d.load * 100) / 100 })),
  };
}
