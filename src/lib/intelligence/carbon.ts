/**
 * Travel carbon footprint estimator (pure, no network).
 *
 * Estimates passenger CO₂e for a journey from great-circle distance and a
 * transport mode, using published per-passenger-kilometre emission factors.
 * Deterministic and unit-tested; no I/O.
 *
 * Honesty note: these are *standard approximate* factors (DEFRA/IPCC-style
 * order-of-magnitude values), not a live per-route lifecycle model. Output is
 * surfaced as an approximation, never as an authoritative figure. The factors
 * live here as the single tunable source — like scoring weights, they are
 * config, not algorithm constants — so a richer model can replace them without
 * touching callers.
 */
import { haversineKm, type Coord } from "./geo";

export type TransportMode =
  | "plane_short" // short-haul flight (<~1500 km), high per-km due to take-off/landing
  | "plane_long" // long-haul flight, lower per-km but huge distances
  | "train"
  | "bus"
  | "car"
  | "ferry";

/** kg CO₂e per passenger-kilometre. Config seam — approximate standard factors. */
export const EMISSION_FACTORS_KG_PER_KM: Readonly<Record<TransportMode, number>> = {
  plane_short: 0.25,
  plane_long: 0.15,
  train: 0.035,
  bus: 0.03,
  car: 0.17,
  ferry: 0.11,
};

/** Distance below which a flight is treated as short-haul, in kilometres. */
export const SHORT_HAUL_THRESHOLD_KM = 1500;

export interface FootprintLeg {
  readonly distanceKm: number;
  readonly mode: TransportMode;
  readonly kgCO2e: number;
}

export interface TripFootprint {
  /** Total estimated passenger CO₂e for the trip, in kilograms. */
  readonly totalKgCO2e: number;
  readonly legs: readonly FootprintLeg[];
  /** Always true — a reminder this is an approximation, surfaced in UI. */
  readonly approximate: true;
}

function roundKg(n: number): number {
  // One decimal under 100 kg, whole kg above — enough precision without false
  // exactness for what is an approximation.
  return n < 100 ? Math.round(n * 10) / 10 : Math.round(n);
}

/** Estimate CO₂e for a single leg of a given distance and mode. */
export function estimateLeg(distanceKm: number, mode: TransportMode): FootprintLeg {
  const dist = distanceKm > 0 && Number.isFinite(distanceKm) ? distanceKm : 0;
  const kgCO2e = roundKg(dist * EMISSION_FACTORS_KG_PER_KM[mode]);
  return { distanceKm: Math.round(dist), mode, kgCO2e };
}

/**
 * Pick the most likely flight class for a distance. Trains/cars/etc. are an
 * explicit caller choice; flying is inferred by haul length when a caller asks
 * for the realistic default of a route.
 */
export function flightModeFor(distanceKm: number): TransportMode {
  return distanceKm <= SHORT_HAUL_THRESHOLD_KM ? "plane_short" : "plane_long";
}

export interface PlannedLeg {
  readonly distanceKm: number;
  /** If omitted, the realistic flight class for the distance is assumed. */
  readonly mode?: TransportMode;
}

/** Sum a sequence of legs into a trip footprint. */
export function estimateTripFootprint(legs: readonly PlannedLeg[]): TripFootprint {
  const resolved = legs.map((l) =>
    estimateLeg(l.distanceKm, l.mode ?? flightModeFor(l.distanceKm)),
  );
  const total = resolved.reduce((sum, l) => sum + l.kgCO2e, 0);
  return { totalKgCO2e: roundKg(total), legs: resolved, approximate: true };
}

/**
 * Estimate a round-trip footprint from a home coordinate to an ordered list of
 * destination coordinates and back, assuming flight between far stops. This is
 * the convenience the `/plan` view uses; it derives distance from the catalog
 * coordinates via the same great-circle math the trip planner already uses.
 */
export function estimateRouteFootprint(
  home: Coord,
  stops: readonly Coord[],
  mode?: TransportMode,
): TripFootprint {
  if (stops.length === 0) return { totalKgCO2e: 0, legs: [], approximate: true };
  const points: Coord[] = [home, ...stops, home];
  const legs: PlannedLeg[] = [];
  for (let i = 1; i < points.length; i++) {
    legs.push({ distanceKm: haversineKm(points[i - 1]!, points[i]!), mode });
  }
  return estimateTripFootprint(legs);
}

/**
 * Estimate the footprint of travelling between an ordered list of stops (no
 * return home). Each consecutive pair becomes a leg whose mode defaults to the
 * realistic flight class for its distance. This is what the `/plan` view uses:
 * it has the selected stops' coordinates but not yet a home airport (that
 * arrives with user profiles in Phase 1).
 */
export function estimateStopsFootprint(
  stops: readonly Coord[],
  mode?: TransportMode,
): TripFootprint {
  if (stops.length < 2) return { totalKgCO2e: 0, legs: [], approximate: true };
  const legs: PlannedLeg[] = [];
  for (let i = 1; i < stops.length; i++) {
    legs.push({ distanceKm: haversineKm(stops[i - 1]!, stops[i]!), mode });
  }
  return estimateTripFootprint(legs);
}

/**
 * Map a trip footprint to a 0..1 transport-sustainability signal for the
 * sustainability engine (1 = low impact). Uses a soft reference budget so the
 * signal degrades smoothly rather than as a hard cliff. `referenceKg` is the
 * footprint considered "high impact" (maps to ~0); 0 kg maps to 1.
 */
export function footprintToTransportSignal(
  totalKgCO2e: number,
  referenceKg = 2000,
): number {
  if (!(referenceKg > 0) || totalKgCO2e <= 0) return totalKgCO2e <= 0 ? 1 : 0;
  const ratio = totalKgCO2e / referenceKg;
  return Math.min(1, Math.max(0, 1 - ratio));
}
