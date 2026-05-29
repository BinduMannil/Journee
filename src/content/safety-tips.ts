/**
 * Common scams & safety tips (editorial seed data).
 *
 * Practical, non-alarmist guidance per destination: the handful of scams or
 * hassles travellers actually run into, how each works, and how to sidestep it —
 * plus a few general safety pointers. Most listed places are very safe; this is
 * about staying street-smart, not afraid. **Editorial seed data**, not exhaustive
 * or live advice, so `SAFETY_TIPS_DATA_NOTE` is surfaced with every consumer.
 * Mirrors the `festivals.ts` content pattern.
 */

export interface ScamTip {
  readonly name: string;
  /** How the scam works, in one sentence. */
  readonly how: string;
  /** How to avoid it. */
  readonly avoid: string;
}

export interface SafetyTipsProfile {
  readonly destinationId: string;
  readonly commonScams: readonly ScamTip[];
  /** Practical general safety tips. */
  readonly generalTips: readonly string[];
}

/** Shown with any safety data so it reads as guidance, not a guarantee. */
export const SAFETY_TIPS_DATA_NOTE =
  "Editorial general guidance, not exhaustive — most destinations here are very " +
  "safe; stay aware, use common sense, and verify current local advice before you go.";

export const safetyTipsProfiles: readonly SafetyTipsProfile[] = [
  {
    destinationId: "kyoto",
    commonScams: [
      {
        name: "Nightlife bar touts",
        how: "In nightlife districts like Kiyamachi, touts steer visitors to bars that later add surprise cover charges or inflated drink prices.",
        avoid: "Skip places fronted by touts; choose bars with posted prices or a reputation you've checked beforehand.",
      },
    ],
    generalTips: [
      "Crime is very low and scams are rare — petty theft and serious harassment are uncommon.",
      "Be wary of bar touts in nightlife districts and stick to venues with clearly posted prices.",
      "If you rent a bicycle, follow local cycling rules — ride on the correct side, park only in designated areas, and avoid blocking footpaths.",
      "Carry your passport or a copy, as police can ask foreign visitors to show ID.",
    ],
  },
  {
    destinationId: "santorini",
    commonScams: [
      {
        name: "Café and bar overcharging",
        how: "A few cafés in the busiest caldera spots leave prices off the menu and add high or unexpected charges to the bill.",
        avoid: "Check that prices are printed on the menu before ordering and glance over the bill before paying.",
      },
      {
        name: "Unmetered taxi fares",
        how: "Some taxis quote a vague or inflated price for popular routes, especially from the port or airport at peak times.",
        avoid: "Agree the fare before getting in, or confirm the meter is used, and ask your hotel for typical rates.",
      },
    ],
    generalTips: [
      "The island is generally very safe; issues are mostly about overpaying rather than crime.",
      "Agree taxi fares up front and keep small change for short trips.",
      "Mind the cliff and caldera paths — surfaces are uneven and can be slippery, so wear good footwear and take care near edges.",
      "Donkey and mule rides up the Fira steps raise animal-welfare concerns; consider the cable car or walking instead.",
    ],
  },
  {
    destinationId: "marrakech",
    commonScams: [
      {
        name: "Unofficial 'guides'",
        how: "Someone offers to guide you or insists you're lost in the medina, then demands a fee afterwards.",
        avoid: "Politely but firmly decline, keep walking, and use a licensed guide arranged through your accommodation if you want one.",
      },
      {
        name: "Henna approach",
        how: "Women in busy squares offer henna and apply it quickly, then ask for a high payment.",
        avoid: "Keep your hands to yourself and say no clearly; only agree to henna at a stall with an agreed price.",
      },
      {
        name: "'This way is closed' misdirection",
        how: "A passer-by claims your route or a sight is closed and steers you toward a shop, tannery, or longer paid route.",
        avoid: "Thank them and check the route yourself with a map; closures are rarely what they claim.",
      },
      {
        name: "Photo fees at Jemaa el-Fnaa",
        how: "Performers, snake charmers, or water sellers encourage a photo, then ask for money once you've taken it.",
        avoid: "Only photograph if you're happy to tip, agree a small amount first, or simply enjoy the scene without a photo.",
      },
    ],
    generalTips: [
      "Marrakech is welcoming and most encounters are friendly — the hassles are mostly persistent sales pressure, not danger.",
      "Agree prices first for taxis, guides, henna, and souk purchases, and expect to haggle in the markets.",
      "Politely decline offers of help or guiding and keep walking if you don't want them.",
      "Keep valuables secure and stay aware in the densest, busiest parts of the medina.",
    ],
  },
  {
    destinationId: "patagonia",
    commonScams: [
      {
        name: "Petty theft at bus terminals",
        how: "Bags left unattended at busy bus terminals or in larger cities can be taken while you're distracted.",
        avoid: "Keep bags within sight and in contact with you, and don't leave luggage unwatched on terminal floors.",
      },
    ],
    generalTips: [
      "The region is generally safe; the main risk is petty theft in larger cities and at bus terminals rather than violent crime.",
      "Watch your bags closely at terminals and on long-distance buses, and keep valuables on your person.",
      "Be weather-prepared in the parks — conditions change fast, so carry layers, wind protection, water, and check forecasts and trail status.",
      "Tell someone your hiking plans and stick to marked trails in remote areas.",
    ],
  },
];
