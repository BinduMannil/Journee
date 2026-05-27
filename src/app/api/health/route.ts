import { getSupabaseConfig } from "@/lib/config/env";
import { isFeatureEnabled } from "@/lib/config/flags";
import { isAiPlanningEnabled } from "@/lib/providers/llm";

/**
 * Liveness/readiness endpoint. Reports config *presence* as booleans only —
 * never values — so it is safe to expose. See
 * docs/architecture/monitoring-observability-architecture.md.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    time: new Date().toISOString(),
    config: {
      supabaseConfigured: getSupabaseConfig() !== null,
      // True only when an LLM key AND the ai-planning flag are set (the same
      // AND-gate the provider uses). A boolean — never the key itself.
      aiPlanningReady: await isAiPlanningEnabled(),
      flags: {
        supabaseDestinations: isFeatureEnabled("supabase-destinations"),
        affiliateCatalog: isFeatureEnabled("affiliate-catalog"),
      },
    },
  });
}
