/**
 * Beaches & swimming spots (editorial seed data, per destination).
 *
 * Describes a destination's beaches, lakes, rivers and swimming spots — or
 * honestly notes where there are none — with the *kind* of water, what each
 * place is *like*, and practical notes (facilities, safety, who it suits). This
 * is editorial background to help travellers plan, **not** a live conditions
 * feed: currents, water quality, access and safety change constantly.
 * `BEACHES_DATA_NOTE` is surfaced with every consumer. Mirrors the `hazards.ts`
 * content pattern.
 */

export type WaterType = "sea" | "lake" | "river" | "pool_complex" | "none";

export type BeachVibe = "lively" | "quiet" | "family" | "scenic" | "party" | "remote";

export interface SwimSpot {
  readonly name: string;
  readonly waterType: WaterType;
  readonly vibe: BeachVibe;
  /** One neutral, practical sentence: what it's like, facilities, safety, best for. */
  readonly note: string;
  /** Whether swimming there is realistic / reasonably safe (heed local flags regardless). */
  readonly swimmable: boolean;
}

export interface BeachesProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** Whether the destination itself sits on a swimmable coast (honest about landlocked places). */
  readonly hasCoast: boolean;
  readonly spots: readonly SwimSpot[];
}

/** Shown with any beaches data so it reads as editorial background, not a live feed. */
export const BEACHES_DATA_NOTE =
  "Editorial seed describing beaches, lakes and swimming spots for each " +
  "destination. Water conditions, safety, currents, water quality and access " +
  "change constantly — always heed local flags, warnings and lifeguards and " +
  "verify before you swim. This is not a live conditions feed.";

export const beachesProfiles: readonly BeachesProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto is landlocked: the city itself has no beaches and no coastline. " +
      "Real swimming means a trip — Lake Biwa for a freshwater day out, or the " +
      "Sea of Japan coast a train ride north — while in town you fall back on " +
      "pools and sento bathhouses.",
    hasCoast: false,
    spots: [
      {
        name: "Lake Biwa (day trip)",
        waterType: "lake",
        vibe: "scenic",
        note: "Japan's largest lake, roughly 15–20 min by train to Otsu; designated swimming beaches with summer facilities make it Kyoto's nearest real swim, best for a warm-season day out.",
        swimmable: true,
      },
      {
        name: "Sea of Japan coast, e.g. Amanohashidate / Kotohiki (day trip)",
        waterType: "sea",
        vibe: "quiet",
        note: "The nearest sea beaches are around two hours north by train; clean sand and summer swimming, best treated as a full day trip rather than a city activity.",
        swimmable: true,
      },
      {
        name: "Public pools & sento bathhouses",
        waterType: "pool_complex",
        vibe: "family",
        note: "With no beaches in the city, municipal pools and traditional sento offer the in-town way to cool off; sento are for soaking and washing, not swimming, so check etiquette and tattoo rules first.",
        swimmable: true,
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini's volcanic coast trades golden sand for dramatic black and red " +
      "beaches. The long southeast strands at Perissa, Perivolos and Kamari are " +
      "the main swimming scene, with quieter and more scenic coves elsewhere; the " +
      "dark sand gets very hot underfoot at midday.",
    hasCoast: true,
    spots: [
      {
        name: "Perissa & Perivolos",
        waterType: "sea",
        vibe: "lively",
        note: "Long black-sand strand with sunbeds, tavernas and beach bars; well-organised and busy, best for those who want facilities, watersports and a lively day by the water.",
        swimmable: true,
      },
      {
        name: "Kamari",
        waterType: "sea",
        vibe: "family",
        note: "Organised black-sand beach below the Mesa Vouno headland with a promenade, loungers and shallow entry; family-friendly with the usual amenities.",
        swimmable: true,
      },
      {
        name: "Red Beach",
        waterType: "sea",
        vibe: "scenic",
        note: "Striking red cliffs and pebbly sand reached by a short rough path; minimal to no facilities and occasional rockfall, so it's best for the view and a quick dip rather than a full day.",
        swimmable: true,
      },
      {
        name: "Vlychada",
        waterType: "sea",
        vibe: "quiet",
        note: "Quieter southern beach under sculpted pale cliffs; scenic and more relaxed than the main strands, with limited facilities, best for a calmer swim.",
        swimmable: true,
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech is an inland desert city with no beaches of its own. The usual " +
      "way to swim is a hotel or riad pool, and the nearest real coast is " +
      "Essaouira on the Atlantic, around a three-hour drive away as a day trip " +
      "or overnight.",
    hasCoast: false,
    spots: [
      {
        name: "Hotel & riad pools",
        waterType: "pool_complex",
        vibe: "quiet",
        note: "With no natural swimming in the city, hotel, riad and day-pass resort pools are the practical option; best for cooling off in the heat, and the main reliable swim within Marrakech itself.",
        swimmable: true,
      },
      {
        name: "Essaouira beach (day trip)",
        waterType: "sea",
        vibe: "lively",
        note: "The nearest Atlantic coast, around a three-hour drive west; a wide windy beach famous for kitesurfing and windsurfing, with cool water and strong wind and currents, so heed local conditions before swimming.",
        swimmable: true,
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia's water is glacial and frigid. Its lakes and fjords are stunning " +
      "for scenery, but most are far too cold to swim; a brisk warm-season dip in " +
      "lower lakes like Nahuel Huapi near Bariloche is about as far as it goes.",
    hasCoast: true,
    spots: [
      {
        name: "Lago Nahuel Huapi (Bariloche)",
        waterType: "lake",
        vibe: "scenic",
        note: "Large glacial lake with beaches and bays near Bariloche; swimming is realistic only in high summer and stays brisk even then, best for a quick bracing dip on a hot day.",
        swimmable: true,
      },
      {
        name: "High Andean glacial lakes",
        waterType: "lake",
        vibe: "remote",
        note: "Turquoise meltwater lakes are spectacular but frigid year-round; far too cold for safe swimming, so enjoy them for the scenery and paddling rather than getting in.",
        swimmable: false,
      },
      {
        name: "Patagonian fjords",
        waterType: "sea",
        vibe: "remote",
        note: "Cold, deep fjord waters with strong currents and near-freezing temperatures; not for swimming, best experienced by boat with proper layers.",
        swimmable: false,
      },
    ],
  },
];
