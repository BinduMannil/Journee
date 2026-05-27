/**
 * Real-Time Travel Conditions Engine (scaffold).
 *
 * Maps live operational inputs to *smoothness* signals (1 = running normally).
 * Live feeds (airport/metro status, attraction/route closures, ferry status,
 * tourism surge) are roadmap; the mapping is real and testable.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface ConditionsContext {
  /** 0..1 — 1 = airports/flights normal. */
  readonly airportFlow?: number;
  /** 0..1 — 1 = metro/transit normal. */
  readonly transitFlow?: number;
  /** 0..1 — 1 = attractions open / routes clear. */
  readonly accessOpen?: number;
  /** 0..1 — 1 = manageable tourism levels (not surging). */
  readonly surgeComfort?: number;
}

export const CONDITIONS_SIGNAL_KEYS = [
  "airport",
  "transit",
  "access",
  "surge",
] as const;

export const conditionsEngine: IntelligenceEngine<ConditionsContext> = {
  id: "conditions-intelligence",
  name: "Real-Time Travel Conditions Engine",
  toSignals(input: ConditionsContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.airportFlow !== undefined) s.push({ key: "airport", value: input.airportFlow, note: "Airport flow" });
    if (input.transitFlow !== undefined) s.push({ key: "transit", value: input.transitFlow, note: "Transit flow" });
    if (input.accessOpen !== undefined) s.push({ key: "access", value: input.accessOpen, note: "Access open" });
    if (input.surgeComfort !== undefined) s.push({ key: "surge", value: input.surgeComfort, note: "Surge comfort" });
    return s;
  },
};
