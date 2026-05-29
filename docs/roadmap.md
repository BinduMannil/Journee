# Feature Roadmap & Status Register

_Last updated: 2026-05-29. The canonical "what's built / what's left" register._

This is the single place to see **every feature, its real status, what exists
today, and what it needs to advance**. It is deliberately honest about maturity
(see `docs/README.md` documentation principles): nothing here is described as
working unless it is.

## Sources of truth (this doc consolidates them)

- **`src/content/systems.ts`** — the machine-readable per-system status
  (`live | scaffold | roadmap`) rendered on `/about`. **That file is the status
  source; update it when a system's status changes**, and reflect it here.
- **`docs/architecture/intelligence-engine-architecture.md`** — engine roster +
  signal model.
- **`docs/governance/continuation-handoff.md`** — the rolling per-session
  next-steps queue and the externally-blocked queue.
- **`docs/runbooks/hosted-enablement.md`** — the config-only steps to turn on
  the "built, inert" items below.

Status legend: **✅ live** (real working logic; data may be seed/sample) ·
**🟡 scaffold** (logic + versioned weights real; needs a live data feed and/or
UI) · **🔌 built-inert** (adapter built; enabled by config only) · **⛔ blocked**
(needs external access) · **⬜ not started**.

## Platform features

### ✅ Built & working

