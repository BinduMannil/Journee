/**
 * Packing list generator (pure, no network).
 *
 * Derives a categorized packing checklist from a destination's environmental
 * conditions (the same `ComfortInput` a live weather feed will populate) plus
 * the traveller's planned activities and trip length. Deterministic and
 * unit-tested; no I/O. Like the comfort engine, this is correct the moment a
 * real weather feed is attached — until then it runs on injected conditions.
 */
import type { ComfortInput } from "./comfort";

export type Activity =
  | "beach"
  | "swimming"
  | "hiking"
  | "city"
  | "winter_sports"
  | "formal_dining"
  | "business"
  | "photography";

export interface PackingInput {
  /** Representative conditions for the trip window. */
  readonly conditions: ComfortInput;
  /** Chance of rain over the trip, 0..1. */
  readonly rainChance?: number;
  /** Peak UV index (0..11+). High UV adds sun protection. */
  readonly uvIndex?: number;
  readonly activities?: readonly Activity[];
  /** Trip length in days; scales quantity-sensitive reminders. */
  readonly durationDays?: number;
}

export interface PackingCategory {
  readonly category: string;
  readonly items: readonly string[];
}

export type TempBand = "freezing" | "cold" | "mild" | "warm" | "hot";

/** Classify a temperature into a packing-relevant band. */
export function tempBand(temperatureC: number): TempBand {
  if (temperatureC < 5) return "freezing";
  if (temperatureC < 14) return "cold";
  if (temperatureC < 22) return "mild";
  if (temperatureC < 28) return "warm";
  return "hot";
}

const CLOTHING_BY_BAND: Readonly<Record<TempBand, readonly string[]>> = {
  freezing: ["Insulated coat", "Thermal base layers", "Hat, gloves & scarf", "Warm socks"],
  cold: ["Warm jacket", "Sweaters / layers", "Long trousers", "Closed shoes"],
  mild: ["Light jacket", "Layerable tops", "Comfortable trousers"],
  warm: ["Breathable shirts", "Light trousers / shorts", "Comfortable walking shoes"],
  hot: ["Lightweight breathable clothing", "Shorts / skirts", "Sandals"],
};

const ACTIVITY_ITEMS: Readonly<Record<Activity, readonly string[]>> = {
  beach: ["Swimwear", "Beach towel", "Flip-flops"],
  swimming: ["Swimwear", "Goggles"],
  hiking: ["Hiking boots", "Daypack", "Refillable water bottle"],
  city: ["Comfortable walking shoes", "Day bag"],
  winter_sports: ["Ski gloves", "Goggles", "Thermal layers"],
  formal_dining: ["Smart outfit", "Dress shoes"],
  business: ["Business attire", "Laptop & charger", "Notebook"],
  photography: ["Camera & lenses", "Spare batteries", "Memory cards"],
};

function dedupe(items: readonly string[]): string[] {
  return [...new Set(items)];
}

/**
 * Build a categorized packing list. Deterministic: identical input → identical
 * output. With no conditions activities are still honoured; an empty input
 * yields only the universal baseline.
 */
export function generatePackingList(input: PackingInput): readonly PackingCategory[] {
  const categories: PackingCategory[] = [];
  const band = tempBand(input.conditions.temperatureC);

  // Universal baseline — always needed regardless of destination.
  categories.push({
    category: "Essentials",
    items: ["Phone & charger", "Wallet & cards", "Daily medication", "Toiletries"],
  });

  categories.push({ category: "Clothing", items: CLOTHING_BY_BAND[band] });

  // Weather-driven additions.
  const weather: string[] = [];
  if ((input.rainChance ?? 0) >= 0.3) weather.push("Compact umbrella", "Waterproof jacket");
  if ((input.uvIndex ?? 0) >= 6 || band === "hot" || band === "warm")
    weather.push("Sunscreen", "Sunglasses", "Sun hat");
  if (band === "freezing" || band === "cold") weather.push("Lip balm", "Moisturizer");
  if ((input.conditions.aqi ?? 0) >= 100) weather.push("Face mask (air quality)");
  if (weather.length > 0) categories.push({ category: "Weather & climate", items: dedupe(weather) });

  // Activity-driven additions.
  const activities = input.activities ?? [];
  if (activities.length > 0) {
    const items = dedupe(activities.flatMap((a) => ACTIVITY_ITEMS[a]));
    categories.push({ category: "Activities", items });
  }

  // Quantity reminder for longer trips.
  const days = input.durationDays ?? 0;
  if (days >= 7) {
    categories.push({
      category: "Reminders",
      items: ["Laundry plan or detergent", `Enough underwear/socks for ~${Math.min(days, 14)} days`],
    });
  }

  return categories;
}
