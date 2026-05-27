/**
 * Political, Weather & Disruption Intelligence Engine (scaffold).
 *
 * Maps risk inputs (advisories, unrest, transport disruption, natural hazards,
 * weather severity) to *confidence* signals (1 = safe/operational, 0 = high
 * risk). Feeds an operational/safety confidence score. Mapping is real; live
 * advisory/weather/hazard feeds are roadmap.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface DisruptionContext {
  /** 0..1 — 1 = no travel advisory, 0 = do-not-travel. */
  readonly advisoryConfidence?: number;
  /** 0..1 — 1 = calm, 0 = active unrest/protests. */
  readonly civilStability?: number;
  /** 0..1 — 1 = transport normal, 0 = major strikes/closures. */
  readonly transportReliability?: number;
  /** 0..1 — 1 = no natural hazard, 0 = active flood/wildfire/typhoon. */
  readonly hazardSafety?: number;
  /** 0..1 — 1 = mild weather, 0 = severe conditions. */
  readonly weatherSeverityInverse?: number;
}

export const DISRUPTION_SIGNAL_KEYS = [
  "advisory",
  "civil_stability",
  "transport",
  "hazard",
  "weather_severity",
] as const;

export const disruptionEngine: IntelligenceEngine<DisruptionContext> = {
  id: "disruption-intelligence",
  name: "Political, Weather & Disruption Intelligence Engine",
  toSignals(input: DisruptionContext): readonly IntelligenceSignal[] {
    const signals: IntelligenceSignal[] = [];
    if (input.advisoryConfidence !== undefined)
      signals.push({ key: "advisory", value: input.advisoryConfidence, note: "Travel advisory level" });
    if (input.civilStability !== undefined)
      signals.push({ key: "civil_stability", value: input.civilStability, note: "Civil stability" });
    if (input.transportReliability !== undefined)
      signals.push({ key: "transport", value: input.transportReliability, note: "Transport reliability" });
    if (input.hazardSafety !== undefined)
      signals.push({ key: "hazard", value: input.hazardSafety, note: "Natural hazard safety" });
    if (input.weatherSeverityInverse !== undefined)
      signals.push({ key: "weather_severity", value: input.weatherSeverityInverse, note: "Weather mildness" });
    return signals;
  },
};
