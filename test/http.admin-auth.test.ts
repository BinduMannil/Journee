import { test } from "node:test";
import assert from "node:assert/strict";
import { tokensMatch, adminGate } from "../src/lib/http/admin-auth";

test("tokensMatch is true only for an exact match", () => {
  assert.equal(tokensMatch("secret", "secret"), true);
  assert.equal(tokensMatch("secret", "secreT"), false);
  assert.equal(tokensMatch("secre", "secret"), false); // length mismatch
  assert.equal(tokensMatch("", "secret"), false);
  assert.equal(tokensMatch(null, "secret"), false);
  assert.equal(tokensMatch(undefined, "secret"), false);
});

test("adminGate disables the surface (503) when no token is configured", () => {
  // JOURNEE_ADMIN_TOKEN is unset in the test env -> secure-by-default off.
  const res = adminGate(new Request("http://localhost/api/admin/status"), "status");
  assert.ok(res);
  assert.equal(res.status, 503);
});
