/**
 * Packing guidance (editorial seed data, per destination).
 *
 * Per-destination editorial guidance on what to pack: climate-independent
 * year-round essentials plus seasonal suggestions, each with a short reason and
 * a rough priority. Mindful of local climate and customs (e.g. modest dress for
 * temples and churches, wind-readiness in Patagonia). This is *general* editorial
 * guidance — it is **not** a substitute for checking the live forecast for your
 * dates, your own itinerary and activities, or any visa/medical requirements.
 * `PACKING_DATA_NOTE` is surfaced with every consumer. Mirrors the `festivals.ts`
 * content pattern.
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export type PackingPriority = "essential" | "recommended" | "optional";

export interface PackingItem {
  readonly item: string;
  readonly priority: PackingPriority;
  /** Why it matters — one short phrase or sentence. */
  readonly reason: string;
}

export interface SeasonalPacking {
  readonly season: Season;
  readonly items: readonly PackingItem[];
}

export interface PackingProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** Climate-independent essentials worth packing regardless of season. */
  readonly yearRound: readonly PackingItem[];
  readonly seasonal: readonly SeasonalPacking[];
}

/** Shown with any packing data so it reads as general guidance, not a checklist. */
export const PACKING_DATA_NOTE =
  "Editorial general guidance — pack for your own itinerary, activities and the " +
  "live forecast for your dates. Conditions vary, and this is not a substitute " +
  "for checking current weather or any visa/medical requirements before you travel.";

export const packingProfiles: readonly PackingProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Pack in layers for Kyoto's marked seasons — humid, rainy summers and cold winters — and bring modest cover for temple and shrine visits.",
    yearRound: [
      { item: "Comfortable walking shoes", priority: "essential", reason: "Days mean long walks across temple grounds and stone paths." },
      { item: "Modest layer for temples", priority: "essential", reason: "Shoulders and knees should be covered at many religious sites." },
      { item: "Compact umbrella", priority: "recommended", reason: "Rain can arrive in any season, especially the June rainy spell." },
    ],
    seasonal: [
      {
        season: "summer",
        items: [
          { item: "Breathable, light clothing", priority: "essential", reason: "Kyoto summers are hot and very humid." },
          { item: "Hand fan and water bottle", priority: "recommended", reason: "Helps cope with sticky midsummer heat." },
          { item: "Rain jacket", priority: "recommended", reason: "Late-June rainy season brings frequent downpours." },
        ],
      },
      {
        season: "winter",
        items: [
          { item: "Warm coat and thermal layers", priority: "essential", reason: "Winters are cold and damp, occasionally with snow." },
          { item: "Gloves and a scarf", priority: "recommended", reason: "Mornings and evenings turn sharply cold." },
        ],
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Pack for strong Aegean sun and steep, stepped paths, with a light wrap for church visits and cooler evenings.",
    yearRound: [
      { item: "Sun protection (hat, sunglasses, SPF)", priority: "essential", reason: "Sunlight off the white buildings and sea is intense." },
      { item: "Sturdy shoes for stepped paths", priority: "essential", reason: "Caldera villages are built on steep cobbled and stepped lanes." },
      { item: "Light wrap or shawl", priority: "recommended", reason: "Covers shoulders for church visits and warms breezy evenings." },
    ],
    seasonal: [
      {
        season: "summer",
        items: [
          { item: "Light, breathable clothing", priority: "essential", reason: "Summers are hot, dry and bright." },
          { item: "Swimwear", priority: "recommended", reason: "For beaches and hotel pools in peak season." },
        ],
      },
      {
        season: "winter",
        items: [
          { item: "Warm layers and a windproof jacket", priority: "essential", reason: "Winters are cool, wet and windy on the exposed caldera." },
        ],
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Pack sun protection and modest, cover-up clothing for the medina, comfortable shoes for uneven lanes, and layers for cool desert nights.",
    yearRound: [
      { item: "Sun protection (hat, sunglasses, SPF)", priority: "essential", reason: "The sun is strong year-round in Marrakech." },
      { item: "Modest, cover-up clothing", priority: "essential", reason: "Lightweight clothing covering shoulders and knees respects local customs." },
      { item: "Comfortable closed shoes", priority: "recommended", reason: "Medina lanes are uneven, busy and sometimes dusty." },
    ],
    seasonal: [
      {
        season: "summer",
        items: [
          { item: "Loose, breathable fabrics", priority: "essential", reason: "Summer heat is extreme and dry." },
          { item: "Refillable water bottle", priority: "recommended", reason: "Staying hydrated is vital in the midday heat." },
        ],
      },
      {
        season: "winter",
        items: [
          { item: "Warm layer for evenings", priority: "essential", reason: "Desert nights and winter evenings turn cold quickly." },
        ],
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Pack for relentless wind and fast-changing weather: a windproof, waterproof shell, warm layers, sturdy hiking boots, and sun protection in every season.",
    yearRound: [
      { item: "Windproof, waterproof shell", priority: "essential", reason: "Strong winds and sudden rain are constant, even in summer." },
      { item: "Insulating mid-layers", priority: "essential", reason: "Temperatures swing fast, so layers you can add or shed are key." },
      { item: "Sturdy hiking boots", priority: "essential", reason: "Trails are rugged, rocky and often muddy." },
      { item: "Sun protection (hat, sunglasses, SPF)", priority: "recommended", reason: "High-latitude sun and reflection off ice and snow are strong year-round." },
    ],
    seasonal: [
      {
        season: "summer",
        items: [
          { item: "Lighter base layers", priority: "recommended", reason: "Summer days can be mild between cold, windy spells." },
          { item: "Buff or windproof hat", priority: "recommended", reason: "Even summer brings biting wind on exposed trails." },
        ],
      },
      {
        season: "winter",
        items: [
          { item: "Heavy insulated jacket", priority: "essential", reason: "Winters are bitterly cold with fierce wind chill." },
          { item: "Warm gloves and hat", priority: "essential", reason: "Exposed extremities lose heat fast in the wind." },
        ],
      },
    ],
  },
];
