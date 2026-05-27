/**
 * Request identity for metering (pure).
 *
 * Derives a best-effort client IP from the standard forwarding headers. This is
 * only trustworthy behind a proxy/CDN that sets these headers (the platform);
 * a direct client can spoof `x-forwarded-for`, so treat IP as an abuse-ceiling
 * heuristic, not strong identity. Real per-user limits need accounts.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Anonymous visitor id (`jid`) parsed from the request's Cookie header, or null
 * when absent. Reading the header (rather than `next/headers` cookies()) keeps
 * the metering subject a pure function of the Request — the same value the
 * middleware-set cookie carries — so route handlers stay testable and free of
 * request-scope coupling.
 */
export function getVisitorId(headers: Headers): string | null {
  const cookie = headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== "jid") continue;
    const value = part.slice(eq + 1).trim();
    return value || null;
  }
  return null;
}
