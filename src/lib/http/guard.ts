import { getClientIp } from "@/lib/billing/identity";
import { incrementCounter } from "@/lib/observability/metrics";
import type { RateLimiter } from "./rate-limit";

/**
 * Applies a rate limiter to an incoming request, keyed by best-effort client IP.
 * Returns a `429` denial `Response` (with `Retry-After`) when the caller is over
 * the limit, or `null` when the request may proceed. A `rate_limited` counter is
 * incremented per route on denial so the pressure is visible on the metrics
 * endpoint. Usage:
 *
 *   const limited = enforceRateLimit(limiter, request, "affiliate_click");
 *   if (limited) return limited;
 */
export function enforceRateLimit(
  limiter: RateLimiter,
  request: Request,
  route: string,
): Response | null {
  const key = getClientIp(request.headers);
  const result = limiter.check(key);
  if (result.allowed) return null;
  incrementCounter("rate_limited", { route });
  return Response.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
  );
}
