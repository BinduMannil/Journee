/**
 * Hazards & advisories accessor (pure, no I/O).
 *
 * Reads the editorial hazards seed data and answers "what is this place
 * generally exposed to" and "what are the elevated/high hazards". Deterministic
 * + unit-tested. Pair output with `HAZARDS_DATA_NOTE` (re-exported) so it reads
 * as general background, not a forecast, and never as a substitute for official
 * government travel advisories.
 */
import {
  HAZARDS_DATA_NOTE,
  hazardsProfiles,
  type HazardExposure,
  type HazardsProfile,
} from "@/content/hazards";

export { HAZARDS_DATA_NOTE };
export type {
  HazardsProfile,
  HazardExposure,
  HazardType,
  RiskLevel,
  ConflictStatus,
  AdvisoryLevel,
} from "@/content/hazards";

/** The hazards profile for a destination, or null when none is catalogued. */
export function getHazardsProfile(destinationId: string): HazardsProfile | null {
  return hazardsProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Natural hazards rated "elevated" or "high" ([] for unknown destination). */
export function highRiskHazards(destinationId: string): readonly HazardExposure[] {
  return (
    getHazardsProfile(destinationId)?.naturalHazards.filter(
      (h) => h.risk === "elevated" || h.risk === "high",
    ) ?? []
  );
}
