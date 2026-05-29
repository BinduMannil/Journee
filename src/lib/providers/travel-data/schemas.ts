/**
 * Runtime (zod) schemas for the travel-data contracts.
 *
 * `contracts.ts` holds the compile-time TypeScript shapes that the application
 * depends on. This module mirrors those shapes as zod schemas so the same
 * contracts can be:
 *   - validated at runtime (e.g. admin-endpoint request payloads), and
 *   - exported as JSON Schema (see `./json-schema`) for OpenAPI generation and
 *     client-SDK shapes.
 *
 * The two definitions are kept in lock-step by the compile-time `Mirrors<>`
 * assertions at the bottom: if a contract interface and its schema drift, the
 * type-check fails. There is no live data here — these are pure shape
 * descriptions, honest about the seed/mock/live `sourceType` like the contracts.
 *
 * NOTE: this uses zod's v4 API (`zod/v4`, shipped inside the installed
 * `zod@3.25` package) because JSON Schema export (`z.toJSONSchema`) lives there.
 * The rest of the app uses the classic `zod` entrypoint; both share one install.
 */
import { z } from "zod/v4";

import type {
  DayHours,
  LocalEvent,
  LocalEventsQuery,
  OpeningHours,
  OpeningHoursQuery,
  Place,
  PlacesQuery,
  ReviewSummary,
  ReviewsQuery,
  SafetyAdvisory,
  SafetyAdvisoryQuery,
  TicketLink,
  TicketLinkQuery,
  TicketPrice,
  TicketPriceQuery,
  TravelDataKind,
} from "./contracts";
import { TRAVEL_DATA_KINDS } from "./contracts";
import type { ProviderSourceClass, SourceMetadata, SourceType } from "./source";

// ── Enumerations ─────────────────────────────────────────────────────────────

export const sourceTypeSchema = z.enum([
  "seed",
  "mock",
  "live",
  "stale",
  "unavailable",
]);

export const providerSourceClassSchema = z.enum(["seed", "mock", "live"]);

/** Mirrors `TRAVEL_DATA_KINDS`, so adding a kind there is a compile error here. */
export const travelDataKindSchema = z.enum(
  TRAVEL_DATA_KINDS as readonly [TravelDataKind, ...TravelDataKind[]],
);

export const advisoryLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

// ── Source metadata ──────────────────────────────────────────────────────────

export const sourceMetadataSchema = z.object({
  sourceName: z.string(),
  sourceType: sourceTypeSchema,
  providerId: z.string(),
  confidence: z.number().min(0).max(1),
  fetchedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  attributionUrl: z.string().optional(),
});

// ── Domain payloads ──────────────────────────────────────────────────────────

export const placeSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  name: z.string(),
  category: z.string(),
  coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
  summary: z.string().optional(),
});

export const dayHoursSchema = z.object({
  day: z.number().int().min(0).max(6),
  closed: z.boolean(),
  open: z.string().optional(),
  close: z.string().optional(),
});

export const openingHoursSchema = z.object({
  placeId: z.string(),
  timezone: z.string(),
  weekly: z.array(dayHoursSchema),
});

export const ticketPriceSchema = z.object({
  placeId: z.string(),
  currency: z.string(),
  free: z.boolean(),
  adult: z.number(),
  child: z.number().optional(),
});

export const ticketLinkSchema = z.object({
  placeId: z.string(),
  vendor: z.string(),
  url: z.string(),
});

export const reviewSummarySchema = z.object({
  placeId: z.string(),
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  highlights: z.array(z.string()).optional(),
});

export const localEventSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  name: z.string(),
  category: z.string(),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  venue: z.string().optional(),
});

export const safetyAdvisorySchema = z.object({
  destinationId: z.string(),
  level: advisoryLevelSchema,
  headline: z.string(),
  summary: z.string().optional(),
  updatedAt: z.string(),
});

// ── Query payloads ───────────────────────────────────────────────────────────

export const placesQuerySchema = z.object({
  destinationId: z.string().min(1),
  limit: z.number().int().positive().optional(),
});

export const openingHoursQuerySchema = z.object({ placeId: z.string().min(1) });
export const ticketPriceQuerySchema = z.object({ placeId: z.string().min(1) });
export const ticketLinkQuerySchema = z.object({ placeId: z.string().min(1) });
export const reviewsQuerySchema = z.object({ placeId: z.string().min(1) });

