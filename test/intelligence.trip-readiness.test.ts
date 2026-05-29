import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assembleTripReadiness,
  composeTripReadiness,
  composeTripReadinessFromSources,
  tripReadinessWeights,
  type ResolvedTripStop,
} from "../src/lib/intelligence/trip-readiness";
import { composeDestinationReadiness } from "../src/lib/intelligence/destination-readiness";
// Side effect: register seed travel-data adapters.
import "../src/lib/providers/travel-data/register";
import {
  okResponse,
  unavailableResponse,
  type LocalEvent,
  type SafetyAdvisory,
  type TravelDataKind,
  type TravelDataResponse,
} from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata, unavailableSource } from "../src/lib/providers/travel-data/source";

const NOW = new Date("2026-07-15T03:00:00Z");

function ok<T>(kind: TravelDataKind, data: T): TravelDataResponse<T> {
  return okResponse<T>(
    "seed-x",
    kind,
    data,
    makeSourceMetadata({ sourceName: "Seed", sourceType: "seed", providerId: "seed-x", confidence: 0.5, fetchedAt: NOW, ttlMs: 6 * 3600 * 1000 }),
  );
}
function gone(kind: TravelDataKind): TravelDataResponse<never> {
  return unavailableResponse("seed-x", kind, "nope", unavailableSource("seed-x", "Seed")) as TravelDataResponse<never>;
}

const advisoryL1: SafetyAdvisory = { destinationId: "d", level: 1, headline: "normal", updatedAt: "2026-05-01T00:00:00Z" };
const advisoryL4: SafetyAdvisory = { destinationId: "d", level: 4, headline: "do not travel", updatedAt: "2026-05-01T00:00:00Z" };
const events: readonly LocalEvent[] = [
  { id: "e", destinationId: "d", name: "Fest", category: "festival", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-07-31T00:00:00Z" },
];

function stop(destinationId: string, advisory: SafetyAdvisory | "missing"): ResolvedTripStop {
  return {
    destinationId,
    readiness: composeDestinationReadiness(
      destinationId,
      {
        advisory: advisory === "missing" ? gone("safety-advisories") : ok("safety-advisories", advisory),
        events: ok("local-events", events),
      },
      NOW,
    ),
  };
}

test("composeTripReadiness: empty trip → zero-confidence empty aggregate (no throw)", () => {
  const r = composeTripReadiness([]);
  assert.equal(r.stops.length, 0);
  assert.equal(r.overall.confidence, 0);
  assert.equal(r.bestStop, undefined);
  assert.equal(r.worstStop, undefined);
  assert.equal(r.sources.length, 0);
});

test("composeTripReadiness: roll-up score is the equal-weighted mean of per-stop scores", () => {
  const stops = [stop("a", advisoryL1), stop("b", advisoryL4)];
  const trip = composeTripReadiness(stops);
  const a = stops[0]!.readiness.overall.score;
  const b = stops[1]!.readiness.overall.score;
  // Bounded by per-stop scores and within ±1 of their mean (rounding tolerance).
  assert.ok(trip.overall.score >= Math.min(a, b) && trip.overall.score <= Math.max(a, b));
  assert.ok(Math.abs(trip.overall.score - (a + b) / 2) <= 1);
  assert.equal(trip.overall.weightsVersion, tripReadinessWeights.version);
});

test("composeTripReadiness: confidence is the mean of per-stop confidences", () => {
  const stops = [stop("a", advisoryL1), stop("b", advisoryL4)];
  const trip = composeTripReadiness(stops);
  const expected = (stops[0]!.readiness.overall.confidence + stops[1]!.readiness.overall.confidence) / 2;
  assert.ok(Math.abs(trip.overall.confidence - expected) < 1e-9);
});

test("composeTripReadiness: best/worst stops reflect per-stop overall scores", () => {
  const safe = stop("safe", advisoryL1);
  const danger = stop("danger", advisoryL4);
  const trip = composeTripReadiness([danger, safe]);
  assert.equal(trip.bestStop?.destinationId, "safe");
  assert.equal(trip.worstStop?.destinationId, "danger");
  assert.ok((trip.bestStop?.score ?? 0) >= (trip.worstStop?.score ?? 0));
});

test("composeTripReadiness: provenance is flattened and tagged with destinationId", () => {
  const stops = [stop("a", advisoryL1), stop("b", "missing")];
  const trip = composeTripReadiness(stops);
  assert.ok(trip.sources.length >= 4); // 2 sources per stop × 2 stops
  for (const s of trip.sources) {
    assert.ok(["a", "b"].includes(s.destinationId));
  }
  // The unavailable advisory from stop b is recorded as non-contributing.
  const bAdv = trip.sources.find((s) => s.destinationId === "b" && s.kind === "safety-advisories");
  assert.ok(bAdv);
  assert.equal(bAdv!.contributed, false);
  assert.equal(bAdv!.status, "unavailable");
});

test("composeTripReadinessFromSources: composes per-stop readiness from raw responses", () => {
  const trip = composeTripReadinessFromSources(
    [{ destinationId: "a" }, { destinationId: "b" }],
    {
      a: { advisory: ok("safety-advisories", advisoryL1), events: ok("local-events", events) },
      b: { advisory: ok("safety-advisories", advisoryL4), events: ok("local-events", events) },
    },
    NOW,
  );
  assert.equal(trip.stops.length, 2);
  assert.ok(trip.overall.score > 0);
});

test("assembleTripReadiness: resolves seed data end-to-end for multiple destinations", async () => {
  const trip = await assembleTripReadiness({
    stops: [
      { destinationId: "kyoto", primaryPlaceId: "kyoto-kinkakuji" },
      { destinationId: "santorini", primaryPlaceId: "santorini-oia" },
    ],
    now: NOW,
  });
  assert.equal(trip.stops.length, 2);
  for (const s of trip.stops) {
    assert.ok(s.readiness.parts.length > 0, `expected parts for ${s.destinationId}`);
  }
  // Every contributing source is seed-labeled.
  for (const src of trip.sources) {
    if (src.contributed) assert.equal(src.sourceType, "seed");
  }
});

test("assembleTripReadiness: unknown destinations resolve unavailable but the trip still rolls up cleanly", async () => {
  const trip = await assembleTripReadiness({
    stops: [{ destinationId: "atlantis" }, { destinationId: "elsewhere" }],
    now: NOW,
  });
  assert.equal(trip.stops.length, 2);
  for (const s of trip.stops) {
    assert.equal(s.readiness.parts.length, 0);
  }
  assert.equal(trip.overall.confidence, 0);
});
