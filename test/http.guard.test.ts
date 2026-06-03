import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../src/lib/http/rate-limit";
import { enforceRateLimit } from "../src/lib/http/guard";

function reqFrom(ip: string): Request {
  return new Request("http://localhost/api/affiliate/click", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

test("passes through (null) while under the limit, blocks with 429 over it", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
  const first = enforceRateLimit(limiter, reqFrom("203.0.113.1"), "test_route");
  assert.equal(first, null);

  const second = enforceRateLimit(limiter, reqFrom("203.0.113.1"), "test_route");
  assert.ok(second);
  assert.equal(second!.status, 429);
  assert.ok(second!.headers.get("Retry-After"));
});

test("limits are per client IP", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
  assert.equal(enforceRateLimit(limiter, reqFrom("198.51.100.1"), "r"), null);
  // A different IP is unaffected by the first IP's window.
  assert.equal(enforceRateLimit(limiter, reqFrom("198.51.100.2"), "r"), null);
});
