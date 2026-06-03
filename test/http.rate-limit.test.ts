import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "../src/lib/http/rate-limit";

test("allows requests up to the limit, then blocks", () => {
  const rl = createRateLimiter({ limit: 3, windowMs: 1000 });
  const t = 1_000_000;
  assert.equal(rl.check("a", t).allowed, true);
  assert.equal(rl.check("a", t).allowed, true);
  const third = rl.check("a", t);
  assert.equal(third.allowed, true);
  assert.equal(third.remaining, 0);
  assert.equal(rl.check("a", t).allowed, false);
});

test("tracks keys independently", () => {
  const rl = createRateLimiter({ limit: 1, windowMs: 1000 });
  const t = 5_000;
  assert.equal(rl.check("a", t).allowed, true);
  assert.equal(rl.check("a", t).allowed, false);
  // A different key has its own window.
  assert.equal(rl.check("b", t).allowed, true);
});

test("resets after the window elapses", () => {
  const rl = createRateLimiter({ limit: 1, windowMs: 1000 });
  assert.equal(rl.check("a", 0).allowed, true);
  assert.equal(rl.check("a", 500).allowed, false);
  // At/after windowMs a fresh window starts.
  assert.equal(rl.check("a", 1000).allowed, true);
});

test("reports a retry-after that counts down within the window", () => {
  const rl = createRateLimiter({ limit: 1, windowMs: 10_000 });
  rl.check("a", 0);
  const blocked = rl.check("a", 3000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 7);
  assert.equal(blocked.resetAt, 10_000);
});

test("reset() clears all windows", () => {
  const rl = createRateLimiter({ limit: 1, windowMs: 1000 });
  assert.equal(rl.check("a", 0).allowed, true);
  assert.equal(rl.check("a", 0).allowed, false);
  rl.reset();
  assert.equal(rl.check("a", 0).allowed, true);
});
