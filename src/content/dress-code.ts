/**
 * Dress code by venue (editorial seed data, per destination).
 *
 * Describes how to dress *respectfully and appropriately* at different venue
 * types in each destination — religious sites, fine dining, beaches/pools,
 * nightlife and general streetwear. This is editorial cultural guidance to help
 * travellers pack and behave considerately; customs vary by venue, season and
 * individual establishment, so it is **not** a rule guarantee. `DRESS_CODE_NOTE`
 * is surfaced with every consumer. Mirrors the `connectivity.ts` content pattern.
 */

export type VenueKind =
  | "religious_site"
  | "fine_dining"
  | "beach_pool"
  | "nightlife"
  | "general";

export type Strictness = "relaxed" | "moderate" | "conservative" | "strict";

export interface DressGuidance {
  readonly venue: VenueKind;
  readonly strictness: Strictness;
  /** One practical sentence on how to dress for this venue type. */
  readonly guidance: string;
}

export interface DressCodeProfile {
  readonly destinationId: string;
  /** Brief overall framing of the destination's dress norms. */
  readonly overallNote: string;
  readonly guidance: readonly DressGuidance[];
}

/** Shown with any dress-code data so it reads as general guidance, not a rulebook. */
export const DRESS_CODE_NOTE =
  "Editorial, general guidance on dressing respectfully and appropriately. " +
  "Norms vary by venue, season and individual establishment, and this is not a " +
  "guarantee of any venue's rules. Check specific venue requirements — especially " +
  "for religious sites — before you visit.";

export const dressCodeProfiles: readonly DressCodeProfile[] = [
  {
    destinationId: "kyoto",
    overallNote:
      "Japan is generally relaxed about everyday dress, but temples and shrines reward modest, tidy clothing and good etiquette.",
    guidance: [
      { venue: "religious_site", strictness: "moderate", guidance: "At temples and shrines, dress modestly and neatly, keep shoulders covered, and be ready to remove your shoes where indicated." },
      { venue: "fine_dining", strictness: "moderate", guidance: "Upscale kaiseki and hotel restaurants expect smart-casual attire; avoid beachwear, gym kit or strong fragrances in intimate dining rooms." },
      { venue: "general", strictness: "relaxed", guidance: "Everyday streetwear is fine, and locals tend to dress neatly and on the conservative side rather than in revealing clothing." },
    ],
  },
  {
    destinationId: "santorini",
    overallNote:
      "Relaxed, beachy island style overall, though you should cover up away from the sand and dress modestly to enter churches.",
    guidance: [
      { venue: "beach_pool", strictness: "relaxed", guidance: "Swimwear, light cover-ups and sandals are the norm at beaches, pools and beach bars." },
      { venue: "religious_site", strictness: "conservative", guidance: "To enter the island's churches and monasteries, cover shoulders and knees and avoid swimwear; some sites lend wraps at the entrance." },
      { venue: "general", strictness: "relaxed", guidance: "Around the towns, light summer clothing is fine, but throw on a cover-up or shirt over swimwear when leaving the beach." },
      { venue: "fine_dining", strictness: "moderate", guidance: "Caldera-view restaurants lean smart-casual at dinner; a collared shirt or a sundress fits in better than damp beachwear." },
    ],
  },
  {
    destinationId: "marrakech",
    overallNote:
      "Morocco is more conservative than many beach destinations; covering shoulders and knees is appreciated and helps you blend in, especially near religious sites.",
    guidance: [
      { venue: "general", strictness: "conservative", guidance: "In the medina and souks, cover shoulders and knees with loose, lightweight clothing; this is respectful and draws less unwanted attention." },
      { venue: "religious_site", strictness: "strict", guidance: "Dress conservatively with shoulders, knees and chest covered near mosques — and note that many Moroccan mosques are closed to non-Muslims, so admire them from outside." },
      { venue: "fine_dining", strictness: "moderate", guidance: "Riads and upscale restaurants accept smart-casual dress, and elegant, modest outfits are well suited to the setting." },
      { venue: "beach_pool", strictness: "moderate", guidance: "Swimwear is fine at hotel and riad pools, but cover up with a kaftan or wrap before walking back through public areas." },
    ],
  },
  {
    destinationId: "patagonia",
    overallNote:
      "Dress here is practical and outdoors-led; layering for fierce wind and fast-changing weather matters far more than formality.",
    guidance: [
      { venue: "general", strictness: "relaxed", guidance: "Hiking and outdoor clothing is the everyday norm in gateway towns; pack windproof, waterproof layers you can add or shed quickly." },
      { venue: "fine_dining", strictness: "relaxed", guidance: "Even smarter lodge and town restaurants are casual; tidy outdoor-casual clothing is perfectly acceptable." },
      { venue: "religious_site", strictness: "moderate", guidance: "At the region's small churches, dress neatly and modestly and remove hats, as you would in any place of worship." },
    ],
  },
];
