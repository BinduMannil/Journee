import { z } from "zod";
import { getPlanningProvider } from "@/lib/providers/llm";
import { getUsageStore } from "@/lib/billing/store";
import {
  evaluateEntitlement,
  consumeEntitlement,
  EMPTY_USAGE,
  type UsageState,
} from "@/lib/billing/entitlements";
import { getClientIp, getVisitorId } from "@/lib/billing/identity";
import { FREE_AI_PLANS, FREE_AI_PLANS_PER_IP } from "@/content/pricing";
import { log } from "@/lib/observability/logger";

/**
 * AI trip planning (server-only). Returns an LLM-generated day-by-day plan when
 * AI planning is enabled (an LLM key + the `ai-planning` flag). Returns 503 when
 * unconfigured — honest about the capability being off — so the client can fall
 * back to the deterministic planner. See docs/runbooks/hosted-enablement.md.
 */
export const dynamic = "force-dynamic";

// Bounds double as a cost/abuse guard: the request shape caps how large a prompt
// (and therefore how expensive an LLM call) a single request can produce.
const requestSchema = z.object({
  destinations: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        name: z.string().min(1).max(120),
        mood: z.string().min(1).max(120),
      }),
    )
    .min(1)
    .max(20),
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

  // Cost guardrail: gate the (paid) LLM call on the visitor's entitlement BEFORE
  // calling it. Free quota first, then credits; 402 when exhausted.
  const store = getUsageStore();
  const subject = `jid:${getVisitorId(request.headers) ?? "anonymous"}`;
  const usage = await store.get(subject);
  const entitlement = evaluateEntitlement(usage, FREE_AI_PLANS);
  if (!entitlement.allowed) {
    return Response.json(
      { error: "quota_exhausted", remainingFree: 0, credits: usage.credits },
      { status: 402 },
    );
  }

  // Free-tier abuse ceiling: bound free plans per IP so cycling cookies/accounts
  // can't farm unlimited free usage. Paid (credit) usage is exempt.
  const ipSubject = `ip:${getClientIp(request.headers)}`;
  let ipUsage: UsageState = EMPTY_USAGE;
  if (entitlement.source === "free") {
    ipUsage = await store.get(ipSubject);
    if (!evaluateEntitlement(ipUsage, FREE_AI_PLANS_PER_IP).allowed) {
      return Response.json({ error: "ip_free_limit_reached" }, { status: 429 });
    }
  }

  try {
    const plan = await provider.generate(parsed.data);
    // Consume only on success — don't charge for a failed generation.
    const consumed = consumeEntitlement(usage, FREE_AI_PLANS);
    const after = consumed ? consumed.next : usage;
    if (consumed) await store.save(subject, after);
    if (entitlement.source === "free") {
      const ipConsumed = consumeEntitlement(ipUsage, FREE_AI_PLANS_PER_IP);
      if (ipConsumed) await store.save(ipSubject, ipConsumed.next);
    }
    const remaining = evaluateEntitlement(after, FREE_AI_PLANS);
    return Response.json(
      {
        ...plan,
        entitlement: {
          source: consumed?.source ?? entitlement.source,
          remainingFree: remaining.remainingFree,
          credits: after.credits,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    log.error("ai_planning_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ error: "ai_planning_failed" }, { status: 502 });
  }
}
