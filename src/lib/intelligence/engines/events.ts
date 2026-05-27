/**
 * Event, Festival & Cultural Intelligence Engine (scaffold).
 *
 * Maps cultural-context inputs (festival intensity, cultural significance,
 * operational/crowd impact) to signals that describe how a destination's
 * atmosphere and accessibility shift around events. Mapping is real; event
 * feeds and holiday/observance calendars are roadmap.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface EventContext {
  /** 0..1 — intensity of festival/celebration activity. */
  readonly festivalIntensity?: number;
  /** 0..1 — cultural/historical significance of current events. */
  readonly culturalSignificance?: number;
  /**
   * 0..1 — operational accessibility given events (1 = unaffected,
   * 0 = widespread closures). Inverse of "operational impact".
   */
  readonly operationalAccessibility?: number;
  /** 0..1 — crowd comfort given event-driven density (1 = comfortable). */
  readonly crowdComfort?: number;
}

export const EVENT_SIGNAL_KEYS = [
  "festival_intensity",
  "cultural_significance",
  "operational_accessibility",
  "crowd_comfort",
] as const;

export const eventEngine: IntelligenceEngine<EventContext> = {
  id: "event-intelligence",
  name: "Event, Festival & Cultural Intelligence Engine",
  toSignals(input: EventContext): readonly IntelligenceSignal[] {
    const signals: IntelligenceSignal[] = [];
    if (input.festivalIntensity !== undefined)
      signals.push({ key: "festival_intensity", value: input.festivalIntensity, note: "Festival energy" });
    if (input.culturalSignificance !== undefined)
      signals.push({ key: "cultural_significance", value: input.culturalSignificance, note: "Cultural significance" });
    if (input.operationalAccessibility !== undefined)
      signals.push({ key: "operational_accessibility", value: input.operationalAccessibility, note: "Access despite events" });
    if (input.crowdComfort !== undefined)
      signals.push({ key: "crowd_comfort", value: input.crowdComfort, note: "Event-driven crowding" });
    return signals;
  },
};
