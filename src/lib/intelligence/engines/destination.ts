/**
 * Destination Intelligence Engine (scaffold).
 *
 * Reduces destination-context inputs (opening state, crowd, season, weather
 * relevance, golden-hour proximity) to normalized favorability signals. The
 * mapping is real and testable; the live data feeds that populate the input are
 * roadmap. See docs/architecture/intelligence-engine-architecture.md.
 */
import type { IntelligenceEngine, IntelligenceSignal } from "../types";

export interface DestinationContext {
  /** Is the place open right now? */
  readonly isOpenNow?: boolean;
  /** 0..1, where 1 = empty/uncrowded (favorable). */
  readonly crowdEmptiness?: number;
  /** 0..1, fit of the current season for this place. */
  readonly seasonalFit?: number;
  /** 0..1, how favorable current weather is for visiting. */
  readonly weatherFavorability?: number;
  /** 0..1, proximity to golden hour for atmospheric visits. */
  readonly goldenHourProximity?: number;
}

export const DESTINATION_SIGNAL_KEYS = [
  "open_now",
  "crowd",
  "season",
  "weather",
  "golden_hour",
] as const;

export const destinationEngine: IntelligenceEngine<DestinationContext> = {
  id: "destination-intelligence",
  name: "Destination Intelligence Engine",
  toSignals(input: DestinationContext): readonly IntelligenceSignal[] {
    const signals: IntelligenceSignal[] = [];
    if (input.isOpenNow !== undefined) {
      signals.push({
        key: "open_now",
        value: input.isOpenNow ? 1 : 0,
        note: input.isOpenNow ? "Open now" : "Currently closed",
      });
    }
    if (input.crowdEmptiness !== undefined)
      signals.push({ key: "crowd", value: input.crowdEmptiness, note: "Lower crowds are better" });
    if (input.seasonalFit !== undefined)
      signals.push({ key: "season", value: input.seasonalFit, note: "Seasonal suitability" });
    if (input.weatherFavorability !== undefined)
      signals.push({ key: "weather", value: input.weatherFavorability, note: "Weather favorability" });
    if (input.goldenHourProximity !== undefined)
      signals.push({ key: "golden_hour", value: input.goldenHourProximity, note: "Atmospheric light" });
    return signals;
  },
};
