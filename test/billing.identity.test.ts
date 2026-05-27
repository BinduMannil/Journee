import { test } from "node:test";
import assert from "node:assert/strict";
import { getClientIp } from "../src/lib/billing/identity";

function h(headers: Record<string, string>): Headers {
  return new Headers(headers);
}

test("uses the first x-forwarded-for hop", () => {
  assert.equal(getClientIp(h({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" })), "203.0.113.7");
});

test("falls back to x-real-ip", () => {
  assert.equal(getClientIp(h({ "x-real-ip": "198.51.100.9" })), "198.51.100.9");
});

test("returns 'unknown' when no forwarding header is present", () => {
  assert.equal(getClientIp(h({})), "unknown");
});
