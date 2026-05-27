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
import type { SafetyContext } from "./engines/safety";
import type { ConditionsContext } from "./engines/conditions";

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

export function mockSafetyContext(seed: string): SafetyContext {
  return {
    scamSafety: unit(seed, 10),
    crowdSafety: unit(seed, 11),
    emergencyReadiness: unit(seed, 12),
    healthSafety: unit(seed, 13),
  };
}

export function mockConditionsContext(seed: string): ConditionsContext {
  return {
    airportFlow: unit(seed, 14),
    transitFlow: unit(seed, 15),
    accessOpen: unit(seed, 16),
    surgeComfort: unit(seed, 17),
  };
}
