import { allProviders } from "@/lib/providers/registry";
import "@/lib/providers/register";
import "@/lib/providers/travel-data/register";
import { reportTravelDataReadiness } from "@/lib/providers/travel-data/registry";
import { requireAdmin } from "@/lib/auth/admin";
import { getCounters } from "@/lib/observability/metrics";
import { KNOWN_FLAGS, isFeatureEnabled } from "@/lib/config/flags";

/**
 * Read-only control-plane snapshot: registered providers + availability, flag
 * state, and counters. Secure by default — disabled (503) unless
 * JOURNEE_ADMIN_TOKEN is set, and then requires a matching `x-admin-token`
 * header. See docs/architecture/control-plane-architecture.md.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const providers = await Promise.all(
    allProviders().map(async (p) => ({
      id: p.id,
      name: p.name,
      capability: p.capability,
      priority: p.priority,
      available: await p.isAvailable(),
    })),
  );
  const flags = Object.fromEntries(KNOWN_FLAGS.map((f) => [f, isFeatureEnabled(f)]));
  const travelData = await reportTravelDataReadiness();

  return Response.json({
    time: new Date().toISOString(),
    providers,
    travelData,
    flags,
    counters: getCounters(),
  });
}
