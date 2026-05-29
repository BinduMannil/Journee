/**
 * Shopping & essentials accessor (pure, no I/O).
 *
 * Reads the editorial shopping seed data and derives concise traveller tips
 * (fuel sparsity, EV-charging scarcity, payment norms). Deterministic +
 * unit-tested. Pair output with `SHOPPING_DATA_NOTE` (re-exported) so it reads
 * as planning guidance, not a live directory.
 */
import {
  SHOPPING_DATA_NOTE,
  shoppingProfiles,
  type ShoppingProfile,
} from "@/content/shopping";

export { SHOPPING_DATA_NOTE };
export type { ShoppingProfile, FuelInfo, EvChargingAvailability } from "@/content/shopping";

/** The shopping profile for a destination, or null when none is catalogued. */
export function getShoppingProfile(destinationId: string): ShoppingProfile | null {
  return shoppingProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

export type ShoppingTipKind = "fuel" | "payment";

export interface ShoppingTip {
  readonly kind: ShoppingTipKind;
  readonly text: string;
}

/**
 * Derive concise tips from a shopping profile: an EV-charging caution when it's
 * rare, any fuel note, and the payment norm. Signal-dense — the catalogued
 * mall/market/online lists are the rest of the value.
 */
export function shoppingTips(profile: ShoppingProfile): readonly ShoppingTip[] {
  const tips: ShoppingTip[] = [];
  if (profile.fuel.evCharging === "rare") {
    tips.push({ kind: "fuel", text: "EV charging is rare here — plan routes around it." });
  }
  if (profile.fuel.note) {
    tips.push({ kind: "fuel", text: profile.fuel.note });
  }
  tips.push({ kind: "payment", text: profile.payment });
  return tips;
}
