import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminToken } from "@/lib/config/env";

/**
 * Shared admin control-plane authorization.
 *
 * Secure-by-default: when no `JOURNEE_ADMIN_TOKEN` is configured the caller is
 * *disabled* (503) rather than open; when configured, the request must present a
 * matching `x-admin-token` header. Centralized so every privileged endpoint
 * (admin status/readiness, revenue analytics, metrics) enforces the exact same
 * rule. See docs/architecture/control-plane-architecture.md.
 */

/**
 * Constant-time string equality. Both inputs are SHA-256 hashed first so the
 * comparison is over fixed-length digests — this avoids leaking the token
 * length (and avoids `timingSafeEqual`'s equal-length requirement) while
 * keeping the compare itself timing-safe.
 */
export function safeEqual(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

/**
 * Returns a denial `Response` when the request is not an authorized admin call,
 * or `null` when it is authorized (caller proceeds). Usage:
 *
 *   const denied = requireAdmin(request);
 *   if (denied) return denied;
 */
export function requireAdmin(request: Request): Response | null {
  const token = getAdminToken();
  if (!token) {
    return Response.json({ error: "admin_disabled" }, { status: 503 });
  }
  const provided = request.headers.get("x-admin-token");
  if (!provided || !safeEqual(provided, token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
