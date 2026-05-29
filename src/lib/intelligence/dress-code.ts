/**
 * Dress-code accessor (pure, no I/O).
 *
 * Reads the editorial dress-code seed data and answers "how should I dress at
 * this venue type here" and "which venues call for modest dress". Deterministic
 * + unit-tested. Pair output with `DRESS_CODE_NOTE` (re-exported) so it reads as
 * general cultural guidance, not a guarantee of any venue's rules, and so
 * travellers still check specific venue requirements before visiting.
 */
import {
  DRESS_CODE_NOTE,
  dressCodeProfiles,
  type DressCodeProfile,
  type DressGuidance,
  type VenueKind,
} from "@/content/dress-code";

export { DRESS_CODE_NOTE };
export type {
  DressCodeProfile,
  DressGuidance,
  VenueKind,
  Strictness,
} from "@/content/dress-code";

/** The dress-code profile for a destination, or null when none is catalogued. */
export function getDressCode(destinationId: string): DressCodeProfile | null {
  return dressCodeProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** First guidance entry for a venue type, or null when none/unknown destination. */
export function dressGuidanceFor(
  destinationId: string,
  venue: VenueKind,
): DressGuidance | null {
  return getDressCode(destinationId)?.guidance.find((g) => g.venue === venue) ?? null;
}

/** Venue kinds rated "conservative" or "strict" ([] for unknown destination). */
export function venuesNeedingModesty(destinationId: string): readonly VenueKind[] {
  return (
    getDressCode(destinationId)
      ?.guidance.filter((g) => g.strictness === "conservative" || g.strictness === "strict")
      .map((g) => g.venue) ?? []
  );
}
