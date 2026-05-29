/**
 * Tipping norms & service charges (editorial seed data).
 *
 * Per-destination expectations for tipping in restaurants, taxis and hotels,
 * plus whether a service charge is usually already on the bill — so travellers
 * neither under- nor over-tip, and don't accidentally cause offence.
 * **Editorial seed data**, not a live guide — customs vary by venue and shift
 * over time, so `TIPPING_DATA_NOTE` is surfaced with every consumer.
 * Mirrors the `festivals.ts` content pattern.
 */

export type TippingExpectation = "not_expected" | "round_up" | "appreciated" | "expected";

export interface TippingProfile {
  readonly destinationId: string;
  /** General expectation for tipping at restaurants. */
  readonly restaurants: TippingExpectation;
  /** Typical restaurant tip range when tipping applies (e.g. "5–10%"). */
  readonly restaurantPct?: string;
  /** Whether a service charge is usually already added to the bill. */
  readonly serviceChargeIncluded: boolean;
  /** General expectation for tipping taxi drivers. */
  readonly taxis: TippingExpectation;
  /** Short note on hotel tipping (porters, housekeeping). */
  readonly hotels: string;
  /** One-paragraph editorial summary of the local tipping culture. */
  readonly summary: string;
}

/** Shown with any tipping data so norms read as guidance, not rules. */
export const TIPPING_DATA_NOTE =
  "Editorial guide; tipping customs vary by venue and change over time — " +
  "check your bill for an existing service charge and verify local norms before you go.";

export const tippingProfiles: readonly TippingProfile[] = [
  {
    destinationId: "kyoto",
    restaurants: "not_expected",
    serviceChargeIncluded: false,
    taxis: "not_expected",
    hotels: "Not expected; high-end ryokan may include service in the rate.",
    summary:
      "Tipping is not part of Japanese culture and can confuse or even offend — attentive service is considered standard. Don't leave cash on the table; if you want to thank a ryokan host, present a small gift discreetly in an envelope. Restaurants rarely add a service charge, though some upscale or izakaya venues levy a small otōshi/seating charge.",
  },
  {
    destinationId: "santorini",
    restaurants: "appreciated",
    restaurantPct: "5–10%",
    serviceChargeIncluded: false,
    taxis: "round_up",
    hotels: "1–2 EUR per bag for porters; a few euros for housekeeping is kind.",
    summary:
      "Tipping is appreciated but not obligatory in Greece. A service charge is sometimes included on the bill, so check first; if not, rounding up or leaving 5–10% for good service is the norm. Round up taxi fares to the nearest euro or two.",
  },
  {
    destinationId: "marrakech",
    restaurants: "expected",
    restaurantPct: "5–10%",
    serviceChargeIncluded: false,
    taxis: "round_up",
    hotels: "10–20 MAD for porters; a few dirham daily for housekeeping.",
    summary:
      "Morocco has a customary 'dirham tipping' (pourboire) culture — small tips are expected widely, for waiters, guides, parking attendants and anyone who helps you. Around 5–10% in restaurants is standard, and keeping small coins on hand makes daily life smoother. Round up taxi fares, especially in petit taxis.",
  },
  {
    destinationId: "patagonia",
    restaurants: "expected",
    restaurantPct: "~10%",
    serviceChargeIncluded: false,
    taxis: "round_up",
    hotels: "A small note for porters; tip guides on multi-day treks.",
    summary:
      "In Argentina and Chile a roughly 10% restaurant tip (la propina) is expected and appreciated, and is usually not included in the bill — note that a 'cubierto' cover charge in Argentina is not a tip. Round up taxi fares; on guided treks and estancia stays, tipping guides and staff is customary.",
  },
];
