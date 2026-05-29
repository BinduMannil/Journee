import { test } from "node:test";
import assert from "node:assert/strict";
import {
  activeEventCount,
  advisoryLevelToConfidence,
  advisoryToDisruptionContext,
  eventsToEventContext,
  isOpenNow,
  openingHoursToDestinationContext,
  responseQuality,
} from "../src/lib/intelligence/travel-data-context";
import { destinationEngine } from "../src/lib/intelligence/engines/destination";
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

function ok<T>(kind: TravelDataKind, data: T, fetchedAt: Date, ttlMs = 6 * 3600 * 1000): TravelDataResponse<T> {
  return okResponse<T>(
    "seed-x",
    kind,
    data,
    makeSourceMetadata({ sourceName: "Seed", sourceType: "seed", providerId: "seed-x", confidence: 0.5, fetchedAt, ttlMs }),
  );
}

function hoursAll(open: string, close: string): OpeningHours {
  return { placeId: "p", timezone: "Asia/Tokyo", weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: false, open, close })) };
}

const WED_NOON_JST = new Date("2026-07-01T03:00:00Z"); // 12:00 Wed in Tokyo
const WED_NIGHT_JST = new Date("2026-07-01T12:00:00Z"); // 21:00 Wed in Tokyo
const THU_NOON_JST = new Date("2026-07-02T03:00:00Z"); // 12:00 Thu in Tokyo

// ── isOpenNow ────────────────────────────────────────────────────────────────

test("isOpenNow: open within daytime hours, closed outside (timezone-aware)", () => {
  const hours = hoursAll("09:00", "17:00");
  assert.equal(isOpenNow(hours, WED_NOON_JST), true);
  assert.equal(isOpenNow(hours, WED_NIGHT_JST), false);
});

test("isOpenNow: respects per-day closure (Wednesday open, Thursday closed)", () => {
  const hours: OpeningHours = {
    placeId: "p",
    timezone: "Asia/Tokyo",
    weekly: Array.from({ length: 7 }, (_, day) => ({ day, closed: day !== 3, open: day === 3 ? "09:00" : undefined, close: day === 3 ? "17:00" : undefined })),
  };
  assert.equal(isOpenNow(hours, WED_NOON_JST), true);
  assert.equal(isOpenNow(hours, THU_NOON_JST), false);
});

test("isOpenNow: handles overnight spans (22:00–02:00)", () => {
  const hours = hoursAll("22:00", "02:00");
  assert.equal(isOpenNow(hours, WED_NIGHT_JST), false); // 21:00 — not yet open
  assert.equal(isOpenNow(hours, new Date("2026-07-01T14:00:00Z")), true); // 23:00 JST
  assert.equal(isOpenNow(hours, new Date("2026-07-01T16:00:00Z")), true); // 01:00 JST next day
});

// Regression: an overnight span belongs to the day it STARTS, so its
// early-morning tail must be attributed to the previous day's record — not to
// today's. Uniform schedules mask this; differing weekday schedules expose it.
test("isOpenNow: overnight tail uses the previous day's record (open Fri 22:00→02:00, Sat closed)", () => {
  const FRI = 5;
  const hours: OpeningHours = {
    placeId: "p",
    timezone: "Asia/Tokyo",
    weekly: Array.from({ length: 7 }, (_, day) => ({
      day,
      closed: day !== FRI,
      open: day === FRI ? "22:00" : undefined,
      close: day === FRI ? "02:00" : undefined,
    })),
  };
  // Sat 01:00 JST: Saturday's record is closed, but Friday's span still runs → OPEN.
  assert.equal(isOpenNow(hours, new Date("2026-07-03T16:00:00Z")), true);
  // Fri 01:00 JST: Friday's own span hasn't started and Thursday is closed → CLOSED.
  assert.equal(isOpenNow(hours, new Date("2026-07-02T16:00:00Z")), false);
  // Fri 23:00 JST: inside Friday's evening span → OPEN.
  assert.equal(isOpenNow(hours, new Date("2026-07-03T14:00:00Z")), true);
});

// ── advisory mapping ─────────────────────────────────────────────────────────

test("advisoryLevelToConfidence maps 1..4 and clamps", () => {
  assert.equal(advisoryLevelToConfidence(1), 1);
  assert.ok(Math.abs(advisoryLevelToConfidence(2) - 2 / 3) < 1e-9);
  assert.ok(Math.abs(advisoryLevelToConfidence(3) - 1 / 3) < 1e-9);
  assert.equal(advisoryLevelToConfidence(4), 0);
  assert.equal(advisoryLevelToConfidence(0), 1); // clamp low
  assert.equal(advisoryLevelToConfidence(9), 0); // clamp high
});

// ── activeEventCount ─────────────────────────────────────────────────────────

