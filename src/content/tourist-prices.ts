/**
 * Tourist item base prices — fair / typical price ranges per destination
 * (editorial seed data).
 *
 * The fair or typical price band (in **approximate USD equivalents**) for the
 * things travellers commonly buy — souvenirs, street food, short rides, entry
 * fees — so a visitor knows roughly when they are being overcharged and can
 * haggle from a sensible anchor rather than the vendor's first ask. This is an
 * editorial orientation/anti-overcharging index, not live prices or quotes;
 * figures are rounded and drift with season, vendor, quality and exchange
 * rates, so `TOURIST_PRICES_NOTE` is surfaced with every consumer. Mirrors the
 * `costs.ts` content pattern.
 */

export type ItemCategory =
  | "souvenir"
  | "food_drink"
  | "transport"
  | "attraction"
  | "essentials";

export interface TouristItemPrice {
  readonly item: string;
  readonly category: ItemCategory;
  /** Lower bound of a fair price as an approximate USD equivalent. */
  readonly fairLowUsd: number;
  /** Upper bound of a fair price as an approximate USD equivalent. */
  readonly fairHighUsd: number;
  /** Practical, factual anti-overcharging note (e.g. haggling guidance). */
  readonly note: string;
}

export interface TouristPricesProfile {
  readonly destinationId: string;
  readonly summary: string;
  /** Whether bargaining is the local norm for the items below. */
  readonly bargainingExpected: boolean;
  readonly items: readonly TouristItemPrice[];
}

/** Shown with any tourist-price data so figures read as orientation, not quotes. */
export const TOURIST_PRICES_NOTE =
  "Editorial approximate USD-equivalent price ranges for orientation and to " +
  "avoid being overcharged — these are not live prices or quotes. Prices vary " +
  "by season, vendor and quality and drift with exchange rates, so verify " +
  "locally before paying.";

