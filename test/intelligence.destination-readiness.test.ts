import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assembleDestinationReadiness,
  composeDestinationReadiness,
} from "../src/lib/intelligence/destination-readiness";
// Side effect: register the seed travel-data adapters so resolution works.
import "../src/lib/providers/travel-data/register";
import {
  okResponse,
  unavailableResponse,
  type LocalEvent,
  type OpeningHours,
  type SafetyAdvisory,
  type TravelDataKind,
  type TravelDataResponse,
} from "../src/lib/providers/travel-data/contracts";
import { makeSourceMetadata, unavailableSource } from "../src/lib/providers/travel-data/source";

const NOW = new Date("2026-07-15T03:00:00Z"); // mid-July; inside seed event windows

function ok<T>(kind: TravelDataKind, data: T, fetchedAt: Date = NOW, ttlMs = 6 * 3600 * 1000): TravelDataResponse<T> {
  return okResponse<T>(
    "seed-x",
    kind,
    data,
    makeSourceMetadata({ sourceName: "Seed", sourceType: "seed", providerId: "seed-x", confidence: 0.5, fetchedAt, ttlMs }),
  );
}

function gone(kind: TravelDataKind): TravelDataResponse<never> {
  return unavailableResponse("seed-x", kind, "nope", unavailableSource("seed-x", "Seed")) as TravelDataResponse<never>;
}

const advisoryL1: SafetyAdvisory = { destinationId: "d", level: 1, headline: "normal", updatedAt: "2026-05-01T00:00:00Z" };
const advisoryL4: SafetyAdvisory = { destinationId: "d", level: 4, headline: "do not travel", updatedAt: "2026-05-01T00:00:00Z" };
const hours: OpeningHours = { placeId: "p", timezone: "Asia/Tokyo", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open: "09:00", close: "17:00" })) };
const oneEvent: readonly LocalEvent[] = [
  { id: "e", destinationId: "d", name: "Fest", category: "festival", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-07-31T00:00:00Z" },
];

test("composeDestinationReadiness: all sources ok → three parts, provenance recorded", () => {
  const r = composeDestinationReadiness(
    "d",
    { openingHours: ok("opening-hours", hours), advisory: ok("safety-advisories", advisoryL1), events: ok("local-events", oneEvent) },
    NOW,
  );
  const keys = r.parts.map((p) => p.key).sort();
  assert.deepEqual(keys, ["destination", "disruption", "events"]);
  assert.ok(r.overall.score >= 0 && r.overall.score <= 100);
  assert.ok(r.overall.confidence > 0);
  assert.equal(r.sources.length, 3);
  for (const s of r.sources) {
    assert.equal(s.contributed, true);
    assert.equal(s.sourceType, "seed");
  }
});

test("composeDestinationReadiness: unavailable source contributes no part but is recorded", () => {
  const all = composeDestinationReadiness(
    "d",
    { openingHours: ok("opening-hours", hours), advisory: ok("safety-advisories", advisoryL1), events: ok("local-events", oneEvent) },
    NOW,
  );
  const missingAdvisory = composeDestinationReadiness(
    "d",
    { openingHours: ok("opening-hours", hours), advisory: gone("safety-advisories"), events: ok("local-events", oneEvent) },
    NOW,
  );
  // Fewer sub-engine parts back the aggregate when a source is unavailable.
  assert.equal(all.parts.length, 3);
  assert.equal(missingAdvisory.parts.length, 2);
  assert.ok(!missingAdvisory.parts.some((p) => p.key === "disruption"));
  // Provenance still records the unavailable source, marked non-contributing.
  const adv = missingAdvisory.sources.find((s) => s.kind === "safety-advisories");
  assert.ok(adv);
  assert.equal(adv!.status, "unavailable");
  assert.equal(adv!.contributed, false);
  assert.equal(adv!.quality, "none");
});

test("composeDestinationReadiness: a safer advisory yields a higher aggregate than a severe one", () => {
  const safe = composeDestinationReadiness("d", { advisory: ok("safety-advisories", advisoryL1) }, NOW);
  const danger = composeDestinationReadiness("d", { advisory: ok("safety-advisories", advisoryL4) }, NOW);
  assert.ok(safe.overall.score > danger.overall.score);
});

test("composeDestinationReadiness: no sources → empty aggregate, zero confidence, no throw", () => {
  const r = composeDestinationReadiness("d", {}, NOW);
  assert.equal(r.parts.length, 0);
  assert.equal(r.overall.confidence, 0);
  assert.equal(r.sources.length, 0);
});

test("assembleDestinationReadiness resolves seed data end-to-end for a seed destination", async () => {
  const r = await assembleDestinationReadiness({ destinationId: "kyoto", primaryPlaceId: "kyoto-kinkakuji", now: NOW });
  assert.equal(r.destinationId, "kyoto");
  // Seed has advisory + events + opening hours for kyoto → all three contribute.
  const keys = r.parts.map((p) => p.key).sort();
  assert.deepEqual(keys, ["destination", "disruption", "events"]);
  // Kyoto's Gion Matsuri (July) is active at NOW → events sub-score reflects it.
  const events = r.parts.find((p) => p.key === "events");
  assert.ok(events && events.result.score >= 0);
  // Every contributing source is seed-labeled (honest provenance).
  for (const s of r.sources) {
    if (s.contributed) assert.equal(s.sourceType, "seed");
  }
});

test("assembleDestinationReadiness: unknown destination → unavailable sources, no parts", async () => {
  const r = await assembleDestinationReadiness({ destinationId: "atlantis", primaryPlaceId: "nowhere", now: NOW });
  assert.equal(r.parts.length, 0);
  assert.equal(r.overall.confidence, 0);
  for (const s of r.sources) {
    assert.equal(s.status, "unavailable");
    assert.equal(s.contributed, false);
  }
});

test("assembleDestinationReadiness: omitting primaryPlaceId skips the opening-hours source", async () => {
  const r = await assembleDestinationReadiness({ destinationId: "kyoto", now: NOW });
  assert.ok(!r.sources.some((s) => s.kind === "opening-hours"));
  assert.ok(!r.parts.some((p) => p.key === "destination"));
});
