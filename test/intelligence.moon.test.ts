import { test } from "node:test";
import assert from "node:assert/strict";
import { moonPhase } from "../src/lib/intelligence/moon";

const SYNODIC = 29.530588853;
const EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);
const addDays = (ms: number, d: number) => new Date(ms + d * 86_400_000);

test("at the new-moon epoch the disc is dark and named New moon", () => {
  const m = moonPhase(new Date(EPOCH));
  assert.ok(m.illumination < 0.01, `illum ${m.illumination}`);
  assert.equal(m.phase, "New moon");
});

test("half a synodic month later it is full and fully lit", () => {
  const m = moonPhase(addDays(EPOCH, SYNODIC / 2));
  assert.ok(m.illumination > 0.99, `illum ${m.illumination}`);
  assert.equal(m.phase, "Full moon");
});

test("a quarter cycle in is roughly half-lit (first quarter)", () => {
  const m = moonPhase(addDays(EPOCH, SYNODIC / 4));
  assert.ok(Math.abs(m.illumination - 0.5) < 0.02, `illum ${m.illumination}`);
  assert.equal(m.phase, "First quarter");
});

test("illumination stays within 0..1 and is deterministic", () => {
  for (let d = 0; d < 30; d += 0.5) {
    const m = moonPhase(addDays(EPOCH, d));
    assert.ok(m.illumination >= 0 && m.illumination <= 1, `illum ${m.illumination} at ${d}d`);
  }
  assert.deepEqual(moonPhase(new Date("2026-05-27T00:00:00Z")), moonPhase(new Date("2026-05-27T00:00:00Z")));
});

test("age wraps within one synodic month", () => {
  const m = moonPhase(addDays(EPOCH, SYNODIC * 3 + 1));
  assert.ok(m.ageDays >= 0 && m.ageDays < SYNODIC, `age ${m.ageDays}`);
  assert.ok(Math.abs(m.ageDays - 1) < 0.001, `age ${m.ageDays}`);
});
