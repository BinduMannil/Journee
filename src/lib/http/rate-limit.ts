/**
 * Minimal in-process rate limiter (no dependencies).
 *
 * Caps how many times a given key (e.g. an IP) may perform an action within a
 * rolling window, so a single client cannot flood an endpoint with writes
 * (data poisoning) or reports (log flooding).
 *
 * IMPORTANT — this counter lives in the server's own memory, so it is
 * NON-DURABLE and PER-INSTANCE: it resets on deploy and is not shared across
 * serverless instances. It is a meaningful speed bump, not a hard guarantee.
 * For real enforcement, back this with a shared store (e.g. Upstash Redis +
 * @upstash/ratelimit) behind the same `checkRateLimit` call site — see
 * docs/security/soc2-readiness-review-2026-06-10.md (Finding #2).
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Records one hit for `key` and reports whether it is within `max` hits per
 * `windowMs`. Returns `true` when allowed, `false` when the limit is exceeded.
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/** Exposed for tests. */
export function resetRateLimits(): void {
  buckets.clear();
}
