/**
 * Trip budget / cost estimate (pure, no I/O).
 *
 * Composes existing seed layers into a rough per-trip cost estimate: lodging
 * (nightly rate by area `StayCostTier`, from `lodging.ts`) + on-the-ground daily
 * spend (food + local transport, from the cost index) across each stop, for a
 * party size, optionally normalized to a currency (via the seed FX layer). It
 * deliberately does NOT reuse `dailyBudgetEstimateUsd` (which folds in a lodging
 * uplift) so lodging isn't double-counted. Every figure is an ESTIMATE — pair
 * with the re-exported notes. Confidence = share of stops with real cost data.
 */
import { getCostProfile } from "./costs";
import { convertUsd } from "./currency";
import {
  LODGING_DATA_NOTE,
  LODGING_MODEL_VERSION,
  lodgingTierEstimates,
} from "@/content/lodging";
import type { StayCostTier } from "@/content/neighborhoods";

export { LODGING_DATA_NOTE, LODGING_MODEL_VERSION };

export interface TripBudgetStop {
  readonly destinationId: string;
  /** Nights at this stop (clamped to a non-negative integer). */
  readonly nights: number;
  /** Area tier to price lodging at; defaults to "moderate". */
  readonly stayCostTier?: StayCostTier;
}

export interface TripBudgetOptions {
  /** Party size; daily on-the-ground spend scales by this (default 1). */
  readonly travelers?: number;
  /** Currency to also report the total in (default "USD"). */
  readonly currency?: string;
}

export interface StopBudget {
  readonly destinationId: string;
  readonly nights: number;
  readonly stayCostTier: StayCostTier;
  /** Lodging cost (one room): nightly rate × nights. */
  readonly lodgingUsd: number;
  /** Daily food + local-transport spend per person. */
  readonly dailyPerPersonUsd: number;
  /** On-the-ground spend: dailyPerPerson × travelers × nights. */
  readonly groundUsd: number;
  readonly subtotalUsd: number;
  /** False when the destination has no catalogued cost profile. */
  readonly hasCostData: boolean;
}

export interface TripBudget {
  readonly stops: readonly StopBudget[];
  readonly travelers: number;
  readonly totalNights: number;
  readonly totalUsd: number;
  /** Currency the `total` is expressed in (falls back to USD if unknown). */
  readonly currency: string;
  /** Total in `currency` (== totalUsd when currency is USD/unknown). */
  readonly total: number;
  /** 0..1 — share of stops backed by real cost data. */
  readonly confidence: number;
  readonly note: string;
}

const DEFAULT_TIER: StayCostTier = "moderate";
const round = (n: number): number => Math.round(n);
const round2 = (n: number): number => Math.round(n * 100) / 100;

function nightlyFor(tier: StayCostTier): number {
  return lodgingTierEstimates.find((l) => l.tier === tier)?.nightlyUsd ?? 0;
}

/** Daily food + local-transport spend per person from the cost anchors. */
function dailyGroundPerPerson(destinationId: string): number | null {
  const profile = getCostProfile(destinationId);
  if (profile === null) return null;
  const { inexpensiveMealUsd, coffeeUsd, beerUsd, taxiStartUsd } = profile.prices;
  return 2 * inexpensiveMealUsd + 2 * coffeeUsd + beerUsd + 2 * taxiStartUsd;
}

export function estimateTripBudget(
  stops: readonly TripBudgetStop[],
  opts: TripBudgetOptions = {},
): TripBudget {
  const travelers = Math.max(1, Math.trunc(opts.travelers ?? 1));
  const currencyReq = opts.currency ?? "USD";

  const budgeted: StopBudget[] = stops.map((stop) => {
    const nights = Math.max(0, Math.trunc(stop.nights));
    const tier = stop.stayCostTier ?? DEFAULT_TIER;
    const lodgingUsd = nightlyFor(tier) * nights;
    const perPerson = dailyGroundPerPerson(stop.destinationId);
    const hasCostData = perPerson !== null;
    const dailyPerPersonUsd = perPerson ?? 0;
    const groundUsd = dailyPerPersonUsd * travelers * nights;
    return {
      destinationId: stop.destinationId,
      nights,
      stayCostTier: tier,
      lodgingUsd: round(lodgingUsd),
      dailyPerPersonUsd: round2(dailyPerPersonUsd),
      groundUsd: round(groundUsd),
      subtotalUsd: round(lodgingUsd + groundUsd),
      hasCostData,
    };
  });

  const totalUsd = round(budgeted.reduce((sum, s) => sum + s.subtotalUsd, 0));
  const totalNights = budgeted.reduce((sum, s) => sum + s.nights, 0);
  const withData = budgeted.filter((s) => s.hasCostData).length;
  const confidence = budgeted.length > 0 ? round2(withData / budgeted.length) : 0;

  // Normalize to the requested currency via the seed FX layer; fall back to USD
  // if the currency isn't catalogued, so the total is always meaningful.
  const converted = currencyReq === "USD" ? totalUsd : convertUsd(totalUsd, currencyReq);
  const currency = converted === null ? "USD" : currencyReq;
  const total = converted ?? totalUsd;

  return {
    stops: budgeted,
    travelers,
    totalNights,
    totalUsd,
    currency,
    total,
    confidence,
    note: LODGING_DATA_NOTE,
  };
}
