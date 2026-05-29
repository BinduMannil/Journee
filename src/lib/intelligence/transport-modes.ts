/**
 * Transport modes accessor (pure, no I/O).
 *
 * Reads the editorial transport-modes seed data and answers "what can I ride
 * here", "is this particular mode available", and "which modes share an
 * availability level". Deterministic + unit-tested. Pair output with
 * `TRANSPORT_MODES_NOTE` (re-exported) so it reads as a typical snapshot, not a
 * live availability or fare feed.
 */
import {
  TRANSPORT_MODES_NOTE,
  transportModesProfiles,
  type Availability,
  type TransportMode,
  type TransportModesProfile,
  type TransportOption,
} from "@/content/transport-modes";

export { TRANSPORT_MODES_NOTE };
export type {
  TransportMode,
  Availability,
  TransportOption,
  TransportModesProfile,
} from "@/content/transport-modes";

/** The transport-modes profile for a destination, or null when none is catalogued. */
export function getTransportModes(destinationId: string): TransportModesProfile | null {
  return transportModesProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Whether the given mode is catalogued for a destination (false for unknown). */
export function isModeAvailable(destinationId: string, mode: TransportMode): boolean {
  return getTransportModes(destinationId)?.modes.some((m) => m.mode === mode) ?? false;
}

/** Modes catalogued at the given availability level ([] for unknown destination). */
export function modesByAvailability(
  destinationId: string,
  availability: Availability,
): readonly TransportOption[] {
  return (
    getTransportModes(destinationId)?.modes.filter((m) => m.availability === availability) ?? []
  );
}
