import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { assembleDestinationReadiness } from "../src/lib/intelligence/destination-readiness";
import { assembleTripReadiness } from "../src/lib/intelligence/trip-readiness";
import { createTravelDataCache } from "../src/lib/providers/travel-data/cache";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";
import "../src/lib/providers/travel-data/register";

const NOW = new Date("2026-07-15T03:00:00Z");

beforeEach(() => {
  resetCounters();
});

test("destination assembler with cache: second call hits cache for every kind", async () => {
  const cache = createTravelDataCache();
  await assembleDestinationReadiness({ destinationId: "kyoto", primaryPlaceId: "kyoto-kinkakuji", now: NOW, cache });
  await assembleDestinationReadiness({ destinationId: "kyoto", primaryPlaceId: "kyoto-kinkakuji", now: NOW, cache });
  const c = getCounters();
  // 3 misses then 3 hits across {safety-advisories, local-events, opening-hours}.
  assert.equal(c["travel_data_cache_miss{kind=safety-advisories}"], 1);
  assert.equal(c["travel_data_cache_miss{kind=local-events}"], 1);
  assert.equal(c["travel_data_cache_miss{kind=opening-hours}"], 1);
  assert.equal(c["travel_data_cache_hit{kind=safety-advisories}"], 1);
  assert.equal(c["travel_data_cache_hit{kind=local-events}"], 1);
  assert.equal(c["travel_data_cache_hit{kind=opening-hours}"], 1);
});

test("destination assembler without cache: no cache counters emitted", async () => {
  await assembleDestinationReadiness({ destinationId: "kyoto", now: NOW });
  await assembleDestinationReadiness({ destinationId: "kyoto", now: NOW });
  const c = getCounters();
  assert.equal(c["travel_data_cache_miss{kind=safety-advisories}"], undefined);
  assert.equal(c["travel_data_cache_hit{kind=safety-advisories}"], undefined);
});

test("trip assembler shares a cache: concurrent duplicates coalesce; cross-trip duplicates hit", async () => {
  const cache = createTravelDataCache();
  // Single trip with concurrent duplicate kyoto stops → first kyoto misses, second
  // coalesces onto the same in-flight; santorini misses independently.
  await assembleTripReadiness({
    stops: [{ destinationId: "kyoto" }, { destinationId: "kyoto" }, { destinationId: "santorini" }],
    now: NOW,
    cache,
  });
  let c = getCounters();
  assert.equal(c["travel_data_cache_miss{kind=safety-advisories}"], 2);
  assert.equal(c["travel_data_cache_coalesced{kind=safety-advisories}"], 1);
  assert.equal(c["travel_data_cache_hit{kind=safety-advisories}"], undefined);

  // A subsequent (sequential) trip over the same stops hits the populated cache.
  await assembleTripReadiness({ stops: [{ destinationId: "kyoto" }], now: NOW, cache });
  c = getCounters();
  assert.equal(c["travel_data_cache_hit{kind=safety-advisories}"], 1);
});
