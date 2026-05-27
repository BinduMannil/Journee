import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateEntitlement,
  consumeEntitlement,
  EMPTY_USAGE,
} from "../src/lib/billing/entitlements";
import { memoryUsageStore, resetUsageStore } from "../src/lib/billing/store";
import { creditPackages, findPackage, FREE_AI_PLANS } from "../src/content/pricing";

test("a fresh visitor is on the free tier", () => {
  const e = evaluateEntitlement(EMPTY_USAGE, 3);
  assert.equal(e.allowed, true);
  assert.equal(e.source, "free");
  assert.equal(e.remainingFree, 3);
});

test("free quota is consumed before credits, then credits", () => {
  // Used 2 of 3 free -> still free.
  assert.equal(evaluateEntitlement({ usedFree: 2, credits: 0 }, 3).source, "free");
  // Free exhausted, has credits -> credit.
  const credit = evaluateEntitlement({ usedFree: 3, credits: 5 }, 3);
  assert.equal(credit.source, "credit");
  assert.equal(credit.remainingFree, 0);
  // Free exhausted, no credits -> not allowed.
  const none = evaluateEntitlement({ usedFree: 3, credits: 0 }, 3);
  assert.equal(none.allowed, false);
  assert.equal(none.source, "none");
});

test("consume advances free usage, then spends credits, then refuses", () => {
  let state = EMPTY_USAGE;
  for (let i = 0; i < 3; i++) {
    const c = consumeEntitlement(state, 3);
    assert.ok(c && c.source === "free");
    state = c.next;
  }
  assert.equal(state.usedFree, 3);
  // Now grant credits and consume one.
  state = { ...state, credits: 2 };
  const credit = consumeEntitlement(state, 3);
  assert.ok(credit && credit.source === "credit");
  assert.equal(credit.next.credits, 1);
  // Exhaust the last credit, then refuse.
  state = consumeEntitlement(credit.next, 3)!.next;
  assert.equal(state.credits, 0);
  assert.equal(consumeEntitlement(state, 3), null);
});

test("usage store round-trips and defaults to empty", async () => {
  resetUsageStore();
  assert.deepEqual(await memoryUsageStore.get("jid-1"), EMPTY_USAGE);
  await memoryUsageStore.save("jid-1", { usedFree: 1, credits: 9 });
  assert.deepEqual(await memoryUsageStore.get("jid-1"), { usedFree: 1, credits: 9 });
  assert.deepEqual(await memoryUsageStore.get("other"), EMPTY_USAGE);
});

test("credit packages are well-formed and addressable", () => {
  assert.ok(FREE_AI_PLANS >= 0);
  assert.ok(creditPackages.length > 0);
  const ids = creditPackages.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of creditPackages) {
    assert.ok(p.credits > 0 && p.priceMinor > 0 && p.currency.length === 3);
  }
  assert.equal(findPackage("starter")?.id, "starter");
  assert.equal(findPackage("nope"), undefined);
});
