import { test } from "node:test";
import assert from "node:assert/strict";
import { localDestinationProvider } from "../src/lib/providers/destinations.local";
import { supabaseDestinationProvider } from "../src/lib/providers/destinations.supabase";
import { supabaseAffiliateProvider } from "../src/lib/providers/affiliate.supabase";
import type { Provider, ProviderCapability } from "../src/lib/providers/types";

const CAPABILITIES: ProviderCapability[] = [
  "content",
  "destinations",
  "affiliate",
  "weather",
  "events",
];

function assertContract(p: Provider<unknown>): void {
  assert.equal(typeof p.id, "string");
  assert.ok(p.id.length > 0, "id must be non-empty");
  assert.equal(typeof p.name, "string");
  assert.ok(p.name.length > 0, "name must be non-empty");
  assert.ok(CAPABILITIES.includes(p.capability), `unknown capability ${p.capability}`);
  assert.equal(typeof p.priority, "number");
  assert.ok(Number.isFinite(p.priority));
  assert.equal(typeof p.isAvailable, "function");
  assert.equal(typeof p.fetch, "function");
}

test("all registered providers satisfy the Provider contract", async () => {
  const providers: Provider<unknown>[] = [
    localDestinationProvider,
    supabaseDestinationProvider,
    supabaseAffiliateProvider,
  ];
  for (const p of providers) {
    assertContract(p);
    assert.equal(typeof (await p.isAvailable()), "boolean");
  }
});

test("local seed provider is always available and returns a non-empty catalog", async () => {
  assert.equal(await localDestinationProvider.isAvailable(), true);
  const data = await localDestinationProvider.fetch();
  assert.ok(Array.isArray(data) && data.length > 0);
});

test("unconfigured Supabase providers report unavailable (clean fallback)", async () => {
  assert.equal(await supabaseDestinationProvider.isAvailable(), false);
  assert.equal(await supabaseAffiliateProvider.isAvailable(), false);
});

test("provider ids are unique", () => {
  const ids = [
    localDestinationProvider.id,
    supabaseDestinationProvider.id,
    supabaseAffiliateProvider.id,
  ];
  assert.equal(new Set(ids).size, ids.length);
});
