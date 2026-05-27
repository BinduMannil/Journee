import { test } from "node:test";
import assert from "node:assert/strict";
import {
  incrementCounter,
  getCounters,
  resetCounters,
} from "../src/lib/observability/metrics";

test("counts increments and encodes labels in a stable key", () => {
  resetCounters();
  incrementCounter("hits");
  incrementCounter("hits");
  incrementCounter("resolve", { capability: "destinations", providerId: "seed" });
  const c = getCounters();
  assert.equal(c["hits"], 2);
  assert.equal(c["resolve{capability=destinations,providerId=seed}"], 1);
});

test("label key is order-independent", () => {
  resetCounters();
  incrementCounter("x", { a: "1", b: "2" });
  incrementCounter("x", { b: "2", a: "1" });
  assert.equal(getCounters()["x{a=1,b=2}"], 2);
});

test("supports a custom increment amount", () => {
  resetCounters();
  incrementCounter("bytes", undefined, 512);
  assert.equal(getCounters()["bytes"], 512);
});

test("resetCounters clears state", () => {
  incrementCounter("temp");
  resetCounters();
  assert.deepEqual(getCounters(), {});
});
