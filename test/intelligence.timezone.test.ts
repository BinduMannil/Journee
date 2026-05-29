import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTimezoneProfile,
  businessHoursFor,
  currentTimeAt,
  TIMEZONE_DATA_NOTE,
} from "../src/lib/intelligence/timezone";
import { timezoneProfiles } from "../src/content/timezone";

const HOURS_CATEGORIES = ["shops", "restaurants", "banks", "government", "markets"];

test("getTimezoneProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getTimezoneProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getTimezoneProfile("atlantis"), null);
});

test("every profile has a valid IANA zone, offset, weekend and well-formed hours", () => {
  assert.ok(timezoneProfiles.length > 0);
  for (const p of timezoneProfiles) {
    assert.doesNotThrow(
      () => new Intl.DateTimeFormat("en-US", { timeZone: p.ianaTimeZone }),
      `${p.destinationId} ianaTimeZone ${p.ianaTimeZone}`,
    );
    assert.match(p.utcOffsetLabel, /^UTC[+-]/, `${p.destinationId} utcOffsetLabel`);
    assert.ok(p.weekendDays.length >= 1, `${p.destinationId} weekendDays`);
    assert.ok(p.hours.length >= 1, `${p.destinationId} hours`);
    for (const h of p.hours) {
      assert.ok(HOURS_CATEGORIES.includes(h.category), `${p.destinationId} category ${h.category}`);
      assert.ok(h.typical && h.typical.length > 0, `${p.destinationId} ${h.category} typical`);
    }
  }
});

test("TIMEZONE_DATA_NOTE carries a clear, non-guaranteed disclaimer", () => {
  assert.match(TIMEZONE_DATA_NOTE, /vary|verify|change/i);
  assert.match(TIMEZONE_DATA_NOTE, /hour/i);
});

test("businessHoursFor returns hours for a known category; null otherwise", () => {
  const banks = businessHoursFor("kyoto", "banks");
  assert.equal(banks?.category, "banks");
  assert.ok(banks && banks.typical.length > 0);
  assert.equal(businessHoursFor("atlantis", "shops"), null);
});

test("currentTimeAt returns local HH:mm for a known destination; null otherwise", () => {
  // Tokyo is UTC+9 (no DST): 2026-01-01T00:00:00Z is 09:00 local.
  assert.equal(currentTimeAt("kyoto", new Date("2026-01-01T00:00:00Z")), "09:00");
  assert.equal(currentTimeAt("atlantis", new Date("2026-01-01T00:00:00Z")), null);
});
