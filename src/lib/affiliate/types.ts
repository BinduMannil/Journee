/**
 * Affiliate & monetization domain model (provider-agnostic).
 *
 * No affiliate URL is ever hardcoded in application code — links are data
 * (`urlTemplate`) resolved at runtime against region/priority/fallback rules.
 * See docs/architecture/affiliate-routing-architecture.md and ADR-005.
 *
 * These types are the contract a Supabase-backed catalog will satisfy
 * (migration scaffold: supabase/migrations/0002_affiliate.sql). The routing
 * logic (routing.ts) is pure and operates over an injected catalog, so it is
 * fully testable today even though the data source is not yet wired.
 */
/**
 * The canonical affiliate categories. Single source of truth: the
 * `AffiliateCategory` type is derived from this list, and runtime guards (e.g.
 * the `/api/affiliate/link` category check) iterate it — so adding a category
 * here updates both the type and the validation, with no second list to keep in
 * sync. Same pattern as `KNOWN_FLAGS` in `config/flags.ts`.
 */
export const AFFILIATE_CATEGORIES = [
  "flights",
  "hotels",
  "experiences",
  "tours",
  "restaurants",
  "insurance",
  "esim",
  "ticketing",
  "luxury",
  "transportation",
] as const;

export type AffiliateCategory = (typeof AFFILIATE_CATEGORIES)[number];

export interface AffiliateProvider {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
}

export interface AffiliateCampaign {
  readonly id: string;
  readonly providerId: string;
  readonly category: AffiliateCategory;
  readonly enabled: boolean;
  /** ISO timestamps; absent = unbounded on that side. */
  readonly startsAt?: string;
  readonly endsAt?: string;
}

export interface AffiliateLink {
  readonly id: string;
  readonly campaignId: string;
  readonly category: AffiliateCategory;
  /** URL template with placeholders, e.g. "https://x.com?dest={dest}&aid={token}". */
  readonly urlTemplate: string;
  readonly enabled: boolean;
}

export interface AffiliateRegionRule {
  readonly campaignId: string;
  /** ISO country codes the rule applies to. Empty = all regions. */
  readonly regions: readonly string[];
  readonly mode: "allow" | "deny";
}

export interface AffiliatePriorityRule {
  readonly campaignId: string;
  readonly category: AffiliateCategory;
  /** Optional region-specific priority; region-specific beats global. */
  readonly region?: string;
  /** Lower = preferred. */
  readonly priority: number;
}

export interface AffiliateFallbackRule {
  readonly category: AffiliateCategory;
  readonly campaignId: string;
}

export interface AffiliateAttribution {
  readonly campaignId: string;
  readonly linkId: string;
  /** Opaque token appended to the resolved URL and stored with events. */
  readonly token: string;
}

export interface AffiliateClickEvent {
  readonly id: string;
  readonly linkId: string;
  readonly campaignId: string;
  readonly region?: string;
  readonly occurredAt: string;
}

export interface AffiliateConversionEvent {
  readonly id: string;
  readonly clickId?: string;
  readonly campaignId: string;
  /** Money in minor units (e.g. cents) to stay currency/provider agnostic. */
  readonly amountMinor?: number;
  readonly currency?: string;
  readonly occurredAt: string;
}

/** Everything the resolver needs, injected (sourced from DB/config later). */
export interface AffiliateCatalog {
  readonly providers: readonly AffiliateProvider[];
  readonly campaigns: readonly AffiliateCampaign[];
  readonly links: readonly AffiliateLink[];
  readonly regionRules: readonly AffiliateRegionRule[];
  readonly priorityRules: readonly AffiliatePriorityRule[];
  readonly fallbackRules: readonly AffiliateFallbackRule[];
}

export interface AffiliateRequest {
  readonly category: AffiliateCategory;
  /** ISO country code of the user, if known. */
  readonly region?: string;
  /** Injectable clock for deterministic testing. */
  readonly now?: Date;
  /**
   * Stable key (e.g. session id) for A/B routing. When set and >1 candidate
   * qualifies, the winner is chosen deterministically with selection
   * probability weighted by inverse priority, so traffic splits across variants
   * while still favoring higher-priority campaigns. Omit for strict
   * lowest-priority selection.
   */
  readonly experimentKey?: string;
}

export interface AffiliateResolution {
  readonly link: AffiliateLink;
  readonly campaign: AffiliateCampaign;
  readonly reason: "priority" | "fallback";
}
