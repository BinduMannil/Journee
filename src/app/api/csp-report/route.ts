import { log } from "@/lib/observability/logger";
import { incrementCounter } from "@/lib/observability/metrics";
import { createRateLimiter } from "@/lib/http/rate-limit";
import { enforceRateLimit } from "@/lib/http/guard";

/**
 * Receives CSP violation reports (from the Report-Only policy) and records them
 * as structured logs + a counter, so we can tighten the policy before
 * enforcing. Normally returns 204; returns 429 when an IP floods reports.
 * Unauthenticated by design (browsers post here), so it is rate-limited per
 * client IP to bound log/counter flooding. See docs/security/security-overview.md.
 */
export const dynamic = "force-dynamic";

// 120 reports/min per IP — real violation bursts are bounded; abuse is not.
const limiter = createRateLimiter({ limit: 120, windowMs: 60_000 });

export async function POST(request: Request): Promise<Response> {
  const limited = enforceRateLimit(limiter, request, "csp_report");
  if (limited) return limited;

  try {
    const body: unknown = await request.json();
    const report =
      (body as { "csp-report"?: Record<string, unknown> })?.["csp-report"] ?? body;
    const r = report as Record<string, unknown>;
    log.warn("csp_violation", {
      violatedDirective: r?.["violated-directive"] ?? r?.["effectiveDirective"],
      blockedUri: r?.["blocked-uri"] ?? r?.["blockedURL"],
      documentUri: r?.["document-uri"] ?? r?.["documentURL"],
    });
    incrementCounter("csp_violation");
  } catch {
    // Ignore malformed reports.
  }
  return new Response(null, { status: 204 });
}
