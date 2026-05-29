/**
 * Local gems accessor (pure, no I/O).
 *
 * Reads the editorial gems seed data and exposes the standout eats & drinks per
 * destination, with a filter by kind. Deterministic + unit-tested. Pair output
 * with `GEMS_DATA_NOTE` (re-exported) so picks read as inspiration, not a
 * guarantee.
 */
import {
  GEMS_DATA_NOTE,
  gemsProfiles,
  type GemKind,
  type GemsProfile,
  type LocalGem,
} from "@/content/local-gems";

export { GEMS_DATA_NOTE };
export type { GemsProfile, LocalGem, GemKind } from "@/content/local-gems";

/** The gems profile for a destination, or null when none is catalogued. */
export function getLocalGems(destinationId: string): GemsProfile | null {
  return gemsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Gems of a given kind (eat/drink) for a destination ([] when none/unknown). */
export function gemsByKind(destinationId: string, kind: GemKind): readonly LocalGem[] {
  return getLocalGems(destinationId)?.gems.filter((g) => g.kind === kind) ?? [];
}
