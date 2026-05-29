/**
 * Familiar local chains by category (editorial seed data).
 *
 * The recognizable chains/brands a traveller will actually see in each
 * destination, by category: cinema, coffee, pharmacy, supermarket, fast food,
 * and hospital networks. Useful for orientation ("what's the local Starbucks /
 * Boots / cinema here?"). **Editorial seed data**, not endorsements or a live
 * directory — brands come and go, so `CHAINS_DATA_NOTE` is surfaced with every
 * consumer. Mirrors the `shopping.ts` content pattern.
 */

export type ChainCategory =
  | "cinema"
  | "coffee"
  | "pharmacy"
  | "supermarket"
  | "fast_food"
  | "hospital";

export const CHAIN_CATEGORIES: readonly ChainCategory[] = [
  "cinema",
  "coffee",
  "pharmacy",
  "supermarket",
  "fast_food",
  "hospital",
];

export interface ChainsProfile {
  readonly destinationId: string;
  /** Recognizable chain/brand names per category (may be empty for a category). */
  readonly chains: Readonly<Record<ChainCategory, readonly string[]>>;
}

/** Shown with any chains data so it reads as orientation, not endorsement. */
export const CHAINS_DATA_NOTE =
  "Editorial orientation, not endorsements or a live directory — brands change; " +
  "verify locally.";

export const chainsProfiles: readonly ChainsProfile[] = [
  {
    destinationId: "kyoto",
    chains: {
      cinema: ["TOHO Cinemas", "MOVIX", "T-Joy"],
      coffee: ["Starbucks", "Doutor", "Komeda's Coffee", "% Arabica"],
      pharmacy: ["Matsumoto Kiyoshi", "Sugi Pharmacy", "Kokumin"],
      supermarket: ["Aeon", "Life", "Fresco"],
      fast_food: ["MOS Burger", "Yoshinoya", "McDonald's", "Sukiya"],
      hospital: ["Kyoto University Hospital", "Japanese Red Cross Kyoto Daiichi"],
    },
  },
  {
    destinationId: "santorini",
    chains: {
      cinema: ["Cine Kamari (open-air, seasonal)"],
      coffee: ["Coffee Island", "Mikel Coffee", "Grégory's"],
      pharmacy: ["Local farmakeio (green-cross pharmacies)"],
      supermarket: ["Sklavenitis", "AB Vassilopoulos", "Lidl (on mainland)"],
      fast_food: ["Goody's Burger House", "McDonald's (Athens/airport)"],
      hospital: ["Santorini General Hospital (Fira)"],
    },
  },
  {
    destinationId: "marrakech",
    chains: {
      cinema: ["Megarama Marrakech", "Cinéma Colisée"],
      coffee: ["Starbucks", "Bacha Coffee", "Café de France"],
      pharmacy: ["Pharmacie de garde (rotating duty pharmacies)"],
      supermarket: ["Carrefour", "Marjane", "Aswak Assalam"],
      fast_food: ["McDonald's", "KFC", "Burger King"],
      hospital: ["Polyclinique du Sud", "Clinique Internationale de Marrakech"],
    },
  },
  {
    destinationId: "patagonia",
    chains: {
      cinema: ["Showcase / regional cinemas (in larger towns)"],
      coffee: ["Havanna (Argentina)", "Starbucks (cities)"],
      pharmacy: ["Farmacity (Argentina)", "Cruz Verde / Salcobrand (Chile)"],
      supermarket: ["La Anónima (Argentina)", "Unimarc / Jumbo (Chile)"],
      fast_food: ["McDonald's", "Mostaza (Argentina)"],
      hospital: ["Hospital Zonal Bariloche", "Hospital de Puerto Natales (Chile)"],
    },
  },
];
