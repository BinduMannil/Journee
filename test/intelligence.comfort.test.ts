import { test } from "node:test";
import assert from "node:assert/strict";
import { comfortScore } from "../src/lib/intelligence/comfort";

test("ideal conditions score near 1", () => {
  const s = comfortScore({ temperatureC: 22, humidityPct: 45, windKph: 0, aqi: 0 });
  assert.ok(s > 0.95, `score was ${s}`);
});

test("extreme heat lowers comfort", () => {
  const hot = comfortScore({ temperatureC: 42 });
  const mild = comfortScore({ temperatureC: 22 });
  assert.ok(hot < mild);
  assert.ok(hot >= 0);
});

test("bad air quality drags the score down", () => {
  const clean = comfortScore({ temperatureC: 22, aqi: 0 });
  const smoggy = comfortScore({ temperatureC: 22, aqi: 150 });
  assert.ok(smoggy < clean);
});

test("missing inputs are skipped, never NaN", () => {
  const s = comfortScore({ temperatureC: 22 });
  assert.ok(!Number.isNaN(s));
  assert.ok(s > 0 && s <= 1);
});

test("score is always within 0..1", () => {
  for (const t of [-30, 0, 22, 60]) {
    const s = comfortScore({ temperatureC: t, humidityPct: 100, windKph: 120, aqi: 500 });
    assert.ok(s >= 0 && s <= 1, `score ${s} out of range for temp ${t}`);
  }
});
