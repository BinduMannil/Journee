import { test } from "node:test";
import assert from "node:assert/strict";
import {
  seedLocalEventsProvider,
  seedOpeningHoursProvider,
  seedPlacesProvider,
  seedReviewsProvider,
  seedSafetyAdvisoryProvider,
  seedTicketLinkProvider,
  seedTicketPriceProvider,
  seedTravelDataProviders,
} from "../src/lib/providers/travel-data/seed";
import {
  assertResponseShape,
  assertTravelDataProviderShape,
} from "./helpers/travel-data";

test("every seed provider satisfies the travel-data provider contract", async () => {
  for (const p of seedTravelDataProviders) {
    assertTravelDataProviderShape(p);
    assert.equal(p.sourceType, "seed");
    assert.equal(typeof (await p.isAvailable()), "boolean");
    assert.equal(await p.isAvailable(), true); // seed is the always-on fallback
  }
});

test("seed provider ids and kinds are unique", () => {
  const ids = seedTravelDataProviders.map((p) => p.id);
  const kinds = seedTravelDataProviders.map((p) => p.kind);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(kinds).size, kinds.length);
});

test("places: ok for a known destination, respects limit, labels source as seed", async () => {
  const res = await seedPlacesProvider.fetch({ destinationId: "kyoto" });
  assertResponseShape(res, "places");
  assert.equal(res.status, "ok");
  if (res.status !== "ok") return;
  assert.ok(res.data.length >= 3);
  assert.equal(res.data[0]?.destinationId, "kyoto");
  assert.equal(res.source.sourceType, "seed");
  assert.equal(res.source.confidence, 0.5);

  const limited = await seedPlacesProvider.fetch({ destinationId: "kyoto", limit: 1 });
  assert.equal(limited.status, "ok");
  if (limited.status === "ok") assert.equal(limited.data.length, 1);
});

test("places: unavailable for an unknown destination with a clear reason", async () => {
  const res = await seedPlacesProvider.fetch({ destinationId: "atlantis" });
  assertResponseShape(res, "places");
  assert.equal(res.status, "unavailable");
  if (res.status === "unavailable") {
    assert.match(res.reason, /atlantis/);
    assert.equal(res.data, null);
  }
});

test("opening hours: ok shape has 7 weekly entries", async () => {
  const res = await seedOpeningHoursProvider.fetch({ placeId: "kyoto-kinkakuji" });
  assertResponseShape(res, "opening-hours");
  assert.equal(res.status, "ok");
  if (res.status === "ok") {
    assert.equal(res.data.weekly.length, 7);
    assert.equal(res.data.timezone, "Asia/Tokyo");
  }
});

test("ticket prices: free attraction has zero price; paid has an adult amount", async () => {
  const free = await seedTicketPriceProvider.fetch({ placeId: "kyoto-fushimi-inari" });
  const paid = await seedTicketPriceProvider.fetch({ placeId: "kyoto-kinkakuji" });
  assert.equal(free.status, "ok");
  assert.equal(paid.status, "ok");
  if (free.status === "ok") {
    assert.equal(free.data.free, true);
    assert.equal(free.data.adult, 0);
  }
  if (paid.status === "ok") {
    assert.equal(paid.data.free, false);
    assert.ok(paid.data.adult > 0);
  }
});

test("ticket links: ok returns safe https placeholder links; unavailable when none", async () => {
  const res = await seedTicketLinkProvider.fetch({ placeId: "kyoto-kinkakuji" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") {
    assert.ok(res.data.length > 0);
    for (const link of res.data) assert.match(link.url, /^https:\/\//);
  }
  const none = await seedTicketLinkProvider.fetch({ placeId: "kyoto-fushimi-inari" });
  assert.equal(none.status, "unavailable");
});

test("reviews: ok summary has rating in 0..5 and a count", async () => {
  const res = await seedReviewsProvider.fetch({ placeId: "santorini-oia" });
  assertResponseShape(res, "reviews");
  assert.equal(res.status, "ok");
  if (res.status === "ok") {
    assert.ok(res.data.averageRating >= 0 && res.data.averageRating <= 5);
    assert.ok(res.data.reviewCount > 0);
  }
});

test("local events: ok (possibly empty) for known dest; window filters; unavailable for unknown", async () => {
  const res = await seedLocalEventsProvider.fetch({ destinationId: "kyoto" });
  assert.equal(res.status, "ok");
  if (res.status === "ok") assert.ok(res.data.length >= 1);

  // Empty result is still `ok` (we have data, it's just empty in the window).
  const empty = await seedLocalEventsProvider.fetch({ destinationId: "patagonia" });
  assert.equal(empty.status, "ok");
  if (empty.status === "ok") assert.equal(empty.data.length, 0);

  const windowed = await seedLocalEventsProvider.fetch({
    destinationId: "kyoto",
    from: "2030-01-01T00:00:00Z",
  });
  assert.equal(windowed.status, "ok");
  if (windowed.status === "ok") assert.equal(windowed.data.length, 0);

  const unknown = await seedLocalEventsProvider.fetch({ destinationId: "atlantis" });
  assert.equal(unknown.status, "unavailable");
});

test("safety advisories: ok returns a 1..4 level", async () => {
  const res = await seedSafetyAdvisoryProvider.fetch({ destinationId: "marrakech" });
  assertResponseShape(res, "safety-advisories");
  assert.equal(res.status, "ok");
  if (res.status === "ok") {
    assert.ok(res.data.level >= 1 && res.data.level <= 4);
    assert.ok(res.data.headline.length > 0);
  }
});

test("seed responses are deterministic in payload across calls", async () => {
  const a = await seedPlacesProvider.fetch({ destinationId: "kyoto" });
  const b = await seedPlacesProvider.fetch({ destinationId: "kyoto" });
  assert.equal(a.status, "ok");
  assert.equal(b.status, "ok");
  if (a.status === "ok" && b.status === "ok") {
    assert.deepEqual(a.data, b.data);
  }
});

test("seed responses carry a fresh source window (fetchedAt < expiresAt)", async () => {
  const res = await seedReviewsProvider.fetch({ placeId: "santorini-oia" });
  assert.ok(res.source.fetchedAt);
  assert.ok(res.source.expiresAt);
  assert.ok(new Date(res.source.fetchedAt!).getTime() < new Date(res.source.expiresAt!).getTime());
});
