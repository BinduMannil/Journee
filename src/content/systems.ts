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
  { name: "Local Gems (Eats & Drinks)", status: "scaffold", note: "Curated standout spots with what to order + why; editorial picks, verify before going." },
  { name: "City Vibe & Friendliness", status: "scaffold", note: "Local friendliness, vibe tags, tourist-ease, English-spoken; editorial generalization, not a verdict." },
  { name: "Festivals & Holidays", status: "scaffold", note: "Notable festivals/holidays with significance, what-to-expect, can-visitors-join; typical months, seed data." },
  { name: "Religion & Places of Worship", status: "scaffold", note: "Predominant religions + major mosques/temples/churches/synagogues; respectful editorial seed, verify access." },
  { name: "Tipping Norms", status: "scaffold", note: "Restaurant/taxi/hotel tipping expectations + service-charge norms per destination; seed data." },
  { name: "Connectivity & Power", status: "scaffold", note: "Plug types/voltage, SIM/eSIM options, tap-water potability, coverage notes; seed data." },
  { name: "Know-Before-You-Go Essentials", status: "scaffold", note: "Emergency numbers, healthcare note, courtesy phrases, etiquette do's/don'ts; seed data, verify on arrival." },
  { name: "Shopping & Essentials", status: "scaffold", note: "Malls, markets/souks, online options, fuel networks + EV note, payment norms; seed data." },
  { name: "Local Chains", status: "scaffold", note: "Recognizable cinema/coffee/pharmacy/supermarket/fast-food/hospital chains per destination; seed data." },
  { name: "Seasonal Fruits", status: "scaffold", note: "In-season + must-try fruits with editorial global taste/production ratings; seed data." },
  { name: "Airport & Terminal Intel", status: "scaffold", note: "Terminals, inter-terminal transfer, boarding method, airport→city distance + access modes; seed data." },
  { name: "Ratings & Recommendations", status: "scaffold", note: "Confidence-weighted (Bayesian) rating core for places/restaurants/users; persistence + UI roadmap." },
  { name: "Airport & Airline Ratings", status: "scaffold", note: "Editorial service ratings (staff/cleanliness/comfort/value) for airports + airlines by cabin class; seed data." },
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
