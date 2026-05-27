/**
 * Memory & Reflection Engine (scaffold).
 *
 * Scores how "memorable" a trip moment is from emotional inputs, to drive trip
 * playback / cinematic summaries. Signals are 0..1 toward "more memorable".
 * Live inputs (photos, sentiment, surprise) are roadmap; mapping is real.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface MemoryContext {
  /** 0..1 — emotional peak intensity of the moment. */
  readonly emotionalPeak?: number;
  /** 0..1 — novelty / surprise. */
  readonly novelty?: number;
  /** 0..1 — social connection during the moment. */
  readonly connection?: number;
  /** 0..1 — sensory richness (views, sound, taste). */
  readonly sensoryRichness?: number;
}

export const MEMORY_SIGNAL_KEYS = [
  "emotional_peak",
  "novelty",
  "connection",
  "sensory",
] as const;

export const memoryEngine: IntelligenceEngine<MemoryContext> = {
  id: "memory-intelligence",
  name: "Memory & Reflection Engine",
  toSignals(input: MemoryContext): readonly IntelligenceSignal[] {
    const s: IntelligenceSignal[] = [];
    if (input.emotionalPeak !== undefined) s.push({ key: "emotional_peak", value: input.emotionalPeak, note: "Emotional peak" });
    if (input.novelty !== undefined) s.push({ key: "novelty", value: input.novelty, note: "Novelty" });
    if (input.connection !== undefined) s.push({ key: "connection", value: input.connection, note: "Connection" });
    if (input.sensoryRichness !== undefined) s.push({ key: "sensory", value: input.sensoryRichness, note: "Sensory richness" });
    return s;
  },
};
