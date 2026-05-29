/**
 * Itinerary combos — "best cities & sites to club together" (editorial seed data,
 * per destination).
 *
 * For each destination, suggests places that pair naturally with it on one trip
 * (nearby cities, regions, islands or sites), why they pair well, and a rough
 * number of days to spend at each. This is editorial trip-planning inspiration to
 * help travellers sketch a combined itinerary — it is **not** a prescriptive plan,
 * and seasons, personal interests and available time all change what makes sense.
 * `COMBOS_DATA_NOTE` is surfaced with every consumer. Mirrors the `hazards.ts`
 * content pattern.
 */

export type ComboReason =
  | "same_region"
  | "easy_transport"
  | "complementary_vibe"
  | "common_route"
  | "logical_extension";

export interface ComboPlace {
  readonly name: string;
  readonly reasons: readonly ComboReason[];
  /** Recommended number of days to spend there on a combined trip. */
  readonly suggestedDays: number;
  /** One factual sentence on why it pairs well with the destination. */
  readonly note: string;
}

export interface CombosProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** Suggested total days for a good combined trip built around this destination. */
  readonly suggestedTripDays: number;
  readonly pairsWith: readonly ComboPlace[];
}

/** Shown with any combos data so it reads as a starting point, not a fixed plan. */
export const COMBOS_DATA_NOTE =
  "Editorial suggestions for trip planning, offered as inspiration rather than a " +
  "prescriptive itinerary. Which places pair well, and how many days each deserves, " +
  "vary with the season, your interests and the time you have — treat these as a " +
  "starting point and adjust to suit your own trip.";

export const combosProfiles: readonly CombosProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto sits at the heart of Japan's Kansai region and on the main Tokaido " +
      "corridor, so it combines easily with Osaka, Nara, Tokyo and the Mt Fuji area.",
    suggestedTripDays: 10,
    pairsWith: [
      {
        name: "Osaka",
        reasons: ["easy_transport", "complementary_vibe"],
        suggestedDays: 2,
        note: "Roughly 15 minutes from Kyoto by rapid train, Osaka's brash food-and-nightlife energy is a lively counterpoint to Kyoto's calm temples.",
      },
      {
        name: "Tokyo",
        reasons: ["common_route"],
        suggestedDays: 3,
        note: "Tokyo and Kyoto are the two anchors of most first Japan trips, linked in about 2.5 hours by the Tokaido Shinkansen.",
      },
      {
        name: "Nara",
        reasons: ["same_region", "easy_transport"],
        suggestedDays: 1,
        note: "An easy 45-minute day trip from Kyoto, with Todai-ji's Great Buddha and the free-roaming deer of Nara Park.",
      },
      {
        name: "Hakone / Mt Fuji",
        reasons: ["logical_extension"],
        suggestedDays: 2,
        note: "Reached en route to or from Tokyo, Hakone offers hot springs and Mt Fuji views that round out a Kyoto-Tokyo journey.",
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini is a Cyclades island reached via Athens, so it pairs naturally with " +
      "the Greek capital and with neighbouring islands like Mykonos, Naxos and Crete.",
    suggestedTripDays: 10,
    pairsWith: [
      {
        name: "Athens",
        reasons: ["common_route", "easy_transport"],
        suggestedDays: 2,
        note: "Most visitors fly into Athens, making the Acropolis and old city a natural first or last stop before the islands.",
      },
      {
        name: "Mykonos",
        reasons: ["same_region", "complementary_vibe"],
        suggestedDays: 2,
        note: "A short ferry away in the same Cyclades, Mykonos trades Santorini's caldera sunsets for beaches and nightlife.",
      },
      {
        name: "Crete",
        reasons: ["same_region"],
        suggestedDays: 3,
        note: "A direct ferry south reaches Greece's largest island, with Minoan ruins, mountains and beaches for a slower second leg.",
      },
      {
        name: "Naxos / Paros",
        reasons: ["same_region"],
        suggestedDays: 2,
        note: "These central Cyclades islands sit on the same ferry routes and offer a quieter, more local island-hopping stop.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech is a hub for southern Morocco, combining well with the imperial city " +
      "of Fez, the Sahara at Merzouga, coastal Essaouira and the High Atlas mountains.",
    suggestedTripDays: 10,
    pairsWith: [
      {
        name: "Fez",
        reasons: ["common_route", "complementary_vibe"],
        suggestedDays: 2,
        note: "Morocco's other great imperial city pairs classically with Marrakech, its labyrinthine medieval medina contrasting Marrakech's livelier square.",
      },
      {
        name: "Sahara / Merzouga",
        reasons: ["logical_extension"],
        suggestedDays: 3,
        note: "The Erg Chebbi dunes near Merzouga are the usual desert extension from Marrakech, typically a multi-day overland loop.",
      },
      {
        name: "Essaouira",
        reasons: ["easy_transport"],
        suggestedDays: 2,
        note: "About 3 hours west by road, this breezy Atlantic port offers a relaxed coastal break from Marrakech's intensity.",
      },
      {
        name: "Atlas Mountains",
        reasons: ["same_region"],
        suggestedDays: 1,
        note: "The High Atlas rises just south of the city, putting Berber villages and the Ourika Valley within an easy day trip.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia spans Argentina and Chile, so it pairs naturally with El Chaltén, " +
      "Torres del Paine and Ushuaia, with Bariloche as a farther northern option.",
    suggestedTripDays: 12,
    pairsWith: [
      {
        name: "El Chaltén",
        reasons: ["same_region", "easy_transport"],
        suggestedDays: 3,
        note: "Argentina's trekking capital sits about 3 hours from El Calafate, with day hikes to Fitz Roy that need no guide.",
      },
      {
        name: "Torres del Paine",
        reasons: ["logical_extension", "common_route"],
        suggestedDays: 4,
        note: "Chile's flagship national park is the classic cross-border extension, famed for the W and O trekking circuits.",
      },
      {
        name: "Ushuaia",
        reasons: ["logical_extension"],
        suggestedDays: 2,
        note: "The world's southernmost city is the gateway to the Beagle Channel and a common add-on at the end of a Patagonia trip.",
      },
      {
        name: "Bariloche",
        reasons: ["same_region"],
        suggestedDays: 3,
        note: "Far to the north in the Argentine Lake District, Bariloche adds alpine lakes and forests but requires a flight to reach.",
      },
    ],
  },
];
