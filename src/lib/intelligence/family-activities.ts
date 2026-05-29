/**
 * Family & kids activities accessor (pure, no I/O).
 *
 * Reads the editorial family-activities seed data and answers "what can we do
 * with the kids here", "what suits this age" and "what are the activities of a
 * given kind". Deterministic + unit-tested. Pair output with `FAMILY_DATA_NOTE`
 * (re-exported) so it reads as editorial inspiration, not advice, and never as a
 * guarantee that an activity suits a particular child.
 */
import {
  FAMILY_DATA_NOTE,
  familyActivitiesProfiles,
  type ActivityKind,
  type AgeSuitability,
  type FamilyActivity,
  type FamilyActivitiesProfile,
} from "@/content/family-activities";

export { FAMILY_DATA_NOTE };
export type {
  ActivityKind,
  AgeSuitability,
  FamilyActivity,
  FamilyActivitiesProfile,
} from "@/content/family-activities";

/** The family-activities profile for a destination, or null when none is catalogued. */
export function getFamilyActivities(destinationId: string): FamilyActivitiesProfile | null {
  return familyActivitiesProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/**
 * Activities suitable for a given age, including any flagged for "all_ages"
 * ([] for an unknown destination).
 */
export function activitiesForAge(
  destinationId: string,
  age: AgeSuitability,
): readonly FamilyActivity[] {
  return (
    getFamilyActivities(destinationId)?.activities.filter(
      (a) => a.suitableFor.includes(age) || a.suitableFor.includes("all_ages"),
    ) ?? []
  );
}

/** Activities of a given kind ([] for an unknown destination or kind). */
export function activitiesByKind(
  destinationId: string,
  kind: ActivityKind,
): readonly FamilyActivity[] {
  return getFamilyActivities(destinationId)?.activities.filter((a) => a.kind === kind) ?? [];
}
