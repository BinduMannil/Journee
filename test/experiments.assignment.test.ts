import { test } from "node:test";
import assert from "node:assert/strict";
import { assignVariant, type Variant } from "../src/lib/experiments/assignment";

const ab: Variant[] = [
  { id: "A", weight: 1 },
  { id: "B", weight: 1 },
];

test("assignment is deterministic for the same key", () => {
  const first = assignVariant("user-123", ab);
  for (let i = 0; i < 5; i++) {
    assert.equal(assignVariant("user-123", ab), first);
  }
});

test("returns null when no positive weight exists", () => {
  assert.equal(assignVariant("k", []), null);
  assert.equal(assignVariant("k", [{ id: "A", weight: 0 }]), null);
});

test("single variant always wins", () => {
  assert.equal(assignVariant("anything", [{ id: "only", weight: 5 }]), "only");
});

test("distribution roughly follows weights", () => {
  const variants: Variant[] = [
    { id: "A", weight: 8 },
    { id: "B", weight: 2 },
  ];
  let a = 0;
  const n = 5000;
  for (let i = 0; i < n; i++) {
    if (assignVariant(`key-${i}`, variants) === "A") a++;
  }
  const ratio = a / n;
  // Expected ~0.8; allow generous tolerance for hash variance.
  assert.ok(ratio > 0.72 && ratio < 0.88, `ratio was ${ratio}`);
});

test("only assigns to declared variant ids", () => {
  const ids = new Set(["A", "B"]);
  for (let i = 0; i < 200; i++) {
    const v = assignVariant(`k-${i}`, ab);
    assert.ok(v !== null && ids.has(v));
  }
});
