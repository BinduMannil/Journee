import { test } from "node:test";
import assert from "node:assert/strict";
import { explainScore } from "../src/lib/intelligence/explain";
import { score } from "../src/lib/intelligence/scoring";
import type { ScoringWeights } from "../src/lib/intelligence/types";

const weights: ScoringWeights = {
  version: "test-v1",
  weights: { weather: 0.5, crowd: 0.3, season: 0.2 },
  defaultWeight: 0.1,
};

test("ranks drivers by descending share and identifies the top driver", () => {
  const s = score(
    [
      { key: "weather", value: 0.9, note: "Great weather" },
      { key: "crowd", value: 0.5 },
      { key: "season", value: 0.2 },
    ],
    weights,
  );
  const ex = explainScore(s);
  assert.equal(ex.drivers.length, 3);
  // shares are sorted desc
  for (let i = 1; i < ex.drivers.length; i++) {
    assert.ok(ex.drivers[i - 1]!.share >= ex.drivers[i]!.share);
  }
  // weather: 0.9*0.5=0.45 is the largest weighted contribution
  assert.equal(ex.topDriver?.key, "weather");
  assert.ok(ex.topDriver!.share > 0.5);
  assert.equal(ex.topDriver!.note, "Great weather");
});

test("classifies impact and finds the weakest dragging signal", () => {
  const s = score(
    [
      { key: "weather", value: 0.9 },
      { key: "crowd", value: 0.5 },
      { key: "season", value: 0.2 },
    ],
    weights,
  );
  const ex = explainScore(s);
  const byKey = new Map(ex.drivers.map((d) => [d.key, d]));
  assert.equal(byKey.get("weather")!.impact, "boosts");
  assert.equal(byKey.get("crowd")!.impact, "neutral");
  assert.equal(byKey.get("season")!.impact, "drags");
  assert.equal(ex.weakest?.key, "season");
});

test("shares sum to ~1 when there is any weighted contribution", () => {
  const s = score(
    [
      { key: "weather", value: 0.8 },
      { key: "crowd", value: 0.4 },
    ],
    weights,
  );
  const ex = explainScore(s);
  const total = ex.drivers.reduce((a, d) => a + d.share, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `shares sum=${total}`);
});

test("summary mentions the score, confidence and the top driver", () => {
  const s = score([{ key: "weather", value: 0.9 }], weights, ["weather", "crowd"]);
  const ex = explainScore(s);
  assert.match(ex.summary, /Scored \d+\/100/);
  assert.match(ex.summary, /confidence/);
  assert.match(ex.summary, /weather/);
  assert.equal(ex.confidence, 0.5); // 1 of 2 expected keys present
});

test("handles an empty score without throwing", () => {
  const s = score([], weights, ["weather"]);
  const ex = explainScore(s);
  assert.equal(ex.drivers.length, 0);
  assert.equal(ex.topDriver, null);
  assert.equal(ex.weakest, null);
  assert.match(ex.summary, /no signals/i);
});
