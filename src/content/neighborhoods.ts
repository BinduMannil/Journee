/**
 * Neighborhoods & where to stay (editorial seed data, per destination).
 *
 * The distinct areas within a destination — their character (historic, beach,
 * nightlife, scenic, …), a one-line description, who each suits, and a *relative*
 * cost-of-staying tier (budget → luxury) so a traveller can pick the right base.
 * **Editorial seed data**, not live lodging prices: the tier is a relative
 * comparison within the destination, not a quote, and areas/prices change — so
 * `NEIGHBORHOODS_DATA_NOTE` is surfaced with every consumer. For larger regions
 * (e.g. Patagonia) the "neighborhoods" are the main towns/bases. Mirrors the
 * `hazards.ts` content pattern.
 */

export type AreaType =
  | "historic"
  | "tourist_hub"
  | "nightlife"
  | "beach"
  | "scenic"
  | "shopping"
  | "business"
  | "residential"
  | "quiet"
  | "trekking_base";

/** Relative cost of staying in the area, within the destination (not a quote). */
export type StayCostTier = "budget" | "moderate" | "upscale" | "luxury";

export interface Neighborhood {
  readonly name: string;
  /** One or more character tags. */
  readonly types: readonly AreaType[];
  /** One neutral, factual orientation sentence. */
  readonly description: string;
  readonly stayCostTier: StayCostTier;
  /** Who this area suits best, e.g. "first-time visitors". */
  readonly bestFor: string;
}

export interface NeighborhoodsProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly neighborhoods: readonly Neighborhood[];
}

/** Ascending cost order — used by accessors to compare/filter tiers. */
export const STAY_COST_ORDER: readonly StayCostTier[] = [
  "budget",
  "moderate",
  "upscale",
  "luxury",
];

/** Shown with any neighborhoods data so cost tiers read as relative, not quotes. */
export const NEIGHBORHOODS_DATA_NOTE =
  "Editorial orientation for choosing where to stay. Cost tiers are a *relative* " +
  "comparison within the destination, not live lodging prices or quotes, and " +
  "areas, character and prices change — verify current rates before booking.";

export const neighborhoodsProfiles: readonly NeighborhoodsProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto's areas range from lantern-lit historic quarters to a convenient, modern station hub; central districts cost more, while staying near the station or south is easier on the budget.",
    neighborhoods: [
      { name: "Gion & Higashiyama", types: ["historic", "scenic"], description: "Kyoto's iconic geisha and temple district of wooden machiya, shrines and stone lanes.", stayCostTier: "upscale", bestFor: "atmosphere and first-time sightseeing" },
      { name: "Downtown (Kawaramachi/Pontocho)", types: ["shopping", "nightlife"], description: "Central dining, shopping and nightlife along the Kamo River, walkable to most sights.", stayCostTier: "upscale", bestFor: "food, nightlife and central convenience" },
      { name: "Kyoto Station area", types: ["business", "tourist_hub"], description: "The transport hub, with hotels of every grade and direct access to trains and buses.", stayCostTier: "moderate", bestFor: "convenience and day trips" },
      { name: "Arashiyama", types: ["scenic", "quiet"], description: "A leafy western edge of bamboo groves and riverside temples, calmer in the evenings.", stayCostTier: "upscale", bestFor: "nature and a quieter base" },
      { name: "Southern Kyoto (near Tofukuji/Fushimi)", types: ["residential", "quiet"], description: "Residential southern wards near Fushimi Inari, cheaper and well-connected by rail.", stayCostTier: "budget", bestFor: "value and rail access" },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini splits between pricey caldera-rim villages with the famous views and far cheaper beach towns on the flat eastern coast.",
    neighborhoods: [
      { name: "Oia", types: ["scenic", "tourist_hub"], description: "The postcard sunset village of white-and-blue cliffside houses; the most sought-after and expensive.", stayCostTier: "luxury", bestFor: "honeymooners and the iconic view" },
      { name: "Imerovigli & Firostefani", types: ["scenic", "quiet"], description: "Caldera-rim villages just north of Fira with the same views but a calmer feel.", stayCostTier: "upscale", bestFor: "romantic views without Oia's crowds" },
      { name: "Fira", types: ["tourist_hub", "nightlife", "shopping"], description: "The capital and transport hub, with the most shops, bars and bus links plus caldera views.", stayCostTier: "upscale", bestFor: "central convenience and nightlife" },
      { name: "Kamari & Perissa", types: ["beach", "tourist_hub"], description: "Black-sand beach resort towns on the east coast, far cheaper than the caldera.", stayCostTier: "budget", bestFor: "beach holidays and value" },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech contrasts the labyrinthine historic Medina (riads) with the modern, leafy new town and resort districts on the edge.",
    neighborhoods: [
      { name: "Medina", types: ["historic", "tourist_hub"], description: "The walled old city of souks and riads around Jemaa el-Fnaa — atmospheric, central, and a maze.", stayCostTier: "moderate", bestFor: "immersion and riad stays" },
      { name: "Gueliz (Ville Nouvelle)", types: ["business", "shopping"], description: "The modern new town with boulevards, cafés, malls and contemporary hotels.", stayCostTier: "moderate", bestFor: "modern comfort and shopping" },
      { name: "Hivernage", types: ["nightlife", "tourist_hub"], description: "An elegant district of large hotels, clubs and restaurants between Gueliz and the Medina.", stayCostTier: "upscale", bestFor: "upscale hotels and nightlife" },
      { name: "Palmeraie", types: ["scenic", "quiet"], description: "A palm-grove belt of resorts and villas on the outskirts, calm but car-dependent.", stayCostTier: "luxury", bestFor: "resort relaxation and pools" },
      { name: "Kasbah", types: ["historic", "quiet"], description: "The southern Medina quarter near the royal palaces and Saadian Tombs, quieter than the centre.", stayCostTier: "budget", bestFor: "history at a calmer pace" },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia is a vast region, so the 'areas' are its gateway towns; prices are highest in the trekking hotspots in peak summer and lower in the larger service towns.",
    neighborhoods: [
      { name: "El Calafate (AR)", types: ["tourist_hub", "scenic"], description: "The main Argentine gateway to the Perito Moreno glacier, with the widest range of lodging.", stayCostTier: "moderate", bestFor: "glaciers and a well-served base" },
      { name: "El Chaltén (AR)", types: ["trekking_base", "scenic"], description: "A small trekking village at the foot of Fitz Roy; limited, in-demand beds in season.", stayCostTier: "upscale", bestFor: "hikers wanting trailhead access" },
      { name: "Puerto Natales (CL)", types: ["tourist_hub", "trekking_base"], description: "The Chilean gateway to Torres del Paine, with hostels through to boutique hotels.", stayCostTier: "moderate", bestFor: "Torres del Paine logistics" },
      { name: "Bariloche (AR)", types: ["scenic", "nightlife", "shopping"], description: "A lakeside alpine town in the northern Lake District, lively and well-equipped year-round.", stayCostTier: "moderate", bestFor: "lakes, skiing and town comforts" },
    ],
  },
];
