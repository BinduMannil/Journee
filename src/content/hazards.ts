/**
 * Hazards & advisories (editorial seed data, per destination).
 *
 * Describes a destination's *general* exposure to natural hazards (the kinds of
 * events the area is geographically prone to, and roughly when), its broad
 * conflict status, and a *typical* government travel-advisory level. This is
 * factual background to help travellers prepare and pack sensibly — it is **not**
 * a forecast of specific disasters and **not** a substitute for official, live
 * government travel advisories. `HAZARDS_DATA_NOTE` is surfaced with every
 * consumer. Mirrors the `festivals.ts` content pattern.
 */

export type HazardType =
  | "earthquake"
  | "volcano"
  | "typhoon"
  | "hurricane"
  | "wildfire"
  | "flood"
  | "tsunami"
  | "extreme_heat"
  | "extreme_cold";

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export type ConflictStatus = "none" | "localized_unrest" | "active_conflict";

/** 1 = exercise normal precautions … 4 = do not travel (mirrors common scales). */
export type AdvisoryLevel = 1 | 2 | 3 | 4;

export interface HazardExposure {
  readonly type: HazardType;
  readonly risk: RiskLevel;
  /** Typical season/window of heightened exposure, when applicable. */
  readonly season?: string;
  /** One neutral, factual sentence describing the exposure. */
  readonly note: string;
}

export interface HazardsProfile {
  readonly destinationId: string;
  readonly advisoryLevel: AdvisoryLevel;
  readonly advisorySummary: string;
  readonly conflictStatus: ConflictStatus;
  readonly naturalHazards: readonly HazardExposure[];
}

/** Shown with any hazards data so it reads as general background, not a forecast. */
export const HAZARDS_DATA_NOTE =
  "Editorial background describing general, long-run hazard exposure and a " +
  "typical travel-advisory level for each destination. It is not a forecast or " +
  "prediction of specific disasters, and not a guarantee of safety or of any " +
  "advisory level. Always check your government's official travel advisory " +
  "before and during travel.";

export const hazardsProfiles: readonly HazardsProfile[] = [
  {
    destinationId: "kyoto",
    advisoryLevel: 1,
    advisorySummary: "Japan typically sits at a normal-precautions level; a safe, stable destination.",
    conflictStatus: "none",
    naturalHazards: [
      { type: "earthquake", risk: "moderate", note: "Japan is seismically active, and Japan's building codes and public preparedness are among the strongest in the world." },
      { type: "typhoon", risk: "moderate", season: "Jun–Oct", note: "Typhoons can bring heavy rain and travel disruption during the warmer months, though direct hits on Kyoto are less frequent than on coastal regions." },
      { type: "extreme_heat", risk: "moderate", season: "Jul–Aug", note: "Midsummer brings hot, humid conditions in the Kyoto basin that warrant hydration and pacing." },
    ],
  },
  {
    destinationId: "santorini",
    advisoryLevel: 1,
    advisorySummary: "Greece typically sits at a normal-precautions level for travellers.",
    conflictStatus: "none",
    naturalHazards: [
      { type: "volcano", risk: "low", note: "Santorini sits on a dormant but actively monitored caldera, with no eruption expected for the typical visitor." },
      { type: "earthquake", risk: "moderate", note: "The Aegean is seismically active and the island experiences periodic tremors." },
      { type: "wildfire", risk: "moderate", season: "Jun–Sep", note: "Hot, dry summers raise wildfire risk across Greece, including the Cyclades." },
    ],
  },
  {
    destinationId: "marrakech",
    advisoryLevel: 1,
    advisorySummary: "Morocco typically sits at a normal-precautions level, with standard urban awareness advised.",
    conflictStatus: "none",
    naturalHazards: [
      { type: "earthquake", risk: "elevated", note: "The region experienced the September 2023 Al Haouz earthquake south of Marrakech, reflecting genuine regional seismic exposure." },
      { type: "extreme_heat", risk: "high", season: "Jun–Aug", note: "Summer temperatures in Marrakech regularly become dangerously hot, demanding shade, hydration and midday rest." },
      { type: "flood", risk: "low", note: "Occasional intense rainfall can cause localised flash flooding, though this is relatively uncommon." },
    ],
  },
  {
    destinationId: "patagonia",
    advisoryLevel: 1,
    advisorySummary: "Argentina and Chile typically sit at a normal-precautions level for travellers.",
    conflictStatus: "none",
    naturalHazards: [
      { type: "volcano", risk: "moderate", note: "The Andes along Patagonia host active volcanism that occasionally affects air travel and nearby areas." },
      { type: "earthquake", risk: "moderate", note: "The Chilean side of the Andes is seismically active and experiences periodic earthquakes." },
      { type: "extreme_cold", risk: "high", season: "year-round, worst in winter", note: "Patagonia is exposed to fierce winds and rapidly changing, often bitterly cold weather throughout the year, most severe in winter." },
    ],
  },
];
