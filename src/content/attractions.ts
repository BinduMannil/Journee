/**
 * Tourist sites & attractions (editorial seed data, per destination).
 *
 * Describes a destination's top sights with a rough cost band, the best time of
 * day to visit *and why* (light, weather, heat, crowds), a typical busyness
 * pattern, usual opening/closing hours, and an honest note on *how* to book.
 * This is editorial background to help travellers plan sensibly — it is **not** a
 * live availability feed and **not** a substitute for the official source.
 * Hours, prices, booking arrangements and crowd patterns change and vary by
 * season, so always confirm current details before visiting.
 * `ATTRACTIONS_DATA_NOTE` is surfaced with every consumer. Mirrors the
 * `hazards.ts` content pattern.
 */

export type CostBand = "free" | "low" | "moderate" | "high";

export type TimeOfDay =
  | "early_morning"
  | "morning"
  | "midday"
  | "afternoon"
  | "sunset"
  | "evening";

export type Busyness = "quiet" | "moderate" | "busy" | "very_busy";

/** The kind of experience a site offers, for experience-based recommendations. */
export type Experience =
  | "scenic"
  | "historic"
  | "cultural"
  | "nature"
  | "adventure"
  | "relaxing"
  | "romantic"
  | "foodie"
  | "nightlife"
  | "family"
  | "spiritual"
  | "photography";

export interface Attraction {
  readonly name: string;
  readonly costBand: CostBand;
  /** Rough per-person entry cost in USD, when there is a fee. */
  readonly approxCostUsd?: number;
  readonly bestTimeOfDay: TimeOfDay;
  /** Why this time is best — references light, weather, heat or crowds. */
  readonly bestTimeReason: string;
  readonly typicalBusyness: Busyness;
  /** Usual opening/closing hours, e.g. "08:30–17:00, last entry 16:30". */
  readonly typicalHours: string;
  /** How to book — plain guidance, never a URL or affiliate link. */
  readonly bookingNote: string;
  /** Experiences this site offers, for "best sites for X" recommendations. */
  readonly experienceTags: readonly Experience[];
}

export interface AttractionsProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly attractions: readonly Attraction[];
}

/** Shown with any attractions data so it reads as editorial seed, not a live feed. */
export const ATTRACTIONS_DATA_NOTE =
  "Editorial seed describing top sights per destination. Hours, prices, booking " +
  "arrangements and crowd patterns change and vary by season — always check the " +
  "official source for current hours, prices and tickets before visiting. This is " +
  "not a live availability feed.";

