import { clickEventSchema, buildClickRow } from "@/lib/affiliate/events";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { log } from "@/lib/observability/logger";
import { createRateLimiter } from "@/lib/http/rate-limit";
import { enforceRateLimit } from "@/lib/http/guard";

/**
 * Affiliate click ingestion (server-only write path).
 *
 * Validates the body, then inserts via the privileged service-role client.
 * Returns 503 when ingestion is unconfigured rather than silently dropping
 * data — honest about data loss. See docs/architecture/affiliate-routing-architecture.md.
 *
 * Unauthenticated by design (a browser beacon), so it is rate-limited per client
 * IP to bound fake-event injection. The in-memory limiter is per-instance; a
 * shared store is needed for a global limit under horizontal scaling.
 */
export const dynamic = "force-dynamic";

// 60 events/min per IP — generous for a real session, a low ceiling for a script.
const limiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

export async function POST(request: Request): Promise<Response> {
  const limited = enforceRateLimit(limiter, request, "affiliate_click");
  if (limited) return limited;

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
