/**
 * Connectivity & power accessor (pure, no I/O).
 *
 * Reads the editorial connectivity seed data and answers "what do I need to
 * charge and connect here" and "can I drink the tap water". Deterministic +
 * unit-tested. Pair output with `CONNECTIVITY_DATA_NOTE` (re-exported) so
 * details read as guidance, not guarantees.
 */
import {
  CONNECTIVITY_DATA_NOTE,
  connectivityProfiles,
  type ConnectivityProfile,
} from "@/content/connectivity";

export { CONNECTIVITY_DATA_NOTE };
export type { ConnectivityProfile } from "@/content/connectivity";

/** The connectivity profile for a destination, or null when none is catalogued. */
export function getConnectivityProfile(destinationId: string): ConnectivityProfile | null {
  return connectivityProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Short tap-water advice for a destination (null for unknown destination). */
export function tapWaterAdvice(destinationId: string): string | null {
  const profile = getConnectivityProfile(destinationId);
  if (!profile) return null;
  return profile.tapWaterPotable
    ? "Tap water is generally safe to drink."
    : "Stick to bottled water.";
}
