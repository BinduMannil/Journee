/**
 * Local gems — standout eats & drinks (editorial seed data).
 *
 * Curated, specific recommendations per destination: recognizable local
 * institutions and standout spots, what to order there, and why they're worth
 * it. **Editorial picks for inspiration**, not sponsored and not a live
 * directory — places change hours, move, or close, so `GEMS_DATA_NOTE` is
 * surfaced with every consumer and travellers are told to verify before going.
 * Leans on long-standing, well-known spots to stay accurate. Mirrors the
 * `culinary.ts` content pattern.
 */

export type GemKind = "eat" | "drink";

export interface LocalGem {
  readonly name: string;
  readonly kind: GemKind;
  /** Neighbourhood / area to find it. */
  readonly area: string;
  /** The specific thing to order. */
  readonly whatToTry: string;
  /** Why it's a gem. */
  readonly why: string;
}

export interface GemsProfile {
  readonly destinationId: string;
  readonly gems: readonly LocalGem[];
}

/** Shown with any gems data so picks read as inspiration, not a guarantee. */
export const GEMS_DATA_NOTE =
  "Editorial picks for inspiration — not sponsored. Verify it's open and current " +
  "before you go; favourites change.";

export const gemsProfiles: readonly GemsProfile[] = [
  {
    destinationId: "kyoto",
    gems: [
      { name: "Nishiki Market stalls", kind: "eat", area: "Nakagyo", whatToTry: "Tako tamago, soy-milk doughnuts, tsukemono", why: "Kyoto's 400-year-old 'kitchen' — graze a dozen tiny specialists." },
      { name: "% Arabica Higashiyama", kind: "drink", area: "Higashiyama", whatToTry: "Single-origin latte by the Yasaka Pagoda", why: "Minimalist coffee with one of Kyoto's best street views." },
      { name: "Ramen Sen-no-Kaze / Kyoto ramen shops", kind: "eat", area: "Central Kyoto", whatToTry: "Kyoto-style soy 'kotteri' ramen", why: "Rich, local take on ramen distinct from Tokyo/Hakata." },
    ],
  },
  {
    destinationId: "santorini",
    gems: [
      { name: "Taverna in Ammoudi Bay", kind: "eat", area: "Ammoudi (below Oia)", whatToTry: "Grilled octopus & fresh catch by the water", why: "Seafood at the waterline below the Oia cliffs." },
      { name: "Santo Wines / a caldera-view winery", kind: "drink", area: "Pyrgos / caldera rim", whatToTry: "Assyrtiko tasting flight at sunset", why: "Volcanic-soil whites with the caldera as backdrop." },
      { name: "Lucky's Souvlakis", kind: "eat", area: "Fira", whatToTry: "Pork gyros pita", why: "Cheap, beloved late-night staple away from the tourist markup." },
    ],
  },
  {
    destinationId: "marrakech",
    gems: [
      { name: "Jemaa el-Fnaa food stalls", kind: "eat", area: "Medina (the main square)", whatToTry: "Freshly grilled brochettes & harira; fresh orange juice", why: "The square turns into an open-air kitchen at dusk — pick a busy stall." },
      { name: "Café des Épices / Nomad", kind: "drink", area: "Spice square, medina", whatToTry: "Mint tea on the rooftop", why: "Rooftop calm above the souk bustle." },
      { name: "Mechoui Alley", kind: "eat", area: "Off Jemaa el-Fnaa", whatToTry: "Slow-roast lamb (mechoui) by the half-kilo", why: "Lunchtime institution — order by weight with bread and cumin." },
    ],
  },
  {
    destinationId: "patagonia",
    gems: [
      { name: "La Tablita", kind: "eat", area: "El Calafate", whatToTry: "Cordero patagónico (spit-roast lamb)", why: "The classic parrilla for Patagonian lamb done right." },
      { name: "Rapa Nui", kind: "drink", area: "Bariloche", whatToTry: "Hot chocolate & artisan chocolates", why: "Bariloche's Alpine-style chocolate culture in one stop." },
      { name: "La Anónima rotisería / town parrillas", kind: "eat", area: "Regional towns", whatToTry: "Empanadas and asado to go", why: "Reliable, cheap local eats between long drives." },
    ],
  },
];
