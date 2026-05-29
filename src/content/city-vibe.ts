/**
 * City vibe & local friendliness (editorial seed data).
 *
 * How a place *feels* to a visitor: how welcoming locals tend to be, the overall
 * vibe (tags), how easy it is to get around as a tourist, and whether English is
 * widely spoken. **Editorial / subjective seed data** — a generalization, never
 * a judgement of individuals — so `CITY_VIBE_NOTE` is surfaced with every
 * consumer. Mirrors the `culinary.ts` content pattern.
 */

export type TouristEase = "very_easy" | "easy" | "moderate" | "challenging";

export interface CityVibe {
  readonly destinationId: string;
  /** How welcoming locals tend to feel to visitors, 0..5 (editorial). */
  readonly friendliness: number;
  /** Short vibe tags, e.g. "relaxed", "bustling", "romantic". */
  readonly vibes: readonly string[];
  /** How easy it is to navigate as a tourist. */
  readonly touristEase: TouristEase;
  /** Whether English is widely spoken by those in tourism. */
  readonly englishWidelySpoken: boolean;
  readonly summary: string;
}

/** Shown with any vibe data so it reads as a generalization, not a verdict. */
export const CITY_VIBE_NOTE =
  "Editorial, subjective generalization to set expectations — never a judgement " +
  "of individuals. Experiences vary.";

export const cityVibes: readonly CityVibe[] = [
  {
    destinationId: "kyoto",
    friendliness: 4.3,
    vibes: ["serene", "traditional", "refined"],
    touristEase: "easy",
    englishWidelySpoken: false,
    summary:
      "Polite, orderly and deeply respectful of custom — reserved at first but genuinely helpful. Some English around sights; less off the beaten path.",
  },
  {
    destinationId: "santorini",
    friendliness: 4.2,
    vibes: ["romantic", "relaxed", "scenic"],
    touristEase: "very_easy",
    englishWidelySpoken: true,
    summary:
      "Warm Greek hospitality (filoxenia) and very tourist-friendly; can feel crowded and commercial at peak summer.",
  },
  {
    destinationId: "marrakech",
    friendliness: 4.0,
    vibes: ["bustling", "sensory", "vibrant"],
    touristEase: "moderate",
    englishWidelySpoken: false,
    summary:
      "Hospitable and lively; expect energetic hustle in the souks. Friendly, confident haggling is normal; French and Arabic dominate.",
  },
  {
    destinationId: "patagonia",
    friendliness: 4.2,
    vibes: ["adventurous", "laid-back", "wild"],
    touristEase: "moderate",
    englishWidelySpoken: false,
    summary:
      "Easy-going and warm; remote, unhurried and outdoorsy — relationships matter and Spanish goes a long way.",
  },
];
