import { test } from "node:test";
import assert from "node:assert/strict";

import {
  defaultPreferences,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  kmToMiles,
  milesToKm,
  formatTemperature,
  formatDistance,
  formatCurrency,
  PREFERENCES_NOTE,
  type UserPreferences,
} from "../src/lib/preferences/preferences";

test("defaultPreferences shape", () => {
  assert.deepEqual(defaultPreferences, {
    currency: "USD",
    temperatureUnit: "celsius",
    distanceUnit: "km",
  });
});

test("temperature converters", () => {
  assert.equal(celsiusToFahrenheit(0), 32);
  assert.equal(celsiusToFahrenheit(100), 212);
  assert.equal(fahrenheitToCelsius(32), 0);
});

test("distance converters", () => {
  assert.ok(Math.abs(kmToMiles(1) - 0.621) < 0.001);
  assert.ok(Math.abs(milesToKm(kmToMiles(10)) - 10) < 0.001);
});

test("formatTemperature", () => {
  const c: UserPreferences = { ...defaultPreferences, temperatureUnit: "celsius" };
  const f: UserPreferences = { ...defaultPreferences, temperatureUnit: "fahrenheit" };
  assert.equal(formatTemperature(21, c), "21°C");
  assert.equal(formatTemperature(21, f), "70°F");
});

test("formatDistance", () => {
  const km: UserPreferences = { ...defaultPreferences, distanceUnit: "km" };
  const mi: UserPreferences = { ...defaultPreferences, distanceUnit: "mi" };
  assert.equal(formatDistance(10, km), "10 km");
  assert.ok(formatDistance(10, mi).startsWith("6.2"));
});

test("formatCurrency labels but does not convert", () => {
  const usd: UserPreferences = { ...defaultPreferences, currency: "USD" };
  const jpy: UserPreferences = { ...defaultPreferences, currency: "JPY" };
  const usdOut = formatCurrency(1234.5, usd);
  assert.ok(usdOut.includes("$") || usdOut.includes("1,234"));
  const jpyOut = formatCurrency(1234.5, jpy);
  assert.ok(jpyOut.includes("¥") || jpyOut.includes("JP"));
});

test("PREFERENCES_NOTE documents no-FX / conversion", () => {
  assert.match(PREFERENCES_NOTE, /FX|convert/i);
});
