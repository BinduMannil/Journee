import {
  aggregateCampaignMetrics,
  parseTimeWindow,
  parsePage,
  paginateMetrics,
  type ClickRowLike,
  type ConversionRowLike,
  type TimeWindow,
} from "@/lib/affiliate/analytics";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { requireAdmin } from "@/lib/auth/admin";
import { log } from "@/lib/observability/logger";

/**
 * Affiliate revenue analytics (server-only read of event tables).
 *
 * Returns per-campaign metrics aggregated from click/conversion events,
 * optionally bounded by `?since=&until=` (ISO timestamps).
 *
 * This is privileged business data (it reads the event tables via the
 * service-role client, which bypasses RLS), so it is admin-gated exactly like
 * `/api/admin/*`: disabled (503) unless `JOURNEE_ADMIN_TOKEN` is set, then
 * requires a matching `x-admin-token` header. 503 also when ingestion storage
 * is unconfigured.
 */
export const dynamic = "force-dynamic";

function applyWindow<T>(query: T, window: TimeWindow): T {
  // Supabase query builder is chainable + thenable; narrow via a structural
  // type to keep this helper decoupled from the SDK's generics.
  const q = query as unknown as {
    gte(col: string, val: string): unknown;
    lte(col: string, val: string): unknown;
  };
  let result: unknown = q;
  if (window.since) result = (result as typeof q).gte("occurred_at", window.since);
  if (window.until) result = (result as typeof q).lte("occurred_at", window.until);
  return result as T;
}

export async function GET(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const parsed = parseTimeWindow(new URL(request.url).searchParams);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const client = getSupabaseServiceClient();
  if (!client) {
    return Response.json({ error: "analytics_unconfigured" }, { status: 503 });
  }

  const [clicks, conversions] = await Promise.all([
    applyWindow(client.from("affiliate_click_events").select("campaign_id"), parsed.window),
    applyWindow(
      client.from("affiliate_conversion_events").select("campaign_id,amount_minor,currency"),
      parsed.window,
    ),
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
  const paged = paginateMetrics(metrics, parsePage(new URL(request.url).searchParams));
  return Response.json(paged);
}
