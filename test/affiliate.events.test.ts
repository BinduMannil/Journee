import { test } from "node:test";
import assert from "node:assert/strict";
import { clickEventSchema, buildClickRow } from "../src/lib/affiliate/events";
import { POST } from "../src/app/api/affiliate/click/route";

test("schema accepts a valid click and rejects bad input", () => {
  assert.equal(clickEventSchema.safeParse({ linkId: "l", campaignId: "c" }).success, true);
  assert.equal(clickEventSchema.safeParse({ linkId: "l" }).success, false);
  assert.equal(
    clickEventSchema.safeParse({ linkId: "l", campaignId: "c", region: "USA" }).success,
    false,
  );
});

test("buildClickRow maps fields, generates id + ISO timestamp", () => {
  const now = new Date("2026-05-26T00:00:00Z");
  const row = buildClickRow({ linkId: "l1", campaignId: "c1" }, now);
  assert.equal(row.link_id, "l1");
  assert.equal(row.campaign_id, "c1");
  assert.equal(row.region, null);
  assert.equal(row.occurred_at, "2026-05-26T00:00:00.000Z");
  assert.match(row.id, /[0-9a-f-]{36}/);
});

function req(body: unknown): Request {
  return new Request("http://localhost/api/affiliate/click", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

test("route returns 400 on malformed JSON", async () => {
  const res = await POST(req("{not json"));
  assert.equal(res.status, 400);
});

test("route returns 400 on invalid body", async () => {
  const res = await POST(req({ linkId: "l" }));
  assert.equal(res.status, 400);
});

test("route returns 503 when ingestion is unconfigured", async () => {
  // No SUPABASE_SERVICE_ROLE_KEY in the test env -> no service client.
  const res = await POST(req({ linkId: "l", campaignId: "c" }));
  assert.equal(res.status, 503);
});
