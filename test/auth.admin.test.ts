import { test } from "node:test";
import assert from "node:assert/strict";

// Configure the admin token BEFORE any handler runs. The env boundary reads
// `process.env` lazily (on first `getEnv()` call inside a test) and caches it,
// so setting it at module top is sufficient. node's test runner isolates files
// in separate processes, so this does not leak into the secure-by-default tests.
process.env.JOURNEE_ADMIN_TOKEN = "s3cret-token";

import { requireAdmin, safeEqual } from "../src/lib/auth/admin";

function req(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/admin/status", { headers });
}

test("rejects a missing token header with 401", () => {
  const res = requireAdmin(req());
  assert.ok(res);
  assert.equal(res!.status, 401);
});

test("rejects a wrong token with 401", () => {
  const res = requireAdmin(req({ "x-admin-token": "wrong" }));
  assert.ok(res);
  assert.equal(res!.status, 401);
});

test("authorizes a matching token (returns null)", () => {
  const res = requireAdmin(req({ "x-admin-token": "s3cret-token" }));
  assert.equal(res, null);
});

test("safeEqual is true only for identical strings", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  // Different lengths must not throw and must compare unequal.
  assert.equal(safeEqual("abc", "abcdef"), false);
  assert.equal(safeEqual("", ""), true);
});
