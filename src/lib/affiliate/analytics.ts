/**
 * Affiliate revenue analytics (pure aggregation).
 *
 * Reduces raw click/conversion rows into per-campaign metrics. Pure and
 * unit-tested; the read endpoint is a thin shell that fetches rows and calls
 * this. Revenue stays in minor units, bucketed by currency, to remain
 * currency-agnostic. See docs/architecture/affiliate-routing-architecture.md.
 */
export interface TimeWindow {
  /** ISO timestamp lower bound (inclusive). */
  readonly since?: string;
  /** ISO timestamp upper bound (inclusive). */
  readonly until?: string;
}

export type TimeWindowResult =
  | { readonly ok: true; readonly window: TimeWindow }
  | { readonly ok: false; readonly error: string };

/** Validate optional `since`/`until` query params into a time window. */
export function parseTimeWindow(params: URLSearchParams): TimeWindowResult {
  const since = params.get("since") ?? undefined;
  const until = params.get("until") ?? undefined;
  if (since !== undefined && Number.isNaN(Date.parse(since))) {
    return { ok: false, error: "invalid_since" };
  }
  if (until !== undefined && Number.isNaN(Date.parse(until))) {
    return { ok: false, error: "invalid_until" };
  }
  return { ok: true, window: { since, until } };
}

export interface ClickRowLike {
  readonly campaign_id: string;
}

export interface ConversionRowLike {
  readonly campaign_id: string;
  readonly amount_minor: number | null;
  readonly currency: string | null;
}

export interface CampaignMetrics {
  readonly campaignId: string;
  readonly clicks: number;
  readonly conversions: number;
  /** conversions / clicks, in 0..1; 0 when there are no clicks. */
  readonly conversionRate: number;
  /** Summed revenue in minor units, keyed by currency code. */
  readonly revenueMinorByCurrency: Readonly<Record<string, number>>;
}

export function aggregateCampaignMetrics(
  clicks: readonly ClickRowLike[],
  conversions: readonly ConversionRowLike[],
): readonly CampaignMetrics[] {
  const clickCounts = new Map<string, number>();
  for (const c of clicks) {
    clickCounts.set(c.campaign_id, (clickCounts.get(c.campaign_id) ?? 0) + 1);
  }

  const conversionCounts = new Map<string, number>();
  const revenue = new Map<string, Map<string, number>>();
  for (const c of conversions) {
    conversionCounts.set(c.campaign_id, (conversionCounts.get(c.campaign_id) ?? 0) + 1);
    if (c.amount_minor !== null && c.currency !== null) {
      const byCurrency = revenue.get(c.campaign_id) ?? new Map<string, number>();
      byCurrency.set(c.currency, (byCurrency.get(c.currency) ?? 0) + c.amount_minor);
      revenue.set(c.campaign_id, byCurrency);
    }
  }

  const campaignIds = new Set<string>([
    ...clickCounts.keys(),
    ...conversionCounts.keys(),
  ]);

  return [...campaignIds]
    .sort()
    .map((campaignId): CampaignMetrics => {
      const clickCount = clickCounts.get(campaignId) ?? 0;
      const conversionCount = conversionCounts.get(campaignId) ?? 0;
      return {
        campaignId,
        clicks: clickCount,
        conversions: conversionCount,
        conversionRate: clickCount > 0 ? conversionCount / clickCount : 0,
        revenueMinorByCurrency: Object.fromEntries(
          revenue.get(campaignId) ?? new Map<string, number>(),
        ),
      };
    });
}
