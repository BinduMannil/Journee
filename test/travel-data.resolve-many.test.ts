import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  registerTravelDataProvider,
  resetTravelDataRegistry,
  resolveTravelDataMany,
} from "../src/lib/providers/travel-data/registry";
import { cachedResolveTravelData, createTravelDataCache } from "../src/lib/providers/travel-data/cache";
import {
  okResponse,
  unavailableResponse,
  type TravelDataKind,
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata, type ProviderSourceClass } from "../src/lib/providers/travel-data/source";

type Q = { readonly id: string };
type D = { readonly v: number };

function provider(opts: {
  id: string;
  kind: TravelDataKind;
  sourceType?: ProviderSourceClass;
  behavior?: "ok" | "unavailable";
  ttlMs?: number;
  counter?: { n: number };
}): TravelDataProvider<Q, D> {
  const { id, kind, sourceType = "seed", behavior = "ok", ttlMs, counter } = opts;
  return {
    id,
    name: id,
    kind,
    sourceType,
    isAvailable: () => true,
    async fetch(query) {
      if (counter) counter.n += 1;
      const source = makeSourceMetadata({ sourceName: id, sourceType, providerId: id, confidence: 0.5, fetchedAt: new Date(), ttlMs });
      if (behavior === "unavailable") return unavailableResponse(id, kind, "nope", source);
      return okResponse<D>(id, kind, { v: query.id.length }, source);
    },
  };
}

beforeEach(() => resetTravelDataRegistry());

test("resolveTravelDataMany returns responses aligned by index", async () => {
  registerTravelDataProvider(provider({ id: "p-places", kind: "places" }));
  registerTravelDataProvider(provider({ id: "p-reviews", kind: "reviews" }));
  const out = await resolveTravelDataMany([
    { kind: "places", query: { id: "kyoto" } },
    { kind: "reviews", query: { id: "x" } },
  ]);
  assert.equal(out.length, 2);
  assert.equal(out[0]?.kind, "places");
  assert.equal(out[1]?.kind, "reviews");
});

test("one unavailable kind does not fail the others", async () => {
  registerTravelDataProvider(provider({ id: "p-places", kind: "places" }));
  registerTravelDataProvider(provider({ id: "p-reviews", kind: "reviews", behavior: "unavailable" }));
  // `local-events` has no provider registered → synthesized unavailable.
  const out = await resolveTravelDataMany([
    { kind: "places", query: { id: "kyoto" } },
    { kind: "reviews", query: { id: "x" } },
    { kind: "local-events", query: { id: "kyoto" } },
  ]);
  assert.equal(out[0]?.status, "ok");
  assert.equal(out[1]?.status, "unavailable");
  assert.equal(out[2]?.status, "unavailable");
});

test("empty batch resolves to an empty array", async () => {
  assert.deepEqual(await resolveTravelDataMany([]), []);
});

test("an injected cache-backed resolver is shared across the batch (coalesces duplicates)", async () => {
  const c = { n: 0 };
  registerTravelDataProvider(provider({ id: "p-places", kind: "places", ttlMs: 60_000, counter: c }));
  const cache = createTravelDataCache();
  const out = await resolveTravelDataMany(
    [
      { kind: "places", query: { id: "kyoto" } },
      { kind: "places", query: { id: "kyoto" } }, // duplicate within the batch
    ],
    (k, q) => cachedResolveTravelData(k, q, cache),
  );
  assert.equal(out.length, 2);
  assert.equal(out[0]?.status, "ok");
  assert.equal(c.n, 1, "duplicate requests in the batch coalesce onto one fetch");
});
