/**
 * Real-Time City Energy Engine (scaffold).
 *
 * Describes a city's current emotional atmosphere as signals (each 0..1 toward
 * the named pole). Unlike safety/conditions, "high" isn't strictly "better" —
 * these characterize vibe for matching to a traveler's mood, not ranking
 * safety. Live inputs (events density, nightlife, local/tourist ratio) roadmap.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface CityEnergyContext {
  /** 0..1 — 1 = very calm. */
  readonly calmness?: number;
  /** 0..1 — 1 = peak festival/celebration intensity. */
  readonly festivity?: number;
  /** 0..1 — 1 = vibrant nightlife. */
  readonly nightlife?: number;
  /** 0..1 — 1 = predominantly local (vs tourist-saturated). */
  readonly localDensity?: number;
}

export const CITY_ENERGY_SIGNAL_KEYS = [
  "calmness",
  "festivity",
  "nightlife",
  "local_density",
] as const;

export const cityEnergyEngine: IntelligenceEngine<CityEnergyContext> = {
  id: "city-energy-intelligence",
  name: "Real-Time City Energy Engine",
  toSignals(input: CityEnergyContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.calmness !== undefined) s.push({ key: "calmness", value: input.calmness, note: "Calmness" });
    if (input.festivity !== undefined) s.push({ key: "festivity", value: input.festivity, note: "Festivity" });
    if (input.nightlife !== undefined) s.push({ key: "nightlife", value: input.nightlife, note: "Nightlife" });
    if (input.localDensity !== undefined) s.push({ key: "local_density", value: input.localDensity, note: "Local density" });
    return s;
  },
};
