import { test } from "node:test";
import assert from "node:assert/strict";
import { itineraryToICS } from "../src/lib/intelligence/itinerary-export";
import type { Itinerary } from "../src/lib/intelligence/itinerary";

const itinerary: Itinerary = {
  pacing: "balanced",
  budget: 1.8,
  days: [
    { items: [{ id: "a", title: "Kyoto, Japan", intensity: 0.5 }], load: 0.5 },
    { items: [{ id: "b", title: "Santorini", intensity: 0.5 }], load: 0.5 },
  ],
};

const opts = { startDate: new Date("2026-06-01T00:00:00Z") };

test("wraps events in a VCALENDAR with one VEVENT per day", () => {
  const ics = itineraryToICS(itinerary, opts);
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
  assert.ok(ics.trimEnd().endsWith("END:VCALENDAR"));
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 2);
  assert.equal((ics.match(/END:VEVENT/g) ?? []).length, 2);
});

test("all-day dates advance by one day per itinerary day", () => {
  const ics = itineraryToICS(itinerary, opts);
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20260601"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20260602"));
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20260602"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20260603"));
});

test("escapes commas in titles per RFC 5545 and uses CRLF", () => {
  const ics = itineraryToICS(itinerary, opts);
  assert.ok(ics.includes("SUMMARY:Day 1: Kyoto\\, Japan"));
  assert.ok(ics.includes("\r\n"));
});

test("empty itinerary still produces a valid (event-less) calendar", () => {
  const ics = itineraryToICS({ pacing: "relaxed", budget: 1, days: [] }, opts);
  assert.ok(ics.includes("BEGIN:VCALENDAR"));
  assert.ok(ics.includes("END:VCALENDAR"));
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 0);
});
