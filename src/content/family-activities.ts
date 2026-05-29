/**
 * Family & kids activities (editorial seed data, per destination).
 *
 * Describes a destination's *general* selection of things to do with children —
 * attractions and activities that tend to suit families, with a rough sense of
 * which ages they work best for and a practical note on why kids enjoy them or
 * how to approach them. This is editorial inspiration, **not** a guarantee that
 * any activity is appropriate for a particular child or open on a given day.
 * `FAMILY_DATA_NOTE` is surfaced with every consumer. Mirrors the `hazards.ts`
 * content pattern.
 */

export type ActivityKind =
  | "animals_nature"
  | "museum_interactive"
  | "outdoor_play"
  | "boat_water"
  | "ride_transport"
  | "cultural"
  | "food_treat"
  | "easy_walk";

export type AgeSuitability =
  | "toddlers"
  | "young_kids"
  | "older_kids"
  | "teens"
  | "all_ages";

export interface FamilyActivity {
  readonly name: string;
  readonly kind: ActivityKind;
  readonly suitableFor: readonly AgeSuitability[];
  /** Why kids like it, or a practical tip for visiting with children. */
  readonly note: string;
}

export interface FamilyActivitiesProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly strollerFriendly: boolean;
  readonly activities: readonly FamilyActivity[];
}

/** Shown with any family data so it reads as editorial inspiration, not advice. */
export const FAMILY_DATA_NOTE =
  "Editorial suggestions for things to do with children at each destination. " +
  "Suitability depends on the individual child, and conditions change — always " +
  "verify opening times, safety and accessibility before going. This is not a " +
  "guarantee that any activity is appropriate for your family.";

export const familyActivitiesProfiles: readonly FamilyActivitiesProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "A gentle mix of friendly animals, hands-on transport history and short nature walks make Kyoto rewarding for families, though crowds and steps mean some patience and planning help.",
    strollerFriendly: false,
    activities: [
      {
        name: "Nara deer park day trip",
        kind: "animals_nature",
        suitableFor: ["all_ages"],
        note: "Free-roaming, semi-tame deer that bow for crackers delight children; keep little ones supervised as the deer can nudge for food.",
      },
      {
        name: "Kyoto Railway Museum",
        kind: "museum_interactive",
        suitableFor: ["young_kids", "older_kids", "teens"],
        note: "Real locomotives, a steam-train ride and hands-on simulators make this an easy hit for train-loving kids of most ages.",
      },
      {
        name: "Arashiyama Monkey Park Iwatayama",
        kind: "animals_nature",
        suitableFor: ["older_kids", "teens"],
        note: "Wild macaques roam a hilltop with city views; the uphill walk and need to follow rules suit slightly older children.",
      },
      {
        name: "Fushimi Inari easy lower trail",
        kind: "easy_walk",
        suitableFor: ["all_ages"],
        note: "The first stretch of vermilion torii gates is flat and atmospheric; turn back before the steeper climb with tired legs.",
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini works best for families who love the water — black-sand beaches and boat trips are the highlight, while the stepped cliff villages call for sturdy legs rather than wheels.",
    strollerFriendly: false,
    activities: [
      {
        name: "Black-sand beach play at Perissa or Kamari",
        kind: "outdoor_play",
        suitableFor: ["all_ages"],
        note: "Calm, shallow shallows and dark volcanic sand are great for paddling and building; the sand gets very hot, so bring water shoes.",
      },
      {
        name: "Catamaran or boat trip around the caldera",
        kind: "boat_water",
        suitableFor: ["older_kids", "teens"],
        note: "Swimming stops at the hot springs and red beach keep older kids engaged; choose a calmer half-day cruise for first-timers.",
      },
      {
        name: "Cable car ride up to Fira",
        kind: "ride_transport",
        suitableFor: ["young_kids", "older_kids", "teens"],
        note: "The short cable-car ride up the cliff offers big views; prefer it to the donkey climb, as the donkey rides raise animal-welfare concerns.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech rewards curious families with lush gardens, a buzzing square full of performers and gentle carriage rides, balanced against the heat and the crowded, uneven medina.",
    strollerFriendly: false,
    activities: [
      {
        name: "Jardin Majorelle and the Menara gardens",
        kind: "easy_walk",
        suitableFor: ["all_ages"],
        note: "Cool, shaded paths, bright blue buildings and pools with mountain views give little ones space to roam between sights.",
      },
      {
        name: "Jemaa el-Fnaa performers and spectacle",
        kind: "cultural",
        suitableFor: ["older_kids", "teens"],
        note: "Storytellers, musicians and snake-charmers make a vivid evening; keep your distance from the snakes, expect to tip, and mind pockets in the crowd.",
      },
      {
        name: "Horse-drawn caleche ride around the ramparts",
        kind: "ride_transport",
        suitableFor: ["all_ages"],
        note: "A relaxed, shaded way to see the old city walls and gardens without tired feet; agree the fare and route before setting off.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia is an outdoor playground of lakeshores, glaciers and wildlife best suited to active families; the rugged terrain and changeable weather call for layers and flexibility.",
    strollerFriendly: false,
    activities: [
      {
        name: "Easy lakeshore walks and beaches around Bariloche",
        kind: "easy_walk",
        suitableFor: ["all_ages"],
        note: "Gentle paths and pebbly lake beaches let young children skip stones and explore; pack windproof layers as the weather shifts quickly.",
      },
      {
        name: "Boat trip to a glacier",
        kind: "boat_water",
        suitableFor: ["older_kids", "teens"],
        note: "Cruising up to towering blue ice is a wow moment for older kids; bring warm clothing as it is cold and breezy on deck.",
      },
      {
        name: "Wildlife spotting (condors, guanacos and birdlife)",
        kind: "animals_nature",
        suitableFor: ["all_ages"],
        note: "Open steppe and trails offer chances to spot soaring condors and grazing guanacos; binoculars turn it into a fun game.",
      },
      {
        name: "Cerro Otto cable car in Bariloche",
        kind: "ride_transport",
        suitableFor: ["all_ages"],
        note: "A gentle cable-car ride lifts the whole family to panoramic mountain and lake views with no hard hiking required.",
      },
    ],
  },
];
