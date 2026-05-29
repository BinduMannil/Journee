/**
 * Festivals & holidays (editorial seed data).
 *
 * The notable festivals and public/religious holidays at each destination: what
 * they are, *why* they happen, what to expect, and whether visitors can join in.
 * Helps travellers time a trip — and avoid being caught out by closures.
 * **Editorial seed data**, not a live calendar — exact dates shift yearly
 * (especially lunar ones), so `FESTIVALS_DATA_NOTE` is surfaced with every
 * consumer and dates are given as typical months/seasons, not exact days.
 * Mirrors the `culinary.ts` content pattern.
 */

export type FestivalKind = "festival" | "public_holiday" | "religious";

export interface Festival {
  readonly name: string;
  readonly kind: FestivalKind;
  /** Typical months it falls in (1=Jan…12=Dec); lunar ones drift year to year. */
  readonly months: readonly number[];
  /** Why it happens — the meaning/origin. */
  readonly significance: string;
  /** What a visitor will see/experience. */
  readonly whatToExpect: string;
  /** Whether visitors can respectfully take part (vs observe only / closures). */
  readonly visitorsCanJoin: boolean;
}

export interface FestivalsProfile {
  readonly destinationId: string;
  readonly festivals: readonly Festival[];
}

/** Shown with any festival data so dates read as typical, not exact. */
export const FESTIVALS_DATA_NOTE =
  "Editorial guide; dates are typical months and lunar/movable holidays shift " +
  "each year — confirm exact dates and closures before booking.";

export const festivalsProfiles: readonly FestivalsProfile[] = [
  {
    destinationId: "kyoto",
    festivals: [
      { name: "Gion Matsuri", kind: "festival", months: [7], significance: "A 1,100-year-old Yasaka Shrine festival originally to ward off plague.", whatToExpect: "Giant Yamaboko floats parade the streets; lively pre-parade evenings (yoiyama) with food stalls.", visitorsCanJoin: true },
      { name: "Hanami (cherry blossom season)", kind: "festival", months: [3, 4], significance: "Centuries-old custom of contemplating the fleeting beauty of sakura.", whatToExpect: "Picnics under blossoms in parks and along the Philosopher's Path; crowded but joyful.", visitorsCanJoin: true },
      { name: "New Year (Shōgatsu)", kind: "public_holiday", months: [1], significance: "Japan's most important holiday; family, shrine visits (hatsumōde) and renewal.", whatToExpect: "Many shops/restaurants close 1–3 Jan; temples and shrines are busy.", visitorsCanJoin: true },
    ],
  },
  {
    destinationId: "santorini",
    festivals: [
      { name: "Greek Orthodox Easter (Pascha)", kind: "religious", months: [4, 5], significance: "The most important Orthodox feast — Christ's resurrection.", whatToExpect: "Candlelit midnight services, fireworks, and feasting; the island's biggest celebration.", visitorsCanJoin: true },
      { name: "Ifestia Festival", kind: "festival", months: [9], significance: "Re-enacts the volcanic eruption that shaped the caldera.", whatToExpect: "Fireworks over the caldera from Fira; large evening crowds.", visitorsCanJoin: true },
      { name: "Assumption of the Virgin (Dekapentavgoustos)", kind: "religious", months: [8], significance: "Major Orthodox feast of the Virgin Mary on 15 Aug.", whatToExpect: "Church services and village festivities; some closures.", visitorsCanJoin: true },
    ],
  },
  {
    destinationId: "marrakech",
    festivals: [
      { name: "Ramadan", kind: "religious", months: [3, 4], significance: "The Islamic holy month of dawn-to-dusk fasting (lunar — shifts ~11 days earlier yearly).", whatToExpect: "Daytime cafés/quiet, vibrant evenings after iftar; be discreet eating/drinking by day.", visitorsCanJoin: false },
      { name: "Eid al-Fitr", kind: "religious", months: [4], significance: "Celebrates the end of Ramadan.", whatToExpect: "Family gatherings and closures; a festive but largely private holiday.", visitorsCanJoin: false },
      { name: "Marrakech du Rire / arts festivals", kind: "festival", months: [6], significance: "Modern cultural/comedy festivals drawing international acts.", whatToExpect: "Public performances and a lively city; open to all.", visitorsCanJoin: true },
    ],
  },
  {
    destinationId: "patagonia",
    festivals: [
      { name: "Fiesta Nacional del Lago (Bariloche)", kind: "festival", months: [2], significance: "Summer lake festival celebrating the region.", whatToExpect: "Concerts, food and lakeside events.", visitorsCanJoin: true },
      { name: "National Day (Argentina, 25 May / 9 July)", kind: "public_holiday", months: [5, 7], significance: "Patriotic commemorations of the May Revolution and Independence.", whatToExpect: "Parades and closures; hearty traditional food (locro).", visitorsCanJoin: true },
      { name: "Fiestas Patrias (Chile, 18 Sept)", kind: "public_holiday", months: [9], significance: "Chile's independence celebrations.", whatToExpect: "Fondas (party venues), cueca dancing, asado; widespread closures.", visitorsCanJoin: true },
    ],
  },
];
