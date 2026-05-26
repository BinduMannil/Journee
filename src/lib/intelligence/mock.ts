/**
 * Deterministic MOCK intelligence contexts for local dev and tests.
 *
 * Generates plausible EventContext / DisruptionContext values from a string
 * seed (e.g. a destination id) with NO network. Clearly mocks — never present
 * as real observations. They exist so the events and disruption engines are
 * exercisable end-to-end before live feeds (calendars, advisories) are wired.
 */
import type { EventContext } from "./engines/events";
import type { DisruptionContext } from "./engines/disruption";

/** Stable 0..1 pseudo-value from a seed + salt (FNV-1a based). */
function unit(seed: string, salt: number): number {
  let h = 0x811c9dc5 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0x100000000;
}

export function mockEventContext(seed: string): EventContext {
  return {
    festivalIntensity: unit(seed, 1),
    culturalSignificance: unit(seed, 2),
    operationalAccessibility: unit(seed, 3),
    crowdComfort: unit(seed, 4),
  };
}

export function mockDisruptionContext(seed: string): DisruptionContext {
  return {
    advisoryConfidence: unit(seed, 5),
    civilStability: unit(seed, 6),
    transportReliability: unit(seed, 7),
    hazardSafety: unit(seed, 8),
    weatherSeverityInverse: unit(seed, 9),
  };
}
