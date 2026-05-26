/**
 * Affiliate routing resolver (pure function).
 *
 * Given a catalog and a request (category + optional region), selects the best
 * affiliate link by: eligibility (enabled provider/campaign/link + active time
 * window) -> region rules -> priority -> fallback. Returns null if nothing
 * applies. No network, no hardcoded links, deterministic given inputs.
 *
 * See docs/architecture/affiliate-routing-architecture.md.
 */
import type {
  AffiliateCampaign,
  AffiliateCatalog,
  AffiliateRequest,
  AffiliateResolution,
} from "./types";
import { assignVariant } from "@/lib/experiments/assignment";

function isWindowActive(campaign: AffiliateCampaign, now: Date): boolean {
  if (campaign.startsAt && new Date(campaign.startsAt) > now) return false;
  if (campaign.endsAt && new Date(campaign.endsAt) < now) return false;
  return true;
}

function isRegionAllowed(
  catalog: AffiliateCatalog,
  campaignId: string,
  region: string | undefined,
): boolean {
  const rules = catalog.regionRules.filter((r) => r.campaignId === campaignId);
  if (rules.length === 0) return true;

  // Deny rules win. A deny that matches (or is global) blocks the campaign.
  for (const rule of rules) {
    if (rule.mode !== "deny") continue;
    const matches = rule.regions.length === 0 || (region !== undefined && rule.regions.includes(region));
    if (matches) return false;
  }

  // If any allow rule exists, the region must match at least one of them.
  const allows = rules.filter((r) => r.mode === "allow");
  if (allows.length === 0) return true;
  return allows.some(
    (r) => r.regions.length === 0 || (region !== undefined && r.regions.includes(region)),
  );
}

/** Effective priority for a campaign, preferring a region-specific rule. */
function priorityFor(
  catalog: AffiliateCatalog,
  campaign: AffiliateCampaign,
  region: string | undefined,
): number | null {
  const rules = catalog.priorityRules.filter(
    (r) => r.campaignId === campaign.id && r.category === campaign.category,
  );
  if (rules.length === 0) return null;
  const regional = region !== undefined ? rules.filter((r) => r.region === region) : [];
  const global = rules.filter((r) => r.region === undefined);
  const pool = regional.length > 0 ? regional : global.length > 0 ? global : rules;
  return pool.reduce((min, r) => Math.min(min, r.priority), Number.POSITIVE_INFINITY);
}

export function resolveAffiliateLink(
  catalog: AffiliateCatalog,
  request: AffiliateRequest,
): AffiliateResolution | null {
  const now = request.now ?? new Date();
  const enabledProviderIds = new Set(
    catalog.providers.filter((p) => p.enabled).map((p) => p.id),
  );

  const eligible = catalog.campaigns.filter(
    (c) =>
      c.category === request.category &&
      c.enabled &&
      enabledProviderIds.has(c.providerId) &&
      isWindowActive(c, now) &&
      isRegionAllowed(catalog, c.id, request.region),
  );

  const linkFor = (campaignId: string) =>
    catalog.links.find((l) => l.campaignId === campaignId && l.enabled) ?? null;

  // Candidates: eligible campaigns with a priority rule and an enabled link.
  const candidates = eligible.flatMap((campaign) => {
    const priority = priorityFor(catalog, campaign, request.region);
    const link = linkFor(campaign.id);
    if (priority === null || !link) return [];
    return [{ campaign, link, priority }];
  });

  if (candidates.length > 0) {
    let chosen = candidates.reduce((a, b) => (b.priority < a.priority ? b : a));

    // A/B routing: split traffic across candidates by inverse-priority weight.
    if (request.experimentKey && candidates.length > 1) {
      const variants = candidates.map((c) => ({
        id: c.campaign.id,
        weight: 1 / Math.max(c.priority, 0.001),
      }));
      const winnerId = assignVariant(request.experimentKey, variants);
      const winner = candidates.find((c) => c.campaign.id === winnerId);
      if (winner) chosen = winner;
    }

    return { link: chosen.link, campaign: chosen.campaign, reason: "priority" };
  }

  // Fallback: first fallback rule for the category whose campaign has a link.
  for (const rule of catalog.fallbackRules.filter((r) => r.category === request.category)) {
    const campaign = catalog.campaigns.find((c) => c.id === rule.campaignId);
    const link = linkFor(rule.campaignId);
    if (campaign && link) return { link, campaign, reason: "fallback" };
  }

  return null;
}
