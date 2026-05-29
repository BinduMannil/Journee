/**
 * Lodging nightly-cost estimates by stay-cost tier (editorial SEED data).
 *
 * Maps the relative `StayCostTier` (from `neighborhoods.ts`) to a rough nightly
 * room-rate estimate in USD, so a trip budget can turn "stay in an upscale area"
 * into a number. These are **indicative seed estimates**, not live lodging
 * prices — actual rates swing hugely with season, demand and property — so
 * `LODGING_DATA_NOTE` is surfaced with every consumer and the trip-budget output
 * is always labelled an estimate. Versioned like the other seed models so the
 * numbers are tunable and auditable.
 */
import type { StayCostTier } from "./neighborhoods";

export interface LodgingTierEstimate {
  readonly tier: StayCostTier;
  /** Indicative nightly room rate in USD (one room). */
  readonly nightlyUsd: number;
}

/** Bump when the seed estimates or their shape change. */
export const LODGING_MODEL_VERSION = "lodging-seed-v1";

/** Shown with any lodging/trip-budget figure so it reads as an estimate. */
export const LODGING_DATA_NOTE =
  "Indicative SEED nightly-rate estimates by area tier, not live lodging prices " +
  "or quotes — actual rates swing widely with season, demand and property. Trip " +
  "budgets built on them are rough estimates; verify real prices before booking.";

export const lodgingTierEstimates: readonly LodgingTierEstimate[] = [
  { tier: "budget", nightlyUsd: 60 },
  { tier: "moderate", nightlyUsd: 130 },
  { tier: "upscale", nightlyUsd: 280 },
  { tier: "luxury", nightlyUsd: 600 },
];