| Feature | Status | What exists | Left to build |
| --- | --- | --- | --- |
| Destination Intelligence | ✅ | Explainable score; **real** solar light-phase/golden-hour signal | More live signals (weather/events) as feeds land |
| Pathfinder Discovery (`/discover`) | ✅ | Vibe-based ranking with reasons + avoid arm | — (tune weights as data grows) |
| Dynamic Itinerary (`/plan`) | ✅ | Fatigue-aware day pacing; `.ics` calendar export + **GeoJSON route export** (`itineraryToGeoJSON`: ordered `Point`s + a route `LineString` with great-circle length, RFC 7946 `[lon,lat]`) | Wire to AI planning + live readiness (UI); waypoint coords from the catalog at the surface layer |
| Carbon Estimate | ✅ | Per-trip CO2e from route distance × versioned emission model (`carbon-v1`); mode inferred per leg; honest "estimate" labeling | Per-mode overrides from real itinerary legs; UI surfacing |
| Trip Budget Estimate | ✅ (seed) | Per-trip cost estimate: lodging (nightly by area `StayCostTier`, `lodging-seed-v1`) + on-the-ground daily food/transport (cost index) × nights × travelers, normalized to any currency via the seed FX layer; per-stop breakdown + confidence; `LODGING_DATA_NOTE` (estimate, not live prices) | Live lodging/price feeds; UI |
| Food & Drink Customs | ✅ (seed) | Editorial per-destination profile (popular dishes, signature drink, pork/beef prevalence, veg-friendliness, alcohol-in-supermarkets, public-drinking) + derived honest flags; `CULINARY_DATA_NOTE` disclaimer | Live/expanded coverage; UI surfacing |
| Local Gems (Eats & Drinks) | ✅ (seed) | Curated standout eats/drinks per destination with area, what-to-order, and why; `getLocalGems` / `gemsByKind`; `GEMS_DATA_NOTE` | User/UGC picks (via ratings core + auth), expanded coverage, UI |
| City Vibe & Friendliness | ✅ (seed) | Per-destination friendliness (0..5), vibe tags, tourist-ease, English-spoken, summary + `expectLanguageBarrier`; `CITY_VIBE_NOTE` | Fold into City Energy engine as a live signal; UI |
| Festivals & Holidays | ✅ (seed) | Notable festivals/holidays per destination with significance, what-to-expect, and whether visitors can join; `festivalsInMonth` / `joinableFestivals`; typical months; `FESTIVALS_DATA_NOTE` | Live calendar + exact dates; tie to events engine; UI |
| Religion & Places of Worship | ✅ (seed) | Predominant religions + major mosques/temples/churches/synagogues per destination; `getReligionProfile` / `placesOfWorshipByKind`; `RELIGION_DATA_NOTE` | Geo/live listings, expanded coverage, UI |
| Tipping Norms | ✅ (seed) | Restaurant/taxi/hotel tipping expectations + service-charge norms + `tippingSummaryLine`; `TIPPING_DATA_NOTE` | Expanded coverage, UI |
| Connectivity & Power | ✅ (seed) | Plug types/voltage, SIM/eSIM options, tap-water potability + `tapWaterAdvice`, coverage notes; `CONNECTIVITY_DATA_NOTE` | Live coverage data, UI |
| Traveller Inclusion & Safety | ✅ (seed) | LGBTQ+ legal status + same-sex-marriage + social climate, religious-minority & solo-women notes; `getInclusionProfile`; factual, strongly disclaimered (`INCLUSION_DATA_NOTE`) | Tie to live govt advisories, expanded coverage, UI |
| Cost Index | ✅ (seed) | Approx meal/coffee/beer/taxi prices + affordability band + `dailyBudgetEstimateUsd`; `COSTS_DATA_NOTE` | Live FX, more cities, UI |
| Neighborhoods & Where to Stay | ✅ (seed) | Areas within each destination with character tags (historic/beach/nightlife/scenic/…), who each suits, and a *relative* stay-cost tier (budget→luxury); `getNeighborhoods` / `neighborhoodsByType` / `neighborhoodsByCostTier` / `areasWithinBudget`; `NEIGHBORHOODS_DATA_NOTE` (tiers are relative, not live quotes) | Live lodging prices (tie to FX/cost layers), more areas, UI |
| Day Trips & Excursions | ✅ (seed) | Popular trips within reach of each base with type tags, approximate travel time + mode, and why; `getDayTrips` / `dayTripsByType`; `DAY_TRIPS_DATA_NOTE` (approximate, not a live transit/tour feed) | Live transit/tour data, more trips, UI |
| Multi-Currency Normalization | ✅ (seed) | Indicative, dated SEED FX table (`fx-seed-v1`) + `convertUsd` / `convertCurrency` (cross via USD) / `costPricesIn` (cost anchors in any catalogued currency); `FX_DATA_NOTE` (never a live quote) | Live FX feed behind a provider (⛔ egress); more currencies; UI |
| Scams & Safety Tips | ✅ (seed) | Common scams (how + how-to-avoid) + general safety tips per destination; `getSafetyTips` / `scamNames`; `SAFETY_TIPS_DATA_NOTE` | Expanded coverage, UI |
| Hazards & Advisories | ✅ (seed) | Per-destination natural-hazard exposure (quake/volcano/typhoon/wildfire/etc.), conflict status, typical advisory level (1–4); `getHazardsProfile` / `highRiskHazards`; factual exposure not a forecast (`HAZARDS_DATA_NOTE`) | Tie to live govt advisories + disruption engine; UI |
| Display Preferences & Units | ✅ (pure) | `UserPreferences` (currency, °C/°F, km/mi) + converters + `formatTemperature`/`formatDistance`/`formatCurrency` (display only, no FX yet); `PREFERENCES_NOTE` | Persistence + profile UI + live FX (⛔) |
| Know-Before-You-Go Essentials | ✅ (seed) | Per-destination emergency numbers (+ flat list), healthcare note, courtesy phrases (hello/thanks/please/yes/no in the local language), etiquette do's/don'ts; `ESSENTIALS_DATA_NOTE` disclaimer | Expanded coverage, UI |
| Healthcare & Medical Facilities | ✅ (seed) | Notable hospitals/clinics/pharmacies/dental per destination with area + English-spoken + a pharmacy note; `getHealthcareProfile` / `facilitiesByKind` / `hasHospital`; `HEALTHCARE_DATA_NOTE` (not medical advice / not a live directory) | Live/geo directory, expanded coverage, UI |
| Shopping & Essentials | ✅ (seed) | Per-destination malls, markets/souks, online/e-commerce, fuel networks + EV-charging availability, payment norms + derived tips; `SHOPPING_DATA_NOTE` disclaimer | Live directory/geo, expanded coverage, UI |
| Local Chains | ✅ (seed) | Recognizable chains by category (cinema, coffee, pharmacy, supermarket, fast food, hospital) per destination + `chainsForCategory`; `CHAINS_DATA_NOTE` disclaimer | Live directory/geo, expanded coverage, UI |
| Seasonal Fruits | ✅ (seed) | In-season (by local month) + must-try fruits with editorial global taste/production ratings; `inSeasonFruits` / `mustTryFruits`; `FRUITS_DATA_NOTE` disclaimer | Live/expanded coverage, UI |
| Airport & Terminal Intel | ✅ (seed) | Per-destination airports: terminals, inter-terminal transfer mode, boarding method, airport→city distance + access modes; `getAirportsProfile` / `primaryAirport`; `AIRPORTS_DATA_NOTE` | Live/geo source, more airports, UI |
| Ratings core | ✅ (pure) | `aggregateRatings` (count, mean, confidence-weighted/Bayesian score, confidence) + `rankByRating`, versioned (`rating-v1`) — the shared core for rating restaurants/places/users | Persistence + auth + UI (⛔) |
| Airport & Airline Ratings | ✅ (seed) | Editorial service ratings (staff/cleanliness/comfort/value) for catalogued airports + airlines **by cabin class**; `overallScore`, accessors by code/destination/name/class; `TRANSIT_RATINGS_NOTE` | User-submitted ratings (via ratings core + auth/persistence), more airlines, UI |
| UV & Weather-Protection Customs | ✅ (seed) | Typical peak-UV band + months per destination + how locals protect against sun/heat/wind/cold/rain; `getUvProtectionProfile` / `protectionFor` / `isHighUv`; `UV_PROTECTION_NOTE` | Live UV index from the weather feed (⛔ Open-Meteo egress); expanded coverage; UI |
| Dress Code by Venue | ✅ (seed) | Respectful-dress guidance by venue kind (religious site/fine dining/beach-pool/nightlife/general) with strictness; `getDressCode` / `dressGuidanceFor` / `venuesNeedingModesty`; `DRESS_CODE_NOTE` | Expanded coverage, UI |
| Photography Rules & Etiquette | ✅ (seed) | Per-destination photo/drone rules by subject kind (people/religious/government/museum/drone) with permission level; `getPhotographyProfile` / `photoRuleFor` / `prohibitedSubjects`; `PHOTOGRAPHY_DATA_NOTE` | Live/expanded regulations, UI |
| Public-Transport How-To | ✅ (seed) | Modes, ticketing/passes, payment methods + practical tip per destination; `getTransitHowTo` / `transitOptionFor` / `acceptsContactless`; `TRANSIT_HOWTO_NOTE` | Live operator/route/fare data, expanded coverage, UI |
| Transport Modes | ✅ (seed) | Comprehensive per-destination catalog of every transport mode (metro/bus/tram/train/taxi/rideshare/tuk-tuk/ferry/funicular/cable-car/scooter/ATV/caleche/bike-share/walk) with availability + a note; `getTransportModes` / `isModeAvailable` / `modesByAvailability`; `TRANSPORT_MODES_NOTE` | Live availability/fare feed, expanded coverage, UI |
| Tourist Item Base Prices | ✅ (seed) | Fair/typical USD price ranges for common tourist buys by category + a bargaining-expected flag + anti-overcharging notes; `getTouristPrices` / `pricesByCategory` / `fairPriceRange`; `TOURIST_PRICES_NOTE` (approximate, not live quotes) | Live price signals, more items, UI |
| Tourist Sites & Attractions | ✅ (seed) | Top sites per destination with cost band/approx USD, best time of day + why (light/weather/heat/crowds), typical busyness, typical hours, and an honest booking note (no fabricated/affiliate URLs); `getAttractions` / `attractionsByBestTime` / `freeAttractions`; `ATTRACTIONS_DATA_NOTE` | Live hours/ticketing/crowd feeds, real booking integration, more sites, UI |
| Accessibility Capability | ✅ (seed) | Step-free/wheelchair access + mobility realities by facet (getting around/attractions/lodging/terrain) with a level; `getAccessibilityProfile` / `accessAspectFor` / `challengingFacets`; `ACCESSIBILITY_DATA_NOTE` | Per-venue live data, expanded coverage, UI |
| Timezone & Business Hours | ✅ (seed) | IANA timezone + UTC offset, typical shop/restaurant/bank/government/market hours, weekend days, siesta notes; `getTimezoneProfile` / `businessHoursFor` / `currentTimeAt` (live local time via the zone); `TIMEZONE_DATA_NOTE` | Live/expanded hours, holiday calendars, UI |
| Packing Guidance | ✅ (seed) | Year-round + seasonal packing items with priority + reason, climate/customs-aware; `getPackingProfile` / `packingForSeason` / `essentialItems`; `PACKING_DATA_NOTE` | Tie to live forecast + itinerary activities, UI |
| Best Time to Visit | ✅ (seed) | Per-month visit rating (weather/crowds/prices) + reason; `getBestTimeProfile` / `monthAssessment` / `idealMonths`; `BEST_TIME_DATA_NOTE` | Tie to real solar + live events/weather, UI |
| Affiliate & Monetization | ✅ | Data-driven routing, A/B, click/conversion ingestion, analytics | Live catalog via hosted Supabase (⛔) |
| Travel-data backend | ✅ (seed) | 7 capability contracts, source/freshness/confidence model, trust-ordered registry, TTL cache, strict resolver, readiness assemblers, **JSON-Schema export**, observability, gated admin readiness | **Live vendor adapters** (⛔ egress); UI surfacing (deferred) |
| Observability & control plane | ✅ | Structured logs, counter metrics, `/api/metrics`, `/api/health`, secure-by-default `/api/admin/{status,readiness}` | Cache stats endpoint; latency histograms (non-blocked queue) |

