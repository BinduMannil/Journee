/**
 * Trip-level readiness assembler (backend).
 *
 * Composes per-stop `DestinationReadiness` into a single trip aggregate via the
 * existing explainable scoring core + versioned weights. Pure where possible:
 * `composeTripReadiness` takes already-resolved per-stop readiness;
 * `assembleTripReadiness` walks the registry per stop via
 * `assembleDestinationReadiness`. Each stop is weighted equally
 * (`trip-readiness-v1`) and the aggregate's confidence is the mean of per-stop
 * confidences — so a trip cannot show high confidence unless its stops do.
 *
 * Honest by construction: best/worst stop are derived from real per-stop
 * scores, source provenance from every stop is flattened and tagged with its
 * `destinationId`, and a trip with zero stops returns a zero-confidence empty
 * aggregate rather than throwing.
 */
import { score } from "./scoring";
import type { IntelligenceScore, ScoringWeights } from "./types";
import {
  assembleDestinationReadiness,
  composeDestinationReadiness,
  type DestinationReadiness,
  type ReadinessSources,
  type SourceProvenance,
} from "./destination-readiness";

/** A single stop on a trip — what `assembleDestinationReadiness` needs per dest. */
export interface TripStop {
  readonly destinationId: string;
  readonly primaryPlaceId?: string;
}

/** Per-stop readiness already resolved (for the pure composer). */
export interface ResolvedTripStop {
  readonly destinationId: string;
  readonly readiness: DestinationReadiness;
}

/** Pre-resolved sources keyed by destinationId (for the pure composer's friend). */
export interface TripSourcesByDestination {
  readonly [destinationId: string]: ReadinessSources;
}

/** Provenance flattened across all stops, with the stop's id attached. */
export interface TripSourceProvenance extends SourceProvenance {
  readonly destinationId: string;
}

export interface TripStopSummary {
  readonly destinationId: string;
  /** The stop's `overall.score` (0..100). */
  readonly score: number;
  /** The stop's `overall.confidence` (0..1). */
  readonly confidence: number;
}

export interface TripReadiness {
  readonly stops: readonly ResolvedTripStop[];
  readonly overall: IntelligenceScore;
  readonly bestStop?: TripStopSummary;
  readonly worstStop?: TripStopSummary;
  readonly sources: readonly TripSourceProvenance[];
}

/** Trip-level weighting: every stop equally important. */
export const tripReadinessWeights: ScoringWeights = {
  version: "trip-readiness-v1",
  defaultWeight: 1,
  weights: {},
};

function summarize(stop: ResolvedTripStop): TripStopSummary {
  return {
    destinationId: stop.destinationId,
    score: stop.readiness.overall.score,
    confidence: stop.readiness.overall.confidence,
  };
}

/**
 * Pure: roll up already-resolved per-stop readiness into a trip aggregate.
 * Equal-weighted across stops; aggregate confidence is the mean of per-stop
 * confidences (so a confident trip needs confident stops).
 */
export function composeTripReadiness(stops: readonly ResolvedTripStop[]): TripReadiness {
  // Score across stops by treating each stop's overall.score as a 0..1 signal.
  const signals = stops.map((s) => ({
    key: s.destinationId,
    value: s.readiness.overall.score / 100,
  }));
  const base = score(
    signals,
    tripReadinessWeights,
    stops.map((s) => s.destinationId),
  );
  const meanConfidence =
    stops.length > 0
      ? stops.reduce((sum, s) => sum + s.readiness.overall.confidence, 0) / stops.length
      : 0;
  const overall: IntelligenceScore = { ...base, confidence: meanConfidence };

  // Per-stop best/worst by score.
  let best: TripStopSummary | undefined;
  let worst: TripStopSummary | undefined;
  for (const s of stops) {
    const summary = summarize(s);
    if (!best || summary.score > best.score) best = summary;
    if (!worst || summary.score < worst.score) worst = summary;
  }

  // Flatten + tag every source's provenance with its stop.
  const sources: TripSourceProvenance[] = [];
  for (const s of stops) {
    for (const src of s.readiness.sources) {
      sources.push({ ...src, destinationId: s.destinationId });
    }
  }

  return { stops, overall, bestStop: best, worstStop: worst, sources };
}

/**
 * Compose from pre-resolved travel-data responses (per stop). Pure helper for
 * callers that have already done their own resolution.
 */
export function composeTripReadinessFromSources(
  stops: readonly TripStop[],
  sourcesByDestination: TripSourcesByDestination,
  now: Date = new Date(),
): TripReadiness {
  const resolved: ResolvedTripStop[] = stops.map((stop) => ({
    destinationId: stop.destinationId,
    readiness: composeDestinationReadiness(
      stop.destinationId,
      sourcesByDestination[stop.destinationId] ?? {},
      now,
    ),
  }));
  return composeTripReadiness(resolved);
}

export interface AssembleTripReadinessInput {
  readonly stops: readonly TripStop[];
  readonly now?: Date;
}

/**
 * Walk the registry per stop via `assembleDestinationReadiness`, then compose
 * the trip aggregate. Always resolves (per-stop assembler never throws); an
 * empty stops list returns a zero-confidence empty aggregate.
 */
export async function assembleTripReadiness(
  input: AssembleTripReadinessInput,
): Promise<TripReadiness> {
  const now = input.now ?? new Date();
  const resolved = await Promise.all(
    input.stops.map(async (stop) => ({
      destinationId: stop.destinationId,
      readiness: await assembleDestinationReadiness({
        destinationId: stop.destinationId,
        primaryPlaceId: stop.primaryPlaceId,
        now,
      }),
    })),
  );
  return composeTripReadiness(resolved);
}
