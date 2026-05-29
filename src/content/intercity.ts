/**
 * Best intercity options (editorial seed data, per destination).
 *
 * Describes the *typical* best ways to travel onward from a destination to
 * nearby key cities and hubs — the next big city, the capital, a popular
 * neighbouring destination — covering mode, approximate duration, rough
 * frequency, and which option is generally recommended and why. This is
 * editorial background to help travellers plan a sensible onward leg — it is
 * **not** a live schedule, fare or availability feed. Routes, operators and
 * times change. `INTERCITY_DATA_NOTE` is surfaced with every consumer. Mirrors
 * the `hazards.ts` content pattern.
 */

export type IntercityMode =
  | "flight"
  | "train"
  | "high_speed_train"
  | "bus"
  | "ferry"
  | "car"
  | "shared_van";

export interface IntercityRoute {
  /** Destination city or place name reachable from this origin. */
  readonly to: string;
  readonly mode: IntercityMode;
  /** Approximate door-to-door-ish travel time, e.g. "2h 15m". */
  readonly approxDuration: string;
  /** Rough service frequency, e.g. "every 30 min" or "several daily". */
  readonly frequency: string;
  /** Whether this is a generally recommended onward option. */
  readonly recommended: boolean;
  /** One practical sentence: why it is recommended, or a useful tip. */
  readonly note: string;
}

export interface IntercityProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly routes: readonly IntercityRoute[];
}

/** Shown with any intercity data so it reads as editorial guidance, not a live feed. */
export const INTERCITY_DATA_NOTE =
  "Editorial seed of typical onward travel options with approximate durations " +
  "and rough frequencies. It is not a live schedule, timetable or fare feed, " +
  "and not a guarantee of availability. Routes, operators, schedules and fares " +
  "change, so always verify current times and book before you travel.";

export const intercityProfiles: readonly IntercityProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto sits on Japan's main rail spine, so fast, frequent trains reach Osaka, Tokyo and the wider Kansai region with ease.",
    routes: [
      {
        to: "Osaka",
        mode: "high_speed_train",
        approxDuration: "15m",
        frequency: "every few minutes",
        recommended: true,
        note: "The Shinkansen covers Kyoto–Shin-Osaka in about 15 minutes; the slower JR Special Rapid into Osaka Station takes roughly 30 minutes and needs no surcharge.",
      },
      {
        to: "Tokyo",
        mode: "high_speed_train",
        approxDuration: "2h 15m",
        frequency: "several per hour",
        recommended: true,
        note: "The Tokaido Shinkansen (Nozomi/Hikari) is the fastest and most comfortable link to Tokyo, easily beating flying once airport transfers are counted.",
      },
      {
        to: "Nara",
        mode: "train",
        approxDuration: "45m",
        frequency: "several per hour",
        recommended: false,
        note: "Frequent JR and Kintetsu trains make Nara and its great temples an easy day trip from Kyoto.",
      },
      {
        to: "Kanazawa",
        mode: "train",
        approxDuration: "2h",
        frequency: "hourly",
        recommended: false,
        note: "The limited express Thunderbird runs to Kanazawa for its gardens and old districts; check for transfers as services have shifted with new Shinkansen extensions.",
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "As a Cyclades island, Santorini connects to mainland Greece by a short flight or longer ferry, and to neighbouring islands by sea.",
    routes: [
      {
        to: "Athens",
        mode: "flight",
        approxDuration: "50m",
        frequency: "several daily",
        recommended: true,
        note: "A short domestic flight is the quickest way to the capital; the alternative is a 5–8h ferry that is cheaper and scenic but far slower.",
      },
      {
        to: "Mykonos",
        mode: "ferry",
        approxDuration: "2h 30m",
        frequency: "several daily in summer",
        recommended: false,
        note: "High-speed ferries link the two best-known Cyclades islands in roughly 2–3 hours; sailings thin out sharply outside the summer season.",
      },
      {
        to: "Crete",
        mode: "ferry",
        approxDuration: "2h",
        frequency: "daily in season",
        recommended: false,
        note: "Fast ferries reach Heraklion on Crete in about two hours; service is seasonal and weather-dependent, so confirm the day before.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech is a hub on Morocco's rail and road network, with trains north to the coast and cities and overland routes east to the desert.",
    routes: [
      {
        to: "Casablanca",
        mode: "train",
        approxDuration: "3h",
        frequency: "roughly hourly",
        recommended: true,
        note: "Frequent, comfortable ONCF trains make Casablanca the easy onward hub; book first class for a reserved, calmer seat.",
      },
      {
        to: "Fez",
        mode: "train",
        approxDuration: "7h",
        frequency: "several daily",
        recommended: false,
        note: "Direct trains to Fez take around seven hours; a short domestic flight is worth considering if time is tight.",
      },
      {
        to: "Essaouira",
        mode: "bus",
        approxDuration: "3h",
        frequency: "several daily",
        recommended: false,
        note: "Supratours and CTM coaches run to the breezy Atlantic town of Essaouira in about three hours; there is no rail line on this route.",
      },
      {
        to: "Sahara / Merzouga",
        mode: "shared_van",
        approxDuration: "9h",
        frequency: "daily tours",
        recommended: false,
        note: "Reaching the Erg Chebbi dunes is a long haul best done as a 2–3 day shared-van or private-car tour rather than a single tiring day.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "From the El Calafate gateway, short hops by bus reach nearby trekking towns while flights cover Patagonia's vast cross-region distances.",
    routes: [
      {
        to: "El Chaltén",
        mode: "bus",
        approxDuration: "3h",
        frequency: "several daily in season",
        recommended: true,
        note: "Regular buses link El Calafate with the trekking capital El Chaltén in about three hours; service is seasonal, so book ahead in peak summer.",
      },
      {
        to: "Puerto Natales (Chile)",
        mode: "bus",
        approxDuration: "5h 30m",
        frequency: "daily in season",
        recommended: false,
        note: "Cross-border buses run to Puerto Natales, the gateway to Torres del Paine; allow extra time for the Argentina–Chile border formalities.",
      },
      {
        to: "Ushuaia",
        mode: "flight",
        approxDuration: "1h 20m",
        frequency: "daily",
        recommended: true,
        note: "Flying to the southern city of Ushuaia is strongly preferred over the very long, multi-day overland bus route.",
      },
      {
        to: "Bariloche",
        mode: "flight",
        approxDuration: "1h 50m",
        frequency: "several weekly",
        recommended: false,
        note: "Bariloche lies far to the north, so a flight (often via Buenos Aires) is far more practical than the marathon overland journey.",
      },
    ],
  },
];
