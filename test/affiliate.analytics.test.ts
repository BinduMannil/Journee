import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aggregateCampaignMetrics,
  parseTimeWindow,
} from "../src/lib/affiliate/analytics";
import { GET } from "../src/app/api/affiliate/analytics/route";

function analyticsReq(query = ""): Request {
  return new Request(`http://localhost/api/affiliate/analytics${query}`);
}

test("aggregates clicks, conversions, rate, and revenue by currency", () => {
  const metrics = aggregateCampaignMetrics(
    [{ campaign_id: "a" }, { campaign_id: "a" }, { campaign_id: "a" }, { campaign_id: "b" }],
    [
      { campaign_id: "a", amount_minor: 1000, currency: "USD" },
      { campaign_id: "a", amount_minor: 500, currency: "USD" },
      { campaign_id: "a", amount_minor: 900, currency: "EUR" },
    ],
  );

  const a = metrics.find((m) => m.campaignId === "a");
  assert.ok(a);
  assert.equal(a.clicks, 3);
  assert.equal(a.conversions, 3);
  assert.equal(a.conversionRate, 1);
  assert.deepEqual(a.revenueMinorByCurrency, { USD: 1500, EUR: 900 });

  const b = metrics.find((m) => m.campaignId === "b");
  assert.ok(b);
  assert.equal(b.clicks, 1);
  assert.equal(b.conversions, 0);
  assert.equal(b.conversionRate, 0);
  assert.deepEqual(b.revenueMinorByCurrency, {});
});

test("conversion rate is 0 when there are no clicks", () => {
  const metrics = aggregateCampaignMetrics(
    [],
    [{ campaign_id: "x", amount_minor: null, currency: null }],
  );
  assert.equal(metrics[0]?.conversionRate, 0);
  assert.equal(metrics[0]?.conversions, 1);
});

test("results are sorted by campaignId for determinism", () => {
  const metrics = aggregateCampaignMetrics(
    [{ campaign_id: "z" }, { campaign_id: "a" }, { campaign_id: "m" }],
    [],
  );
  assert.deepEqual(metrics.map((m) => m.campaignId), ["a", "m", "z"]);
});

test("parseTimeWindow validates ISO bounds", () => {
  const ok = parseTimeWindow(new URLSearchParams("since=2026-01-01&until=2026-02-01"));
  assert.equal(ok.ok, true);
  assert.equal(parseTimeWindow(new URLSearchParams("since=not-a-date")).ok, false);
  assert.equal(parseTimeWindow(new URLSearchParams()).ok, true);
});

test("route returns 400 on an invalid time window (before config check)", async () => {
  const res = await GET(analyticsReq("?since=garbage"));
  assert.equal(res.status, 400);
});

test("route returns 503 when analytics is unconfigured", async () => {
  const res = await GET(analyticsReq());
  assert.equal(res.status, 503);
});
