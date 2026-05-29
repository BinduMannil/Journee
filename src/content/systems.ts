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
  { name: "Traveller Inclusion & Safety", status: "scaffold", note: "LGBTQ+ legal status & climate, religious-minority & solo-women safety; factual, verify advisories." },
  { name: "Cost Index", status: "scaffold", note: "Typical meal/coffee/beer/taxi prices + daily-budget estimate; approximate USD, verify FX." },
  { name: "Multi-Currency Normalization", status: "scaffold", note: "Indicative SEED FX table + convertUsd/convertCurrency/costPricesIn over the cost anchors; not a live quote — live FX feed is roadmap." },
  { name: "Scams & Safety Tips", status: "scaffold", note: "Common local scams (how + avoid) and practical safety tips per destination; seed data." },
  { name: "Hazards & Advisories", status: "scaffold", note: "Natural-hazard exposure + conflict status + typical advisory level; factual exposure, not a forecast — verify official advisories." },
  { name: "Display Preferences & Units", status: "scaffold", note: "Currency/°C-°F/km-mi preference model + pure converters/formatters (no FX yet); profile UI deferred." },
  { name: "Know-Before-You-Go Essentials", status: "scaffold", note: "Emergency numbers, healthcare note, courtesy phrases, etiquette do's/don'ts; seed data, verify on arrival." },
  { name: "Healthcare & Medical Facilities", status: "scaffold", note: "Notable hospitals/clinics/pharmacies per destination with area + English-spoken; editorial orientation, not medical advice or a live directory." },
  { name: "Shopping & Essentials", status: "scaffold", note: "Malls, markets/souks, online options, fuel networks + EV note, payment norms; seed data." },
  { name: "Local Chains", status: "scaffold", note: "Recognizable cinema/coffee/pharmacy/supermarket/fast-food/hospital chains per destination; seed data." },
  { name: "Seasonal Fruits", status: "scaffold", note: "In-season + must-try fruits with editorial global taste/production ratings; seed data." },
  { name: "Airport & Terminal Intel", status: "scaffold", note: "Terminals, inter-terminal transfer, boarding method, airport→city distance + access modes; seed data." },
  { name: "Ratings & Recommendations", status: "scaffold", note: "Confidence-weighted (Bayesian) rating core for places/restaurants/users; persistence + UI roadmap." },
  { name: "Airport & Airline Ratings", status: "scaffold", note: "Editorial service ratings (staff/cleanliness/comfort/value) for airports + airlines by cabin class; seed data." },
  { name: "UV & Weather-Protection Customs", status: "scaffold", note: "Typical peak-UV band/months + how locals protect against sun/heat/wind/cold; editorial seed, not a live UV forecast." },
  { name: "Dress Code by Venue", status: "scaffold", note: "Respectful-dress guidance by venue (religious sites/dining/beach/nightlife); editorial, verify specific venue rules." },
  { name: "Photography Rules & Etiquette", status: "scaffold", note: "Where photos/drones are restricted + photographing people; editorial etiquette, not legal advice — check local/drone rules." },
  { name: "Public-Transport How-To", status: "scaffold", note: "Modes, ticketing/passes, payment methods + practical tips per destination; seed data, verify operator info." },
  { name: "Accessibility Capability", status: "scaffold", note: "Step-free/wheelchair access by facet (getting around/attractions/lodging/terrain); editorial, not a guarantee — confirm with venues." },
  { name: "Timezone & Business Hours", status: "scaffold", note: "IANA timezone + UTC offset, typical shop/restaurant/bank hours, weekend days, siesta notes; live local time from the zone, hours are seed." },
  { name: "Packing Guidance", status: "scaffold", note: "Year-round + seasonal packing items with priority and reason, climate/customs-aware; editorial, pack for the live forecast." },
  { name: "Best Time to Visit", status: "scaffold", note: "Per-month visit rating (weather/crowds/prices) with reasons; editorial seasonality, verify live forecast + events." },
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
  { name: "Social & Creator", status: "scaffold", note: "Saved collections (localStorage); pure cores for public posts (note/blog/vlog + zod), follow graph, and journey feed — storage/auth/UI blocked." },
  { name: "AI Planning", status: "roadmap", note: "Needs an LLM provider." },
];
