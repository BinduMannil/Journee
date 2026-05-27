import { test } from "node:test";
import assert from "node:assert/strict";
import { renderAffiliateUrl, AffiliateUrlError } from "../src/lib/affiliate/url";
import { resolveAffiliateLink } from "../src/lib/affiliate/routing";
import type { AffiliateCatalog } from "../src/lib/affiliate/types";

test("substitutes and URL-encodes placeholders", () => {
  const url = renderAffiliateUrl("https://ex.com/h?aid={token}&q={dest}", {
    token: "abc 123",
    dest: "Kyoto/JP",
  });
  assert.equal(url, "https://ex.com/h?aid=abc%20123&q=Kyoto%2FJP");
});

test("missing params resolve to empty", () => {
  const url = renderAffiliateUrl("https://ex.com/h?aid={token}", {});
  assert.equal(url, "https://ex.com/h?aid=");
});

test("rejects non-http(s) schemes", () => {
  assert.throws(
    () => renderAffiliateUrl("javascript:alert({token})", { token: "1" }),
    AffiliateUrlError,
  );
});

test("rejects malformed templates", () => {
  assert.throws(() => renderAffiliateUrl("not a url"), AffiliateUrlError);
});

test("end-to-end: resolve a link then render its URL", () => {
  const catalog: AffiliateCatalog = {
    providers: [{ id: "p", name: "P", enabled: true }],
    campaigns: [{ id: "c", providerId: "p", category: "hotels", enabled: true }],
    links: [
      {
        id: "l",
        campaignId: "c",
        category: "hotels",
        urlTemplate: "https://ex.com/h?aid={token}",
        enabled: true,
      },
    ],
    regionRules: [],
    priorityRules: [{ campaignId: "c", category: "hotels", priority: 1 }],
    fallbackRules: [],
  };
  const resolution = resolveAffiliateLink(catalog, { category: "hotels" });
  assert.ok(resolution);
  const url = renderAffiliateUrl(resolution.link.urlTemplate, { token: "tok-9" });
  assert.equal(url, "https://ex.com/h?aid=tok-9");
});
