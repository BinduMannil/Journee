/**
 * Editorial destination catalog (seed content).
 *
 * This is intentionally a typed, data-driven catalog rather than markup baked
 * into a component. In production this shape is what a `ContentProvider`
 * adapter (see src/lib/providers) will return from Supabase or a CMS, so the
 * UI never changes when the catalog grows.
 */
export interface Destination {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  /** One-line editorial hook. */
  readonly headline: string;
  /** The dominant mood this place evokes — drives mood-first discovery later. */
  readonly mood: string;
  readonly imageUrl: string;
  /** Real coordinates, used for the live light-phase signal (solar math). */
  readonly coordinates?: { readonly lat: number; readonly lon: number };
  /** Editorial paragraph shown on the detail page. */
  readonly description?: string;
  /** When to go. */
  readonly bestTime?: string;
}

export const featuredDestinations: readonly Destination[] = [
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    headline: "Lantern-lit alleys and the slow theatre of the tea house.",
    mood: "Contemplative",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    coordinates: { lat: 35.0116, lon: 135.7681 },
    description:
      "Kyoto rewards slowness. Beyond the headline shrines, the city is a "
      + "thousand small rituals — a kettle's whistle in a machiya, moss kept "
      + "like a secret, lantern light pooling on wet stone after rain.",
    bestTime: "Late November for maple fire; early April for cherry blossom.",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    headline: "Whitewashed terraces poured over a drowned volcano.",
    mood: "Luminous",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80",
    coordinates: { lat: 36.3932, lon: 25.4615 },
    description:
      "Santorini is a study in contrast — blinding white against volcanic "
      + "black, the caldera dropping away beneath terraces that seem poured "
      + "rather than built. Come for the light; stay for the long, slow dusk.",
    bestTime: "Late spring or September — past the heat, before the crowds.",
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    headline: "Spice smoke, brass light, and a medina that never quite sleeps.",
    mood: "Electric",
    imageUrl:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1600&q=80",
    coordinates: { lat: 31.6295, lon: -7.9811 },
    description:
      "Marrakech arrives through the senses first — saffron and smoke, the "
      + "call to prayer over the Jemaa el-Fnaa, a medina that folds in on "
      + "itself until a riad's quiet courtyard opens like a held breath.",
    bestTime: "Spring and autumn; high summer is fierce.",
  },
  {
    id: "patagonia",
    name: "Patagonia",
    country: "Chile",
    headline: "Granite cathedrals and wind that rearranges the sky.",
    mood: "Untamed",
    imageUrl:
      "https://images.unsplash.com/photo-1531794343993-cd2ef0e94c5b?auto=format&fit=crop&w=1600&q=80",
    coordinates: { lat: -51.0, lon: -73.0 },
    description:
      "Patagonia is scale you feel in the chest — granite towers, glaciers "
      + "calving into milk-blue lakes, and a wind that rewrites the sky by the "
      + "hour. It humbles and clarifies in equal measure.",
    bestTime: "November–March (austral summer) for trekking.",
  },
];

/**
 * Mood → experience intensity (0..1), config-driven so the trip planner's
 * fatigue-aware pacing isn't hardcoded in components. Unknown moods fall back
 * to `defaultMoodIntensity`.
 */
export const moodIntensity: Readonly<Record<string, number>> = {
  Contemplative: 0.4,
  Luminous: 0.5,
  Electric: 0.9,
  Untamed: 0.8,
};

export const defaultMoodIntensity = 0.6;

export function intensityForMood(mood: string): number {
  return moodIntensity[mood] ?? defaultMoodIntensity;
}

/** Editorial copy for the home page "Featured" section (no literals in JSX). */
export const homeFeaturedCopy = {
  eyebrow: "Featured",
  title: "Destinations chosen by mood, not by map.",
} as const;

/** Editorial copy for the /destinations index page. */
export const destinationsIndexCopy = {
  eyebrow: "Destinations",
  title: "Every place, by the mood it keeps.",
  description:
    "Filter by the atmosphere you're after, or search across names, "
    + "countries, and moods. The catalog grows; the filters grow with it.",
} as const;

/** Rotating atmospheric quotes for the hero (driven by data, not hardcoded JSX). */
export const heroQuotes: readonly string[] = [
  "Travel is the only thing you buy that makes you richer.",
  "The world is a book, and those who do not travel read only one page.",
  "We travel not to escape life, but for life not to escape us.",
];
