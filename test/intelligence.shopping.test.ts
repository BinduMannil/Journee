import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getShoppingProfile,
  shoppingTips,
  SHOPPING_DATA_NOTE,
} from "../src/lib/intelligence/shopping";
import { shoppingProfiles } from "../src/content/shopping";

test("getShoppingProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getShoppingProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getShoppingProfile("atlantis"), null);
});

test("every destination has malls/markets/online, fuel, and payment info", () => {
  for (const p of shoppingProfiles) {
    assert.ok(p.markets.length > 0, `${p.destinationId} markets`);
    assert.ok(p.online.length > 0, `${p.destinationId} online`);
    assert.ok(p.fuel.petrolStations.length > 0, `${p.destinationId} fuel`);
    assert.ok(p.payment.length > 0, `${p.destinationId} payment`);
  }
  assert.match(SHOPPING_DATA_NOTE, /verify locally/i);
});

test("rare EV charging surfaces a caution; payment tip always present", () => {
  const marrakech = getShoppingProfile("marrakech")!;
  const tips = shoppingTips(marrakech);
  assert.ok(tips.some((t) => t.kind === "fuel" && /EV charging is rare/i.test(t.text)));
  assert.ok(tips.some((t) => t.kind === "payment"));
});

test("a destination with non-rare EV charging raises no EV caution (Kyoto)", () => {
  const tips = shoppingTips(getShoppingProfile("kyoto")!);
  assert.equal(tips.some((t) => /EV charging is rare/i.test(t.text)), false);
  assert.ok(tips.some((t) => t.kind === "payment"));
});
