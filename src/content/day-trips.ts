/**
 * Day trips & excursions (editorial seed data, per destination).
 *
 * Popular trips within reach of each base — what they are, roughly how long it
 * takes to get there and how, and why they're worth it. **Editorial seed data**,
 * not a live transit/tour feed: times are approximate and routes/operators
 * change, so `DAY_TRIPS_DATA_NOTE` is surfaced with every consumer. Mirrors the
 * `hazards.ts` content pattern.
 */

export type DayTripType =
  | "nature"
  | "historic"
  | "beach"
  | "town"
  | "mountains"
  | "desert"
  | "island"
  | "wine_food";

export interface DayTrip {
  readonly name: string;
  readonly types: readonly DayTripType[];
  /** Approximate one-way travel time + mode, e.g. "45 min by train". */
  readonly travelTime: string;
  /** One neutral, factual sentence on why it's worth the trip. */
  readonly note: string;
}

export interface DayTripsProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly trips: readonly DayTrip[];
}

/** Shown with any day-trip data so times read as approximate, not a live feed. */
export const DAY_TRIPS_DATA_NOTE =
  "Editorial suggestions with approximate travel times, not a live transit or " +
  "tour feed — routes, schedules and operators change, so verify current times " +
  "and availability before you go.";

export const dayTripsProfiles: readonly DayTripsProfile[] = [
  {
    destinationId: "kyoto",
    summary: "Kyoto's central rail links put temples, castles and the bright lights of Osaka within an easy day's reach.",
    trips: [
      { name: "Nara", types: ["historic", "nature"], travelTime: "45 min by train", note: "Great temples and Todai-ji's giant Buddha amid a park of free-roaming deer." },
      { name: "Osaka", types: ["town"], travelTime: "30 min by train", note: "A lively food-and-nightlife counterpoint to Kyoto, famous for street eats in Dotonbori." },
      { name: "Uji", types: ["historic", "wine_food"], travelTime: "30 min by train", note: "Home of Byodo-in temple and Japan's finest green tea." },
      { name: "Himeji Castle", types: ["historic"], travelTime: "1.5 h by train", note: "Japan's most spectacular original feudal castle, a brilliant-white hilltop fortress." },
    ],
  },
  {
    destinationId: "santorini",
    summary: "From Santorini the sea is the highway — short boat trips reach the volcano, hot springs and quieter Cycladic islands.",
    trips: [
      { name: "Nea Kameni volcano", types: ["nature"], travelTime: "30 min by boat", note: "Hike the steaming crater of the active volcano in the middle of the caldera." },
      { name: "Thirassia island", types: ["island"], travelTime: "30 min by boat", note: "The caldera's quiet sibling island, a glimpse of Santorini before mass tourism." },
      { name: "Ios", types: ["island", "beach"], travelTime: "45 min by ferry", note: "A lively neighbouring island with excellent beaches and a buzzing summer scene." },
      { name: "Akrotiri excavations", types: ["historic"], travelTime: "20 min by bus", note: "A remarkably preserved Bronze-Age town buried by eruption, the 'Greek Pompeii'." },
    ],
  },
  {
    destinationId: "marrakech",
    summary: "Marrakech is a launchpad for the High Atlas, the desert fringe and the Atlantic coast.",
    trips: [
      { name: "Ourika Valley & Atlas foothills", types: ["mountains", "nature"], travelTime: "1 h by car", note: "Berber villages, waterfalls and cool green valleys at the foot of the High Atlas." },
      { name: "Agafay Desert", types: ["desert"], travelTime: "45 min by car", note: "A rocky desert of camp dinners and camel rides within easy reach of the city." },
      { name: "Aït Benhaddou", types: ["historic", "desert"], travelTime: "3.5 h by car", note: "A spectacular fortified earthen ksar and famous film location beyond the Tizi n'Tichka pass." },
      { name: "Essaouira", types: ["beach", "town"], travelTime: "3 h by car/bus", note: "A breezy, walled Atlantic port town of ramparts, seafood and laid-back charm." },
    ],
  },
  {
    destinationId: "patagonia",
    summary: "In Patagonia the 'day trips' are the headline sights themselves — glaciers, granite spires and turquoise lakes from the gateway towns.",
    trips: [
      { name: "Perito Moreno Glacier", types: ["nature", "mountains"], travelTime: "1.5 h by bus from El Calafate", note: "Boardwalks face a colossal advancing glacier that regularly calves into the lake." },
      { name: "Laguna de los Tres (Fitz Roy)", types: ["mountains", "nature"], travelTime: "trailhead in El Chaltén", note: "A demanding day hike to a glacial lagoon beneath the iconic Fitz Roy spires." },
      { name: "Torres del Paine viewpoints", types: ["mountains", "nature"], travelTime: "2 h by road from Puerto Natales", note: "Day visits reach lakes, waterfalls and the base of the famous granite towers." },
      { name: "Lago Nahuel Huapi (Bariloche)", types: ["nature", "town"], travelTime: "lakeside in Bariloche", note: "Scenic-drive and boat outings around a vast alpine lake in the Lake District." },
    ],
  },
];
