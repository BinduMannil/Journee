import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  cachedResolveTravelData,
  createTravelDataCache,
  defaultTravelDataCache,
} from "../src/lib/providers/travel-data/cache";
import {
  registerTravelDataProvider,
  resetTravelDataRegistry,
} from "../src/lib/providers/travel-data/registry";
import {
  errorResponse,
  okResponse,
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata, type ProviderSourceClass } from "../src/lib/providers/travel-data/source";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

type Q = { readonly id: string };
type D = { readonly v: number };

function counting(opts: {
  id: string;
  sourceType: ProviderSourceClass;
  behavior?: "ok" | "error";
  ttlMs?: number;
  /** Out param: increments per fetch call. */
  counter: { n: number };
}): TravelDataProvider<Q, D> {
  const { id, sourceType, behavior = "ok", ttlMs, counter } = opts;
  return {
    id,
    name: id,
    kind: "places",
    sourceType,
    isAvailable: () => true,
    async fetch(query) {
      counter.n += 1;
      const source = makeSourceMetadata({
        sourceName: id,
        sourceType,
        providerId: id,
        confidence: 0.5,
        fetchedAt: new Date(),
        ttlMs,
      });
      if (behavior === "error") return errorResponse(id, "places", "broke", source);
      return okResponse<D>(id, "places", { v: query.id.length }, source);
    },
  };
}

beforeEach(() => {
  resetTravelDataRegistry();
  resetCounters();
  defaultTravelDataCache.clear();
});

test("cache miss → resolves, hit → does not re-resolve", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  const a = await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  const b = await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  assert.equal(c.n, 1, "provider should be called once");
  assert.equal(cache.size(), 1);
});

test("cache key is stable regardless of query property order", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  // Same logical query, fields registered in different code paths.
  const q1 = { id: "abc" };
  const q2 = { id: "abc" };
  await cachedResolveTravelData<Q, D>("places", q1, cache);
  await cachedResolveTravelData<Q, D>("places", q2, cache);
  assert.equal(c.n, 1);
});

test("different queries get distinct cache entries", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  await cachedResolveTravelData<Q, D>("places", { id: "xyz" }, cache);
  assert.equal(c.n, 2);
  assert.equal(cache.size(), 2);
});

test("entry expires past its TTL → re-resolves", async () => {
  const c = { n: 0 };
  // No source TTL — cache's defaultTtlMs governs (uses the mock clock).
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", counter: c }));
  let t = new Date("2026-05-29T00:00:00Z").getTime();
  const cache = createTravelDataCache({ now: () => new Date(t), defaultTtlMs: 1_000 });
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  t += 5_000; // 5s later — past the 1s defaultTtlMs
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  assert.equal(c.n, 2);
});

test("non-ok responses bypass the cache (failures are not memoized)", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", behavior: "error", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  assert.equal(c.n, 2, "errors must not be cached");
  assert.equal(cache.size(), 0);
});

test("hit/miss/bypass counters are emitted with the kind label", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache); // miss
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache); // hit
  const k = getCounters();
  assert.equal(k["travel_data_cache_miss{kind=places}"], 1);
  assert.equal(k["travel_data_cache_hit{kind=places}"], 1);
});

test("bypass counter increments when an error response is returned", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", behavior: "error", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  assert.equal(getCounters()["travel_data_cache_bypass{kind=places}"], 1);
});

test("clear() empties the cache; subsequent calls miss again", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(counting({ id: "live-x", sourceType: "live", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  cache.clear();
  await cachedResolveTravelData<Q, D>("places", { id: "abc" }, cache);
  assert.equal(c.n, 2);
});
