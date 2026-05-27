import { conversionEventSchema, buildConversionRow } from "@/lib/affiliate/events";
import { getSupabaseServiceClient } from "@/lib/providers/supabase/client";
import { log } from "@/lib/observability/logger";

/**
 * Affiliate conversion ingestion (server-only write path). Mirrors the click
 * endpoint: validate, then insert via the privileged service-role client.
 * Returns 503 when unconfigured rather than dropping data silently.
 */
export const dynamic = "force-dynamic";

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
