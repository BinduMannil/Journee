import { conversionEventSchema, buildConversionRow } from "@/lib/affiliate/events";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { getConversionToken } from "@/lib/config/env";
import { tokensMatch } from "@/lib/http/admin-auth";
import { checkRateLimit } from "@/lib/http/rate-limit";
import { getClientIp } from "@/lib/billing/identity";
import { log } from "@/lib/observability/logger";

/**
 * Affiliate conversion ingestion (server-only write path).
 *
 * Conversions record FINANCIAL outcomes (amount + currency), so — unlike clicks
 * — they must be authenticated: real conversions arrive as server-to-server
 * postbacks from the affiliate network, not from browsers. Secure by default:
 * disabled (503) unless JOURNEE_CONVERSION_TOKEN is set, then the request must
 * carry a matching `x-conversion-token` header. This stops anyone from
 * fabricating revenue. Returns 503 when the database is unconfigured rather
 * than dropping data silently. See
 * docs/security/soc2-readiness-review-2026-06-10.md (Finding #3).
 */
export const dynamic = "force-dynamic";

/** Per-IP ceiling as defense-in-depth on top of the postback secret. */
const MAX_EVENTS_PER_MINUTE = 30;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = conversionEventSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const token = getConversionToken();
  if (!token) {
    return Response.json({ error: "conversion_disabled" }, { status: 503 });
  }
  if (!tokensMatch(request.headers.get("x-conversion-token"), token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`affiliate-conversion:${ip}`, MAX_EVENTS_PER_MINUTE, RATE_WINDOW_MS)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const client = getSupabaseServiceClient();
  if (!client) {
    return Response.json({ error: "ingestion_unconfigured" }, { status: 503 });
  }

  const row = buildConversionRow(parsed.data);
  const { error } = await client.from("affiliate_conversion_events").insert(row);
  if (error) {
    log.error("affiliate_conversion_insert_failed", { error: error.message });
    return Response.json({ error: "insert_failed" }, { status: 500 });
  }

  return Response.json({ id: row.id }, { status: 202 });
}
