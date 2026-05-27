import { test } from "node:test";
import assert from "node:assert/strict";
import {
  conversionEventSchema,
  buildConversionRow,
} from "../src/lib/affiliate/events";
import { POST } from "../src/app/api/affiliate/conversion/route";

test("schema enforces campaignId, int amount, 3-char currency", () => {
  assert.equal(conversionEventSchema.safeParse({ campaignId: "c" }).success, true);
  assert.equal(conversionEventSchema.safeParse({}).success, false);
  assert.equal(
    conversionEventSchema.safeParse({ campaignId: "c", amountMinor: 1.5 }).success,
    false,
  );
  assert.equal(
    conversionEventSchema.safeParse({ campaignId: "c", currency: "DOLLAR" }).success,
    false,
  );
});

test("buildConversionRow maps optional fields to null", () => {
  const now = new Date("2026-05-26T00:00:00Z");
  const row = buildConversionRow({ campaignId: "c1" }, now);
  assert.equal(row.campaign_id, "c1");
  assert.equal(row.click_id, null);
  assert.equal(row.amount_minor, null);
  assert.equal(row.currency, null);
  assert.equal(row.occurred_at, "2026-05-26T00:00:00.000Z");
});

test("buildConversionRow preserves provided money fields", () => {
  const row = buildConversionRow({
    campaignId: "c1",
    clickId: "k1",
    amountMinor: 12999,
    currency: "USD",
  });
  assert.equal(row.click_id, "k1");
  assert.equal(row.amount_minor, 12999);
  assert.equal(row.currency, "USD");
});

function req(body: unknown): Request {
  return new Request("http://localhost/api/affiliate/conversion", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

test("route returns 400 on invalid body, 503 when unconfigured", async () => {
  assert.equal((await POST(req({}))).status, 400);
  assert.equal((await POST(req({ campaignId: "c" }))).status, 503);
});
