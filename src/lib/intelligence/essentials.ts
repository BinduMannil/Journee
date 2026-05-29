/**
 * Know-before-you-go essentials accessor (pure, no I/O).
 *
 * Reads the editorial essentials seed data (emergency numbers, healthcare note,
 * courtesy phrases, etiquette do's/don'ts) and exposes it per destination, plus
 * a flat emergency-number list for display. Deterministic + unit-tested. Always
 * pair output with `ESSENTIALS_DATA_NOTE` (re-exported) so it reads as planning
 * guidance, not official advice — and travellers verify numbers on arrival.
 */
import {
  ESSENTIALS_DATA_NOTE,
  localEssentials,
  type LocalEssentials,
} from "@/content/essentials";

export { ESSENTIALS_DATA_NOTE };
export type { LocalEssentials, EmergencyNumbers, KeyPhrase } from "@/content/essentials";

/** The essentials for a destination, or null when none is catalogued. */
export function getLocalEssentials(destinationId: string): LocalEssentials | null {
  return localEssentials.find((e) => e.destinationId === destinationId) ?? null;
}

export interface LabeledNumber {
  readonly label: string;
  readonly number: string;
}

/**
 * Flatten the emergency numbers into a labeled, display-ready list, preferring a
 * universal number first and omitting any that aren't defined.
 */
export function emergencyNumberList(essentials: LocalEssentials): readonly LabeledNumber[] {
  const e = essentials.emergency;
  const entries: readonly (readonly [string, string | undefined])[] = [
    ["Universal", e.universal],
    ["Police", e.police],
    ["Ambulance", e.ambulance],
    ["Fire", e.fire],
  ];
  return entries
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))
    .map(([label, number]) => ({ label, number }));
}
