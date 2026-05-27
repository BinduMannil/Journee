import { allProviders } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { getAdminToken } from "@/lib/config/env";
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
  const token = getAdminToken();
  if (!token) {
    return Response.json({ error: "admin_disabled" }, { status: 503 });
  }
  if (request.headers.get("x-admin-token") !== token) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

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

  return Response.json({
    time: new Date().toISOString(),
    providers,
    flags,
    counters: getCounters(),
  });
}
