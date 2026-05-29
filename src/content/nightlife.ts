/**
 * Nightlife & bars (editorial seed data, per destination).
 *
 * A per-destination editorial sketch of the after-dark scene: notable bar,
 * club, live-music, rooftop and cultural-evening venues or areas, what each is
 * roughly like, and practical notes on dress, timing and local norms. This is
 * factual, culturally-aware background to help travellers plan an evening — it
 * is **not** a live listings feed: venues open, close, rebrand and change scene
 * constantly, so verify before going. `NIGHTLIFE_DATA_NOTE` is surfaced with
 * every consumer. Mirrors the `hazards.ts` content pattern.
 */

export type NightlifeKind =
  | "bar"
  | "cocktail_bar"
  | "club"
  | "live_music"
  | "rooftop"
  | "pub"
  | "cultural_evening"
  | "night_market";

export type Vibe = "lively" | "chill" | "upscale" | "local" | "touristy";

export interface NightlifeSpot {
  readonly name: string;
  readonly kind: NightlifeKind;
  readonly area: string;
  readonly vibe: Vibe;
  /** One neutral, factual sentence describing the spot. */
  readonly note: string;
}

export interface NightlifeProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** When nightlife runs, e.g. "bars from 20:00, clubs after midnight". */
  readonly typicalHours: string;
  readonly spots: readonly NightlifeSpot[];
}

/** Shown with any nightlife data so it reads as editorial background, not live listings. */
export const NIGHTLIFE_DATA_NOTE =
  "Editorial seed describing the general after-dark scene for each destination. " +
  "Venues open, close, rebrand and change in character constantly, so this is " +
  "not a live listings feed — verify a bar or venue is still operating before " +
  "you go. Drink responsibly and mind local norms, dress codes and laws, which " +
  "vary by place and can be strict.";

export const nightlifeProfiles: readonly NightlifeProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto's nightlife is intimate and low-key rather than loud, centred on narrow lantern-lit lanes of small bars, sake and craft-beer spots, with a refined traditional-entertainment culture in Gion.",
    typicalHours: "izakaya and bars from around 18:00–20:00, clubs and later bars after midnight, many small places close by 01:00–02:00",
    spots: [
      {
        name: "Pontocho Alley",
        kind: "bar",
        area: "Pontocho (along the Kamogawa river)",
        vibe: "local",
        note: "A narrow pedestrian lane of small traditional bars and restaurants, many with riverside terraces in the warmer months.",
      },
      {
        name: "Kiyamachi Street",
        kind: "club",
        area: "Kiyamachi (along the canal)",
        vibe: "lively",
        note: "A denser strip of bars, izakaya and late-night clubs that is the busiest part of central Kyoto after dark.",
      },
      {
        name: "Gion teahouse evenings",
        kind: "cultural_evening",
        area: "Gion",
        vibe: "upscale",
        note: "Gion's traditional teahouse (ochaya) culture centred on geiko and maiko is largely invitation-based, though arranged cultural performances offer respectful access.",
      },
      {
        name: "Craft beer and sake bars",
        kind: "bar",
        area: "central Kyoto (Kawaramachi and around)",
        vibe: "chill",
        note: "Kyoto has a growing scene of small craft-beer taprooms and standing sake bars pouring local and regional brews.",
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini's nightlife splits between the buzzy bars and clubs of Fira, the polished sunset cocktail terraces of Oia, and relaxed beach bars on the southeast coast at Perissa and Kamari.",
    typicalHours: "sunset cocktails from around 19:00, bars busy from 22:00, clubs in Fira running until the early hours in high season",
    spots: [
      {
        name: "Fira bars and clubs",
        kind: "club",
        area: "Fira (the capital)",
        vibe: "lively",
        note: "Fira concentrates most of the island's late-night bars and clubs, busiest through the summer high season.",
      },
      {
        name: "Oia sunset cocktail terraces",
        kind: "rooftop",
        area: "Oia",
        vibe: "upscale",
        note: "Oia's caldera-edge bars are known for premium-priced cocktails timed around the famous sunset, often requiring early arrival or a reservation.",
      },
      {
        name: "Perissa and Kamari beach bars",
        kind: "bar",
        area: "Perissa and Kamari (southeast coast)",
        vibe: "chill",
        note: "The black-sand beaches host laid-back beach bars that run from daytime loungers into relaxed evening drinks.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech's evenings revolve around the open-air food, music and performance of Jemaa el-Fnaa and atmospheric riad and hotel rooftops; alcohol is available mainly in licensed hotels, riads and the Hivernage district rather than widely, so plan and dress with cultural sensitivity.",
    typicalHours: "Jemaa el-Fnaa food stalls and performers from dusk; rooftop bars in the evening; Hivernage clubs and lounges later into the night",
    spots: [
      {
        name: "Jemaa el-Fnaa evening square",
        kind: "night_market",
        area: "Medina (Jemaa el-Fnaa)",
        vibe: "local",
        note: "After dusk the main square fills with food stalls, musicians and performers, a UNESCO-recognised cultural space and the heart of the city's nightlife.",
      },
      {
        name: "Riad and hotel rooftop bars",
        kind: "rooftop",
        area: "Medina and Gueliz",
        vibe: "upscale",
        note: "Licensed riads and hotels offer rooftop terraces where alcohol is served; outside such venues alcohol is limited and discretion is appreciated.",
      },
      {
        name: "Hivernage clubs and lounges",
        kind: "club",
        area: "Hivernage",
        vibe: "touristy",
        note: "The Hivernage district holds most of the city's upscale nightclubs and cocktail lounges, catering largely to visitors and an affluent local crowd.",
      },
      {
        name: "Cultural dinner shows",
        kind: "cultural_evening",
        area: "outskirts and Medina",
        vibe: "touristy",
        note: "Evening shows pairing Moroccan cuisine with music, dance and folklore performances are a common, alcohol-optional way to spend the night.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonian nightlife is mostly quiet and small-town, built around cosy craft-beer breweries and pubs in hubs like El Calafate and Bariloche, with Bariloche offering the region's liveliest bar and club scene.",
    typicalHours: "breweries and pubs from around 19:00–20:00, the few Bariloche clubs busy late on weekends, most towns winding down early",
    spots: [
      {
        name: "El Calafate craft-beer pubs",
        kind: "pub",
        area: "El Calafate (Argentina)",
        vibe: "chill",
        note: "This gateway town to the Perito Moreno glacier has a handful of craft-beer pubs and casual bars favoured by trekkers.",
      },
      {
        name: "Bariloche breweries",
        kind: "pub",
        area: "Bariloche (Argentina)",
        vibe: "local",
        note: "Bariloche is known across Argentina for its artisanal breweries, reflecting the area's Alpine-influenced beer and chocolate tradition.",
      },
      {
        name: "Bariloche bars and clubs",
        kind: "club",
        area: "Bariloche town centre",
        vibe: "lively",
        note: "As a popular resort town, Bariloche has the region's most active bar and nightclub scene, especially in the ski and summer seasons.",
      },
      {
        name: "Small-town evenings elsewhere",
        kind: "bar",
        area: "rural Patagonia (e.g. El Chaltén, Puerto Natales)",
        vibe: "chill",
        note: "Most Patagonian towns are very quiet after dark, with a single pub or hostel bar serving as the main evening gathering spot.",
      },
    ],
  },
];
