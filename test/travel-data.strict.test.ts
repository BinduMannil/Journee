import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  registerTravelDataProvider,
  resetTravelDataRegistry,
  resolveTravelDataStrict,
} from "../src/lib/providers/travel-data/registry";
import {
  okResponse,
  errorResponse,
  type TravelDataProvider,
} from "../src/lib/providers/travel-data/contracts";
import {
  makeSourceMetadata,
  type ProviderSourceClass,
} from "../src/lib/providers/travel-data/source";
import { meetsQuality } from "../src/lib/providers/travel-data/freshness";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

type Q = { readonly id: string };
type D = { readonly v: number };

function provider(opts: {
  id: string;
  sourceType: ProviderSourceClass;
  confidence?: number;
  fetchedAt?: Date;
  ttlMs?: number;
  behavior?: "ok" | "error";
}): TravelDataProvider<Q, D> {
  const { id, sourceType, confidence = 0.5, fetchedAt, ttlMs, behavior = "ok" } = opts;
  const source = makeSourceMetadata({ sourceName: id, sourceType, providerId: id, confidence, fetchedAt, ttlMs });
  return {
    id,
    name: id,
    kind: "places",
    sourceType,
    isAvailable: () => true,
    async fetch() {
      if (behavior === "error") return errorResponse(id, "places", "broke", source);
      return okResponse<D>(id, "places", { v: 1 }, source);
    },
  };
}

beforeEach(() => {
  resetTravelDataRegistry();
  resetCounters();
});

test("meetsQuality: high meets medium; low does not meet medium", () => {
  assert.equal(meetsQuality("high", "medium"), true);
  assert.equal(meetsQuality("medium", "medium"), true);
  assert.equal(meetsQuality("low", "medium"), false);
  assert.equal(meetsQuality("none", "low"), false);
  assert.equal(meetsQuality("high", "low"), true);
});

test("strict: default minQuality 'low' lets seed (medium) through", async () => {
  registerTravelDataProvider(provider({ id: "seed-x", sourceType: "seed", confidence: 0.5 }));
  const res = await resolveTravelDataStrict<Q, D>("places", { id: "q" });
  assert.equal(res.status, "ok");
});

test("strict: minQuality 'high' downgrades a seed (medium) response to unavailable", async () => {
  registerTravelDataProvider(provider({ id: "seed-x", sourceType: "seed", confidence: 0.5 }));
  const res = await resolveTravelDataStrict<Q, D>("places", { id: "q" }, { minQuality: "high" });
  assert.equal(res.status, "unavailable");
  if (res.status === "unavailable") {
    assert.match(res.reason, /below required high/);
    // Provenance preserved on downgrade.
    assert.equal(res.source.providerId, "seed-x");
  }
  assert.equal(getCounters()["travel_data_strict_downgrade{kind=places,reason=below_min_quality}"], 1);
});

test("strict: minQuality 'high' allows fresh live high-confidence source", async () => {
  registerTravelDataProvider(provider({
    id: "live-x", sourceType: "live", confidence: 0.95,
    fetchedAt: new Date(), ttlMs: 60_000,
  }));
  const res = await resolveTravelDataStrict<Q, D>("places", { id: "q" }, { minQuality: "high" });
  assert.equal(res.status, "ok");
});

test("strict: dropStale downgrades an `ok` response whose source has expired", async () => {
  registerTravelDataProvider(provider({
    id: "live-x", sourceType: "live", confidence: 0.9,
    fetchedAt: new Date("2026-05-29T00:00:00Z"), ttlMs: 1_000,
  }));
  const now = new Date("2026-05-29T01:00:00Z"); // an hour past TTL
  const res = await resolveTravelDataStrict<Q, D>("places", { id: "q" }, { now, dropStale: true });
  assert.equal(res.status, "unavailable");
  if (res.status === "unavailable") assert.match(res.reason, /stale/);
  assert.equal(getCounters()["travel_data_strict_downgrade{kind=places,reason=stale}"], 1);
});

test("strict: non-ok responses pass through unchanged (no downgrade counter)", async () => {
  registerTravelDataProvider(provider({ id: "live-x", sourceType: "live", behavior: "error" }));
  const res = await resolveTravelDataStrict<Q, D>("places", { id: "q" });
  assert.equal(res.status, "error");
  assert.equal(getCounters()["travel_data_strict_downgrade{kind=places,reason=below_min_quality}"], undefined);
});
