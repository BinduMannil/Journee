import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, registerProvider, listProviders } from "../src/lib/providers/registry";
import { featuredDestinations, type Destination } from "../src/content/destinations";
// Wire up the real adapters (seed + Supabase). With no env/flags set in the
// test environment, the Supabase adapters report unavailable, so this exercises
// real end-to-end fallback to the seed provider.
import "../src/lib/providers/register";

test("destinations fall back to the seed provider when no external provider is available", async () => {
  const result = await resolve<readonly Destination[]>("destinations");
  assert.ok(Array.isArray(result));
  assert.equal(result?.length, featuredDestinations.length);
});

test("affiliate capability resolves to null when its only provider is unconfigured", async () => {
  const result = await resolve("affiliate");
  assert.equal(result, null);
});

test("registry skips an unavailable/throwing provider and falls through by priority", async () => {
  const capability = "events" as const;
  const calls: string[] = [];
  registerProvider({
    id: "fake-unavailable",
    name: "Unavailable",
    capability,
    priority: 1,
    isAvailable: () => false,
    fetch: async () => {
      calls.push("unavailable");
      return "should-not-run";
    },
  });
  registerProvider({
    id: "fake-throws",
    name: "Throws",
    capability,
    priority: 2,
    isAvailable: () => true,
    fetch: async () => {
      calls.push("throws");
      throw new Error("boom");
    },
  });
  registerProvider({
    id: "fake-ok",
    name: "OK",
    capability,
    priority: 3,
    isAvailable: () => true,
    fetch: async () => {
      calls.push("ok");
      return "winner";
    },
  });

  const result = await resolve<string>(capability);
  assert.equal(result, "winner");
  // Unavailable provider's fetch never ran; throwing provider was attempted.
  assert.deepEqual(calls, ["throws", "ok"]);
  assert.equal(listProviders(capability).length, 3);
});