test("activeEventCount counts overlapping events; open-ended end is ongoing", () => {
  const now = new Date("2026-07-05T00:00:00Z");
  const events: LocalEvent[] = [
    { id: "a", destinationId: "d", name: "A", category: "festival", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-07-31T00:00:00Z" },
    { id: "b", destinationId: "d", name: "B", category: "music", startsAt: "2026-07-04T00:00:00Z" }, // ongoing
    { id: "c", destinationId: "d", name: "C", category: "culture", startsAt: "2026-08-01T00:00:00Z", endsAt: "2026-08-02T00:00:00Z" }, // future
  ];
  assert.equal(activeEventCount(events, now), 2);
});

// ── fragment builders: gating ────────────────────────────────────────────────

test("openingHoursToDestinationContext: ok→fragment, unavailable→empty", () => {
  const res = ok("opening-hours", hoursAll("09:00", "17:00"), WED_NOON_JST);
  assert.deepEqual(openingHoursToDestinationContext(res, { now: WED_NOON_JST }), { isOpenNow: true });

  const missing = unavailableResponse("seed-x", "opening-hours", "nope", unavailableSource("seed-x", "Seed"));
  assert.deepEqual(openingHoursToDestinationContext(missing, { now: WED_NOON_JST }), {});
});

test("openingHoursToDestinationContext: dropStale omits a stale source", () => {
  const stale = ok("opening-hours", hoursAll("09:00", "17:00"), new Date("2026-06-30T00:00:00Z")); // fetched long before now
  // Default: stale still surfaces (seed is labeled, callers may keep it).
  assert.deepEqual(openingHoursToDestinationContext(stale, { now: WED_NOON_JST }), { isOpenNow: true });
  // dropStale: omitted entirely.
  assert.deepEqual(openingHoursToDestinationContext(stale, { now: WED_NOON_JST, dropStale: true }), {});
});

test("advisoryToDisruptionContext: ok→advisoryConfidence, unavailable→empty", () => {
  const advisory: SafetyAdvisory = { destinationId: "d", level: 2, headline: "caution", updatedAt: "2026-05-01T00:00:00Z" };
  const res = ok("safety-advisories", advisory, WED_NOON_JST);
  const frag = advisoryToDisruptionContext(res, { now: WED_NOON_JST });
  assert.ok(frag.advisoryConfidence !== undefined && Math.abs(frag.advisoryConfidence - 2 / 3) < 1e-9);

  const missing = unavailableResponse("seed-x", "safety-advisories", "nope", unavailableSource("seed-x", "Seed"));
  assert.deepEqual(advisoryToDisruptionContext(missing, { now: WED_NOON_JST }), {});
});

test("eventsToEventContext: intensity from active count; empty→0; unavailable→empty", () => {
  const now = new Date("2026-07-05T00:00:00Z");
  const one: LocalEvent[] = [{ id: "a", destinationId: "d", name: "A", category: "festival", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-07-31T00:00:00Z" }];
  const frag = eventsToEventContext(ok("local-events", one as readonly LocalEvent[], now), { now });
  assert.ok(frag.festivalIntensity !== undefined && Math.abs(frag.festivalIntensity - 1 / 3) < 1e-9);

  const none = eventsToEventContext(ok("local-events", [] as readonly LocalEvent[], now), { now });
  assert.deepEqual(none, { festivalIntensity: 0 });

  const missing = unavailableResponse("seed-x", "local-events", "nope", unavailableSource("seed-x", "Seed"));
  assert.deepEqual(eventsToEventContext(missing, { now }), {});
});

// ── responseQuality + engine integration ─────────────────────────────────────

test("responseQuality: ok seed fresh → medium; unavailable → none", () => {
  const res = ok("reviews", { placeId: "p", averageRating: 4, reviewCount: 1 }, WED_NOON_JST);
  assert.equal(responseQuality(res, WED_NOON_JST), "medium");
  const missing = unavailableResponse("seed-x", "reviews", "nope", unavailableSource("seed-x", "Seed"));
  assert.equal(responseQuality(missing), "none");
});

test("bridge fragment feeds the destination engine and yields an open_now signal", () => {
  const res = ok("opening-hours", hoursAll("09:00", "17:00"), WED_NOON_JST);
  const fragment = openingHoursToDestinationContext(res, { now: WED_NOON_JST });
  const signals = destinationEngine.toSignals(fragment);
  const openNow = signals.find((s) => s.key === "open_now");
  assert.ok(openNow);
  assert.equal(openNow!.value, 1);
});

test("an unavailable source yields no signal (lower coverage confidence, not a fake value)", () => {
  const missing = unavailableResponse("seed-x", "opening-hours", "nope", unavailableSource("seed-x", "Seed"));
  const fragment = openingHoursToDestinationContext(missing, { now: WED_NOON_JST });
  assert.equal(destinationEngine.toSignals(fragment).length, 0);
});