### 🔌 Built, inert — enabled by config only

| Feature | Enable with | Blocked by |
| --- | --- | --- |
| AI Planning (`POST /api/plan/ai`, Anthropic adapter) | `LLM_API_KEY` (+ `LLM_MODEL`) + `ai-planning` flag | ⛔ no LLM key / network egress in this env |
| Live Weather (Open-Meteo `WeatherProvider`) | `live-weather` flag + host egress | ⛔ Open-Meteo egress blocked by network allow-list |
| Hosted destinations / affiliate catalog (Supabase adapters) | env secrets + `supabase db push` + flags | ⛔ hosted Supabase access |

### 🟡 Scaffolded — engine logic real, needs a live feed and/or UI

Each has a pure, tested engine (input→signal mapping) + versioned weights; what's
left is a **live data source** (and eventually UI surfacing). See
`intelligence-engine-architecture.md` for the signal tables.

| Engine / system | Left to build (the data feed) |
| --- | --- |
| Travel Confidence (aggregate) | Nothing structural — improves as sub-engine feeds land |
| Event & Cultural | Live event/holiday calendars |
| Political & Disruption | Government advisory feeds |
| Weather & Environmental | Live weather feed (see Open-Meteo, ⛔ egress) |
| Safety & Risk | Safety/crime datasets |
| Visa & Entry | Visa/entry-rules dataset |
| Local Culture | Etiquette/culture datasets |
| Real-Time Conditions | Live airport/transit status |
| City Energy | Live density/crowd signals |
| Memory & Reflection | Capture/feedback loop |
| Travel DNA | (model live; deepen with behavioral data) |
| Social & Creator | Server persistence (saved is `localStorage` today) |

