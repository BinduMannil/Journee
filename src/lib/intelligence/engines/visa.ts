/**
 * Visa & Entry Intelligence Engine (scaffold).
 *
 * Maps entry inputs to *ease/readiness* signals (1 = easiest). Live inputs
 * (per-passport visa rules, eVisa availability, policy changes) are roadmap;
 * the mapping is real and testable.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface VisaContext {
  /** 0..1 — 1 = visa-free / on-arrival, 0 = hard visa. */
  readonly entryEase?: number;
  /** 0..1 — 1 = fast/reliable processing (e.g. eVisa). */
  readonly processingConfidence?: number;
  /** 0..1 — 1 = traveler's documents meet requirements. */
  readonly documentReadiness?: number;
  /** 0..1 — 1 = stable entry policy (no recent changes). */
  readonly policyStability?: number;
}

export const VISA_SIGNAL_KEYS = [
  "entry_ease",
  "processing",
  "documents",
  "policy_stability",
] as const;

export const visaEngine: IntelligenceEngine<VisaContext> = {
  id: "visa-intelligence",
  name: "Visa & Entry Intelligence Engine",
  toSignals(input: VisaContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.entryEase !== undefined) s.push({ key: "entry_ease", value: input.entryEase, note: "Entry ease" });
    if (input.processingConfidence !== undefined) s.push({ key: "processing", value: input.processingConfidence, note: "Processing confidence" });
    if (input.documentReadiness !== undefined) s.push({ key: "documents", value: input.documentReadiness, note: "Document readiness" });
    if (input.policyStability !== undefined) s.push({ key: "policy_stability", value: input.policyStability, note: "Policy stability" });
    return s;
  },
};
