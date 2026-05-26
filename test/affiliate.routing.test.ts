import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveAffiliateLink } from "../src/lib/affiliate/routing";
import type { AffiliateCatalog } from "../src/lib/affiliate/types";

function catalog(overrides: Partial<AffiliateCatalog> = {}): AffiliateCatalog {
  return {
    providers: [{ id: "p1", name: "P1", enabled: true }],
    campaigns: [
      { id: "c1", providerId: "p1", category: "hotels", enabled: true },
      { id: "c2", providerId: "p1", category: "hotels", enabled: true },
    ],
    links: [
      { id: "l1", campaignId: "c1", category: "hotels", urlTemplate: "x", enabled: true },
      { id: "l2", campaignId: "c2", category: "hotels", urlTemplate: "y", enabled: true },
    ],
    regionRules: [],
    priorityRules: [
      { campaignId: "c1", category: "hotels", priority: 50 },
      { campaignId: "c2", category: "hotels", priority: 10 },
    ],
    fallbackRules: [],
    ...overrides,
  };
}

test("picks the lowest-priority-number campaign", () => {
  const r = resolveAffiliateLink(catalog(), { category: "hotels" });
  assert.equal(r?.campaign.id, "c2");
  assert.equal(r?.reason, "priority");
});

test("region-specific priority beats global", () => {
  const r = resolveAffiliateLink(
    catalog({
      priorityRules: [
        { campaignId: "c1", category: "hotels", priority: 99 },
        { campaignId: "c1", category: "hotels", region: "JP", priority: 1 },
        { campaignId: "c2", category: "hotels", priority: 10 },
      ],
    }),
    { category: "hotels", region: "JP" },
  );
  assert.equal(r?.campaign.id, "c1");
});

test("deny region rule excludes a campaign", () => {
  const r = resolveAffiliateLink(
    catalog({
      regionRules: [{ campaignId: "c2", regions: ["US"], mode: "deny" }],
    }),
    { category: "hotels", region: "US" },
  );
  assert.equal(r?.campaign.id, "c1");
});

test("disabled provider removes its campaigns", () => {
  const r = resolveAffiliateLink(
    catalog({ providers: [{ id: "p1", name: "P1", enabled: false }] }),
    { category: "hotels" },
  );
  assert.equal(r, null);
});

test("expired campaign is excluded by time window", () => {
  const r = resolveAffiliateLink(
    catalog({
      campaigns: [
        { id: "c1", providerId: "p1", category: "hotels", enabled: true },
        {
          id: "c2",
          providerId: "p1",
          category: "hotels",
          enabled: true,
          endsAt: "2020-01-01T00:00:00Z",
        },
      ],
    }),
    { category: "hotels", now: new Date("2026-05-26T00:00:00Z") },
  );
  // c2 expired -> falls to c1 (only remaining with a priority rule)
  assert.equal(r?.campaign.id, "c1");
});

test("experimentKey splits equal-weight candidates but is stable per key", () => {
  const c = catalog({
    priorityRules: [
      { campaignId: "c1", category: "hotels", priority: 10 },
      { campaignId: "c2", category: "hotels", priority: 10 },
    ],
  });
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const r = resolveAffiliateLink(c, { category: "hotels", experimentKey: `s-${i}` });
    if (r) seen.add(r.campaign.id);
  }
  // Both variants should receive traffic.
  assert.deepEqual([...seen].sort(), ["c1", "c2"]);
  // Same key is stable.
  const a = resolveAffiliateLink(c, { category: "hotels", experimentKey: "fixed" });
  const b = resolveAffiliateLink(c, { category: "hotels", experimentKey: "fixed" });
  assert.equal(a?.campaign.id, b?.campaign.id);
});

test("experimentKey still favors much higher priority (lower number)", () => {
  const c = catalog({
    priorityRules: [
      { campaignId: "c1", category: "hotels", priority: 1 },
      { campaignId: "c2", category: "hotels", priority: 1000 },
    ],
  });
  let c1 = 0;
  const n = 300;
  for (let i = 0; i < n; i++) {
    if (resolveAffiliateLink(c, { category: "hotels", experimentKey: `k-${i}` })?.campaign.id === "c1") {
      c1++;
    }
  }
  // Inverse-weight makes c1 (priority 1) win the vast majority.
  assert.ok(c1 / n > 0.9, `c1 share was ${c1 / n}`);
});

test("falls back when no priority match, else null", () => {
  const fallback = resolveAffiliateLink(
    catalog({
      priorityRules: [],
      fallbackRules: [{ category: "hotels", campaignId: "c1" }],
    }),
    { category: "hotels" },
  );
  assert.equal(fallback?.reason, "fallback");

  const none = resolveAffiliateLink(
    catalog({ priorityRules: [], fallbackRules: [] }),
    { category: "hotels" },
  );
  assert.equal(none, null);
});
