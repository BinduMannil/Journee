import { test } from "node:test";
import assert from "node:assert/strict";

// Revenue analytics is privileged business data and must be admin-gated. With a
// token configured, an unauthenticated request must be rejected (401) BEFORE any
// data access — proving the gate runs ahead of the Supabase read. Isolated in
// its own process so the token doesn't leak into other suites.
process.env.JOURNEE_ADMIN_TOKEN = "analytics-token";

import { GET } from "../src/app/api/affiliate/analytics/route";

test("analytics rejects an unauthenticated request with 401", async () => {
  const res = await GET(new Request("http://localhost/api/affiliate/analytics"));
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.error, "unauthorized");
});

test("analytics rejects a wrong token with 401", async () => {
  const res = await GET(
    new Request("http://localhost/api/affiliate/analytics", {
      headers: { "x-admin-token": "nope" },
    }),
  );
  assert.equal(res.status, 401);
});
