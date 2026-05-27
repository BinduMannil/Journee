/**
 * Convenience accessor: load the affiliate catalog via the provider registry.
 *
 * Returns null when no affiliate provider is available (unconfigured), so
 * callers render no affiliate CTA rather than failing. Pairs with
 * `resolveAffiliateLink` (routing.ts) and `renderAffiliateUrl` (url.ts).
 */
import { resolve } from "@/lib/providers/registry";
import type { AffiliateCatalog } from "./types";

export async function getAffiliateCatalog(): Promise<AffiliateCatalog | null> {
  return resolve<AffiliateCatalog>("affiliate");
}
