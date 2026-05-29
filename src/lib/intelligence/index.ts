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
  editorialCoverage,
  editorialConfidence,
  EDITORIAL_FEATURE_KEYS,
  type EditorialCoverage,
} from "./editorial-confidence";
export {
  explainScore,
  type ScoreExplanation,
  type ExplainedContribution,
  type DriverImpact,
} from "./explain";
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
  composeDestinationReadiness,
  assembleDestinationReadiness,
  type DestinationReadiness,
  type ReadinessSources,
  type SourceProvenance,
  type AssembleReadinessInput,
} from "./destination-readiness";
export {
  composeTripReadiness,
  composeTripReadinessFromSources,
  assembleTripReadiness,
  tripReadinessWeights,
  type TripStop,
  type ResolvedTripStop,
  type TripReadiness,
  type TripStopSummary,
  type TripSourceProvenance,
  type TripSourcesByDestination,
  type AssembleTripReadinessInput,
} from "./trip-readiness";
export {
  affinityFor,
  rankByDNA,
  type TravelDNA,
  type DestinationLike,
  type MatchResult,
} from "./travel-dna";
export { pathfind, type PathfinderQuery } from "./pathfinder";
export {
  getCulinaryProfile,
  culinaryFlags,
  CULINARY_DATA_NOTE,
  type CulinaryProfile,
  type CulinaryFlag,
  type CulinaryFlagKind,
} from "./culinary";
export {
  getLocalGems,
  gemsByKind,
  GEMS_DATA_NOTE,
  type GemsProfile,
  type LocalGem,
  type GemKind,
} from "./local-gems";
export {
  getCityVibe,
  expectLanguageBarrier,
  CITY_VIBE_NOTE,
  type CityVibe,
  type TouristEase,
} from "./city-vibe";
export {
  getFestivals,
  festivalsInMonth,
  joinableFestivals,
  FESTIVALS_DATA_NOTE,
  type FestivalsProfile,
  type Festival,
  type FestivalKind,
} from "./festivals";
export {
  getReligionProfile,
  placesOfWorshipByKind,
  RELIGION_DATA_NOTE,
  type Religion,
  type PlaceOfWorship,
  type PlaceOfWorshipKind,
} from "./religion";
export {
  getTippingProfile,
  tippingSummaryLine,
  TIPPING_DATA_NOTE,
  type TippingProfile,
  type TippingExpectation,
} from "./tipping";
export {
  getConnectivityProfile,
  tapWaterAdvice,
  CONNECTIVITY_DATA_NOTE,
  type ConnectivityProfile,
} from "./connectivity";
export {
  getInclusionProfile,
  INCLUSION_DATA_NOTE,
  type InclusionProfile,
  type LegalStatus,
  type Acceptance,
} from "./inclusion";
export {
  getCostProfile,
  dailyBudgetEstimateUsd,
  COSTS_DATA_NOTE,
  type CostProfile,
  type Affordability,
} from "./costs";
export {
  getNeighborhoods,
  neighborhoodsByType,
  neighborhoodsByCostTier,
  areasWithinBudget,
  STAY_COST_ORDER,
  NEIGHBORHOODS_DATA_NOTE,
  type NeighborhoodsProfile,
  type Neighborhood,
  type AreaType,
  type StayCostTier,
} from "./neighborhoods";
export {
  getDayTrips,
  dayTripsByType,
  DAY_TRIPS_DATA_NOTE,
  type DayTripsProfile,
  type DayTrip,
  type DayTripType,
} from "./day-trips";
export {
  getTransportModes,
  isModeAvailable,
  modesByAvailability,
  TRANSPORT_MODES_NOTE,
  type TransportModesProfile,
  type TransportOption,
  type TransportMode,
  type Availability,
} from "./transport-modes";
export {
  getTouristPrices,
  pricesByCategory,
  fairPriceRange,
  TOURIST_PRICES_NOTE,
  type TouristPricesProfile,
  type TouristItemPrice,
  type ItemCategory,
} from "./tourist-prices";
export {
  getAttractions,
  attractionsByBestTime,
  freeAttractions,
  ATTRACTIONS_DATA_NOTE,
  type AttractionsProfile,
  type Attraction,
  type CostBand,
  type TimeOfDay,
  type Busyness,
} from "./attractions";
export {
  supportedCurrencies,
  fxRate,
  convertUsd,
  convertCurrency,
  costPricesIn,
  FX_DATA_NOTE,
  FX_MODEL_VERSION,
  FX_AS_OF,
  type FxRate,
  type NormalizedCostPrices,
} from "./currency";
export {
  getSafetyTips,
  scamNames,
  SAFETY_TIPS_DATA_NOTE,
  type SafetyTipsProfile,
  type ScamTip,
} from "./safety-tips";
export {
  getHazardsProfile,
  highRiskHazards,
  HAZARDS_DATA_NOTE,
  type HazardsProfile,
  type HazardExposure,
  type HazardType,
  type RiskLevel,
  type ConflictStatus,
  type AdvisoryLevel,
} from "./hazards";
export {
  getLocalEssentials,
  emergencyNumberList,
  ESSENTIALS_DATA_NOTE,
  type LocalEssentials,
  type EmergencyNumbers,
  type KeyPhrase,
  type LabeledNumber,
} from "./essentials";
export {
  getHealthcareProfile,
  facilitiesByKind,
  hasHospital,
  HEALTHCARE_DATA_NOTE,
  type HealthcareProfile,
  type MedicalFacility,
  type FacilityKind,
} from "./healthcare";
export {
  getShoppingProfile,
  shoppingTips,
  SHOPPING_DATA_NOTE,
  type ShoppingProfile,
  type FuelInfo,
  type EvChargingAvailability,
  type ShoppingTip,
  type ShoppingTipKind,
} from "./shopping";
export {
  getChainsProfile,
  chainsForCategory,
  CHAINS_DATA_NOTE,
  type ChainsProfile,
  type ChainCategory,
} from "./chains";
export {
  getFruitsProfile,
  inSeasonFruits,
  mustTryFruits,
  FRUITS_DATA_NOTE,
  type FruitsProfile,
  type SeasonalFruit,
} from "./fruits";
export {
  getAirportsProfile,
  primaryAirport,
  AIRPORTS_DATA_NOTE,
  type AirportsProfile,
  type AirportInfo,
  type TransferMode,
  type BoardingMethod,
  type CityAccessMode,
} from "./airports";
export {
  aggregateRatings,
  rankByRating,
  ratingModelV1,
  type RatingModel,
  type RatingAggregate,
  type RatedItem,
  type RankedItem,
} from "./ratings";
export {
  overallScore,
  getAirportServiceRating,
  airportRatingsForDestination,
  getAirlineRating,
  airlineClassRatings,
  TRANSIT_RATINGS_NOTE,
  type AirportServiceRating,
  type AirlineRating,
  type AirlineClassRating,
  type DimensionRatings,
  type ServiceDimension,
  type CabinClass,
} from "./transit-ratings";
export {
  estimateTripCarbon,
  inferTravelMode,
  carbonModelV1,
  type TravelMode,
  type CarbonModel,
  type CarbonLeg,
  type CarbonEstimate,
  type CarbonOptions,
} from "./carbon";
export {
  estimateTripBudget,
  LODGING_DATA_NOTE,
  LODGING_MODEL_VERSION,
  type TripBudget,
  type TripBudgetStop,
  type TripBudgetOptions,
  type StopBudget,
} from "./trip-budget";
export {
  getUvProtectionProfile,
  protectionFor,
  isHighUv,
  UV_PROTECTION_NOTE,
  type UvProtectionProfile,
  type ProtectionCustom,
  type ProtectionElement,
  type UvBand,
} from "./uv-protection";
export {
  getDressCode,
  dressGuidanceFor,
  venuesNeedingModesty,
  DRESS_CODE_NOTE,
  type DressCodeProfile,
  type DressGuidance,
  type VenueKind,
  type Strictness,
} from "./dress-code";
export {
  getPhotographyProfile,
  photoRuleFor,
  prohibitedSubjects,
  PHOTOGRAPHY_DATA_NOTE,
  type PhotographyProfile,
  type PhotoRule,
  type PhotoRuleKind,
  type Permission,
} from "./photography";
export {
  getTransitHowTo,
  transitOptionFor,
  acceptsContactless,
  TRANSIT_HOWTO_NOTE,
  type TransitHowToProfile,
  type TransitOption,
  type TransitMode,
  type FarePayment,
} from "./transit-howto";
export {
  getAccessibilityProfile,
  accessAspectFor,
  challengingFacets,
  ACCESSIBILITY_DATA_NOTE,
  type AccessibilityProfile,
  type AccessAspect,
  type AccessFacet,
  type AccessLevel,
} from "./accessibility";
export {
  getTimezoneProfile,
  businessHoursFor,
  currentTimeAt,
  TIMEZONE_DATA_NOTE,
  type TimezoneProfile,
  type BusinessHours,
  type HoursCategory,
} from "./timezone";
export {
  getPackingProfile,
  packingForSeason,
  essentialItems,
  PACKING_DATA_NOTE,
  type PackingProfile,
  type PackingItem,
  type SeasonalPacking,
  type Season,
  type PackingPriority,
} from "./packing";
export {
  getBestTimeProfile,
  monthAssessment,
  idealMonths,
  BEST_TIME_DATA_NOTE,
  type BestTimeProfile,
  type MonthAssessment,
  type SeasonRating,
} from "./best-time";
export {
  buildItinerary,
  type Itinerary,
  type ItineraryItem,
  type ItineraryDay,
  type Pacing,
} from "./itinerary";
export { itineraryToICS, type ICSOptions } from "./itinerary-export";
export {
  itineraryToGeoJSON,
  itineraryToGeoJSONString,
  type RouteWaypoint,
  type GeoJSONOptions,
  type Position,
  type PointFeature,
  type LineStringFeature,
  type RouteFeature,
  type RouteFeatureCollection,
} from "./itinerary-geojson";
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
