/**
 * Transport modes (editorial seed data, per destination).
 *
 * A *comprehensive* catalogue of the means of transport a traveller can
 * realistically ride in each destination — metro, bus, tram, train, taxi,
 * rideshare, tuk-tuks, ferries, funiculars, scooter and bike rentals, horse
 * carriages, walking and more — each tagged with how available it generally is
 * and a short, factual note on where or when it is useful. This *complements*
 * the `transit-howto` feature (ticketing and payment how-to): this one answers
 * "what can I ride here". It is an editorial snapshot of what is *typically*
 * available, not a live availability or fare feed. `TRANSPORT_MODES_NOTE` is
 * surfaced with every consumer. Mirrors the `hazards.ts` content pattern.
 */

export type TransportMode =
  | "metro_subway"
  | "bus"
  | "tram"
  | "train"
  | "taxi"
  | "rideshare"
  | "tuk_tuk"
  | "auto_rickshaw"
  | "ferry"
  | "water_taxi"
  | "funicular"
  | "cable_car"
  | "scooter_rental"
  | "atv_quad_rental"
  | "car_rental"
  | "bike_share"
  | "horse_carriage"
  | "walk";

export type Availability = "ubiquitous" | "common" | "limited" | "tourist_only";

export interface TransportOption {
  readonly mode: TransportMode;
  readonly availability: Availability;
  /** One factual sentence: where or when this mode is useful. */
  readonly note: string;
}

export interface TransportModesProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly modes: readonly TransportOption[];
}

/** Shown with any transport-modes data so it reads as a typical snapshot, not live. */
export const TRANSPORT_MODES_NOTE =
  "Editorial seed describing the transport modes that are typically available " +
  "in each destination, not a live availability or fare feed. Modes, operators, " +
  "routes and fares change over time and vary by season, so always verify " +
  "what is running locally before you rely on it.";

export const transportModesProfiles: readonly TransportModesProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto is best covered by its dense bus network and rail, with two subway lines, taxis and bike share filling the gaps.",
    modes: [
      { mode: "metro_subway", availability: "common", note: "Kyoto's two subway lines (Karasuma and Tozai) cover key north–south and east–west corridors through the city centre." },
      { mode: "bus", availability: "ubiquitous", note: "An extensive city bus network reaches most temples and neighbourhoods and is the workhorse for sightseeing." },
      { mode: "train", availability: "ubiquitous", note: "JR and private lines (Keihan, Hankyu, Kintetsu) link Kyoto Station with the wider region and nearby districts like Arashiyama." },
      { mode: "taxi", availability: "common", note: "Metered taxis are readily found at stations and ranks and are handy for late-night or luggage-heavy trips." },
      { mode: "rideshare", availability: "limited", note: "Japan restricts ride-hailing, so apps like Uber and GO mainly dispatch licensed taxis rather than private drivers." },
      { mode: "bike_share", availability: "common", note: "Bicycle share and rental are popular for exploring Kyoto's flat central grid at your own pace." },
      { mode: "walk", availability: "ubiquitous", note: "Many historic districts such as Gion and Higashiyama are compact and best explored on foot." },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini relies on a bus hub at Fira plus rented ATVs and cars, with a handful of taxis and ferries from the port.",
    modes: [
      { mode: "bus", availability: "common", note: "KTEL buses radiate from the central hub at Fira to villages such as Oia, Kamari and the port at Athinios." },
      { mode: "taxi", availability: "limited", note: "The island has only a small fleet of taxis, so they are scarce and best booked ahead in peak season." },
      { mode: "atv_quad_rental", availability: "common", note: "Rented ATVs and quad bikes are a popular tourist way to reach beaches and viewpoints independently." },
      { mode: "car_rental", availability: "common", note: "Small rental cars give flexibility to tour the island, though parking in Fira and Oia is tight." },
      { mode: "ferry", availability: "common", note: "Ferries and catamarans from Athinios and the old port connect Santorini to Crete, the mainland and neighbouring Cyclades." },
      { mode: "walk", availability: "common", note: "The caldera-edge path between Fira and Oia and the compact village centres reward walking." },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech runs on petits taxis, city buses and your own feet inside the medina, with caleches and rental cars for specific needs.",
    modes: [
      { mode: "taxi", availability: "ubiquitous", note: "Beige petits taxis swarm the city for short hops, while larger grands taxis handle longer or out-of-town routes." },
      { mode: "bus", availability: "common", note: "Alsa city buses link the medina, Gueliz and outlying neighbourhoods at low fares." },
      { mode: "horse_carriage", availability: "tourist_only", note: "Horse-drawn caleches operate mainly as a sightseeing ride around the ramparts and central squares." },
      { mode: "scooter_rental", availability: "common", note: "Mopeds and scooters are everywhere and can be rented, though the dense medina traffic suits only confident riders." },
      { mode: "car_rental", availability: "limited", note: "Rental cars are available and useful for day trips to the Atlas or coast, but impractical inside the walled medina." },
      { mode: "walk", availability: "ubiquitous", note: "The medina's narrow, largely car-free lanes mean walking is the only practical way to reach most riads and souks." },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia is built around long-distance buses and rental cars between towns and parks, with occasional ferries and scarce taxis.",
    modes: [
      { mode: "bus", availability: "common", note: "Long-distance coaches are the backbone of travel between towns such as El Calafate, Puerto Natales and Punta Arenas." },
      { mode: "car_rental", availability: "common", note: "A rental car is the most flexible way to reach trailheads and national parks on the region's long, sparse roads." },
      { mode: "taxi", availability: "limited", note: "Taxis and remises are found in the larger towns but are scarce in remote areas and between settlements." },
      { mode: "ferry", availability: "limited", note: "Boat and ferry crossings serve specific lake and fjord routes, including glacier excursions and the Chilean fjords." },
      { mode: "walk", availability: "common", note: "Town centres are small enough to cross on foot, and walking is how most visitors experience the parks themselves." },
    ],
  },
];
