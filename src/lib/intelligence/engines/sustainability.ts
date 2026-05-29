/**
 * Sustainability & Eco-Travel Engine (scaffold).
 *
 * Maps environmental and social-impact inputs to *sustainability confidence*
 * signals (1 = most sustainable / lowest impact), sharing the polarity of the
 * safety and disruption engines so they compose through the same scoring core.
 *
 * Live inputs (real overtourism indices, protected-area data, water-stress
 * feeds, transport options) are roadmap; the input→signal mapping is real and
 * unit-tested. The `transport` signal can be fed directly from the pure carbon
 * estimator (`carbon.ts` → `footprintToTransportSignal`).
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface SustainabilityContext {
  /** 0..1 — 1 = low-carbon access (train/short trip) vs long-haul flying. */
  readonly transport?: number;
  /** 0..1 — 1 = low overtourism pressure (plenty of carrying capacity). */
  readonly overtourism?: number;
  /** 0..1 — 1 = strong environmental stewardship / protected-area health. */
  readonly conservation?: number;
  /** 0..1 — 1 = tourism revenue largely benefits locals (low leakage). */
  readonly localBenefit?: number;
  /** 0..1 — 1 = ample water/energy headroom (low resource stress). */
  readonly resourceResilience?: number;
}

export const SUSTAINABILITY_SIGNAL_KEYS = [
  "transport",
  "overtourism",
  "conservation",
  "local_benefit",
  "resource_resilience",
] as const;

export const sustainabilityEngine: IntelligenceEngine<SustainabilityContext> = {
  id: "sustainability-intelligence",
  name: "Sustainability & Eco-Travel Engine",
  toSignals(input: SustainabilityContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.transport !== undefined)
      s.push({ key: "transport", value: input.transport, note: "Low-carbon access" });
    if (input.overtourism !== undefined)
      s.push({ key: "overtourism", value: input.overtourism, note: "Overtourism headroom" });
    if (input.conservation !== undefined)
      s.push({ key: "conservation", value: input.conservation, note: "Environmental stewardship" });
    if (input.localBenefit !== undefined)
      s.push({ key: "local_benefit", value: input.localBenefit, note: "Local economic benefit" });
    if (input.resourceResilience !== undefined)
      s.push({ key: "resource_resilience", value: input.resourceResilience, note: "Resource resilience" });
    return s;
  },
};