export const attractionsProfiles: readonly AttractionsProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto's headline sights reward early starts: shrines and groves are most atmospheric — and far cooler and quieter — soon after dawn.",
    attractions: [
      {
        name: "Fushimi Inari Taisha",
        costBand: "free",
        bestTimeOfDay: "early_morning",
        bestTimeReason:
          "Arriving at dawn beats both the midday heat and the heaviest crowds, and the torii gates photograph beautifully in soft early light.",
        typicalBusyness: "very_busy",
        typicalHours: "Open 24 hours (shrine grounds always accessible)",
        bookingNote:
          "No ticket or booking needed — entry is free and open at all hours; simply walk in.",
        experienceTags: ["spiritual", "scenic", "photography", "nature"],
      },
      {
        name: "Kinkaku-ji (Golden Pavilion)",
        costBand: "low",
        approxCostUsd: 4,
        bestTimeOfDay: "morning",
        bestTimeReason:
          "Morning sun lights the gold facade across the pond and the grounds are less crowded than the busy midday tour-bus window.",
        typicalBusyness: "busy",
        typicalHours: "09:00–17:00 daily",
        bookingNote:
          "Buy a paper admission ticket at the gate on arrival; no advance booking is offered.",
        experienceTags: ["historic", "scenic", "cultural", "photography"],
      },
      {
        name: "Arashiyama Bamboo Grove",
        costBand: "free",
        bestTimeOfDay: "early_morning",
        bestTimeReason:
          "The grove is calm and the filtered morning light through the stalks is best before the path fills with crowds later in the day.",
        typicalBusyness: "very_busy",
        typicalHours: "Open 24 hours (public path)",
        bookingNote:
          "Free public walkway — no ticket required; go early as it cannot be reserved.",
        experienceTags: ["nature", "scenic", "photography", "relaxing"],
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini is a sunset-and-archaeology island: the famous Oia view peaks at dusk, while ancient sites are best tackled in the cooler morning.",
    attractions: [
      {
        name: "Oia Sunset Viewpoint",
        costBand: "free",
        bestTimeOfDay: "sunset",
        bestTimeReason:
          "The sunset over the caldera is the whole point — the warm evening light is spectacular, though it draws very large crowds, so arrive about an hour early for a spot.",
        typicalBusyness: "very_busy",
        typicalHours: "Open access; busiest in the hour before sunset",
        bookingNote:
          "No booking for the public viewpoint; arrive early for space, or reserve a table at a view restaurant directly with the venue.",
        experienceTags: ["romantic", "scenic", "photography"],
      },
      {
        name: "Akrotiri Archaeological Site",
        costBand: "moderate",
        approxCostUsd: 13,
        bestTimeOfDay: "morning",
        bestTimeReason:
          "Visiting in the morning avoids the fierce midday summer heat, though the excavation sits under a cool protective roof.",
        typicalBusyness: "moderate",
        typicalHours: "08:00–20:00 in summer (shorter in winter)",
        bookingNote:
          "Buy at the entrance, or skip the queue with a timed e-ticket from the official Greek heritage ticketing system.",
        experienceTags: ["historic", "cultural", "family"],
      },
      {
        name: "Ancient Thera",
        costBand: "low",
        approxCostUsd: 5,
        bestTimeOfDay: "morning",
        bestTimeReason:
          "The hilltop ruins are exposed with little shade, so go in the cooler morning before the sun and heat build over the day.",
        typicalBusyness: "quiet",
        typicalHours: "08:00–15:00, typically closed Mondays",
        bookingNote:
          "Pay at the gate on arrival; reaching the site needs a steep hike, taxi or shuttle arranged locally.",
        experienceTags: ["historic", "scenic", "adventure"],
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech rewards timing: gardens and palaces are coolest and calmest early, while the great square only truly comes alive after dark.",
    attractions: [
      {
        name: "Jardin Majorelle",
        costBand: "moderate",
        approxCostUsd: 8,
        bestTimeOfDay: "early_morning",
        bestTimeReason:
          "Opening time means cooler air before the day's heat and a chance to enjoy the planting before the garden becomes very crowded.",
        typicalBusyness: "very_busy",
        typicalHours: "08:00–18:00 daily (last entry ~17:30)",
        bookingNote:
          "Reserve a timed-entry ticket online via the official garden site — slots sell out in peak season; some same-day tickets are sold at the gate.",
        experienceTags: ["relaxing", "scenic", "photography", "cultural"],
      },
      {
        name: "Bahia Palace",
        costBand: "low",
        approxCostUsd: 7,
        bestTimeOfDay: "morning",
        bestTimeReason:
          "Morning light fills the courtyards and the tiled rooms are more comfortable and less crowded before the midday heat and tour groups arrive.",
        typicalBusyness: "busy",
        typicalHours: "09:00–17:00 daily",
        bookingNote:
          "Buy a ticket at the entrance on the day; advance booking is not generally required.",
        experienceTags: ["historic", "cultural", "photography"],
      },
      {
        name: "Jemaa el-Fnaa",
        costBand: "free",
        bestTimeOfDay: "evening",
        bestTimeReason:
          "After dark the square transforms as food stalls, musicians and performers fill it — the cooler evening air and the atmosphere are the main draw.",
        typicalBusyness: "very_busy",
        typicalHours: "Open square; liveliest from early evening until late",
        bookingNote:
          "No entry fee or booking — wander in; agree any prices with stalls or performers before engaging.",
        experienceTags: ["foodie", "nightlife", "cultural"],
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia's icons hinge on weather and light: start early to catch clear views and good calving light before afternoon winds and cloud roll in.",
    attractions: [
      {
        name: "Perito Moreno Glacier",
        costBand: "moderate",
        approxCostUsd: 30,
        bestTimeOfDay: "morning",
        bestTimeReason:
          "Morning light on the ice is best and you are more likely to witness calving before the busier midday window; afternoons can turn windy and grey.",
        typicalBusyness: "busy",
        typicalHours: "08:00–18:00 (Los Glaciares National Park access hours)",
        bookingNote:
          "Pay the national park entrance fee at the gate; boat trips and ice-trek add-ons should be booked ahead with licensed operators.",
        experienceTags: ["nature", "scenic", "adventure", "photography"],
      },
      {
        name: "Laguna de los Tres Trail",
        costBand: "free",
        bestTimeOfDay: "early_morning",
        bestTimeReason:
          "An early start makes the most of stable weather windows and gives the clearest, calmest views of Mount Fitz Roy before afternoon cloud and wind build.",
        typicalBusyness: "busy",
        typicalHours: "Daylight hours; allow a full day for the round trip",
        bookingNote:
          "Free public trail with no ticket; no booking needed, but check trail and weather conditions at the local ranger office first.",
        experienceTags: ["adventure", "nature", "scenic"],
      },
      {
        name: "Torres Base Viewpoint",
        costBand: "moderate",
        approxCostUsd: 35,
        bestTimeOfDay: "early_morning",
        bestTimeReason:
          "Start before dawn to reach the base under the famous sunrise light and to use the calmer early weather window before strong winds pick up.",
        typicalBusyness: "busy",
        typicalHours: "Daylight hike; full-day round trip from the trailhead",
        bookingNote:
          "Pay the Torres del Paine park entrance fee — buy it online in advance via the official park system, as on-site sales are limited.",
        experienceTags: ["adventure", "nature", "scenic", "photography"],
      },
    ],
  },
];
