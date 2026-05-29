/**
 * Photography rules & etiquette (editorial seed data, per destination).
 *
 * Describes where photography is typically restricted or sensitive at a
 * destination — religious sites, museum interiors, government/military areas —
 * along with the local norms around photographing people and flying drones, plus
 * practical etiquette tips. This is **editorial general guidance** to help
 * travellers behave respectfully and avoid trouble; it is **not** legal advice,
 * and photography and drone laws change and vary by exact site. Always ask
 * permission before photographing people and check current local and drone
 * regulations on the ground. `PHOTOGRAPHY_DATA_NOTE` is surfaced with every
 * consumer. Mirrors the `hazards.ts` content pattern.
 */

export type PhotoRuleKind =
  | "people"
  | "religious_site"
  | "government_military"
  | "museum_interior"
  | "drone"
  | "general";

export type Permission =
  | "generally_ok"
  | "ask_first"
  | "restricted"
  | "prohibited";

export interface PhotoRule {
  readonly kind: PhotoRuleKind;
  readonly permission: Permission;
  /** One practical sentence describing the norm or restriction. */
  readonly note: string;
}

export interface PhotographyProfile {
  readonly destinationId: string;
  readonly summary: string;
  readonly rules: readonly PhotoRule[];
}

/** Shown with any photography data so it reads as etiquette guidance, not law. */
export const PHOTOGRAPHY_DATA_NOTE =
  "Editorial general guidance on photography etiquette and restrictions. " +
  "Photography and drone laws change and vary by exact site, and this is not " +
  "legal advice. Always ask permission before photographing people, and check " +
  "current local rules and drone regulations before you shoot.";

export const photographyProfiles: readonly PhotographyProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Kyoto is wonderfully photogenic, but its historic districts and temples have firm etiquette — and photographing geiko and maiko in Gion is restricted.",
    rules: [
      { kind: "people", permission: "restricted", note: "Photographing geiko and maiko (and stopping or chasing them) is banned on private lanes in Gion, with fines posted — never block their path for a photo." },
      { kind: "people", permission: "ask_first", note: "Ask before close-up portraits of locals, and be especially discreet around residents in quiet neighbourhoods." },
      { kind: "religious_site", permission: "restricted", note: "Many temple and shrine interiors and treasured artworks are no-photo zones; follow posted signs and respect 'no photography' inside main halls." },
      { kind: "general", permission: "ask_first", note: "Some private gardens, machiya houses and tea houses limit or charge for photography, so check before shooting." },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Santorini is famously photogenic and casual photography is generally welcome, but caldera-edge drone flying is tightly controlled.",
    rules: [
      { kind: "general", permission: "generally_ok", note: "Photographing the whitewashed villages, sunsets and caldera views is generally fine in public spaces." },
      { kind: "drone", permission: "restricted", note: "Drone use is restricted near the caldera, busy villages and Santorini airport, and requires registration and authorisation under Greek/EU rules." },
      { kind: "people", permission: "ask_first", note: "Ask before photographing locals, shopkeepers or people relaxing at their homes built into the cliffs." },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "Marrakech is vivid and tempting to photograph, but the souks and Jemaa el-Fnaa have strong norms around photographing people — many expect a tip, and some firmly decline.",
    rules: [
      { kind: "people", permission: "ask_first", note: "Always ask before photographing people in the souks or square; performers and vendors often expect a small tip, and some will refuse outright." },
      { kind: "religious_site", permission: "restricted", note: "Mosques are generally closed to non-Muslims and photographing worshippers or mosque interiors is inappropriate; photograph exteriors discreetly." },
      { kind: "drone", permission: "prohibited", note: "Drones are heavily restricted in Morocco and routinely confiscated at the airport without prior authorisation — assume you cannot fly one." },
      { kind: "general", permission: "ask_first", note: "Inside shops and riads, ask the owner before photographing goods, courtyards or interiors." },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Patagonia's landscapes are a photographer's dream, but drones are restricted across national parks and weather demands caution.",
    rules: [
      { kind: "drone", permission: "restricted", note: "Drone flying is restricted or banned in national parks such as Torres del Paine and Los Glaciares; check park rules and obtain any required permit first." },
      { kind: "general", permission: "generally_ok", note: "Landscape and wildlife photography is generally welcome on trails — keep your distance from animals and stay on marked paths." },
      { kind: "people", permission: "ask_first", note: "Ask before photographing gauchos, estancia staff or residents of small Patagonian towns." },
    ],
  },
];
