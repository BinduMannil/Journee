/**
 * Airport & terminal intelligence (editorial seed data).
 *
 * The practical airport facts a traveller wants before arrival: how many
 * terminals, how you move between them (walk / shuttle bus / inter-terminal
 * train), how you typically board the plane (jet bridge vs bus to stand vs
 * stairs), how far the airport is from the city, and how to get into town.
 * **Editorial seed data**, not a live feed — layouts and services change, so
 * `AIRPORTS_DATA_NOTE` is surfaced with every consumer. Mirrors the
 * `shopping.ts` content pattern.
 */

export type TransferMode = "walk" | "shuttle_bus" | "train" | "metro" | "none";
export type BoardingMethod = "jet_bridge" | "bus_to_stand" | "stairs" | "mixed";
export type CityAccessMode = "metro" | "rail" | "bus" | "taxi" | "shuttle";

export interface AirportInfo {
  /** IATA code. */
  readonly code: string;
  readonly name: string;
  readonly terminals: number;
  /** How you move between terminals (`none` when single-terminal). */
  readonly interTerminalTransfer: TransferMode;
  /** Typical way you board the aircraft. */
  readonly boarding: BoardingMethod;
  /** Approx distance from the airport to the city/destination centre, km. */
  readonly distanceToCityKm: number;
  /** Ways to get from the airport into town. */
  readonly cityAccess: readonly CityAccessMode[];
  readonly note?: string;
}

export interface AirportsProfile {
  readonly destinationId: string;
  /** Airports serving the destination, primary first. */
  readonly airports: readonly AirportInfo[];
}

/** Shown with any airport data so it reads as guidance, not a live feed. */
export const AIRPORTS_DATA_NOTE =
  "Editorial guidance for planning. Terminal layouts, transfers and services " +
  "change — verify with the airport/airline before travel.";

export const airportsProfiles: readonly AirportsProfile[] = [
  {
    destinationId: "kyoto",
    airports: [
      {
        code: "KIX",
        name: "Kansai International (serves Kyoto)",
        terminals: 2,
        interTerminalTransfer: "shuttle_bus",
        boarding: "jet_bridge",
        distanceToCityKm: 100,
        cityAccess: ["rail", "bus", "taxi"],
        note: "Kyoto has no airport of its own; the Haruka express reaches Kyoto in ~75–90 min. T2 is for LCCs and uses bus boarding.",
      },
      {
        code: "ITM",
        name: "Osaka Itami (domestic)",
        terminals: 1,
        interTerminalTransfer: "none",
        boarding: "jet_bridge",
        distanceToCityKm: 55,
        cityAccess: ["bus", "rail", "taxi"],
      },
    ],
  },
  {
    destinationId: "santorini",
    airports: [
      {
        code: "JTR",
        name: "Santorini (Thira) National",
        terminals: 1,
        interTerminalTransfer: "none",
        boarding: "mixed",
        distanceToCityKm: 6,
        cityAccess: ["bus", "taxi"],
        note: "Small single-terminal island airport — very busy in summer; boarding is often by bus/stairs across the apron.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    airports: [
      {
        code: "RAK",
        name: "Marrakech Menara",
        terminals: 2,
        interTerminalTransfer: "walk",
        boarding: "mixed",
        distanceToCityKm: 6,
        cityAccess: ["bus", "taxi"],
        note: "T1 and T2 are connected airside/landside on foot; bus #19 runs to the medina.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    airports: [
      {
        code: "FTE",
        name: "El Calafate (Comandante Armando Tola)",
        terminals: 1,
        interTerminalTransfer: "none",
        boarding: "stairs",
        distanceToCityKm: 23,
        cityAccess: ["shuttle", "taxi"],
        note: "Gateway to Los Glaciares; boarding is typically via stairs/apron.",
      },
      {
        code: "BRC",
        name: "Bariloche (San Carlos de Bariloche)",
        terminals: 1,
        interTerminalTransfer: "none",
        boarding: "mixed",
        distanceToCityKm: 13,
        cityAccess: ["bus", "taxi"],
      },
    ],
  },
];
