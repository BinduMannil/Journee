import { test } from "node:test";
import assert from "node:assert/strict";

import {
  travelDataSchemas,
  travelDataQuerySchemasByKind,
  placesQuerySchema,
  localEventsQuerySchema,
  placesResponseSchema,
  openingHoursResponseSchema,
  ticketPriceResponseSchema,
  ticketLinkResponseSchema,
  reviewsResponseSchema,
  localEventsResponseSchema,
  safetyAdvisoryResponseSchema,
} from "../src/lib/providers/travel-data/schemas";
import {
  travelDataJsonSchema,
  travelDataJsonSchemas,
  travelDataSchemaNames,
} from "../src/lib/providers/travel-data/json-schema";
import { TRAVEL_DATA_KINDS } from "../src/lib/providers/travel-data/contracts";
import {
  seedLocalEventsProvider,
  seedOpeningHoursProvider,
  seedPlacesProvider,
  seedReviewsProvider,
  seedSafetyAdvisoryProvider,
  seedTicketLinkProvider,
  seedTicketPriceProvider,
} from "../src/lib/providers/travel-data/seed";

// ── Schemas validate real seed-fed contract data ─────────────────────────────

test("response schemas accept the actual seed provider responses", async () => {
  placesResponseSchema.parse(await seedPlacesProvider.fetch({ destinationId: "kyoto" }));
  openingHoursResponseSchema.parse(
    await seedOpeningHoursProvider.fetch({ placeId: "kyoto-kinkakuji" }),
  );
  ticketPriceResponseSchema.parse(
    await seedTicketPriceProvider.fetch({ placeId: "kyoto-kinkakuji" }),
  );
  ticketLinkResponseSchema.parse(await seedTicketLinkProvider.fetch({ placeId: "kyoto-kinkakuji" }));
  reviewsResponseSchema.parse(await seedReviewsProvider.fetch({ placeId: "santorini-oia" }));
  localEventsResponseSchema.parse(await seedLocalEventsProvider.fetch({ destinationId: "kyoto" }));
  safetyAdvisoryResponseSchema.parse(
    await seedSafetyAdvisoryProvider.fetch({ destinationId: "marrakech" }),
  );
});

test("response schema accepts unavailable responses (fallback-safe null data)", async () => {
  const res = await seedPlacesProvider.fetch({ destinationId: "atlantis" });
  assert.equal(res.status, "unavailable");
  const parsed = placesResponseSchema.parse(res);
  assert.equal(parsed.data, null);
});

// ── Query validation ─────────────────────────────────────────────────────────

test("query schemas accept valid input and reject malformed input", () => {
  assert.deepEqual(placesQuerySchema.parse({ destinationId: "kyoto", limit: 3 }), {
    destinationId: "kyoto",
    limit: 3,
  });
  // Empty destinationId is rejected.
  assert.equal(placesQuerySchema.safeParse({ destinationId: "" }).success, false);
  // Non-positive / non-integer limit is rejected.
  assert.equal(placesQuerySchema.safeParse({ destinationId: "kyoto", limit: 0 }).success, false);
  assert.equal(placesQuerySchema.safeParse({ destinationId: "kyoto", limit: 1.5 }).success, false);
  // Optional window fields are allowed to be absent.
  assert.equal(localEventsQuerySchema.safeParse({ destinationId: "kyoto" }).success, true);
});

test("every travel-data kind has a query schema", () => {
  for (const kind of TRAVEL_DATA_KINDS) {
    assert.ok(
      kind in travelDataQuerySchemasByKind,
      `missing query schema for kind ${kind}`,
    );
  }
  assert.equal(Object.keys(travelDataQuerySchemasByKind).length, TRAVEL_DATA_KINDS.length);
});

// ── JSON Schema export ───────────────────────────────────────────────────────

test("JSON Schema export covers every named contract schema", () => {
  const names = travelDataSchemaNames();
  assert.equal(names.length, Object.keys(travelDataSchemas).length);
  const all = travelDataJsonSchemas();
  for (const name of names) {
    const doc = all[name];
    assert.equal(typeof doc, "object");
    assert.equal(doc.type, "object");
    assert.ok(doc.properties && typeof doc.properties === "object");
  }
});

test("exported JSON Schema reflects field constraints honestly", () => {
  const place = travelDataJsonSchema("Place");
  // Required vs optional from the contract is preserved.
  assert.deepEqual(
    [...(place.required ?? [])].sort(),
    ["category", "destinationId", "id", "name"].sort(),
  );
  assert.ok(place.properties?.summary, "optional summary still described");

  const advisory = travelDataJsonSchema("SafetyAdvisory");
  // AdvisoryLevel is the 1..4 union — exported as an enum/anyOf of those values.
  const levelJson = JSON.stringify(advisory.properties?.level);
  for (const n of [1, 2, 3, 4]) assert.match(levelJson, new RegExp(`\\b${n}\\b`));

  const review = travelDataJsonSchema("ReviewSummary");
  const ratingJson = JSON.stringify(review.properties?.averageRating);
  assert.match(ratingJson, /5/); // max bound surfaced
});

test("draft-7 target is selectable and changes the dialect marker", () => {
  const d2020 = travelDataJsonSchema("PlacesQuery");
  const d7 = travelDataJsonSchema("PlacesQuery", { target: "draft-7" });
  assert.match(JSON.stringify(d2020.$schema), /2020-12/);
  assert.match(JSON.stringify(d7.$schema), /draft-07/);
});

test("exported JSON Schemas are JSON-serializable (no cycles, no functions)", () => {
  const all = travelDataJsonSchemas();
  assert.doesNotThrow(() => JSON.stringify(all));
});
