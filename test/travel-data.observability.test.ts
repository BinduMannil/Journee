import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  registerTravelDataProvider,
  resetTravelDataRegistry,
  resolveTravelData,
} from "../src/lib/providers/travel-data/registry";
import {
  errorResponse,
  okResponse,
  unavailableResponse,
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import type { ProviderSourceClass } from "../src/lib/providers/travel-data/source";
import { makeSourceMetadata } from "../src/lib/providers/travel-data/source";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

type Q = { readonly id: string };
type D = { readonly v: number };

function fake(opts: {
  id: string;
  sourceType: ProviderSourceClass;
  available?: boolean;
  behavior?: "ok" | "unavailable" | "error" | "throw";
}): TravelDataProvider<Q, D> {
  const { id, sourceType, available = true, behavior = "ok" } = opts;
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
      return okResponse<D>(id, "places", { v: 0 }, source);
    },
  };
}

beforeEach(() => {
  resetTravelDataRegistry();
  resetCounters();
});

test("counts success on the chosen provider, with kind+providerId labels", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  assert.equal(c["travel_data_resolve_success{kind=places,providerId=live-x}"], 1);
});

test("counts isAvailable=false as provider_unavailable, then success on the next provider", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", available: false }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  assert.equal(c["travel_data_provider_unavailable{kind=places,providerId=live-x}"], 1);
  assert.equal(c["travel_data_resolve_success{kind=places,providerId=seed-x}"], 1);
});

test("non-ok response increments the right counter and continues to fallback", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "unavailable" }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  assert.equal(c["travel_data_resolve_unavailable{kind=places,providerId=live-x}"], 1);
  assert.equal(c["travel_data_resolve_success{kind=places,providerId=seed-x}"], 1);
});

test("error response counts under resolve_error", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "error" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  assert.equal(c["travel_data_resolve_error{kind=places,providerId=live-x}"], 1);
  assert.equal(c["travel_data_kind_exhausted{kind=places}"], 1);
});

test("a thrown provider counts under provider_throw and does not crash", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live", behavior: "throw" }));
  registerTravelDataProvider(fake({ id: "seed-x", sourceType: "seed" }));
  const res = await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
  const c = getCounters();
  assert.equal(c["travel_data_provider_throw{kind=places,providerId=live-x}"], 1);
  assert.equal(c["travel_data_resolve_success{kind=places,providerId=seed-x}"], 1);
});

test("no provider registered for a kind counts under kind_no_provider (and no exhausted)", async () => {
  const res = await resolveTravelData<Q, D>("reviews", { id: "q" });
  assert.equal(res.status, "unavailable");
  const c = getCounters();
  assert.equal(c["travel_data_kind_no_provider{kind=reviews}"], 1);
  assert.equal(c["travel_data_kind_exhausted{kind=reviews}"], undefined);
});

test("all providers non-ok counts kind_exhausted exactly once", async () => {
  registerTravelDataProvider(fake({ id: "a", sourceType: "live", behavior: "unavailable" }));
  registerTravelDataProvider(fake({ id: "b", sourceType: "seed", behavior: "error" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  assert.equal(c["travel_data_kind_exhausted{kind=places}"], 1);
  assert.equal(c["travel_data_resolve_unavailable{kind=places,providerId=a}"], 1);
  assert.equal(c["travel_data_resolve_error{kind=places,providerId=b}"], 1);
});

test("counters accumulate across calls", async () => {
  registerTravelDataProvider(fake({ id: "live-x", sourceType: "live" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  await resolveTravelData<Q, D>("places", { id: "q" });
  await resolveTravelData<Q, D>("places", { id: "q" });
  assert.equal(getCounters()["travel_data_resolve_success{kind=places,providerId=live-x}"], 3);
});
