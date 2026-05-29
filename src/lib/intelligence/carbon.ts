/**
 * Trip carbon-footprint estimate (pure, no network).
 *
 * Estimates per-passenger travel CO2e for a route from the catalog's
 * coordinates, using the same great-circle distance the planner already uses.
 * Transport mode is *inferred* from leg distance and multiplied by a published
 * average emission factor.
 *
 * HONEST BY CONSTRUCTION: this is a comparison **estimate**, not a measured or
 * certified figure. The factors are illustrative published averages and the
 * mode is a distance heuristic — both are versioned CONFIG (`carbon-v1`), so the
 * model is tunable and every estimate is traceable to the version that produced
 * it (mirrors the scoring-weights seam, ADR-006). Deterministic + unit-tested.
 */
import { haversineKm, type Coord } from "./geo";

export type TravelMode = "road" | "rail" | "short_haul_flight" | "long_haul_flight";

export interface CarbonModel {
  readonly version: string;
  /** kg CO2e per passenger-km, by mode (illustrative published averages). */
  readonly factorsKgPerKm: Readonly<Record<TravelMode, number>>;
  /** Ascending upper distance bounds (km, inclusive) selecting each mode. */
  readonly modeThresholdsKm: readonly { readonly maxKm: number; readonly mode: TravelMode }[];
}

export const carbonModelV1: CarbonModel = {
  version: "carbon-v1",
  factorsKgPerKm: {
    road: 0.17,
    rail: 0.041,
    short_haul_flight: 0.246,
    long_haul_flight: 0.15,
  },
  modeThresholdsKm: [
    { maxKm: 100, mode: "road" },
    { maxKm: 700, mode: "rail" },
    { maxKm: 3700, mode: "short_haul_flight" },
    { maxKm: Infinity, mode: "long_haul_flight" },
  ],
};

/** Infer a transport mode for a leg from its great-circle distance. */
export function inferTravelMode(legKm: number, model: CarbonModel = carbonModelV1): TravelMode {
  for (const t of model.modeThresholdsKm) {
    if (legKm <= t.maxKm) return t.mode;
  }
  // Fallback to the last (widest) band; thresholds always end at Infinity.
  return model.modeThresholdsKm[model.modeThresholdsKm.length - 1]!.mode;
}

export interface CarbonLeg {
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly km: number;
  readonly mode: TravelMode;
  /** Per-passenger CO2e for this leg, in kg. */
  readonly kgCO2e: number;
}

export interface CarbonEstimate {
  readonly version: string;
  readonly passengers: number;
  /** Total CO2e in kg across all legs × passengers. */
  readonly totalKgCO2e: number;
  readonly legs: readonly CarbonLeg[];
  /** Plain-language statement of method + that this is an estimate. */
  readonly basis: string;
}

export interface CarbonOptions {
  /** Travellers to multiply the per-passenger total by. Default 1 (≥1, integer). */
  readonly passengers?: number;
  /** Override the versioned model (tests / future config provider). */
  readonly model?: CarbonModel;
  /** Force one mode for every leg instead of inferring per leg. */
  readonly mode?: TravelMode;
}

const round = (n: number): number => Math.round(n);
const round1 = (n: number): number => Math.round(n * 10) / 10;

const BASIS =
  "Great-circle distance × published average per-passenger-km emission factors; " +
  "transport mode inferred from leg distance. An ESTIMATE for comparison, not a " +
  "measured or certified figure.";

/**
 * Estimate the travel carbon footprint of an ordered route. Returns a per-leg
 * breakdown (distance, inferred/forced mode, kg CO2e) and the total. Fewer than
 * two stops yields an empty breakdown and a zero total.
 */
export function estimateTripCarbon(
  stops: readonly Coord[],
  options: CarbonOptions = {},
): CarbonEstimate {
  const model = options.model ?? carbonModelV1;
  const passengers =
    options.passengers && options.passengers > 0 ? Math.floor(options.passengers) : 1;

  const legs: CarbonLeg[] = [];
  let perPassenger = 0;
  for (let i = 1; i < stops.length; i++) {
    const km = haversineKm(stops[i - 1]!, stops[i]!);
    const mode = options.mode ?? inferTravelMode(km, model);
    const kg = km * model.factorsKgPerKm[mode];
    perPassenger += kg;
    legs.push({ fromIndex: i - 1, toIndex: i, km: round(km), mode, kgCO2e: round1(kg) });
  }

  return {
    version: model.version,
    passengers,
    totalKgCO2e: round1(perPassenger * passengers),
    legs,
    basis: BASIS,
  };
}
