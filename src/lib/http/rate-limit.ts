/**
 * Minimal in-memory fixed-window rate limiter (no dependencies).
 *
 * A scaffold abuse-control seam: public endpoints (CSP reports, affiliate click/
 * conversion beacons) accept unauthenticated writes, so they need a ceiling on
 * request volume per caller. This is a fixed-window counter keyed by an opaque
 * string (typically a client IP). It is per-instance and in-memory — exactly
 * like the AI-planning quota store — so a horizontally-scaled deployment needs a
 * shared/durable backend (Redis, etc.) for a global limit. The call sites stay
 * the same when that lands. See docs/architecture/monitoring-observability-architecture.md.
 */
export interface RateLimitResult {
  readonly allowed: boolean;
  /** Requests still permitted in the current window (0 when blocked). */
  readonly remaining: number;
  /** Epoch ms at which the current window resets. */
  readonly resetAt: number;
  /** Seconds until reset — suitable for a `Retry-After` header. */
  readonly retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
  reset(): void;
}

interface Window {
  count: number;
  start: number;
}

export interface RateLimiterOptions {
  /** Max requests allowed per window. */
  readonly limit: number;
  /** Window length in milliseconds. */
  readonly windowMs: number;
}

export function createRateLimiter({ limit, windowMs }: RateLimiterOptions): RateLimiter {
  const windows = new Map<string, Window>();

  return {
    check(key: string, now: number = Date.now()): RateLimitResult {
      const existing = windows.get(key);
      // Start a fresh window when there is none or the prior one has elapsed.
      if (!existing || now - existing.start >= windowMs) {
        windows.set(key, { count: 1, start: now });
        return {
          allowed: true,
          remaining: limit - 1,
          resetAt: now + windowMs,
          retryAfterSeconds: Math.ceil(windowMs / 1000),
        };
      }

      const resetAt = existing.start + windowMs;
      const retryAfterSeconds = Math.max(0, Math.ceil((resetAt - now) / 1000));
      if (existing.count >= limit) {
        return { allowed: false, remaining: 0, resetAt, retryAfterSeconds };
      }
      existing.count += 1;
      return {
        allowed: true,
        remaining: limit - existing.count,
        resetAt,
        retryAfterSeconds,
      };
    },
    reset() {
      windows.clear();
    },
  };
}
