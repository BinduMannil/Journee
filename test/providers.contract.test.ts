import { test } from "node:test";
import assert from "node:assert/strict";
import { localDestinationProvider } from "../src/lib/providers/destinations.local";
import { supabaseDestinationProvider } from "../src/lib/providers/destinations.supabase";
import { supabaseAffiliateProvider } from "../src/lib/providers/affiliate.supabase";
import type { Provider } from "../src/lib/providers/types";
import { assertProviderContract } from "./helpers/contract";

test("all registered providers satisfy the Provider contract", async () => {
  const providers: Provider<unknown>[] = [
    localDestinationProvider,
    supabaseDestinationProvider,
    supabaseAffiliateProvider,
  ];
  for (const p of providers) {
    assertProviderContract(p);
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
