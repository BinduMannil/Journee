import { getCounters } from "@/lib/observability/metrics";

/**
 * In-process counter snapshot. Scaffold endpoint; a real metrics backend would
 * scrape/export instead. No secrets — counters only.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ time: new Date().toISOString(), counters: getCounters() });
}
