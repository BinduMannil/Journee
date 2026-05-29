/**
 * Per-destination editorial-confidence signal (pure, no I/O).
 *
 * Measures how complete Journee's *own* editorial seed coverage is for a
 * destination: how many of the catalogued seed features actually have data for
 * it. This is an honest meta-signal about our data completeness — NOT a claim
 * about the destination itself — so the UI/engines can temper how confidently
 * they present a place, and so gaps in coverage are visible rather than hidden.
 *
 * Accessors are imported from their own modules (not the barrel) to avoid an
 * import cycle, since the barrel re-exports this module. Deterministic + tested.
 */
import { getCulinaryProfile } from "./culinary";
import { getLocalGems } from "./local-gems";
import { getCityVibe } from "./city-vibe";
import { getFestivals } from "./festivals";
import { getReligionProfile } from "./religion";
import { getTippingProfile } from "./tipping";
import { getConnectivityProfile } from "./connectivity";
import { getInclusionProfile } from "./inclusion";
import { getCostProfile } from "./costs";
import { getSafetyTips } from "./safety-tips";
import { getHazardsProfile } from "./hazards";
import { getLocalEssentials } from "./essentials";
import { getShoppingProfile } from "./shopping";
import { getChainsProfile } from "./chains";
import { getFruitsProfile } from "./fruits";
import { getAirportsProfile } from "./airports";
import { getUvProtectionProfile } from "./uv-protection";
import { getDressCode } from "./dress-code";
import { getPhotographyProfile } from "./photography";
import { getTransitHowTo } from "./transit-howto";
import { getAccessibilityProfile } from "./accessibility";
import { getTimezoneProfile } from "./timezone";
import { getPackingProfile } from "./packing";
import { getBestTimeProfile } from "./best-time";
import { getHealthcareProfile } from "./healthcare";
import { getNeighborhoods } from "./neighborhoods";
import { getDayTrips } from "./day-trips";
import { getTransportModes } from "./transport-modes";
import { getTouristPrices } from "./tourist-prices";
import { getAttractions } from "./attractions";
import { getIntercityOptions } from "./intercity";
import { getCombos } from "./itinerary-combos";

/** The seed features whose coverage is tallied. Add a row when a feature ships. */
const FEATURE_CHECKS: Readonly<Record<string, (id: string) => unknown>> = {
  culinary: getCulinaryProfile,
  localGems: getLocalGems,
  cityVibe: getCityVibe,
  festivals: getFestivals,
  religion: getReligionProfile,
  tipping: getTippingProfile,
  connectivity: getConnectivityProfile,
  inclusion: getInclusionProfile,
  costs: getCostProfile,
  safetyTips: getSafetyTips,
  hazards: getHazardsProfile,
  essentials: getLocalEssentials,
  shopping: getShoppingProfile,
  chains: getChainsProfile,
  fruits: getFruitsProfile,
  airports: getAirportsProfile,
  uvProtection: getUvProtectionProfile,
  dressCode: getDressCode,
  photography: getPhotographyProfile,
  transitHowTo: getTransitHowTo,
  accessibility: getAccessibilityProfile,
  timezone: getTimezoneProfile,
  packing: getPackingProfile,
  bestTime: getBestTimeProfile,
  healthcare: getHealthcareProfile,
  neighborhoods: getNeighborhoods,
  dayTrips: getDayTrips,
  transportModes: getTransportModes,
  touristPrices: getTouristPrices,
  attractions: getAttractions,
  intercity: getIntercityOptions,
  combos: getCombos,
};

/** The full set of feature keys coverage is measured against (sorted). */
export const EDITORIAL_FEATURE_KEYS: readonly string[] = Object.keys(FEATURE_CHECKS).sort();

export interface EditorialCoverage {
  readonly destinationId: string;
  /** Feature keys that have data for this destination (sorted). */
  readonly present: readonly string[];
  /** Feature keys with no data for this destination (sorted). */
  readonly missing: readonly string[];
  readonly covered: number;
  readonly total: number;
  /** 0..1 — covered / total. */
  readonly coverage: number;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Tally editorial seed coverage for a destination. A feature counts as present
 * when its accessor returns a non-null value for the id.
 */
export function editorialCoverage(destinationId: string): EditorialCoverage {
  const present: string[] = [];
  const missing: string[] = [];
  for (const key of EDITORIAL_FEATURE_KEYS) {
    const has = FEATURE_CHECKS[key]!(destinationId) != null;
    (has ? present : missing).push(key);
  }
  const total = EDITORIAL_FEATURE_KEYS.length;
  return {
    destinationId,
    present,
    missing,
    covered: present.length,
    total,
    coverage: total > 0 ? round2(present.length / total) : 0,
  };
}

/** Just the 0..1 coverage ratio for a destination. */
export function editorialConfidence(destinationId: string): number {
  return editorialCoverage(destinationId).coverage;
}
