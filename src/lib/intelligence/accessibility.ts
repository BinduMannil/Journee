/**
 * Accessibility capability accessor (pure, no I/O).
 *
 * Reads the editorial accessibility seed data and answers "how step-free is
 * this place" overall and per facet, plus which facets are most constrained.
 * Deterministic + unit-tested. Pair output with `ACCESSIBILITY_DATA_NOTE`
 * (re-exported) so it reads as general guidance, never as a guarantee that any
 * specific route, attraction, property or operator is accessible.
 */
import {
  ACCESSIBILITY_DATA_NOTE,
  accessibilityProfiles,
  type AccessAspect,
  type AccessFacet,
  type AccessibilityProfile,
} from "@/content/accessibility";

export { ACCESSIBILITY_DATA_NOTE };
export type {
  AccessFacet,
  AccessLevel,
  AccessAspect,
  AccessibilityProfile,
} from "@/content/accessibility";

/** The accessibility profile for a destination, or null when none is catalogued. */
export function getAccessibilityProfile(destinationId: string): AccessibilityProfile | null {
  return accessibilityProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** The access aspect for a destination/facet, or null when none is catalogued. */
export function accessAspectFor(
  destinationId: string,
  facet: AccessFacet,
): AccessAspect | null {
  return getAccessibilityProfile(destinationId)?.aspects.find((a) => a.facet === facet) ?? null;
}

/** Facets rated "limited" or "challenging" ([] for unknown destination). */
export function challengingFacets(destinationId: string): readonly AccessFacet[] {
  return (
    getAccessibilityProfile(destinationId)
      ?.aspects.filter((a) => a.level === "limited" || a.level === "challenging")
      .map((a) => a.facet) ?? []
  );
}
