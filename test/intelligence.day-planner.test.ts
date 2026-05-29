import { test } from "node:test";
import assert from "node:assert/strict";
import { planSmartDay } from "../src/lib/intelligence/day-planner";

const TIME_ORDER = [
  "early_morning",
  "morning",
  "midday",
  "afternoon",
  "sunset",
  "evening",
];

test("planSmartDay returns a plan for a known destination, null otherwise", () => {
  assert.equal(planSmartDay("kyoto")?.destinationId, "kyoto");
  assert.equal(planSmartDay("atlantis"), null);
});

test("stops are ordered through the day (non-decreasing time slot)", () => {
  const plan = planSmartDay("santorini");
  assert.ok(plan);
  assert.ok(plan.stops.length >= 3);
  for (let i = 1; i < plan.stops.length; i++) {
    const prev = TIME_ORDER.indexOf(plan.stops[i - 1]!.slot);
    const cur = TIME_ORDER.indexOf(plan.stops[i]!.slot);
    assert.ok(prev <= cur, `slot ${plan.stops[i - 1]!.slot} should not come after ${plan.stops[i]!.slot}`);
  }
  // Santorini's Oia sunset viewpoint should land in the sunset/evening end.
  const oia = plan.stops.find((s) => s.attraction.name === "Oia Sunset Viewpoint");
  assert.equal(oia?.slot, "sunset");
});

test("within the same slot, busier sites are scheduled first", () => {
  const plan = planSmartDay("kyoto");
  assert.ok(plan);
  // Kyoto's early_morning sites include very_busy Fushimi Inari & Arashiyama.
  const early = plan.stops.filter((s) => s.slot === "early_morning");
  for (let i = 1; i < early.length; i++) {
    const order = ["very_busy", "busy", "moderate", "quiet"];
    assert.ok(
      order.indexOf(early[i - 1]!.attraction.typicalBusyness) <=
        order.indexOf(early[i]!.attraction.typicalBusyness),
    );
  }
});

test("maxStops caps the plan and the note is the honest disclaimer", () => {
  const plan = planSmartDay("kyoto", { maxStops: 2 });
  assert.ok(plan);
  assert.equal(plan.stops.length, 2);
  assert.match(plan.note, /official source|not a live/i);
});
