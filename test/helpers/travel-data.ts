import assert from "node:assert/strict";
import {
  TRAVEL_DATA_KINDS,
  type TravelDataKind,
  type TravelDataProvider,
  type TravelDataResponse,
} from "../../src/lib/providers/travel-data/contracts";

/**
 * Reusable assertions for the travel-data provider contract. Import from any
 * travel-data test so new adapters get contract coverage for free.
 * (Lives under test/helpers so it is not auto-discovered as a test file.)
 */
const PROVIDER_CLASSES = ["seed", "mock", "live"];

export function assertTravelDataProviderShape(p: TravelDataProvider<unknown, unknown>): void {
  assert.equal(typeof p.id, "string");
  assert.ok(p.id.length > 0, "id must be non-empty");
  assert.equal(typeof p.name, "string");
  assert.ok(p.name.length > 0, "name must be non-empty");
  assert.ok(TRAVEL_DATA_KINDS.includes(p.kind as TravelDataKind), `unknown kind ${p.kind}`);
  assert.ok(PROVIDER_CLASSES.includes(p.sourceType), `bad sourceType ${p.sourceType}`);
  assert.equal(typeof p.isAvailable, "function");
  assert.equal(typeof p.fetch, "function");
}

/** Assert a response satisfies the fallback-safe shape for any status. */
export function assertResponseShape(res: TravelDataResponse<unknown>, kind: TravelDataKind): void {
  assert.equal(res.kind, kind);
  assert.equal(typeof res.providerId, "string");
  assert.ok(res.providerId.length > 0);
  assert.ok(["ok", "unavailable", "error"].includes(res.status));
  // `data` is always a present key (fallback-safe): payload when ok, else null.
  assert.ok("data" in res);
  if (res.status === "ok") {
    assert.notEqual(res.data, null);
  } else {
    assert.equal(res.data, null);
    assert.equal(typeof res.reason, "string");
    assert.ok(res.reason.length > 0, "non-ok responses must carry a reason");
  }
  // Source metadata is always present.
  assert.equal(typeof res.source, "object");
  assert.equal(typeof res.source.providerId, "string");
  assert.equal(typeof res.source.sourceType, "string");
  assert.ok(res.source.confidence >= 0 && res.source.confidence <= 1);
}
