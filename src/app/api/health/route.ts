import { getSupabaseConfig } from "@/lib/config/env";
import { isFeatureEnabled } from "@/lib/config/flags";

/**
 * Liveness/readiness endpoint. Reports config *presence* as booleans only —
 * never values — so it is safe to expose. See
 * docs/architecture/monitoring-observability-architecture.md.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    time: new Date().toISOString(),
    config: {
      supabaseConfigured: getSupabaseConfig() !== null,
      flags: {
        supabaseDestinations: isFeatureEnabled("supabase-destinations"),
        affiliateCatalog: isFeatureEnabled("affiliate-catalog"),
      },
    },
  });
}
