import { timingSafeEqual } from "node:crypto";
import { getAdminToken } from "@/lib/config/env";
import { getClientIp } from "@/lib/billing/identity";
import { log } from "@/lib/observability/logger";

/**
 * Shared admin authorization for the control-plane + privileged read endpoints
 * (`/api/admin/*`, `/api/affiliate/analytics`, `/api/metrics`).
 *
 * Secure-by-default: every gated endpoint is disabled (503) unless
 * `JOURNEE_ADMIN_TOKEN` is set, and then requires a matching `x-admin-token`
 * header. Centralizing this here means one audited code path, constant-time
 * token comparison, and consistent access logging across every admin surface.
 */

/**
 * Constant-time token comparison. A plain `===` returns as soon as the first
 * differing byte is found, so the time it takes leaks how much of the token a
 * guess got right (a "timing attack"). `timingSafeEqual` always compares the
 * full length. It requires equal-length buffers, so a length mismatch is a
 * safe early `false`.
 */
export function tokensMatch(provided: string | null | undefined, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Returns a `Response` to short-circuit with when the request is NOT an
 * authorized admin, or `null` when the caller is authorized and the handler
 * should proceed.
 *
 * Authenticated attempts (token configured) are logged for the audit trail;
 * when the surface is disabled (no token configured) nothing is logged, to
 * avoid noise from health checks and unconfigured environments.
 */
export function adminGate(request: Request, route: string): Response | null {
  const token = getAdminToken();
  if (!token) {
    return Response.json({ error: "admin_disabled" }, { status: 503 });
  }
  const ip = getClientIp(request.headers);
  if (!tokensMatch(request.headers.get("x-admin-token"), token)) {
    log.warn("admin_access", { route, outcome: "unauthorized", ip });
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  log.info("admin_access", { route, outcome: "ok", ip });
  return null;
}
