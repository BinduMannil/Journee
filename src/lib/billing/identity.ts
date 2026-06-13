/**
 * Request identity for metering (pure).
 *
 * Derives a best-effort client IP from the standard forwarding headers. This is
 * only trustworthy behind a proxy/CDN that sets these headers (the platform);
 * a direct client can spoof `x-forwarded-for`, so treat IP as an abuse-ceiling
 * heuristic, not strong identity. Real per-user limits need accounts.
 *
 * DEPLOYMENT REQUIREMENT: the IP-based abuse ceilings here are only sound when
 * the hosting platform OVERWRITES the inbound `x-forwarded-for` from the real
 * connection (Vercel and most CDNs do). If Journee is ever deployed behind
 * something that passes a client-supplied `x-forwarded-for` through unchanged,
 * these limits are trivially bypassed — verify this before relying on them.
 * See docs/security/soc2-readiness-review-2026-06-10.md (Finding #18).
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