export const touristPricesProfiles: readonly TouristPricesProfile[] = [
  {
    destinationId: "kyoto",
    summary:
      "Japan runs on fixed, displayed prices — what you see is what you pay, so haggling is neither expected nor welcome.",
    bargainingExpected: false,
    items: [
      {
        item: "Matcha sweets souvenir box",
        category: "souvenir",
        fairLowUsd: 8,
        fairHighUsd: 18,
        note: "Department-store and station shops are fixed-price; compare boxes by weight rather than expecting a discount.",
      },
      {
        item: "Ramen bowl",
        category: "food_drink",
        fairLowUsd: 7,
        fairHighUsd: 13,
        note: "Most shops use a ticket vending machine, so prices are set; a single bowl rarely tops the high end.",
      },
      {
        item: "Temple entry",
        category: "attraction",
        fairLowUsd: 3,
        fairHighUsd: 6,
        note: "Standard published admission; pay at the gate counter only and keep the ticket stub.",
      },
      {
        item: "Short taxi hop",
        category: "transport",
        fairLowUsd: 5,
        fairHighUsd: 9,
        note: "Metered with a posted flag-drop; insist the meter runs and refuse any flat 'tourist' quote.",
      },
      {
        item: "Folding fan (sensu) souvenir",
        category: "souvenir",
        fairLowUsd: 6,
        fairHighUsd: 25,
        note: "Prices are labelled and reflect quality; handmade silk fans sit at the top of the range, plastic ones at the bottom.",
      },
    ],
  },
  {
    destinationId: "santorini",
    summary:
      "Prices are fixed and menu-listed, but caldera-view venues carry a steep view premium — walk a street back for normal prices.",
    bargainingExpected: false,
    items: [
      {
        item: "Caldera-view cocktail",
        category: "food_drink",
        fairLowUsd: 12,
        fairHighUsd: 18,
        note: "You pay a premium for the sunset view; the same drink is roughly half this a block inland.",
      },
      {
        item: "Gyros wrap",
        category: "food_drink",
        fairLowUsd: 4,
        fairHighUsd: 7,
        note: "Cheap and filling; check the posted price board, as a sit-down table can add a service/cover charge.",
      },
      {
        item: "Sunset catamaran boat tour",
        category: "attraction",
        fairLowUsd: 90,
        fairHighUsd: 160,
        note: "Confirm whether food and drinks are included before booking — that is the main source of price gaps.",
      },
      {
        item: "Fridge-magnet souvenir",
        category: "souvenir",
        fairLowUsd: 2,
        fairHighUsd: 6,
        note: "Fixed-price in tourist shops; identical magnets cost less away from the Oia main strip.",
      },
      {
        item: "Bottled water (500ml)",
        category: "essentials",
        fairLowUsd: 0.5,
        fairHighUsd: 2,
        note: "Supermarkets and kiosks are cheapest; clifftop cafes charge several times more for the same bottle.",
      },
    ],
  },
  {
    destinationId: "marrakech",
    summary:
      "In the souks the first ask is typically 3-4x the fair price — bargaining is expected, so counter low and be ready to walk away.",
    bargainingExpected: true,
    items: [
      {
        item: "Leather babouche slippers",
        category: "souvenir",
        fairLowUsd: 8,
        fairHighUsd: 25,
        note: "First quote is often 3-4x; open well below your target, settle in the range, and inspect the stitching and dye.",
      },
      {
        item: "Tagine cooking pottery",
        category: "souvenir",
        fairLowUsd: 10,
        fairHighUsd: 30,
        note: "Glazed decorative pieces cost more than plain cookware; haggle hard and walking away usually drops the price.",
      },
      {
        item: "Mint tea at a cafe",
        category: "food_drink",
        fairLowUsd: 1,
        fairHighUsd: 3,
        note: "Cafes are effectively fixed-price; if no price is shown, ask first to avoid an inflated tourist bill.",
      },
      {
        item: "Taxi from the airport to the medina",
        category: "transport",
        fairLowUsd: 7,
        fairHighUsd: 10,
        note: "Agree the fare before getting in — drivers rarely use the meter; the official daytime rate sits in this band.",
      },
      {
        item: "Riad lamp / lantern",
        category: "souvenir",
        fairLowUsd: 15,
        fairHighUsd: 50,
        note: "Pierced-metal lanterns start very high; expect to negotiate down by half or more, and check for sharp edges.",
      },
    ],
  },
  {
    destinationId: "patagonia",
    summary:
      "Park fees and shop prices are fixed and posted; remote logistics make everything dearer, but there is no haggling.",
    bargainingExpected: false,
    items: [
      {
        item: "National park entrance fee (Torres del Paine / Los Glaciares)",
        category: "attraction",
        fairLowUsd: 20,
        fairHighUsd: 35,
        note: "Official rate set by the park authority; foreigners pay more than locals and buying online can avoid a surcharge.",
      },
      {
        item: "Craft beer (pint)",
        category: "food_drink",
        fairLowUsd: 4,
        fairHighUsd: 8,
        note: "Menu-priced; remote mountain towns sit at the top of the band due to transport costs.",
      },
      {
        item: "Wool / handicraft souvenir",
        category: "souvenir",
        fairLowUsd: 15,
        fairHighUsd: 60,
        note: "Co-op and artisan shops are fixed-price; genuine handspun wool costs more than machine-made imports.",
      },
      {
        item: "Bottled water (500ml)",
        category: "essentials",
        fairLowUsd: 1,
        fairHighUsd: 3,
        note: "Tap water is widely drinkable here, so refilling a bottle avoids the inflated remote-town markup.",
      },
      {
        item: "Intercity bus ticket (between towns)",
        category: "transport",
        fairLowUsd: 10,
        fairHighUsd: 40,
        note: "Fixed published fares by route and distance; book ahead in peak season as seats and prices both tighten.",
      },
    ],
  },
];
