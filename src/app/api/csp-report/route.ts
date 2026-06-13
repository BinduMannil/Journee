import { log } from "@/lib/observability/logger";
import { incrementCounter } from "@/lib/observability/metrics";
import { checkRateLimit } from "@/lib/http/rate-limit";
import { getClientIp } from "@/lib/billing/identity";

/**
 * Receives CSP violation reports (from the Report-Only policy) and records them
 * as structured logs + a counter, so we can tighten the policy before
 * enforcing. This endpoint is necessarily open (browsers post here without
 * auth), so it is hardened against abuse: oversized bodies are rejected before
 * parsing, the request is rate-limited per IP, and the (attacker-controllable)
 * logged fields are truncated. Always returns 204 — never leaks whether a
 * report was accepted. See docs/security/security-overview.md.
 */
export const dynamic = "force-dynamic";

/** Reports are tiny; anything larger is abuse. */
const MAX_BODY_BYTES = 8_192;
const MAX_FIELD_LEN = 200;
const MAX_REPORTS_PER_MINUTE = 60;
const RATE_WINDOW_MS = 60_000;

/** Coerce an unknown report field to a short string for safe logging. */
function field(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return String(value).slice(0, MAX_FIELD_LEN);
}

export async function POST(request: Request): Promise<Response> {
  // Rate-limit first so a flood can't inflate the log bill or bury real reports.
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`csp-report:${ip}`, MAX_REPORTS_PER_MINUTE, RATE_WINDOW_MS)) {
    return new Response(null, { status: 204 });
  }
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 204 });
    }
    const body: unknown = JSON.parse(raw);
    const report =
      (body as { "csp-report"?: Record<string, unknown> })?.["csp-report"] ?? body;
    const r = report as Record<string, unknown>;
    log.warn("csp_violation", {
      violatedDirective: field(r?.["violated-directive"] ?? r?.["effectiveDirective"]),
      blockedUri: field(r?.["blocked-uri"] ?? r?.["blockedURL"]),
      documentUri: field(r?.["document-uri"] ?? r?.["documentURL"]),
    });
    incrementCounter("csp_violation");
  } catch {
    // Ignore malformed reports.
  }
  return new Response(null, { status: 204 });
}
