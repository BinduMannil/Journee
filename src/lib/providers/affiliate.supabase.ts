/**
 * Supabase-backed affiliate catalog loader.
 *
 * Loads the full `AffiliateCatalog` (providers, campaigns, links, region/
 * priority/fallback rules) that the pure routing resolver consumes. Registered
 * under the `affiliate` capability; gated on the `affiliate-catalog` flag and
 * present Supabase config, so it cleanly reports unavailable otherwise.
 *
 * Backing schema: supabase/migrations/0002_affiliate.sql.
 * See docs/architecture/affiliate-routing-architecture.md.
 */
import { getSupabaseClient } from "./supabase/client";
import { registerProvider } from "./registry";
import { isFeatureEnabled } from "@/lib/config/flags";
import type { Provider } from "./types";
import type {
  AffiliateCampaign,
  AffiliateCatalog,
  AffiliateFallbackRule,
  AffiliateLink,
  AffiliatePriorityRule,
  AffiliateProvider,
  AffiliateRegionRule,
} from "@/lib/affiliate/types";

async function loadCatalog(): Promise<AffiliateCatalog> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase client unavailable");

  const [providers, campaigns, links, regionRules, priorityRules, fallbackRules] =
    await Promise.all([
      client.from("affiliate_providers").select("id,name,enabled"),
      client
        .from("affiliate_campaigns")
        .select("id,provider_id,category,enabled,starts_at,ends_at"),
      client
        .from("affiliate_links")
        .select("id,campaign_id,category,url_template,enabled"),
      client.from("affiliate_region_rules").select("campaign_id,regions,mode"),
      client
        .from("affiliate_priority_rules")
        .select("campaign_id,category,region,priority"),
      client.from("affiliate_fallback_rules").select("category,campaign_id"),
    ]);

  for (const r of [providers, campaigns, links, regionRules, priorityRules, fallbackRules]) {
    if (r.error) throw new Error(r.error.message);
  }

  return {
    providers: (providers.data ?? []).map(
      (r): AffiliateProvider => ({ id: r.id, name: r.name, enabled: r.enabled }),
    ),
    campaigns: (campaigns.data ?? []).map(
      (r): AffiliateCampaign => ({
        id: r.id,
        providerId: r.provider_id,
        category: r.category,
        enabled: r.enabled,
        startsAt: r.starts_at ?? undefined,
        endsAt: r.ends_at ?? undefined,
      }),
    ),
    links: (links.data ?? []).map(
      (r): AffiliateLink => ({
        id: r.id,
        campaignId: r.campaign_id,
        category: r.category,
        urlTemplate: r.url_template,
        enabled: r.enabled,
      }),
    ),
    regionRules: (regionRules.data ?? []).map(
      (r): AffiliateRegionRule => ({
        campaignId: r.campaign_id,
        regions: r.regions ?? [],
        mode: r.mode,
      }),
    ),
    priorityRules: (priorityRules.data ?? []).map(
      (r): AffiliatePriorityRule => ({
        campaignId: r.campaign_id,
        category: r.category,
        region: r.region ?? undefined,
        priority: r.priority,
      }),
    ),
    fallbackRules: (fallbackRules.data ?? []).map(
      (r): AffiliateFallbackRule => ({
        category: r.category,
        campaignId: r.campaign_id,
      }),
    ),
  };
}

export const supabaseAffiliateProvider: Provider<AffiliateCatalog> = {
  id: "supabase-affiliate",
  name: "Supabase Affiliate Catalog",
  capability: "affiliate",
  priority: 10,
  isAvailable: () =>
    isFeatureEnabled("affiliate-catalog") && getSupabaseClient() !== null,
  fetch: loadCatalog,
};

registerProvider(supabaseAffiliateProvider);
