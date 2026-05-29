import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { GET, DELETE } from "../src/app/api/admin/cache/route";
import { resetEnvCache } from "../src/lib/config/env";
import { defaultTravelDataCache } from "../src/lib/providers/travel-data/cache";
import { okResponse } from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata } from "../src/lib/providers/travel-data/source";

const TOKEN = "test-admin-token";

function req(method: string, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/admin/cache", { method, headers });
}

function enableAdmin(): void {
  process.env.JOURNEE_ADMIN_TOKEN = TOKEN;
  resetEnvCache();
}

function seedOneEntry(): void {
  const source = makeSourceMetadata({ sourceName: "seed", sourceType: "seed", providerId: "seed", confidence: 0.5 });
  defaultTravelDataCache.set("places|{\"id\":\"kyoto\"}", {
    response: okResponse("seed", "places", { v: 1 }, source),
    expiresAt: Date.now() + 60_000,
  });
}

afterEach(() => {
  delete process.env.JOURNEE_ADMIN_TOKEN;
  resetEnvCache();
  defaultTravelDataCache.clear();
});

test("cache endpoint is disabled (503) when no token is configured (GET + DELETE)", async () => {
  for (const method of ["GET", "DELETE"] as const) {
    const handler = method === "GET" ? GET : DELETE;
    const res = await handler(req(method));
    assert.equal(res.status, 503);
    assert.equal((await res.json()).error, "admin_disabled");
  }
});

test("cache endpoint returns 401 on a bad token", async () => {
  enableAdmin();
  const res = await GET(req("GET", { "x-admin-token": "wrong" }));
  assert.equal(res.status, 401);
});

test("GET reports size + only the travel_data_cache_* counters", async () => {
  enableAdmin();
  seedOneEntry();
  const res = await GET(req("GET", { "x-admin-token": TOKEN }));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.size >= 1, "size reflects the seeded entry");
  assert.equal(typeof body.counters, "object");
  for (const key of Object.keys(body.counters)) {
    assert.ok(key.startsWith("travel_data_cache_"), `unexpected counter ${key}`);
  }
});

test("DELETE clears the default cache and reports the prior size", async () => {
  enableAdmin();
  seedOneEntry();
  assert.ok(defaultTravelDataCache.size() >= 1);
  const res = await DELETE(req("DELETE", { "x-admin-token": TOKEN }));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.cleared, true);
  assert.ok(body.sizeBefore >= 1);
  assert.equal(body.size, 0);
  assert.equal(defaultTravelDataCache.size(), 0);
});