### ⬜ Not started (no code yet)

- **Auth & user sessions** — Supabase Auth + RLS (key-separation scaffold exists;
  see `authentication-architecture.md`).
- **UI surfacing of the travel-data backend** — intentionally deferred while the
  backend is completed (no `.tsx`/page work this phase).
- Each not-yet-started system gets its own architecture doc + ADR **when design
  begins** — not before.

## Near-term non-blocked backend queue

Mirrors `continuation-handoff.md` (kept in sync each session):

1. ✅ `resolveTravelDataMany([{kind,query},…])` heterogeneous fan-out — **done**.
2. ✅ Cache stats / clear admin endpoint (`/api/admin/cache`) — **done**.
3. ✅ Carbon-footprint estimate (`intelligence/carbon.ts`) — **done**.
4. Per-kind latency histograms (`_duration_ms_bucket{le=…}`).
5. Engine-bridge expansion (reviews → safety; advisory/events → conditions).
6. ✅ Per-destination editorial-confidence signal — **done**
   (`editorialCoverage` / `editorialConfidence`: present/missing seed features +
   0..1 coverage, an honest data-completeness meta-signal).

## Requested / candidate features (queued — built in order, seed-backed first)

Captured as they're proposed; each is built behind the existing provider/engine
patterns (seed/estimate data, honestly labeled) until a live source is available.

