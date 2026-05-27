import { test } from "node:test";
import assert from "node:assert/strict";
import { GET } from "../src/app/api/admin/status/route";

function adminReq(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/admin/status", { headers });
}

test("admin status is disabled (503) when no token is configured", async () => {
  // JOURNEE_ADMIN_TOKEN is unset in the test env -> secure-by-default off.
  const res = await GET(adminReq());
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.error, "admin_disabled");
});

test("admin status ignores a provided header when disabled", async () => {
  const res = await GET(adminReq({ "x-admin-token": "guess" }));
  assert.equal(res.status, 503);
});
