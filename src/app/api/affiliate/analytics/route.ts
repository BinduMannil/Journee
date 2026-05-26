import {
  aggregateCampaignMetrics,
  type ClickRowLike,
  type ConversionRowLike,
} from "@/lib/affiliate/analytics";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { log } from "@/lib/observability/logger";

/**
 * Affiliate revenue analytics (server-only read of event tables).
 *
 * Returns per-campaign metrics aggregated from click/conversion events. 503
 * when unconfigured. NOTE: reads all rows — pagination/time-windowing is a
 * roadmap concern as volume grows (event tables are append-only).
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const client = getSupabaseServiceClient();
  if (!client) {
    return Response.json({ error: "analytics_unconfigured" }, { status: 503 });
  }

  const [clicks, conversions] = await Promise.all([
    client.from("affiliate_click_events").select("campaign_id"),
    client.from("affiliate_conversion_events").select("campaign_id,amount_minor,currency"),
  ]);

  if (clicks.error || conversions.error) {
    log.error("affiliate_analytics_read_failed", {
      error: clicks.error?.message ?? conversions.error?.message,
    });
    return Response.json({ error: "read_failed" }, { status: 500 });
  }

  const metrics = aggregateCampaignMetrics(
    (clicks.data ?? []) as ClickRowLike[],
    (conversions.data ?? []) as ConversionRowLike[],
  );
  return Response.json({ metrics });
}
