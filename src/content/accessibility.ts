/**
 * Accessibility capability (editorial seed data, per destination).
 *
 * Describes a destination's *general* step-free / wheelchair access and broad
 * mobility realities, broken out by facet — getting around, attractions,
 * lodging and terrain. This is editorial background to help travellers with
 * mobility or access needs plan sensibly; it is **not** a survey of specific
 * venues and **not** a guarantee that any given route, attraction or hotel is
 * accessible. `ACCESSIBILITY_DATA_NOTE` is surfaced with every consumer.
 * Mirrors the `hazards.ts` / `connectivity.ts` content pattern.
 */

export type AccessFacet = "getting_around" | "attractions" | "lodging" | "terrain";

export type AccessLevel = "good" | "moderate" | "limited" | "challenging";

export interface AccessAspect {
  readonly facet: AccessFacet;
  readonly level: AccessLevel;
  /** One factual, neutral sentence describing the access reality. */
  readonly note: string;
}

export interface AccessibilityProfile {
  readonly destinationId: string;
  readonly overallLevel: AccessLevel;
  readonly summary: string;
  readonly aspects: readonly AccessAspect[];
}

/** Shown with any accessibility data so it reads as general guidance, not a guarantee. */
export const ACCESSIBILITY_DATA_NOTE =
  "Editorial, general guidance on step-free and wheelchair access. Individual " +
  "needs and specific venues vary widely, and conditions change over time, so " +
  "this is not a guarantee of access at any particular route, attraction or " +
  "property. Travellers with mobility or access needs should confirm details " +
  "directly with venues, accommodation and operators before and during travel.";

export const accessibilityProfiles: readonly AccessibilityProfile[] = [
  {
    destinationId: "kyoto",
    overallLevel: "good",
    summary:
      "Modern transit and newer buildings are largely step-free, but many historic temples and gardens involve steps, gravel and uneven ground.",
    aspects: [
      { facet: "getting_around", level: "good", note: "Subways, JR stations and most buses offer elevators, ramps and accessible boarding, and staff routinely assist wheelchair users." },
      { facet: "attractions", level: "moderate", note: "Many famous temples and shrines have steps, raised thresholds and gravel paths, though some sites provide ramps or accessible routes." },
      { facet: "lodging", level: "good", note: "Modern hotels widely offer accessible rooms with lifts, while traditional ryokan with tatami and floor bedding can be harder to navigate." },
    ],
  },
  {
    destinationId: "santorini",
    overallLevel: "challenging",
    summary:
      "The cliff-side villages are built around steep, stepped lanes and cobbles on former donkey paths, making step-free movement difficult.",
    aspects: [
      { facet: "terrain", level: "challenging", note: "Fira, Oia and other caldera villages climb steep hillsides via stairways and narrow cobbled lanes with frequent level changes." },
      { facet: "getting_around", level: "limited", note: "Many alleys are pedestrian-only and stepped, so wheelchair users often rely on taxis, accessible transfers and the cable car rather than walking routes." },
      { facet: "attractions", level: "limited", note: "Caldera viewpoints and clifftop walks generally involve steps and uneven surfaces, though some beaches and newer venues are more level." },
    ],
  },
  {
    destinationId: "marrakech",
    overallLevel: "challenging",
    summary:
      "The medina's narrow, crowded and uneven lanes have few ramps or dropped kerbs, making independent step-free travel difficult.",
    aspects: [
      { facet: "getting_around", level: "challenging", note: "Medina lanes are narrow, uneven and busy with pedestrians, carts and scooters, and dropped kerbs and ramps are scarce." },
      { facet: "attractions", level: "limited", note: "Riads, palaces and historic sites often feature steps, thresholds and tight passages, though some museums and gardens have improved access." },
      { facet: "lodging", level: "moderate", note: "Modern hotels in Gueliz and the new city more commonly offer lifts and accessible rooms than traditional medina riads." },
    ],
  },
  {
    destinationId: "patagonia",
    overallLevel: "limited",
    summary:
      "Access is constrained by remoteness and rugged terrain, though some parks provide accessible viewpoints, boardwalks and visitor facilities.",
    aspects: [
      { facet: "terrain", level: "challenging", note: "Most trails cross rough, rocky and steep ground exposed to strong wind, with long distances between facilities." },
      { facet: "attractions", level: "limited", note: "Some headline sights, such as the Perito Moreno Glacier, offer accessible boardwalks and viewing platforms, while many viewpoints remain reachable only on foot." },
      { facet: "getting_around", level: "limited", note: "Gateway towns have some accessible transfers and tours, but options thin out across the remote parks where distances are large." },
    ],
  },
];
