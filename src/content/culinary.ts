/**
 * Local food & drink customs (editorial seed data).
 *
 * Per-destination culinary context for trip planning: popular dishes, the
 * signature local drink, dietary/religious prevalence flags (e.g. pork/beef),
 * and alcohol norms (sold in supermarkets? public drinking permitted? legal
 * age?). This is **editorial seed data** — general guidance to set expectations,
 * not legal advice or a live feed. Laws and customs change and vary locally;
 * `CULINARY_DATA_NOTE` is surfaced with every consumer so it stays honest.
 *
 * Data-driven so the set stays truthful as it grows; mirrors the destination
 * catalog pattern in `destinations.ts`.
 */

/** How common an ingredient/food is at a destination. */
export type Prevalence = "common" | "limited" | "rare" | "unavailable";

/** How easily a vegetarian traveller is accommodated. */
export type VegFriendliness = "easy" | "moderate" | "limited";

export interface DietaryProfile {
  readonly pork: Prevalence;
  readonly beef: Prevalence;
  readonly vegetarianFriendly: VegFriendliness;
  /** Religious/cultural dietary context (e.g. halal-standard, fish-based stock). */
  readonly notes?: string;
}

export interface AlcoholProfile {
  /** Sold in ordinary supermarkets / convenience stores. */
  readonly inSupermarkets: boolean;
  /** Open-container: drinking in public / "drink and walk" is generally permitted. */
  readonly publicDrinkingAllowed: boolean;
  /** Legal purchase/consumption age, where well-defined. */
  readonly legalAge?: number;
  readonly notes?: string;
}

export interface CulinaryProfile {
  readonly destinationId: string;
  readonly popularDishes: readonly string[];
  /** The signature local drink to try. */
  readonly signatureDrink: string;
  readonly dietary: DietaryProfile;
  readonly alcohol: AlcoholProfile;
}

/** Shown alongside any culinary data so it is never mistaken for legal advice. */
export const CULINARY_DATA_NOTE =
  "Editorial guidance for planning, not legal advice. Customs and alcohol laws " +
  "vary locally and change — verify on the ground.";

export const culinaryProfiles: readonly CulinaryProfile[] = [
  {
    destinationId: "kyoto",
    popularDishes: ["Kaiseki", "Yudofu (tofu hot pot)", "Obanzai", "Ramen", "Matcha sweets"],
    signatureDrink: "Sake (nihonshu); matcha green tea",
    dietary: {
      pork: "common",
      beef: "common",
      vegetarianFriendly: "moderate",
      notes:
        "Buddhist shojin-ryori offers fully vegetarian meals, but everyday dashi stock is often fish-based — ask if avoiding fish.",
    },
    alcohol: {
      inSupermarkets: true,
      publicDrinkingAllowed: true,
      legalAge: 20,
      notes: "Widely sold in convenience stores; public drinking is legal and common.",
    },
  },
  {
    destinationId: "santorini",
    popularDishes: ["Moussaka", "Souvlaki", "Fava", "Tomatokeftedes", "Fresh seafood"],
    signatureDrink: "Assyrtiko white wine; ouzo",
    dietary: {
      pork: "common",
      beef: "limited",
      vegetarianFriendly: "easy",
      notes:
        "Many vegetable mezze; Greek Orthodox fasting ('nistisima') makes vegan-friendly dishes common.",
    },
    alcohol: {
      inSupermarkets: true,
      publicDrinkingAllowed: true,
      legalAge: 18,
      notes: "Sold everywhere; public drinking is generally tolerated.",
    },
  },
  {
    destinationId: "marrakech",
    popularDishes: ["Tagine", "Couscous", "Harira", "Pastilla", "Grilled brochettes (lamb/beef)"],
    signatureDrink: "Mint tea (atay)",
    dietary: {
      pork: "unavailable",
      beef: "common",
      vegetarianFriendly: "moderate",
      notes:
        "Food is halal; pork is not served. Lamb and beef are common, and vegetable tagines are widely available.",
    },
    alcohol: {
      inSupermarkets: false,
      publicDrinkingAllowed: false,
      legalAge: 18,
      notes:
        "Alcohol is restricted — mainly in licensed restaurants, hotels, and some large supermarkets, not corner shops. Public drinking is not socially acceptable.",
    },
  },
  {
    destinationId: "patagonia",
    popularDishes: ["Cordero al palo (spit-roast lamb)", "Asado", "Trout", "Curanto", "Empanadas"],
    signatureDrink: "Mate; Malbec and Patagonian wines",
    dietary: {
      pork: "common",
      beef: "common",
      vegetarianFriendly: "limited",
      notes: "Asado (barbecue) is central; vegetarian options can be scarce in remote areas.",
    },
    alcohol: {
      inSupermarkets: true,
      publicDrinkingAllowed: true,
      legalAge: 18,
      notes: "Wine and beer are widely sold; informal public drinking is generally tolerated.",
    },
  },
];
