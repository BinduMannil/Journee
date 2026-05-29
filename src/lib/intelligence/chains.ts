/**
 * Local chains accessor (pure, no I/O).
 *
 * Reads the editorial chains seed data and exposes it per destination, with a
 * helper to fetch a single category. Deterministic + unit-tested. Pair output
 * with `CHAINS_DATA_NOTE` (re-exported) so it reads as orientation, not
 * endorsement.
 */
import {
  CHAINS_DATA_NOTE,
  chainsProfiles,
  type ChainCategory,
  type ChainsProfile,
} from "@/content/chains";

export { CHAINS_DATA_NOTE };
export type { ChainsProfile, ChainCategory } from "@/content/chains";

/** The chains profile for a destination, or null when none is catalogued. */
export function getChainsProfile(destinationId: string): ChainsProfile | null {
  return chainsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The chains for one category at a destination (empty array when none/unknown). */
export function chainsForCategory(
  destinationId: string,
  category: ChainCategory,
): readonly string[] {
  return getChainsProfile(destinationId)?.chains[category] ?? [];
}
