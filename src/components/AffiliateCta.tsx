import { getAffiliateCatalog } from "@/lib/affiliate/catalog";
import { resolveAffiliateLink } from "@/lib/affiliate/routing";
import { renderAffiliateUrl, AffiliateUrlError } from "@/lib/affiliate/url";
import type { AffiliateCategory } from "@/lib/affiliate/types";
import { log } from "@/lib/observability/logger";

/**
 * Server component that renders an affiliate CTA — but ONLY when a catalog is
 * configured and a link actually resolves for the (category, region). When
 * nothing resolves it renders null: no fabricated links, ever. This is the
 * end-to-end wiring of catalog -> resolver -> safe URL rendering.
 */
export async function AffiliateCta({
  category,
  region,
  label,
}: {
  category: AffiliateCategory;
  region?: string;
  label: string;
}) {
  const catalog = await getAffiliateCatalog();
  if (!catalog) return null;

  const resolution = resolveAffiliateLink(catalog, { category, region });
  if (!resolution) return null;

  let href: string;
  try {
    href = renderAffiliateUrl(resolution.link.urlTemplate, {
      token: resolution.campaign.id,
    });
  } catch (error) {
    log.warn("affiliate_url_render_failed", {
      category,
      linkId: resolution.link.id,
      error: error instanceof AffiliateUrlError ? error.message : String(error),
    });
    return null;
  }

  return (
    <a
      href={href}
      rel="sponsored noopener"
      target="_blank"
      className="inline-block rounded-full border border-gold/50 px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10"
    >
      {label}
    </a>
  );
}
