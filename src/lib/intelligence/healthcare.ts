/**
 * Healthcare & medical facilities accessor (pure, no I/O).
 *
 * Reads the editorial healthcare seed data and answers "where can I seek care
 * here", "what facilities of a given kind exist", and "is there a hospital".
 * Deterministic + unit-tested. Pair output with `HEALTHCARE_DATA_NOTE` (re-
 * exported) so it reads as orientation, never as medical advice, an endorsement,
 * or a live directory.
 */
import {
  HEALTHCARE_DATA_NOTE,
  healthcareProfiles,
  type FacilityKind,
  type HealthcareProfile,
  type MedicalFacility,
} from "@/content/healthcare";

export { HEALTHCARE_DATA_NOTE };
export type { HealthcareProfile, MedicalFacility, FacilityKind } from "@/content/healthcare";

/** The healthcare profile for a destination, or null when none is catalogued. */
export function getHealthcareProfile(destinationId: string): HealthcareProfile | null {
  return healthcareProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Facilities of a given kind for a destination ([] for unknown destination/kind). */
export function facilitiesByKind(
  destinationId: string,
  kind: FacilityKind,
): readonly MedicalFacility[] {
  return getHealthcareProfile(destinationId)?.facilities.filter((f) => f.kind === kind) ?? [];
}

/** Whether the destination has at least one catalogued hospital (false for unknown). */
export function hasHospital(destinationId: string): boolean {
  return facilitiesByKind(destinationId, "hospital").length > 0;
}
