import { getCounters } from "@/lib/observability/metrics";
import { adminGate } from "@/lib/http/admin-auth";

/**
 * In-process counter snapshot. Scaffold endpoint; a real metrics backend would
 * scrape/export instead. No secrets, but operational telemetry (what's failing,
 * how busy we are) is operator-only, so it is admin-gated like /api/admin/* —
 * disabled (503) unless JOURNEE_ADMIN_TOKEN is set, then requires a matching
 * `x-admin-token` header. (/api/health stays public for liveness checks.)
 */
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  const denied = adminGate(request, "metrics");
  if (denied) return denied;
  return Response.json({ time: new Date().toISOString(), counters: getCounters() });
}