Requested by the product owner; built in roughly this order, seed/estimate
data first (honestly labeled), live sources and UI later.

**Local-knowledge intelligence (seed/editorial, buildable now):**
- ✅ **Dress code by venue** — shipped (seed). ✅ **Public-transport how-to** —
  shipped (seed). ✅ **Photography rules** — shipped (seed). ✅ **UV &
  weather-protection customs** — shipped (seed; UV index from the live weather
  feed remains ⛔ egress-blocked).
- ✅ **Accessibility capability** — shipped (seed). ✅ **Time-zone & business
  hours** — shipped (seed). ✅ **Packing/seasonal-clothing guidance** — shipped
  (seed). ✅ **Best-time-to-visit signal** — shipped (seed; tie to real solar +
  live events/weather later).
- ✅ **Hospital / clinic locations** — shipped (seed `healthcare` feature:
  notable hospitals/clinics/pharmacies with area + English-spoken; live/geo
  directory later).
- ✅ **Neighborhoods & where to stay** (product-owner request) — shipped (seed:
  areas/towns per destination with character tags + a relative stay-cost tier;
  live lodging prices later).
- ✅ **All transport modes / tourist base prices / tourist sites with best
  time-of-day** (product-owner requests) — shipped (seed `transport-modes`,
  `tourist-prices`, `attractions`). Anti-scam is served by the existing
  **Scams & Safety Tips** feature plus tourist base prices.
- ✅ **Trip budget / cost estimate** — shipped (`estimateTripBudget`: lodging by
  area tier + cost-index daily spend × nights/travelers, in any currency, with a
  per-stop breakdown + confidence; seed estimates, not live prices).
- ✅ **Multi-currency normalization** — shipped (seed FX layer over the cost
  anchors, indicative-only, behind a provider-ready accessor).
- ✅ **"Explain my ranking" endpoint** — shipped (`explainScore` +
  `POST /api/explain`; ranks contribution shares, top driver vs. weakest signal).
- ✅ **Itinerary GeoJSON / route export** — shipped (`itineraryToGeoJSON`,
  pure; complements the `.ics` export).

**Community / UGC & social (needs auth + persistence + UI — ⛔ blocked; pure
cores built now):**
- ✅ **Public notes & travel blogs/vlogs** — pure core shipped (`src/lib/social/
  posts.ts`: `TravelPost` note/blog/vlog content model + zod `parsePost`, vlogs
  require a media URL, http(s)-only). Storage/auth/UI still blocked.
- ✅ **Follow graph & journey feed** — pure cores shipped (`follow-graph.ts`:
  `buildFollowGraph`/`following`/`followers`/`isFollowing`/`mutuals`/
  `suggestFollows`; `journey-feed.ts`: `composeFeed` — followed-author posts,
  recency-ranked, paged). Storage/auth/UI still blocked.
- ✅ **Ratings & recommendations** — pure cores shipped. The Bayesian
  rating-aggregation core (`intelligence/ratings.ts`, `rating-v1`) plus the
  social glue (`social/recommendations.ts`: `groupRatingsByTarget` de-dupes per
  rater (latest wins), `aggregateTarget`, `rankTargets`, `recommendTargets` with
  min count/confidence + limit) let posts/places/users be rated and recommended.
  Persistence/auth/UI still blocked.

## Externally blocked (resume when access is granted)

| Blocked item | Needs |
| --- | --- |
| Hosted Supabase (destinations, affiliate catalog, event ingestion) | Real project secrets |
| Live weather feed | Open-Meteo host on the egress allow-list |
| Live LLM / AI planning | An `LLM_API_KEY` + network egress |
| Live travel-data vendors | Vendor access + egress (adapters slot behind existing contracts) |
| Branch protection / org settings | Repo-admin access |

## How this stays current

Per the project conventions, **an architecture-changing PR updates the relevant
doc in the same PR**. For features specifically: when a system changes status,
update `src/content/systems.ts` (the rendered source) **and** the matching row
here, in the same PR. This doc is the human-readable register; `systems.ts` is
the machine-readable one they must agree.
