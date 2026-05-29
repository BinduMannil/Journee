/**
 * UV & weather-protection customs (editorial seed data, per destination).
 *
 * Describes a destination's *typical*, long-run UV intensity (the broad band of
 * peak ultraviolet exposure and roughly when it peaks) and the customs locals use
 * to protect against the elements — sun, heat, wind, cold and rain. This is
 * factual background to help travellers pack and behave sensibly. Live UV index
 * values will arrive from the weather feed later; this is the editorial seed and
 * is **not** a live UV forecast. `UV_PROTECTION_NOTE` is surfaced with every
 * consumer. Mirrors the `hazards.ts` content pattern.
 */

export type UvBand = "low" | "moderate" | "high" | "very_high" | "extreme";

export interface ProtectionCustom {
  readonly element: "sun" | "heat" | "wind" | "cold" | "rain";
  /** One neutral, factual sentence describing the protective custom. */
  readonly custom: string;
}

export interface UvProtectionProfile {
  readonly destinationId: string;
  readonly peakUvBand: UvBand;
  /** Typical window of peak UV intensity (e.g. "Jun–Aug"). */
  readonly peakUvMonths: string;
  readonly summary: string;
  readonly customs: readonly ProtectionCustom[];
}

/** Shown with any UV data so it reads as general background, not a live forecast. */
export const UV_PROTECTION_NOTE =
  "Editorial background describing typical, long-run UV intensity and local " +
  "protective customs for each destination. It is not a forecast, prediction or " +
  "live UV reading, and not a guarantee of conditions or of any UV level. Always " +
  "check a live UV index and current sun-safety advice before sun exposure.";

export const uvProtectionProfiles: readonly UvProtectionProfile[] = [
  {
    destinationId: "kyoto",
    peakUvBand: "high",
    peakUvMonths: "Jul–Aug",
    summary:
      "Kyoto's humid midsummer brings high UV and sticky heat in the sheltered basin, easing to moderate levels through spring and autumn.",
    customs: [
      { element: "sun", custom: "Parasols (higasa) are a common everyday sight, used by locals to shade themselves while walking in summer." },
      { element: "heat", custom: "People carry folding fans, hand towels and cooling wipes, and pace sightseeing to avoid the worst of the midday humidity." },
      { element: "rain", custom: "Compact umbrellas are carried year-round, with the June–July tsuyu rainy season making them near-essential." },
    ],
  },
  {
    destinationId: "santorini",
    peakUvBand: "very_high",
    peakUvMonths: "Jun–Aug",
    summary:
      "The exposed Aegean island sees very high UV through the long, cloudless summer, intensified by reflective whitewashed walls and the open sea.",
    customs: [
      { element: "sun", custom: "Wide-brimmed hats and sunglasses are standard, and locals favour the shaded caldera-side terraces during the strongest midday sun." },
      { element: "heat", custom: "Activity shifts to early morning and evening, with the hottest hours of the afternoon spent resting indoors or in shade." },
      { element: "wind", custom: "The summer meltemi wind is strong and persistent, so light layers and secured hats are the norm on exposed clifftops." },
    ],
  },
  {
    destinationId: "marrakech",
    peakUvBand: "very_high",
    peakUvMonths: "Jun–Aug",
    summary:
      "Marrakech sits under intense North African sun with very high summer UV and fierce dry heat radiating off the surrounding plains.",
    customs: [
      { element: "sun", custom: "Loose, long, light-coloured clothing and head coverings are traditional, shielding the skin while keeping the body cool." },
      { element: "heat", custom: "Daily life follows the heat: a long midday break in shaded courtyards and riads, with markets and streets livelier after sunset." },
      { element: "wind", custom: "Scarves are commonly wrapped over the face to keep out hot, dusty winds blowing in from the desert." },
    ],
  },
  {
    destinationId: "patagonia",
    peakUvBand: "very_high",
    peakUvMonths: "Nov–Feb",
    summary:
      "Patagonia is notable for surprisingly strong UV — driven by seasonal ozone thinning, clear skies and altitude — combined with fierce wind and biting cold even in summer.",
    customs: [
      { element: "sun", custom: "High-SPF sunscreen and full sunglasses are treated as essential, as the southern ozone hole can push UV to extreme levels under clear skies." },
      { element: "wind", custom: "Windproof shell layers are worn routinely, since the relentless Patagonian wind can be strong enough to knock walkers off balance." },
      { element: "cold", custom: "Layering with insulating mid-layers and hats and gloves is the norm year-round, as temperatures can drop sharply at any time." },
    ],
  },
];
