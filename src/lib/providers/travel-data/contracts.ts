/**
 * Travel-data provider contracts (backend-only).
 *
 * These are the capability interfaces for real-world travel intelligence:
 * places, opening hours, ticket prices, ticket links, reviews, local events and
 * safety advisories. They are provider-agnostic (ADR-003): the application
 * depends on these shapes, and concrete adapters (seed today; live vendors
 * later, behind the same contract) are swapped without touching callers.
 *
 * IMPORTANT: no live vendor is wired here. The only adapters that exist today
 * are clearly-labeled SEED adapters (`./seed`). Every response carries
 * `SourceMetadata` so seed data can never be mistaken for live data.
 */
import type { ProviderSourceClass, SourceMetadata } from "./source";

/** The kinds of travel data a provider can answer for. */
export type TravelDataKind =
  | "places"
  | "opening-hours"
  | "ticket-prices"
  | "ticket-links"
  | "reviews"
  | "local-events"
  | "safety-advisories";

export const TRAVEL_DATA_KINDS: readonly TravelDataKind[] = [
  "places",
  "opening-hours",
  "ticket-prices",
  "ticket-links",
  "reviews",
  "local-events",
  "safety-advisories",
];

// ── Domain payloads ────────────────────────────────────────────────────────

/** A place or attraction at a destination. */
export interface Place {
  readonly id: string;
  readonly destinationId: string;
  readonly name: string;
  /** e.g. "landmark" | "museum" | "park" | "viewpoint". */
  readonly category: string;
  readonly coordinates?: { readonly lat: number; readonly lon: number };
  readonly summary?: string;
}

/** Hours for one day of the week. `closed` short-circuits open/close. */
export interface DayHours {
  /** 0 = Sunday … 6 = Saturday. */
  readonly day: number;
  readonly closed: boolean;
  /** "HH:MM" 24h local time; omitted when closed. */
  readonly open?: string;
  readonly close?: string;
}

export interface OpeningHours {
  readonly placeId: string;
  /** IANA timezone, e.g. "Asia/Tokyo". */
  readonly timezone: string;
  readonly weekly: readonly DayHours[];
}

export interface TicketPrice {
  readonly placeId: string;
  /** ISO 4217 currency code. */
  readonly currency: string;
  /** True when entry is free; amounts are then 0. */
  readonly free: boolean;
  readonly adult: number;
  readonly child?: number;
}

export interface TicketLink {
  readonly placeId: string;
  /** Generic vendor label — no vendor-specific coupling at the contract level. */
  readonly vendor: string;
  readonly url: string;
}

export interface ReviewSummary {
  readonly placeId: string;
  /** 0..5. */
  readonly averageRating: number;
  readonly reviewCount: number;
  readonly highlights?: readonly string[];
}

export interface LocalEvent {
  readonly id: string;
  readonly destinationId: string;
  readonly name: string;
  readonly category: string;
  /** ISO timestamp. */
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly venue?: string;
}

/** Travel advisory level, modeled on common 1..4 government scales. */
export type AdvisoryLevel = 1 | 2 | 3 | 4;

export interface SafetyAdvisory {
  readonly destinationId: string;
  readonly level: AdvisoryLevel;
  readonly headline: string;
  readonly summary?: string;
  /** ISO timestamp the advisory was issued/updated. */
  readonly updatedAt: string;
}

// ── Query payloads ───────────────────────────────────────────────────────────

export interface PlacesQuery {
  readonly destinationId: string;
  readonly limit?: number;
}
export interface OpeningHoursQuery {
  readonly placeId: string;
}
export interface TicketPriceQuery {
  readonly placeId: string;
}
export interface TicketLinkQuery {
  readonly placeId: string;
}
export interface ReviewsQuery {
  readonly placeId: string;
}
export interface LocalEventsQuery {
  readonly destinationId: string;
  /** Optional ISO window. */
  readonly from?: string;
  readonly to?: string;
}
export interface SafetyAdvisoryQuery {
  readonly destinationId: string;
}

// ── Response shape (fallback-safe, discriminated) ────────────────────────────

export type TravelDataStatus = "ok" | "unavailable" | "error";

interface TravelDataResponseBase {
  readonly providerId: string;
  readonly kind: TravelDataKind;
  readonly source: SourceMetadata;
}

export interface TravelDataOk<TData> extends TravelDataResponseBase {
  readonly status: "ok";
  readonly data: TData;
}

export interface TravelDataUnavailable extends TravelDataResponseBase {
  readonly status: "unavailable";
  /** Why the provider could not serve (e.g. "not configured"). */
  readonly reason: string;
  readonly data: null;
}

export interface TravelDataError extends TravelDataResponseBase {
  readonly status: "error";
  readonly reason: string;
  readonly data: null;
}

/**
 * Fallback-safe response: `data` is always a present key (null unless `ok`), so
 * callers can destructure without guards, and unavailable/error states are
 * explicit and carry a reason rather than throwing.
 */
export type TravelDataResponse<TData> =
  | TravelDataOk<TData>
  | TravelDataUnavailable
  | TravelDataError;

// ── Provider contract ────────────────────────────────────────────────────────

/**
 * A travel-data provider. Parameterized by query + data so the same contract
 * covers every kind. `sourceType` declares the provider's nature (seed/mock/
 * live) for readiness reporting; the per-response `source` may further reflect
 * runtime states (e.g. stale). `fetch` MUST resolve to a `TravelDataResponse`
 * and must not throw for expected unavailable states — it returns them.
 */
export interface TravelDataProvider<TQuery, TData> {
  readonly id: string;
  readonly name: string;
  readonly kind: TravelDataKind;
  readonly sourceType: ProviderSourceClass;
  isAvailable(): boolean | Promise<boolean>;
  fetch(query: TQuery): Promise<TravelDataResponse<TData>>;
}

// Convenience aliases per capability.
export type PlacesProvider = TravelDataProvider<PlacesQuery, readonly Place[]>;
export type OpeningHoursProvider = TravelDataProvider<OpeningHoursQuery, OpeningHours>;
export type TicketPriceProvider = TravelDataProvider<TicketPriceQuery, TicketPrice>;
export type TicketLinkProvider = TravelDataProvider<TicketLinkQuery, readonly TicketLink[]>;
export type ReviewsProvider = TravelDataProvider<ReviewsQuery, ReviewSummary>;
export type LocalEventsProvider = TravelDataProvider<LocalEventsQuery, readonly LocalEvent[]>;
export type SafetyAdvisoryProvider = TravelDataProvider<SafetyAdvisoryQuery, SafetyAdvisory>;

// ── Response helpers ─────────────────────────────────────────────────────────

export function okResponse<TData>(
  providerId: string,
  kind: TravelDataKind,
  data: TData,
  source: SourceMetadata,
): TravelDataOk<TData> {
  return { status: "ok", providerId, kind, data, source };
}

export function unavailableResponse(
  providerId: string,
  kind: TravelDataKind,
  reason: string,
  source: SourceMetadata,
): TravelDataUnavailable {
  return { status: "unavailable", providerId, kind, reason, data: null, source };
}

export function errorResponse(
  providerId: string,
  kind: TravelDataKind,
  reason: string,
  source: SourceMetadata,
): TravelDataError {
  return { status: "error", providerId, kind, reason, data: null, source };
}
