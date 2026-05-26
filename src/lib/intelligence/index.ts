/**
 * Intelligence engine surface.
 *
 * Re-exports the scoring core, contracts, default weights, and the implemented
 * engine scaffolds. Engines map domain input -> signals; callers run those
 * signals through `score(...)` with the matching versioned weights.
 */
export * from "./types";
export { score } from "./scoring";
export { comfortScore, type ComfortInput } from "./comfort";
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
  affinityFor,
  rankByDNA,
  type TravelDNA,
  type DestinationLike,
  type MatchResult,
} from "./travel-dna";
export { pathfind, type PathfinderQuery } from "./pathfinder";
export {
  buildItinerary,
  type Itinerary,
  type ItineraryItem,
  type ItineraryDay,
  type Pacing,
} from "./itinerary";
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
export { safetyEngine, SAFETY_SIGNAL_KEYS, type SafetyContext } from "./engines/safety";
export { visaEngine, VISA_SIGNAL_KEYS, type VisaContext } from "./engines/visa";
export { cultureEngine, CULTURE_SIGNAL_KEYS, type CultureContext } from "./engines/culture";
export { conditionsEngine, CONDITIONS_SIGNAL_KEYS, type ConditionsContext } from "./engines/conditions";
export { cityEnergyEngine, CITY_ENERGY_SIGNAL_KEYS, type CityEnergyContext } from "./engines/city-energy";
export { memoryEngine, MEMORY_SIGNAL_KEYS, type MemoryContext } from "./engines/memory";
export {
  safetyWeights,
  visaWeights,
  cultureWeights,
  conditionsWeights,
  cityEnergyWeights,
  memoryWeights,
} from "./weights";
