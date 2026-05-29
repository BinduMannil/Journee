import { getAdminToken } from "@/lib/config/env";
import { getCounters } from "@/lib/observability/metrics";
import { defaultTravelDataCache } from "@/lib/providers/travel-data/cache";

/**
 * Operational tooling for the in-process travel-data cache.
 *
 * - `GET` returns the current entry count and the `travel_data_cache_*`
 *   counters (hit/miss/bypass/coalesced) so an operator can see cache health.
 * - `DELETE` clears the default cache (e.g. to force a refresh after seeding new
 *   data) and reports how many entries were dropped.
 *
 * Secure by default — disabled (503) unless `JOURNEE_ADMIN_TOKEN` is set, then
 * requires a matching `x-admin-token` header. Read-only counters carry no user
 * data. See docs/architecture/control-plane-architecture.md.
 */
export const dynamic = "force-dynamic";

/** The cache-related counters, filtered from the global snapshot. */
function cacheCounters(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(getCounters())) {
    if (key.startsWith("travel_data_cache_")) out[key] = value;
  }
  return out;
}

function authorize(request: Request): Response | null {
  const token = getAdminToken();
  if (!token) return Response.json({ error: "admin_disabled" }, { status: 503 });
  if (request.headers.get("x-admin-token") !== token) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request): Promise<Response> {
  const denied = authorize(request);
  if (denied) return denied;
  return Response.json({
    time: new Date().toISOString(),
    size: defaultTravelDataCache.size(),
    counters: cacheCounters(),
  });
}

export async function DELETE(request: Request): Promise<Response> {
  const denied = authorize(request);
  if (denied) return denied;
  const sizeBefore = defaultTravelDataCache.size();
  defaultTravelDataCache.clear();
  return Response.json({
    time: new Date().toISOString(),
    cleared: true,
    sizeBefore,
    size: defaultTravelDataCache.size(),
  });
}
