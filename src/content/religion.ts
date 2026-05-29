/**
 * Religious orientation & places of worship (editorial seed data).
 *
 * The predominant religious traditions at each destination and a few notable
 * places of worship a traveller may encounter or wish to visit. Helps visitors
 * understand the cultural context and find sites — while respecting that many
 * are active places of worship with their own etiquette and access rules.
 * **Editorial seed data**, presented factually and neutrally; `RELIGION_DATA_NOTE`
 * is surfaced with every consumer. Mirrors the `festivals.ts` content pattern.
 */

export type PlaceOfWorshipKind = "mosque" | "temple" | "church" | "synagogue" | "shrine";

export interface PlaceOfWorship {
  readonly name: string;
  readonly kind: PlaceOfWorshipKind;
  /** The neighbourhood/area where it is located. */
  readonly area: string;
}

export interface Religion {
  readonly destinationId: string;
  /** Main religious traditions, most prevalent first (e.g. ["Shinto","Buddhism"]). */
  readonly predominant: readonly string[];
  /** A respectful, factual 1–2 sentence overview of the religious landscape. */
  readonly summary: string;
  readonly placesOfWorship: readonly PlaceOfWorship[];
}

/** Shown with any religion data so access and etiquette are checked locally. */
export const RELIGION_DATA_NOTE =
  "Editorial guide, offered respectfully; verify access, dress codes and " +
  "etiquette locally — these are active places of worship and some sites " +
  "restrict entry to non-worshippers.";

export const religionProfiles: readonly Religion[] = [
  {
    destinationId: "kyoto",
    predominant: ["Shinto", "Buddhism"],
    summary:
      "Kyoto's religious life centres on Shinto and Buddhism, which have long " +
      "coexisted; the city is home to thousands of shrines and temples.",
    placesOfWorship: [
      { name: "Fushimi Inari Taisha", kind: "shrine", area: "Fushimi" },
      { name: "Yasaka Shrine", kind: "shrine", area: "Gion" },
      { name: "Kinkaku-ji (Golden Pavilion)", kind: "temple", area: "Kita" },
      { name: "Kiyomizu-dera", kind: "temple", area: "Higashiyama" },
    ],
  },
  {
    destinationId: "santorini",
    predominant: ["Greek Orthodox Christianity"],
    summary:
      "Santorini is predominantly Greek Orthodox Christian, and its blue-domed " +
      "churches are a defining feature of the island's villages.",
    placesOfWorship: [
      { name: "Panagia Episkopi", kind: "church", area: "Mesa Gonia" },
      { name: "Church of the Three Bells of Fira (Catholic)", kind: "church", area: "Fira" },
      { name: "Orthodox Metropolitan Cathedral", kind: "church", area: "Fira" },
    ],
  },
  {
    destinationId: "marrakech",
    predominant: ["Islam (Sunni)"],
    summary:
      "Marrakech is overwhelmingly Sunni Muslim, with smaller historic Jewish " +
      "and Christian communities. In Morocco, non-Muslims generally may not " +
      "enter functioning mosques.",
    placesOfWorship: [
      { name: "Koutoubia Mosque", kind: "mosque", area: "Medina" },
      { name: "Lazama (Slat al-Azama) Synagogue", kind: "synagogue", area: "Mellah" },
      { name: "Église des Saints-Martyrs de Marrakech", kind: "church", area: "Guéliz" },
    ],
  },
  {
    destinationId: "patagonia",
    predominant: ["Roman Catholicism"],
    summary:
      "Patagonia is predominantly Roman Catholic, with small Protestant and " +
      "other Christian communities across its Argentine and Chilean towns.",
    placesOfWorship: [
      { name: "Catedral de Bariloche (Nuestra Señora del Nahuel Huapi)", kind: "church", area: "San Carlos de Bariloche" },
      { name: "Iglesia Parroquial Catedral de Punta Arenas", kind: "church", area: "Punta Arenas" },
    ],
  },
];
