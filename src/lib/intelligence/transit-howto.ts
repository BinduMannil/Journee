/**
 * Public-transport how-to accessor (pure, no I/O).
 *
 * Reads the editorial transit seed data and answers "how do I get around here"
 * and "is this mode available". Deterministic + unit-tested. Pair output with
 * `TRANSIT_HOWTO_NOTE` (re-exported) so it reads as guidance, not a live feed —
 * routes, fares and passes change and should be confirmed close to travel.
 */
import {
  TRANSIT_HOWTO_NOTE,
  transitHowToProfiles,
  type TransitMode,
  type TransitOption,
  type TransitHowToProfile,
} from "@/content/transit-howto";

export { TRANSIT_HOWTO_NOTE };
export type {
  TransitHowToProfile,
  TransitOption,
  TransitMode,
  FarePayment,
} from "@/content/transit-howto";

/** The transit how-to profile for a destination, or null when none is catalogued. */
export function getTransitHowTo(destinationId: string): TransitHowToProfile | null {
  return transitHowToProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The catalogued option for a given mode at a destination, or null when absent. */
export function transitOptionFor(
  destinationId: string,
  mode: TransitMode,
): TransitOption | null {
  return getTransitHowTo(destinationId)?.options.find((o) => o.mode === mode) ?? null;
}

/** Whether the destination accepts contactless card payment (false for unknown). */
export function acceptsContactless(destinationId: string): boolean {
  return getTransitHowTo(destinationId)?.payment.includes("contactless_card") ?? false;
}
