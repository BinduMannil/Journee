/**
 * Intelligence engine surface.
 *
 * Re-exports the scoring core, contracts, default weights, and the implemented
 * engine scaffolds. Engines map domain input -> signals; callers run those
 * signals through `score(...)` with the matching versioned weights.
 */
export * from "./types";
export { score } from "./scoring";
export {
  destinationWeights,
  eventWeights,
  disruptionWeights,
  travelConfidenceWeights,
} from "./weights";
export {
  aggregateTravelConfidence,
  type EngineResult,
} from "./engines/confidence";
export {
  destinationEngine,
  DESTINATION_SIGNAL_KEYS,
  type DestinationContext,
} from "./engines/destination";
export {
  eventEngine,
  EVENT_SIGNAL_KEYS,
  type EventContext,
} from "./engines/events";
export {
  disruptionEngine,
  DISRUPTION_SIGNAL_KEYS,
  type DisruptionContext,
} from "./engines/disruption";
