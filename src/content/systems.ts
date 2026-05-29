/**
 * Platform systems roster shown on /about. Status is honest: "live" means real
 * working logic exists (even if data feeds are sample/roadmap), "roadmap" means
 * not started. Data-driven so the page stays truthful as systems evolve.
 */
export type SystemStatus = "live" | "scaffold" | "roadmap";

export interface PlatformSystem {
  readonly name: string;
  readonly status: SystemStatus;
  readonly note: string;
}

export const platformSystems: readonly PlatformSystem[] = [
  { name: "Destination Intelligence", status: "live", note: "Real live light-phase signal; explainable score." },
  { name: "Pathfinder Discovery", status: "live", note: "Vibe-based ranking with reasons (/discover)." },
  { name: "Dynamic Itinerary", status: "live", note: "Fatigue-aware day pacing (/plan)." },
  { name: "Carbon Estimate", status: "live", note: "Per-trip CO2e estimate from route distance (versioned model; an estimate, not measured)." },
  { name: "Food & Drink Customs", status: "scaffold", note: "Editorial dietary/alcohol flags + signature drink per destination; seed data, verify locally." },
  { name: "Know-Before-You-Go Essentials", status: "scaffold", note: "Emergency numbers, healthcare note, courtesy phrases, etiquette do's/don'ts; seed data, verify on arrival." },
  { name: "Shopping & Essentials", status: "scaffold", note: "Malls, markets/souks, online options, fuel networks + EV note, payment norms; seed data." },
  { name: "Local Chains", status: "scaffold", note: "Recognizable cinema/coffee/pharmacy/supermarket/fast-food/hospital chains per destination; seed data." },
  { name: "Affiliate & Monetization", status: "live", note: "Data-driven routing, A/B, ingestion, analytics." },
  { name: "Travel Confidence", status: "scaffold", note: "Aggregates engine scores; sample inputs." },
  { name: "Event & Cultural", status: "scaffold", note: "Engine + mapping; live calendars roadmap." },
  { name: "Political & Disruption", status: "scaffold", note: "Engine + mapping; advisories roadmap." },
  { name: "Weather & Environmental", status: "scaffold", note: "Comfort scorer; live feed egress-blocked." },
  { name: "Safety & Risk", status: "scaffold", note: "Engine + weights; datasets roadmap." },
  { name: "Visa & Entry", status: "scaffold", note: "Engine + weights; rules data roadmap." },
  { name: "Local Culture", status: "scaffold", note: "Engine + weights; datasets roadmap." },
  { name: "Real-Time Conditions", status: "scaffold", note: "Engine + weights; live status roadmap." },
  { name: "City Energy", status: "scaffold", note: "Vibe signals; live density roadmap." },
  { name: "Memory & Reflection", status: "scaffold", note: "Memorability scoring; capture roadmap." },
  { name: "Travel DNA", status: "scaffold", note: "Mood-affinity model + ranking." },
  { name: "Social & Creator", status: "scaffold", note: "Saved collections (localStorage)." },
  { name: "AI Planning", status: "roadmap", note: "Needs an LLM provider." },
];
