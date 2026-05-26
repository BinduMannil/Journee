import { test } from "node:test";
import assert from "node:assert/strict";
import { formatLog } from "../src/lib/observability/logger";

test("formatLog includes level, msg, and an ISO timestamp", () => {
  const r = formatLog("info", "hello");
  assert.equal(r.level, "info");
  assert.equal(r.msg, "hello");
  assert.ok(!Number.isNaN(Date.parse(r.time)));
  assert.equal(r.fields, undefined);
});

test("formatLog attaches non-empty fields", () => {
  const r = formatLog("warn", "x", { a: 1, b: "two" });
  assert.deepEqual(r.fields, { a: 1, b: "two" });
});

test("formatLog omits an empty fields object", () => {
  const r = formatLog("debug", "x", {});
  assert.equal(r.fields, undefined);
});
