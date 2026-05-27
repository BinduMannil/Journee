import { log } from "@/lib/observability/logger";
import { incrementCounter } from "@/lib/observability/metrics";

/**
 * Receives CSP violation reports (from the Report-Only policy) and records them
 * as structured logs + a counter, so we can tighten the policy before
 * enforcing. Always returns 204. See docs/security/security-overview.md.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
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
