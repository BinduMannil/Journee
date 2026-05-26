/**
 * Safety & Risk Engine (scaffold).
 *
 * Maps risk inputs to *safety confidence* signals (1 = safe, 0 = high risk),
 * sharing the polarity of the disruption engine so they compose. Live inputs
 * (scam reports, health advisories, emergency-service data) are roadmap; the
 * mapping is real and testable.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface SafetyContext {
  /** 0..1 — 1 = low scam prevalence. */
  readonly scamSafety?: number;
  /** 0..1 — 1 = comfortable crowd levels. */
  readonly crowdSafety?: number;
  /** 0..1 — 1 = strong emergency-services access. */
  readonly emergencyReadiness?: number;
  /** 0..1 — 1 = low health risk. */
  readonly healthSafety?: number;
}

export const SAFETY_SIGNAL_KEYS = [
  "scam",
  "crowd",
  "emergency",
  "health",
] as const;

export const safetyEngine: IntelligenceEngine<SafetyContext> = {
  id: "safety-intelligence",
  name: "Safety & Risk Engine",
  toSignals(input: SafetyContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.scamSafety !== undefined) s.push({ key: "scam", value: input.scamSafety, note: "Scam safety" });
    if (input.crowdSafety !== undefined) s.push({ key: "crowd", value: input.crowdSafety, note: "Crowd safety" });
    if (input.emergencyReadiness !== undefined) s.push({ key: "emergency", value: input.emergencyReadiness, note: "Emergency readiness" });
    if (input.healthSafety !== undefined) s.push({ key: "health", value: input.healthSafety, note: "Health safety" });
    return s;
  },
};
