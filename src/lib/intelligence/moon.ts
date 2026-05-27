/**
 * Moon phase (pure, no network).
 *
 * Derives the moon's age, illuminated fraction, and phase name from a known
 * new-moon epoch and the mean synodic month. Accurate to well within a day —
 * fine for "how bright will the night be?" (night photography, stargazing).
 * Deterministic and unit-tested. A real ephemeris can replace this later behind
 * the same shape without changing consumers.
 */
const SYNODIC_DAYS = 29.530588853;
/** Reference new moon: 2000-01-06 18:14 UTC. */
const NEW_MOON_EPOCH_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export type MoonPhaseName =
  | "New moon"
  | "Waxing crescent"
  | "First quarter"
  | "Waxing gibbous"
  | "Full moon"
  | "Waning gibbous"
  | "Last quarter"
  | "Waning crescent";

export interface MoonPhase {
  /** Days since the most recent new moon, 0..~29.53. */
  readonly ageDays: number;
  /** Illuminated fraction of the disc, 0..1. */
  readonly illumination: number;
  readonly phase: MoonPhaseName;
}

function phaseName(ageDays: number): MoonPhaseName {
  const f = ageDays / SYNODIC_DAYS; // 0..1 through the cycle
  if (f < 0.02 || f >= 0.98) return "New moon";
  if (f < 0.23) return "Waxing crescent";
  if (f < 0.27) return "First quarter";
  if (f < 0.48) return "Waxing gibbous";
  if (f < 0.52) return "Full moon";
  if (f < 0.73) return "Waning gibbous";
  if (f < 0.77) return "Last quarter";
  return "Waning crescent";
}

export function moonPhase(date: Date): MoonPhase {
  const days = (date.getTime() - NEW_MOON_EPOCH_MS) / 86_400_000;
  const ageDays = ((days % SYNODIC_DAYS) + SYNODIC_DAYS) % SYNODIC_DAYS;
  // Illuminated fraction peaks (1) at half-cycle (full) and is 0 at new.
  const illumination = (1 - Math.cos((2 * Math.PI * ageDays) / SYNODIC_DAYS)) / 2;
  return { ageDays, illumination, phase: phaseName(ageDays) };
}
