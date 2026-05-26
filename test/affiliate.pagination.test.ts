import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePage, paginateMetrics, type CampaignMetrics } from "../src/lib/affiliate/analytics";

function m(campaignId: string, clicks: number): CampaignMetrics {
  return { campaignId, clicks, conversions: 0, conversionRate: 0, revenueMinorByCurrency: {} };
}

test("parsePage clamps and defaults", () => {
  assert.deepEqual(parsePage(new URLSearchParams("")), { limit: 50, offset: 0 });
  assert.deepEqual(parsePage(new URLSearchParams("limit=10&offset=5")), { limit: 10, offset: 5 });
  assert.deepEqual(parsePage(new URLSearchParams("limit=9999")), { limit: 100, offset: 0 });
  assert.deepEqual(parsePage(new URLSearchParams("limit=-3&offset=-1")), { limit: 50, offset: 0 });
  assert.deepEqual(parsePage(new URLSearchParams("limit=abc")), { limit: 50, offset: 0 });
});

test("paginateMetrics sorts by clicks desc and slices", () => {
  const metrics = [m("a", 5), m("b", 30), m("c", 10)];
  const page = paginateMetrics(metrics, { limit: 2, offset: 0 });
  assert.equal(page.total, 3);
  assert.deepEqual(page.metrics.map((x) => x.campaignId), ["b", "c"]);
});

test("offset pages through results", () => {
  const metrics = [m("a", 5), m("b", 30), m("c", 10)];
  const page = paginateMetrics(metrics, { limit: 2, offset: 2 });
  assert.deepEqual(page.metrics.map((x) => x.campaignId), ["a"]);
});

test("ties broken by campaignId", () => {
  const page = paginateMetrics([m("z", 5), m("a", 5)], { limit: 10, offset: 0 });
  assert.deepEqual(page.metrics.map((x) => x.campaignId), ["a", "z"]);
});
