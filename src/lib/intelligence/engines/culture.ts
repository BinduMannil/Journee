/**
 * Local Culture Intelligence Engine (scaffold).
 *
 * Maps cultural-fit inputs to *clarity/ease* signals (1 = easiest to navigate
 * respectfully). Live inputs (etiquette datasets, dress norms, photography
 * rules) are roadmap; the mapping is real and testable.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface CultureContext {
  /** 0..1 — 1 = etiquette norms are clear/documented. */
  readonly etiquetteClarity?: number;
  /** 0..1 — 1 = relaxed dress expectations. */
  readonly dressFlexibility?: number;
  /** 0..1 — 1 = low language barrier. */
  readonly languageEase?: number;
  /** 0..1 — 1 = few photography restrictions. */
  readonly photographyFreedom?: number;
}

export const CULTURE_SIGNAL_KEYS = [
  "etiquette",
  "dress",
  "language",
  "photography",
] as const;

export const cultureEngine: IntelligenceEngine<CultureContext> = {
  id: "culture-intelligence",
  name: "Local Culture Intelligence Engine",
  toSignals(input: CultureContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.etiquetteClarity !== undefined) s.push({ key: "etiquette", value: input.etiquetteClarity, note: "Etiquette clarity" });
    if (input.dressFlexibility !== undefined) s.push({ key: "dress", value: input.dressFlexibility, note: "Dress flexibility" });
    if (input.languageEase !== undefined) s.push({ key: "language", value: input.languageEase, note: "Language ease" });
    if (input.photographyFreedom !== undefined) s.push({ key: "photography", value: input.photographyFreedom, note: "Photography freedom" });
    return s;
  },
};
