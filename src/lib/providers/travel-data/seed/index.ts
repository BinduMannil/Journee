/**
 * SEED travel-data provider adapters.
 *
 * One adapter per travel-data kind, all backed by the deterministic seed
 * dataset (`./data`). These are the only travel-data adapters that exist today;
 * no live vendor is wired. Each is the always-available, lowest-trust fallback
 * (mirroring the local-seed destinations provider) and labels every response
 * `seed` via `SourceMetadata` so it can never be mistaken for live data.
 */
import {
  okResponse,
  unavailableResponse,
  type LocalEvent,
  type LocalEventsProvider,
  type LocalEventsQuery,
  type OpeningHours,
  type OpeningHoursProvider,
  type OpeningHoursQuery,
  type Place,
  type PlacesProvider,
  type PlacesQuery,
  type ReviewSummary,
  type ReviewsProvider,
  type ReviewsQuery,
  type SafetyAdvisory,
  type SafetyAdvisoryProvider,
  type SafetyAdvisoryQuery,
  type TicketLink,
  type TicketLinkProvider,
  type TicketLinkQuery,
  type TicketPrice,
  type TicketPriceProvider,
  type TicketPriceQuery,
  type TravelDataKind,
  type TravelDataProvider,
  type TravelDataResponse,
} from "../contracts";
import { makeSourceMetadata } from "../source";
import {
  SEED_ADVISORIES,
  SEED_EVENTS,
  SEED_OPENING_HOURS,
  SEED_PLACES,
  SEED_REVIEWS,
  SEED_TICKET_LINKS,
  SEED_TICKET_PRICES,
} from "./data";

const SEED_SOURCE_NAME = "Journee Seed Catalog";
/** Seed data is structurally valid sample data, not authoritative — mid confidence. */
const SEED_CONFIDENCE = 0.5;
/** Seed responses are treated as fresh for 6h after fetch (exercises freshness). */
const SEED_TTL_MS = 6 * 60 * 60 * 1000;

interface SeedProviderConfig<TQuery, TData> {
  readonly id: string;
  readonly name: string;
  readonly kind: TravelDataKind;
  /** Return the seed payload for a query, or null when none exists. */
  readonly lookup: (query: TQuery) => TData | null;
  readonly notFound: (query: TQuery) => string;
}

function makeSeedProvider<TQuery, TData>(
  config: SeedProviderConfig<TQuery, TData>,
): TravelDataProvider<TQuery, TData> {
  return {
    id: config.id,
    name: config.name,
    kind: config.kind,
    sourceType: "seed",
    // Seed is the always-available fallback, like the local-seed destinations
    // provider. Honesty is preserved by the `seed` label on every response.
    isAvailable: () => true,
    async fetch(query: TQuery): Promise<TravelDataResponse<TData>> {
      const data = config.lookup(query);
      const source = makeSourceMetadata({
        sourceName: SEED_SOURCE_NAME,
        sourceType: "seed",
        providerId: config.id,
        confidence: SEED_CONFIDENCE,
        fetchedAt: new Date(),
        ttlMs: SEED_TTL_MS,
      });
      if (data === null) {
        return unavailableResponse(config.id, config.kind, config.notFound(query), source);
      }
      return okResponse(config.id, config.kind, data, source);
    },
  };
}

export const seedPlacesProvider: PlacesProvider = makeSeedProvider<PlacesQuery, readonly Place[]>({
  id: "seed-places",
  name: "Seed Places & Attractions",
  kind: "places",
  lookup: ({ destinationId, limit }) => {
    const all = SEED_PLACES[destinationId];
    if (!all) return null;
    return typeof limit === "number" ? all.slice(0, Math.max(0, limit)) : all;
  },
  notFound: ({ destinationId }) => `no seed places for destination "${destinationId}"`,
});

export const seedOpeningHoursProvider: OpeningHoursProvider = makeSeedProvider<OpeningHoursQuery, OpeningHours>({
  id: "seed-opening-hours",
  name: "Seed Opening Hours",
  kind: "opening-hours",
  lookup: ({ placeId }) => SEED_OPENING_HOURS[placeId] ?? null,
  notFound: ({ placeId }) => `no seed opening hours for place "${placeId}"`,
});

export const seedTicketPriceProvider: TicketPriceProvider = makeSeedProvider<TicketPriceQuery, TicketPrice>({
  id: "seed-ticket-prices",
  name: "Seed Ticket Prices",
  kind: "ticket-prices",
  lookup: ({ placeId }) => SEED_TICKET_PRICES[placeId] ?? null,
  notFound: ({ placeId }) => `no seed ticket price for place "${placeId}"`,
});

export const seedTicketLinkProvider: TicketLinkProvider = makeSeedProvider<TicketLinkQuery, readonly TicketLink[]>({
  id: "seed-ticket-links",
  name: "Seed Ticket Links",
  kind: "ticket-links",
  lookup: ({ placeId }) => SEED_TICKET_LINKS[placeId] ?? null,
  notFound: ({ placeId }) => `no seed ticket links for place "${placeId}"`,
});

export const seedReviewsProvider: ReviewsProvider = makeSeedProvider<ReviewsQuery, ReviewSummary>({
  id: "seed-reviews",
  name: "Seed Review Summaries",
  kind: "reviews",
  lookup: ({ placeId }) => SEED_REVIEWS[placeId] ?? null,
  notFound: ({ placeId }) => `no seed reviews for place "${placeId}"`,
});

export const seedLocalEventsProvider: LocalEventsProvider = makeSeedProvider<LocalEventsQuery, readonly LocalEvent[]>({
  id: "seed-local-events",
  name: "Seed Local Events",
  kind: "local-events",
  lookup: ({ destinationId, from, to }) => {
    const all = SEED_EVENTS[destinationId];
    if (!all) return null;
    const fromT = from ? new Date(from).getTime() : -Infinity;
    const toT = to ? new Date(to).getTime() : Infinity;
    return all.filter((e) => {
      const start = new Date(e.startsAt).getTime();
      return start >= fromT && start <= toT;
    });
  },
  notFound: ({ destinationId }) => `no seed events for destination "${destinationId}"`,
});

export const seedSafetyAdvisoryProvider: SafetyAdvisoryProvider = makeSeedProvider<SafetyAdvisoryQuery, SafetyAdvisory>({
  id: "seed-safety-advisories",
  name: "Seed Safety Advisories",
  kind: "safety-advisories",
  lookup: ({ destinationId }) => SEED_ADVISORIES[destinationId] ?? null,
  notFound: ({ destinationId }) => `no seed advisory for destination "${destinationId}"`,
});

/** Every seed adapter, in declaration order. */
export const seedTravelDataProviders = [
  seedPlacesProvider,
  seedOpeningHoursProvider,
  seedTicketPriceProvider,
  seedTicketLinkProvider,
  seedReviewsProvider,
  seedLocalEventsProvider,
  seedSafetyAdvisoryProvider,
] as const;
