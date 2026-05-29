/**
 * Smart day planner (pure, no I/O).
 *
 * Turns a destination's catalogued attractions into a sensible single-day order
 * by sequencing them through the natural arc of a day (early morning → evening)
 * using each site's `bestTimeOfDay`, then tie-breaking so the busiest sites are
 * tackled first within a slot (beat the crowds). It is a suggested ordering over
 * the editorial `attractions` seed — pair with `ATTRACTIONS_DATA_NOTE` (re-
 * exported) so it reads as guidance, never a live/guaranteed schedule.
 * Deterministic + unit-tested.
 */
import {
  getAttractions,
  ATTRACTIONS_DATA_NOTE,
  type Attraction,
  type Busyness,
  type TimeOfDay,
} from "./attractions";

export { ATTRACTIONS_DATA_NOTE };

/** Canonical order of day parts, earliest first. */
const TIME_ORDER: readonly TimeOfDay[] = [
  "early_morning",
  "morning",
  "midday",
  "afternoon",
  "sunset",
  "evening",
];

/** Busier sites sort first within a slot, so crowds are beaten early. */
const BUSYNESS_RANK: Readonly<Record<Busyness, number>> = {
  very_busy: 0,
  busy: 1,
  moderate: 2,
  quiet: 3,
};

export interface PlannedStop {
  readonly slot: TimeOfDay;
  readonly attraction: Attraction;
}

export interface SmartDayPlan {
  readonly destinationId: string;
  readonly stops: readonly PlannedStop[];
  /** Honest disclaimer (the attractions data note). */
  readonly note: string;
}

export interface DayPlanOptions {
  /** Cap the number of stops in the day (default: all attractions). */
  readonly maxStops?: number;
}

/**
 * Build a suggested day plan for a destination by ordering its attractions
 * through the day. Returns null when the destination has no attractions
 * catalogued.
 */
export function planSmartDay(
  destinationId: string,
  opts: DayPlanOptions = {},
): SmartDayPlan | null {
  const profile = getAttractions(destinationId);
  if (profile === null) return null;

  const ordered = [...profile.attractions].sort((a, b) => {
    const timeDelta = TIME_ORDER.indexOf(a.bestTimeOfDay) - TIME_ORDER.indexOf(b.bestTimeOfDay);
    if (timeDelta !== 0) return timeDelta;
    const busyDelta = BUSYNESS_RANK[a.typicalBusyness] - BUSYNESS_RANK[b.typicalBusyness];
    if (busyDelta !== 0) return busyDelta;
    return a.name.localeCompare(b.name);
  });

  const capped =
    opts.maxStops !== undefined && opts.maxStops >= 0
      ? ordered.slice(0, Math.trunc(opts.maxStops))
      : ordered;

  return {
    destinationId,
    stops: capped.map((attraction) => ({ slot: attraction.bestTimeOfDay, attraction })),
    note: ATTRACTIONS_DATA_NOTE,
  };
}
