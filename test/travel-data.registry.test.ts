import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allTravelDataProviders,
  listTravelDataProviders,
  registerTravelDataProvider,
  reportTravelDataReadiness,
  resetTravelDataRegistry,
  resolveTravelData,
} from "../src/lib/providers/travel-data/registry";
// Importing register.ts populates the registry with the seed adapters (side effect).
import { registerSeedTravelDataProviders } from "../src/lib/providers/travel-data/register";
import {
  errorResponse,
  okResponse,
  unavailableResponse,
  TRAVEL_DATA_KINDS,
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import type { ProviderSourceClass } from "../src/lib/providers/travel-data/source";
import { makeSourceMetadata } from "../src/lib/providers/travel-data/source";

type Q = { readonly id: string };
type D = { readonly v: number };

function fake(opts: {
  id: string;
  sourceType: ProviderSourceClass;
  available?: boolean;
  behavior?: "ok" | "unavailable" | "error" | "throw";
  v?: number;
}): TravelDataProvider<Q, D> {
  const { id, sourceType, available = true, behavior = "ok", v = 0 } = opts;
  const source = makeSourceMetadata({ sourceName: id, sourceType, providerId: id, confidence: 0.5 });
  return {
    id,
    name: id,
    kind: "places",
    sourceType,
    isAvailable: () => available,
    async fetch() {
      if (behavior === "throw") throw new Error("boom");
      if (behavior === "unavailable") return unavailableResponse(id, "places", "nope", source);
      if (behavior === "error") return errorResponse(id, "places", "broke", source);
      return okResponse<D>(id, "places", { v }, source);
    },
  };
}

// ── Seed registration (register.ts side effect) ──────────────────────────────

test("register.ts wires a seed provider for every travel-data kind", () => {
  const all = allTravelDataProviders();
  assert.equal(all.length, TRAVEL_DATA_KINDS.length);
  for (const kind of TRAVEL_DATA_KINDS) {
    assert.equal(listTravelDataProviders(kind).length, 1, `missing provider for ${kind}`);
  }
});

test("readiness report (seed-only): contract-ready, seed-backed, blocked for live", async () => {
  const report = await reportTravelDataReadiness();
  assert.equal(report.kinds.length, TRAVEL_DATA_KINDS.length);
  assert.ok(report.notes.length > 0);
  for (const k of report.kinds) {
    assert.equal(k.contractReady, true);
    assert.equal(k.providerCount, 1);
    assert.equal(k.hasLiveProvider, false);
    assert.equal(k.hasAvailableProvider, true);
    assert.deepEqual(k.sourceTypes, ["seed"]);
    assert.equal(k.blocked, true);
    assert.equal(k.blockedReason, "no live provider wired (seed/mock only)");
  }
});

// ── Resolution / fallback (synthetic providers after a reset) ────────────────

test("resolveTravelData prefers a live provider over seed (trust order)", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed", v: 1 }));
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", v: 2 }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") assert.equal(res.data.v, 2);
});

test("resolveTravelData falls back when the preferred provider is unavailable", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", available: false, v: 2 }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed", v: 1 }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") assert.equal(res.data.v, 1);
});

test("resolveTravelData skips a non-ok response and uses the next provider", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "unavailable" }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed", v: 7 }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") assert.equal(res.data.v, 7);
});

test("resolveTravelData does not throw when a provider throws", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "throw" }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed", v: 9 }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") assert.equal(res.data.v, 9);
});

test("resolveTravelData returns last non-ok when all providers are non-ok", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "error" }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "error");
  if (res.status === "error") assert.equal(res.providerId, "live-x");
});

test("resolveTravelData synthesizes an unavailable response when nothing is registered", async () => {
  resetTravelDataRegistry();
  const res = await resolveTravelData<Q, D>("reviews", { id: "q" });
  assert.equal(res.status, "unavailable");
  assert.equal(res.providerId, "registry");
  if (res.status === "unavailable") assert.match(res.reason, /no provider registered/);
});

test("readiness: a wired live provider flips blocked off for that kind", async () => {
  resetTravelDataRegistry();
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live" }));
  const report = await reportTravelDataReadiness();
  const places = report.kinds.find((k) => k.kind === "places");
  const reviews = report.kinds.find((k) => k.kind === "reviews");
  assert.ok(places && reviews);
  assert.equal(places!.hasLiveProvider, true);
  assert.equal(places!.blocked, false);
  assert.equal(places!.blockedReason, undefined);
  // A kind with no providers reports blocked with the empty reason.
  assert.equal(reviews!.providerCount, 0);
  assert.equal(reviews!.blocked, true);
  assert.equal(reviews!.blockedReason, "no provider registered");
});

test("registry can be repopulated with seed adapters after a reset", () => {
  resetTravelDataRegistry();
  assert.equal(allTravelDataProviders().length, 0);
  registerSeedTravelDataProviders();
  assert.equal(allTravelDataProviders().length, TRAVEL_DATA_KINDS.length);
});
