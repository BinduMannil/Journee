/**
 * UV & weather-protection accessor (pure, no I/O).
 *
 * Reads the editorial UV-protection seed data and answers "how intense is the UV
 * here typically", "what do locals do to protect against a given element", and
 * "is this a high-UV destination". Deterministic + unit-tested. Pair output with
 * `UV_PROTECTION_NOTE` (re-exported) so it reads as general background, not a live
 * UV forecast, and never as a substitute for a live UV index or sun-safety advice.
 */
import {
  UV_PROTECTION_NOTE,
  uvProtectionProfiles,
  type ProtectionCustom,
  type UvProtectionProfile,
} from "@/content/uv-protection";

export { UV_PROTECTION_NOTE };
export type {
  UvProtectionProfile,
  ProtectionCustom,
  UvBand,
} from "@/content/uv-protection";

/** The element a protective custom guards against. */
export type ProtectionElement = ProtectionCustom["element"];

/** The UV-protection profile for a destination, or null when none is catalogued. */
export function getUvProtectionProfile(destinationId: string): UvProtectionProfile | null {
  return uvProtectionProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

/** Protective customs for a given element ([] for unknown destination/element). */
export function protectionFor(
  destinationId: string,
  element: ProtectionElement,
): readonly ProtectionCustom[] {
  return getUvProtectionProfile(destinationId)?.customs.filter((c) => c.element === element) ?? [];
}

/** True when peak UV is rated "high", "very_high" or "extreme" (false for unknown). */
export function isHighUv(destinationId: string): boolean {
  const band = getUvProtectionProfile(destinationId)?.peakUvBand;
  return band === "high" || band === "very_high" || band === "extreme";
}
