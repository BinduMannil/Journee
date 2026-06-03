import { getCounters } from "@/lib/observability/metrics";
import { requireAdmin } from "@/lib/auth/admin";

/**
 * In-process counter snapshot. Scaffold endpoint; a real metrics backend would
 * scrape/export instead. No secrets — counters only — but it still leaks
 * operational signal (traffic volume, CSP-violation counts), so it is admin-
 * gated like the other introspection endpoints: disabled (503) unless
 * `JOURNEE_ADMIN_TOKEN` is set, then requires a matching `x-admin-token` header.
 */
export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ time: new Date().toISOString(), counters: getCounters() });
}
