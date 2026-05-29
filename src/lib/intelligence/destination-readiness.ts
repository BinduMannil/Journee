/**
 * Destination readiness assembler (backend).
 *
 * Composes a destination's Travel Confidence aggregate from the travel-data
 * provider layer (via the pure bridge) and the existing engines + versioned
 * weights. This is the REAL (seed-fed) server-side counterpart to the gated UI
 * preview, which uses mock contexts: here the inputs come from the travel-data
 * contracts (seed today, a live source later — no caller change).
 *
 * Honest by construction: each sub-engine is included ONLY when its source
 * yields a usable fragment. An unavailable/error source contributes no part, so
 * the aggregate's coverage-based `confidence` reflects how much real data backed
 * it — nothing is fabricated. Per-source `provenance` records status, source
 * type and quality so callers can show what's seed vs live vs stale.
 *
 * `composeDestinationReadiness` is pure (takes already-resolved responses).
 * `assembleDestinationReadiness` resolves through the registry first. Providers
 * must be registered (e.g. import `@/lib/providers/travel-data/register`); if
 * none are, resolution yields `unavailable` responses and the aggregate simply
 * has zero coverage rather than throwing.
 */
import { score } from "./scoring";
import { aggregateTravelConfidence, type EngineResult } from "./engines/confidence";
import { destinationEngine, DESTINATION_SIGNAL_KEYS } from "./engines/destination";
import { eventEngine, EVENT_SIGNAL_KEYS } from "./engines/events";
import { disruptionEngine, DISRUPTION_SIGNAL_KEYS } from "./engines/disruption";
import {
  destinationWeights,
  disruptionWeights,
  eventWeights,
  travelConfidenceWeights,
} from "./weights";
import type { IntelligenceScore } from "./types";
import {
  advisoryToDisruptionContext,
  eventsToEventContext,
  openingHoursToDestinationContext,
  responseQuality,
} from "./travel-data-context";
import { resolveTravelData } from "@/lib/providers/travel-data/registry";
import { cachedResolveTravelData, type TravelDataCache } from "@/lib/providers/travel-data/cache";
import type {
  LocalEvent,
  LocalEventsQuery,
  OpeningHours,
  OpeningHoursQuery,
  SafetyAdvisory,
  SafetyAdvisoryQuery,
  TravelDataKind,
  TravelDataResponse,
  TravelDataStatus,
} from "@/lib/providers/travel-data/contracts";
import type { ResultQuality } from "@/lib/providers/travel-data/freshness";
import type { SourceType } from "@/lib/providers/travel-data/source";

/** Already-resolved travel-data responses that feed the aggregate. */
export interface ReadinessSources {
  readonly openingHours?: TravelDataResponse<OpeningHours>;
  readonly advisory?: TravelDataResponse<SafetyAdvisory>;
  readonly events?: TravelDataResponse<readonly LocalEvent[]>;
}

/** Honest record of where each contributing signal came from. */
export interface SourceProvenance {
  readonly kind: TravelDataKind;
  readonly providerId: string;
  readonly status: TravelDataStatus;
  readonly sourceType: SourceType;
  readonly quality: ResultQuality;
  /** Whether this source actually contributed a sub-engine part. */
  readonly contributed: boolean;
}

export interface DestinationReadiness {
  readonly destinationId: string;
  readonly overall: IntelligenceScore;
  readonly parts: readonly EngineResult[];
  readonly sources: readonly SourceProvenance[];
}

function hasKeys(fragment: object): boolean {
  return Object.keys(fragment).length > 0;
}

function provenanceOf(
  kind: TravelDataKind,
  res: TravelDataResponse<unknown>,
  contributed: boolean,
  now: Date,
): SourceProvenance {
  return {
    kind,
    providerId: res.providerId,
    status: res.status,
    sourceType: res.source.sourceType,
    quality: responseQuality(res, now),
    contributed,
  };
}

