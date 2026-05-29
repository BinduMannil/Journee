import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTransitHowTo,
  transitOptionFor,
  acceptsContactless,
  TRANSIT_HOWTO_NOTE,
} from "../src/lib/intelligence/transit-howto";
import { transitHowToProfiles } from "../src/content/transit-howto";

const TRANSIT_MODES = [
  "metro_subway",
  "bus",
  "tram",
  "train",
  "taxi",
  "rideshare",
  "ferry",
  "bike_share",
  "walk",
];
const FARE_PAYMENTS = [
  "contactless_card",
  "transit_card",
  "cash",
  "mobile_app",
  "ticket_machine",
];

test("getTransitHowTo returns a profile for a known destination, null otherwise", () => {
  assert.equal(getTransitHowTo("kyoto")?.destinationId, "kyoto");
  assert.equal(getTransitHowTo("atlantis"), null);
});

test("every profile has primary modes, well-formed options, payment, passInfo and tip", () => {
  assert.ok(transitHowToProfiles.length > 0);
  for (const p of transitHowToProfiles) {
    assert.ok(p.primaryModes.length > 0, `${p.destinationId} primaryModes`);
    for (const m of p.primaryModes) {
      assert.ok(TRANSIT_MODES.includes(m), `${p.destinationId} primaryMode ${m}`);
    }
    assert.ok(p.options.length > 0, `${p.destinationId} options`);
    for (const o of p.options) {
      assert.ok(TRANSIT_MODES.includes(o.mode), `${p.destinationId} option mode ${o.mode}`);
      assert.ok(o.note && o.note.length > 0, `${p.destinationId} option ${o.mode} note`);
    }
    assert.ok(p.payment.length > 0, `${p.destinationId} payment`);
    for (const pay of p.payment) {
      assert.ok(FARE_PAYMENTS.includes(pay), `${p.destinationId} payment ${pay}`);
    }
    assert.ok(p.passInfo.length > 0, `${p.destinationId} passInfo`);
    assert.ok(p.tip.length > 0, `${p.destinationId} tip`);
  }
});

test("TRANSIT_HOWTO_NOTE carries a clear, verify-before-travel disclaimer", () => {
  assert.match(TRANSIT_HOWTO_NOTE, /change|verify|vary/i);
  assert.match(TRANSIT_HOWTO_NOTE, /fare|transit|route|pass/i);
});

test("transitOptionFor returns a matching option or null", () => {
  const bus = transitOptionFor("kyoto", "bus");
  assert.equal(bus?.mode, "bus");
  assert.ok(bus && bus.note.length > 0);
  assert.equal(transitOptionFor("kyoto", "ferry"), null);
  assert.equal(transitOptionFor("atlantis", "bus"), null);
});

test("acceptsContactless reflects payment options; false for unknown", () => {
  assert.equal(acceptsContactless("kyoto"), true);
  assert.equal(acceptsContactless("marrakech"), false);
  assert.equal(acceptsContactless("atlantis"), false);
});