export const localEventsQuerySchema = z.object({
  destinationId: z.string().min(1),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const safetyAdvisoryQuerySchema = z.object({
  destinationId: z.string().min(1),
});

// ── Response shape (fallback-safe, discriminated) ────────────────────────────

export const travelDataStatusSchema = z.enum(["ok", "unavailable", "error"]);

/**
 * Build the discriminated response schema for a given data schema, mirroring
 * `TravelDataResponse<TData>`: `ok` carries `data`; `unavailable`/`error` carry
 * a `reason` and a `null` `data` (always a present key — fallback-safe).
 */
export function travelDataResponseSchema<TData extends z.ZodType>(data: TData) {
  const base = { providerId: z.string(), kind: travelDataKindSchema, source: sourceMetadataSchema };
  return z.discriminatedUnion("status", [
    z.object({ status: z.literal("ok"), ...base, data }),
    z.object({ status: z.literal("unavailable"), ...base, reason: z.string(), data: z.null() }),
    z.object({ status: z.literal("error"), ...base, reason: z.string(), data: z.null() }),
  ]);
}

// Per-capability response schemas (data payload matched to each kind).
export const placesResponseSchema = travelDataResponseSchema(z.array(placeSchema));
export const openingHoursResponseSchema = travelDataResponseSchema(openingHoursSchema);
export const ticketPriceResponseSchema = travelDataResponseSchema(ticketPriceSchema);
export const ticketLinkResponseSchema = travelDataResponseSchema(z.array(ticketLinkSchema));
export const reviewsResponseSchema = travelDataResponseSchema(reviewSummarySchema);
export const localEventsResponseSchema = travelDataResponseSchema(z.array(localEventSchema));
export const safetyAdvisoryResponseSchema = travelDataResponseSchema(safetyAdvisorySchema);

// ── Named registry of the public contract schemas ───────────────────────────

/**
 * Every contract schema keyed by a stable name. This is the single source the
 * JSON-Schema exporter walks, so adding a schema here surfaces it everywhere
 * (JSON Schema map, docs, tests) without further wiring.
 */
export const travelDataSchemas = {
  SourceMetadata: sourceMetadataSchema,
  Place: placeSchema,
  DayHours: dayHoursSchema,
  OpeningHours: openingHoursSchema,
  TicketPrice: ticketPriceSchema,
  TicketLink: ticketLinkSchema,
  ReviewSummary: reviewSummarySchema,
  LocalEvent: localEventSchema,
  SafetyAdvisory: safetyAdvisorySchema,
  PlacesQuery: placesQuerySchema,
  OpeningHoursQuery: openingHoursQuerySchema,
  TicketPriceQuery: ticketPriceQuerySchema,
  TicketLinkQuery: ticketLinkQuerySchema,
  ReviewsQuery: reviewsQuerySchema,
  LocalEventsQuery: localEventsQuerySchema,
  SafetyAdvisoryQuery: safetyAdvisoryQuerySchema,
} as const;

export type TravelDataSchemaName = keyof typeof travelDataSchemas;

/** The query schema for each travel-data kind, for request validation. */
export const travelDataQuerySchemasByKind = {
  places: placesQuerySchema,
  "opening-hours": openingHoursQuerySchema,
  "ticket-prices": ticketPriceQuerySchema,
  "ticket-links": ticketLinkQuerySchema,
  reviews: reviewsQuerySchema,
  "local-events": localEventsQuerySchema,
  "safety-advisories": safetyAdvisoryQuerySchema,
} as const satisfies Record<TravelDataKind, z.ZodType>;

// ── Compile-time sync guards ─────────────────────────────────────────────────
//
// These assert that each schema's inferred type and its hand-written contract
// interface are mutually assignable. Drift (a renamed/added/removed/retyped
// field on either side) breaks the type-check, keeping contracts.ts and this
// module honest about describing the *same* shape.

type Extends<A, B> = A extends B ? true : false;
/** Strip `readonly` recursively; it is invisible in JSON and differs between
 * the (mutable) zod inference and the (readonly) contract interfaces. */
type DeepMutable<T> = T extends readonly (infer U)[]
  ? DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;
type Mirrors<TSchema, TContract> =
  Extends<DeepMutable<TSchema>, DeepMutable<TContract>> extends true
    ? Extends<DeepMutable<TContract>, DeepMutable<TSchema>> extends true
      ? true
      : false
    : false;
type Expect<T extends true> = T;

type _checks = [
  Expect<Mirrors<z.infer<typeof sourceTypeSchema>, SourceType>>,
  Expect<Mirrors<z.infer<typeof providerSourceClassSchema>, ProviderSourceClass>>,
  Expect<Mirrors<z.infer<typeof travelDataKindSchema>, TravelDataKind>>,
  Expect<Mirrors<z.infer<typeof sourceMetadataSchema>, SourceMetadata>>,
  Expect<Mirrors<z.infer<typeof placeSchema>, Place>>,
  Expect<Mirrors<z.infer<typeof dayHoursSchema>, DayHours>>,
  Expect<Mirrors<z.infer<typeof openingHoursSchema>, OpeningHours>>,
  Expect<Mirrors<z.infer<typeof ticketPriceSchema>, TicketPrice>>,
  Expect<Mirrors<z.infer<typeof ticketLinkSchema>, TicketLink>>,
  Expect<Mirrors<z.infer<typeof reviewSummarySchema>, ReviewSummary>>,
  Expect<Mirrors<z.infer<typeof localEventSchema>, LocalEvent>>,
  Expect<Mirrors<z.infer<typeof safetyAdvisorySchema>, SafetyAdvisory>>,
  Expect<Mirrors<z.infer<typeof placesQuerySchema>, PlacesQuery>>,
  Expect<Mirrors<z.infer<typeof openingHoursQuerySchema>, OpeningHoursQuery>>,
  Expect<Mirrors<z.infer<typeof ticketPriceQuerySchema>, TicketPriceQuery>>,
  Expect<Mirrors<z.infer<typeof ticketLinkQuerySchema>, TicketLinkQuery>>,
  Expect<Mirrors<z.infer<typeof reviewsQuerySchema>, ReviewsQuery>>,
  Expect<Mirrors<z.infer<typeof localEventsQuerySchema>, LocalEventsQuery>>,
  Expect<Mirrors<z.infer<typeof safetyAdvisoryQuerySchema>, SafetyAdvisoryQuery>>,
];
// Reference the tuple so it is not reported as unused.
export type TravelDataSchemaChecks = _checks;
