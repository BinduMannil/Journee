/**
 * Airport & airline service ratings (editorial seed data).
 *
 * Editorial 0..5 ratings across service dimensions (staff, cleanliness, comfort,
 * value) for the airports in `airports.ts`, and for a handful of airlines that
 * serve the seed destinations — **rated per cabin class** (economy → first), so
 * the experience reflects what you actually booked. **Editorial / subjective
 * seed data**, not survey results or a live feed; `TRANSIT_RATINGS_NOTE` is
 * surfaced with every consumer. Mirrors the `fruits.ts` content pattern.
 */

export type ServiceDimension = "staff" | "cleanliness" | "comfort" | "value";
export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export interface DimensionRatings {
  /** All 0..5 (editorial). */
  readonly staff: number;
  readonly cleanliness: number;
  readonly comfort: number;
  readonly value: number;
}

export interface AirportServiceRating {
  /** IATA code — matches an airport in `airports.ts`. */
  readonly code: string;
  readonly destinationId: string;
  readonly ratings: DimensionRatings;
}

export interface AirlineClassRating {
  readonly cabin: CabinClass;
  readonly ratings: DimensionRatings;
}

export interface AirlineRating {
  readonly name: string;
  /** IATA airline code. */
  readonly iata: string;
  readonly byClass: readonly AirlineClassRating[];
}

/** Shown with any transit ratings so they read as an editorial view, not fact. */
export const TRANSIT_RATINGS_NOTE =
  "Editorial, subjective ratings for orientation — not survey data or a live " +
  "feed. Experiences vary; verify with recent reviews.";

export const airportServiceRatings: readonly AirportServiceRating[] = [
  { code: "KIX", destinationId: "kyoto", ratings: { staff: 4.3, cleanliness: 4.6, comfort: 4.2, value: 3.8 } },
  { code: "ITM", destinationId: "kyoto", ratings: { staff: 4.2, cleanliness: 4.4, comfort: 4.0, value: 3.9 } },
  { code: "JTR", destinationId: "santorini", ratings: { staff: 3.5, cleanliness: 3.6, comfort: 3.0, value: 3.2 } },
  { code: "RAK", destinationId: "marrakech", ratings: { staff: 3.6, cleanliness: 3.8, comfort: 3.5, value: 3.7 } },
  { code: "FTE", destinationId: "patagonia", ratings: { staff: 3.8, cleanliness: 4.0, comfort: 3.5, value: 3.6 } },
  { code: "BRC", destinationId: "patagonia", ratings: { staff: 3.8, cleanliness: 3.9, comfort: 3.6, value: 3.7 } },
];

export const airlineRatings: readonly AirlineRating[] = [
  {
    name: "Japan Airlines",
    iata: "JL",
    byClass: [
      { cabin: "economy", ratings: { staff: 4.5, cleanliness: 4.6, comfort: 4.0, value: 4.0 } },
      { cabin: "business", ratings: { staff: 4.7, cleanliness: 4.7, comfort: 4.6, value: 4.2 } },
    ],
  },
  {
    name: "ANA",
    iata: "NH",
    byClass: [
      { cabin: "economy", ratings: { staff: 4.5, cleanliness: 4.6, comfort: 4.1, value: 4.0 } },
      { cabin: "business", ratings: { staff: 4.7, cleanliness: 4.7, comfort: 4.6, value: 4.2 } },
    ],
  },
  {
    name: "Aegean Airlines",
    iata: "A3",
    byClass: [
      { cabin: "economy", ratings: { staff: 4.2, cleanliness: 4.2, comfort: 3.9, value: 4.1 } },
      { cabin: "business", ratings: { staff: 4.4, cleanliness: 4.4, comfort: 4.3, value: 4.0 } },
    ],
  },
  {
    name: "Royal Air Maroc",
    iata: "AT",
    byClass: [
      { cabin: "economy", ratings: { staff: 3.6, cleanliness: 3.7, comfort: 3.6, value: 3.6 } },
      { cabin: "business", ratings: { staff: 4.0, cleanliness: 4.0, comfort: 4.1, value: 3.8 } },
    ],
  },
  {
    name: "LATAM",
    iata: "LA",
    byClass: [
      { cabin: "economy", ratings: { staff: 3.8, cleanliness: 3.9, comfort: 3.7, value: 3.8 } },
      { cabin: "business", ratings: { staff: 4.2, cleanliness: 4.2, comfort: 4.2, value: 3.9 } },
    ],
  },
  {
    name: "Aerolíneas Argentinas",
    iata: "AR",
    byClass: [
      { cabin: "economy", ratings: { staff: 3.6, cleanliness: 3.7, comfort: 3.6, value: 3.7 } },
      { cabin: "business", ratings: { staff: 3.9, cleanliness: 3.9, comfort: 4.0, value: 3.7 } },
    ],
  },
];
