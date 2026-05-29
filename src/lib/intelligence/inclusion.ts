/**
 * Traveller inclusion & safety accessor (pure, no I/O).
 *
 * Reads the editorial inclusion seed data and answers "what are the laws and
 * general social climate here" for LGBTQ+ travellers, religious minorities, and
 * solo women. Deterministic + unit-tested. Pair output with `INCLUSION_DATA_NOTE`
 * (re-exported) so it reads as an informational summary, not advice — and
 * remind travellers to verify current official government travel advisories.
 */
import {
  INCLUSION_DATA_NOTE,
  inclusionProfiles,
  type InclusionProfile,
} from "@/content/inclusion";

export { INCLUSION_DATA_NOTE };
export type { InclusionProfile, LegalStatus, Acceptance } from "@/content/inclusion";

/** The inclusion profile for a destination, or null when none is catalogued. */
export function getInclusionProfile(destinationId: string): InclusionProfile | null {
  return inclusionProfiles.find((p) => p.destinationId === destinationId) ?? null;
}
