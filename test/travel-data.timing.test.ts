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
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata, type ProviderSourceClass } from "../src/lib/providers/travel-data/source";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

type Q = { readonly id: string };
type D = { readonly v: number };

function provider(opts: {
  id: string;
  sourceType: ProviderSourceClass;
  behavior?: "ok" | "error" | "throw";
}): TravelDataProvider<Q, D> {
  const { id, sourceType, behavior = "ok" } = opts;
  const source = makeSourceMetadata({ sourceName: id, sourceType, providerId: id, confidence: 0.5 });
  return {
    id,
    name: id,
    kind: "places",
    sourceType,
    isAvailable: () => true,
    async fetch() {
      if (behavior === "throw") throw new Error("boom");
      if (behavior === "error") return errorResponse(id, "places", "broke", source);
      return okResponse<D>(id, "places", { v: 1 }, source);
    },
  };
}

beforeEach(() => {
  resetTravelDataRegistry();
  resetCounters();
});

test("timing: ok outcome emits duration_ms_total counter", async () => {
  registerTravelDataProvider(provider({ id: "live-x", sourceType: "live" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  const key = "travel_data_resolve_duration_ms_total{kind=places,outcome=ok,providerId=live-x}";
  assert.ok(key in c, "expected duration counter to exist");
  assert.ok(c[key]! >= 0);
});

test("timing: error outcome emits duration counter under outcome=error", async () => {
  registerTravelDataProvider(provider({ id: "live-x", sourceType: "live", behavior: "error" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  const key = "travel_data_resolve_duration_ms_total{kind=places,outcome=error,providerId=live-x}";
  assert.ok(key in c);
});

test("timing: throw outcome emits duration counter under outcome=throw", async () => {
  registerTravelDataProvider(provider({ id: "live-x", sourceType: "live", behavior: "throw" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  const key = "travel_data_resolve_duration_ms_total{kind=places,outcome=throw,providerId=live-x}";
  assert.ok(key in c);
});

test("timing: duration counter accumulates across multiple calls", async () => {
  registerTravelDataProvider(provider({ id: "live-x", sourceType: "live" }));
  await resolveTravelData<Q, D>("places", { id: "q" });
  await resolveTravelData<Q, D>("places", { id: "q" });
  await resolveTravelData<Q, D>("places", { id: "q" });
  const c = getCounters();
  const successCount = c["travel_data_resolve_success{kind=places,providerId=live-x}"];
  assert.equal(successCount, 3);
  // Sum is accumulated; per-call avg = total / count.
  const total = c["travel_data_resolve_duration_ms_total{kind=places,outcome=ok,providerId=live-x}"];
  assert.ok(total !== undefined && total >= 0);
});
