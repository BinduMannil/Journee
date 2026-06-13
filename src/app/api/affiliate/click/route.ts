import { clickEventSchema, buildClickRow } from "@/lib/affiliate/events";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { isSameOrigin } from "@/lib/http/origin";
import { checkRateLimit } from "@/lib/http/rate-limit";
import { getClientIp } from "@/lib/billing/identity";
import { log } from "@/lib/observability/logger";

/**
 * Affiliate click ingestion (server-only write path).
 *
 * Validates the body, enforces that the request came from our own site
 * (same-origin) and is within a per-IP rate limit, then inserts via the
 * privileged service-role client. The origin + rate-limit guards stop an
 * attacker from flooding the append-only event table with fabricated clicks
 * (data poisoning). Returns 503 when ingestion is unconfigured rather than
 * silently dropping data. See docs/architecture/affiliate-routing-architecture.md
 * and docs/security/soc2-readiness-review-2026-06-10.md (Finding #2).
 *
 * NOTE: cross-checking linkId/campaignId against the live catalog (so unknown
 * IDs are rejected outright) is a recommended follow-up; it needs the affiliate
 * provider configured and is deferred to keep this hot path off the DB.
 */
export const dynamic = "force-dynamic";

/** Per-IP ceiling: organic clicks are bursty but bounded; this stops scripts. */
const MAX_EVENTS_PER_MINUTE = 30;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = clickEventSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden_origin" }, { status: 403 });
  }

  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`affiliate-click:${ip}`, MAX_EVENTS_PER_MINUTE, RATE_WINDOW_MS)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const client = getSupabaseServiceClient();
  if (!client) {
    return Response.json({ error: "ingestion_unconfigured" }, { status: 503 });
  }

  const row = buildClickRow(parsed.data);
  const { error } = await client.from("affiliate_click_events").insert(row);
  if (error) {
    log.error("affiliate_click_insert_failed", { error: error.message });
    return Response.json({ error: "insert_failed" }, { status: 500 });
  }

  return Response.json({ id: row.id }, { status: 202 });
}
