import { z } from "zod";
import { getPlanningProvider } from "@/lib/providers/llm";
import { log } from "@/lib/observability/logger";

/**
 * AI trip planning (server-only). Returns an LLM-generated day-by-day plan when
 * AI planning is enabled (an LLM key + the `ai-planning` flag). Returns 503 when
 * unconfigured — honest about the capability being off — so the client can fall
 * back to the deterministic planner. See docs/runbooks/hosted-enablement.md.
 */
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  destinations: z
    .array(z.object({ id: z.string().min(1), name: z.string().min(1), mood: z.string().min(1) }))
    .min(1),
  pacing: z.enum(["relaxed", "balanced", "packed"]),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const provider = await getPlanningProvider();
  if (!provider) {
    return Response.json({ error: "ai_planning_unavailable" }, { status: 503 });
  }

  try {
    const plan = await provider.generate(parsed.data);
    return Response.json(plan, { status: 200 });
  } catch (error) {
    log.error("ai_planning_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ error: "ai_planning_failed" }, { status: 502 });
  }
}
