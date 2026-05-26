/**
 * Default scoring weights (versioned config seam).
 *
 * These are CONFIG, not constants of the algorithm. They live here today as the
 * single tunable source; a DB/CMS-backed config provider will later supply them
 * (and versioned overrides) without touching engine or scoring code. The
 * `version` string makes every score traceable to the weighting that produced
 * it. See ADR-006 and docs/architecture/configuration-architecture.md.
 */
import type { ScoringWeights } from "./types";

export const destinationWeights: ScoringWeights = {
  version: "destination-v1",
  defaultWeight: 1,
  weights: {
    open_now: 2,
    crowd: 1.5,
    season: 1.5,
    weather: 1.5,
    golden_hour: 1,
  },
};

export const eventWeights: ScoringWeights = {
  version: "event-v1",
  defaultWeight: 1,
  weights: {
    festival_intensity: 1.5,
    cultural_significance: 1.5,
    operational_accessibility: 2,
    crowd_comfort: 1.5,
  },
};

export const disruptionWeights: ScoringWeights = {
  version: "disruption-v1",
  defaultWeight: 1,
  weights: {
    advisory: 3,
    civil_stability: 2.5,
    transport: 1.5,
    hazard: 2.5,
    weather_severity: 1.5,
  },
};

export const safetyWeights: ScoringWeights = {
  version: "safety-v1",
  defaultWeight: 1,
  weights: { scam: 2, crowd: 1.5, emergency: 2, health: 2 },
};

export const visaWeights: ScoringWeights = {
  version: "visa-v1",
  defaultWeight: 1,
  weights: { entry_ease: 2.5, processing: 1.5, documents: 2, policy_stability: 1 },
};

export const cultureWeights: ScoringWeights = {
  version: "culture-v1",
  defaultWeight: 1,
  weights: { etiquette: 1.5, dress: 1, language: 1.5, photography: 1 },
};

/** Weights for the Travel Confidence aggregate; keys are sub-engine ids. */
export const travelConfidenceWeights: ScoringWeights = {
  version: "travel-confidence-v1",
  defaultWeight: 1,
  weights: {
    disruption: 3,
    destination: 2,
    events: 1,
  },
};
