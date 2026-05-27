import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware:
 *  1. Assigns a stable anonymous visitor id (`jid`) for deterministic A/B.
 *  2. Sets a two-tier Content-Security-Policy (CSP rollout phase 2):
 *     - ENFORCED (`Content-Security-Policy`): the structural directives below
 *       govern features the app does not use (framing, plugins, <base>,
 *       cross-origin form posts). They never touch inline script/style or
 *       content loading, so enforcing them adds real protection with zero risk
 *       to rendering/hydration — and needs no per-request nonce, so static
 *       rendering is preserved.
 *     - REPORT-ONLY (`Content-Security-Policy-Report-Only`): the script/style/
 *       content directives stay monitored. Next.js injects inline bootstrap
 *       scripts/styles during hydration, so a strict script-src/style-src must
 *       be browser-verified (and would need nonces, which force dynamic
 *       rendering) before it can be enforced. Violations report to
 *       /api/csp-report (surfaced via the `csp_violation` counter on
 *       /api/metrics). See docs/security/security-overview.md.
 */
const CSP_ENFORCED = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join("; ");

const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https://images.unsplash.com",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join("; ");

export function middleware(req: NextRequest): NextResponse {
  const res = NextResponse.next();
  if (!req.cookies.get("jid")) {
    res.cookies.set("jid", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  res.headers.set("Content-Security-Policy", CSP_ENFORCED);
  res.headers.set("Content-Security-Policy-Report-Only", CSP_REPORT_ONLY);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
