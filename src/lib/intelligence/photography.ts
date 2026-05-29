/**
 * Photography rules & etiquette accessor (pure, no I/O).
 *
 * Reads the editorial photography seed data and answers "what are the photo
 * rules here", "what is the rule for a given kind of subject", and "what may I
 * not photograph". Deterministic + unit-tested. Pair output with
 * `PHOTOGRAPHY_DATA_NOTE` (re-exported) so it reads as etiquette guidance, not
 * legal advice, and never as a substitute for checking current local and drone
 * regulations on the ground.
 */
import {
  PHOTOGRAPHY_DATA_NOTE,
  photographyProfiles,
  type PhotoRule,
  type PhotoRuleKind,
  type PhotographyProfile,
} from "@/content/photography";

export { PHOTOGRAPHY_DATA_NOTE };
export type {
  PhotographyProfile,
  PhotoRule,
  PhotoRuleKind,
  Permission,
} from "@/content/photography";

/** The photography profile for a destination, or null when none is catalogued. */
export function getPhotographyProfile(destinationId: string): PhotographyProfile | null {
  return photographyProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The rule of a given kind for a destination, or null when none is catalogued. */
export function photoRuleFor(
  destinationId: string,
  kind: PhotoRuleKind,
): PhotoRule | null {
  return getPhotographyProfile(destinationId)?.rules.find((r) => r.kind === kind) ?? null;
}

/** Subject kinds that are "prohibited" or "restricted" ([] for unknown destination). */
export function prohibitedSubjects(destinationId: string): readonly PhotoRuleKind[] {
  return (
    getPhotographyProfile(destinationId)
      ?.rules.filter((r) => r.permission === "prohibited" || r.permission === "restricted")
      .map((r) => r.kind) ?? []
  );
}
