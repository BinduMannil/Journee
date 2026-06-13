import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimits } from "../src/lib/http/rate-limit";

test("allows up to `max` hits, then blocks within the window", () => {
  resetRateLimits();
  assert.equal(checkRateLimit("k", 2, 10_000), true);
  assert.equal(checkRateLimit("k", 2, 10_000), true);
  assert.equal(checkRateLimit("k", 2, 10_000), false);
});

test("separate keys have independent budgets", () => {
  resetRateLimits();
  assert.equal(checkRateLimit("a", 1, 10_000), true);
  assert.equal(checkRateLimit("a", 1, 10_000), false);
  assert.equal(checkRateLimit("b", 1, 10_000), true);
});

test("the window resets after it elapses", () => {
  resetRateLimits();
  assert.equal(checkRateLimit("k", 1, 1), true);
  assert.equal(checkRateLimit("k", 1, 1), false);
  const start = Date.now();
  while (Date.now() <= start + 1) {
    /* spin until the 1ms window elapses */
  }
  assert.equal(checkRateLimit("k", 1, 1), true);
});
