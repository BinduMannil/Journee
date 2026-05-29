/**
 * Local shopping & essentials (editorial seed data).
 *
 * Per-destination practical "where do I get things" context: malls/department
 * stores, traditional markets/souks, online/e-commerce + delivery options,
 * where to fuel (petrol networks + EV-charging availability), and payment norms.
 * **Editorial seed data**, not a live directory — names and availability change,
 * so `SHOPPING_DATA_NOTE` is surfaced with every consumer. Mirrors the
 * `culinary.ts` / `essentials.ts` content pattern.
 */

export type EvChargingAvailability = "common" | "limited" | "rare";

export interface FuelInfo {
  /** Major petrol/fuel station brands a traveller will recognise. */
  readonly petrolStations: readonly string[];
  readonly evCharging: EvChargingAvailability;
  readonly note?: string;
}

export interface ShoppingProfile {
  readonly destinationId: string;
  /** Malls / department stores / shopping arcades. */
  readonly malls: readonly string[];
  /** Traditional markets / souks / bazaars. */
  readonly markets: readonly string[];
  /** Online / e-commerce + delivery options that work here. */
  readonly online: readonly string[];
  readonly fuel: FuelInfo;
  /** Payment norms (cash vs card vs mobile). */
  readonly payment: string;
}

/** Shown with any shopping data so it reads as guidance, not a live directory. */
export const SHOPPING_DATA_NOTE =
  "Editorial guidance for planning. Shops, networks and availability change — " +
  "verify locally.";

export const shoppingProfiles: readonly ShoppingProfile[] = [
  {
    destinationId: "kyoto",
    malls: ["Kyoto Station Building (Isetan)", "Aeon Mall Kyoto", "Teramachi & Shinkyogoku arcades"],
    markets: ["Nishiki Market", "Toji Temple flea market"],
    online: ["Amazon.co.jp", "Rakuten", "Convenience-store (konbini) pickup: 7-Eleven, Lawson, FamilyMart"],
    fuel: {
      petrolStations: ["ENEOS", "Idemitsu", "Cosmo"],
      evCharging: "limited",
      note: "Convenience stores are everywhere for daily essentials.",
    },
    payment: "Cash is still common; IC cards (Suica/ICOCA) and credit cards are widely accepted in the city.",
  },
  {
    destinationId: "santorini",
    malls: ["Fira town shops (no large malls on-island)"],
    markets: ["Fira & Oia boutiques", "Local produce markets"],
    online: ["Skroutz", "Greek e-shops; Amazon ships to Greece (slower to islands)"],
    fuel: {
      petrolStations: ["EKO", "Shell", "BP"],
      evCharging: "limited",
      note: "Fuel up near Fira before remote drives; stations are sparse elsewhere.",
    },
    payment: "Cards are widely accepted; carry some cash for small tavernas and kiosks.",
  },
  {
    destinationId: "marrakech",
    malls: ["Carrefour / Al Mazar Mall", "Menara Mall"],
    markets: ["The souks of the medina", "Jemaa el-Fnaa stalls"],
    online: ["Jumia", "Avito (classifieds); cash-on-delivery is common"],
    fuel: {
      petrolStations: ["Afriquia", "Shell", "Total"],
      evCharging: "rare",
      note: "Afriquia is the largest network; plan EV trips carefully.",
    },
    payment: "Cash is king in the souks (and haggling is expected); cards work in malls and hotels.",
  },
  {
    destinationId: "patagonia",
    malls: ["La Anónima supermarkets (Argentina)", "Unimarc / Jumbo (Chile)"],
    markets: ["Artisan & craft markets in Bariloche, El Calafate, Puerto Natales"],
    online: ["MercadoLibre (Argentina)", "Falabella (Chile); delivery is slow to remote areas"],
    fuel: {
      petrolStations: ["YPF (Argentina)", "Copec (Chile)"],
      evCharging: "rare",
      note: "Fuel is sparse between towns — top up at every opportunity.",
    },
    payment: "Carry cash in remote towns; cards work in cities. Argentina has parallel exchange dynamics — check before changing money.",
  },
];