/**
 * Pure: compose the Travel Confidence aggregate from already-resolved travel-data
 * responses. Each sub-engine is included only when its source yields a usable
 * fragment; provenance is recorded for every provided source.
 */
export function composeDestinationReadiness(
  destinationId: string,
  sources: ReadinessSources,
  now: Date = new Date(),
): DestinationReadiness {
  const parts: EngineResult[] = [];
  const provenance: SourceProvenance[] = [];

  if (sources.openingHours) {
    const fragment = openingHoursToDestinationContext(sources.openingHours, { now });
    const contributed = hasKeys(fragment);
    if (contributed) {
      parts.push({
        key: "destination",
        result: score(destinationEngine.toSignals(fragment), destinationWeights, [...DESTINATION_SIGNAL_KEYS]),
      });
    }
    provenance.push(provenanceOf("opening-hours", sources.openingHours, contributed, now));
  }

  if (sources.advisory) {
    const fragment = advisoryToDisruptionContext(sources.advisory, { now });
    const contributed = hasKeys(fragment);
    if (contributed) {
      parts.push({
        key: "disruption",
        result: score(disruptionEngine.toSignals(fragment), disruptionWeights, [...DISRUPTION_SIGNAL_KEYS]),
      });
    }
    provenance.push(provenanceOf("safety-advisories", sources.advisory, contributed, now));
  }

  if (sources.events) {
    const fragment = eventsToEventContext(sources.events, { now });
    const contributed = hasKeys(fragment);
    if (contributed) {
      parts.push({
        key: "events",
        result: score(eventEngine.toSignals(fragment), eventWeights, [...EVENT_SIGNAL_KEYS]),
      });
    }
    provenance.push(provenanceOf("local-events", sources.events, contributed, now));
  }

  return {
    destinationId,
    overall: aggregateTravelConfidence(parts, travelConfidenceWeights),
    parts,
    sources: provenance,
  };
}

export interface AssembleReadinessInput {
  readonly destinationId: string;
  /** Place whose opening hours feed the destination `open_now` signal. */
  readonly primaryPlaceId?: string;
  readonly now?: Date;
  /**
   * When provided, resolve through the in-process TTL cache (the same instance
   * is reused across calls). Otherwise resolve through the registry directly.
   */
  readonly cache?: TravelDataCache;
}

/**
 * Resolve the relevant travel-data through the registry (optionally via the
 * cache), then compose the aggregate. Always resolves (never throws):
 * unregistered/unavailable sources simply do not contribute.
 */
export async function assembleDestinationReadiness(
  input: AssembleReadinessInput,
): Promise<DestinationReadiness> {
  const now = input.now ?? new Date();
  const cache = input.cache;
  const resolveAdvisory = cache
    ? cachedResolveTravelData<SafetyAdvisoryQuery, SafetyAdvisory>("safety-advisories", { destinationId: input.destinationId }, cache)
    : resolveTravelData<SafetyAdvisoryQuery, SafetyAdvisory>("safety-advisories", { destinationId: input.destinationId });
  const resolveEvents = cache
    ? cachedResolveTravelData<LocalEventsQuery, readonly LocalEvent[]>("local-events", { destinationId: input.destinationId }, cache)
    : resolveTravelData<LocalEventsQuery, readonly LocalEvent[]>("local-events", { destinationId: input.destinationId });
  const resolveHours = input.primaryPlaceId
    ? (cache
        ? cachedResolveTravelData<OpeningHoursQuery, OpeningHours>("opening-hours", { placeId: input.primaryPlaceId }, cache)
        : resolveTravelData<OpeningHoursQuery, OpeningHours>("opening-hours", { placeId: input.primaryPlaceId }))
    : Promise.resolve(undefined);
  const [advisory, events, openingHours] = await Promise.all([
    resolveAdvisory,
    resolveEvents,
    resolveHours,
  ]);
  return composeDestinationReadiness(
    input.destinationId,
    { advisory, events, openingHours: openingHours ?? undefined },
    now,
  );
}
