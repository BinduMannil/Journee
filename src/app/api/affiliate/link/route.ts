import { cookies } from "next/headers";
import { getAffiliateCatalog } from "@/lib/affiliate/catalog";
import { resolveAffiliateLink } from "@/lib/affiliate/routing";
import { renderAffiliateUrl, AffiliateUrlError } from "@/lib/affiliate/url";
import type { AffiliateCategory } from "@/lib/affiliate/types";
import { log } from "@/lib/observability/logger";

/**
 * Resolves the best affiliate link for a category + the visitor's A/B bucket
 * (from the `jid` cookie). Returns `{ link: null }` when no catalog is
 * configured or nothing resolves — never a fabricated link. Lets the client
 * `AffiliateCta` stay dynamic without forcing pages dynamic.
 */
export const dynamic = "force-dynamic";

const CATEGORIES = new Set<AffiliateCategory>([
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
]);

export async function GET(request: Request): Promise<Response> {
  const category = new URL(request.url).searchParams.get("category");
  if (!category || !CATEGORIES.has(category as AffiliateCategory)) {
    return Response.json({ error: "invalid_category" }, { status: 400 });
  }

  const catalog = await getAffiliateCatalog();
  if (!catalog) return Response.json({ link: null });

  const jid = (await cookies()).get("jid")?.value;
  const resolution = resolveAffiliateLink(catalog, {
    category: category as AffiliateCategory,
    experimentKey: jid,
  });
  if (!resolution) return Response.json({ link: null });

  try {
    const href = renderAffiliateUrl(resolution.link.urlTemplate, {
      token: resolution.campaign.id,
    });
    return Response.json({ link: { href, campaignId: resolution.campaign.id } });
  } catch (error) {
    log.warn("affiliate_url_render_failed", {
      category,
      linkId: resolution.link.id,
      error: error instanceof AffiliateUrlError ? error.message : String(error),
    });
    return Response.json({ link: null });
  }
}
