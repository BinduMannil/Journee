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
| Dynamic Itinerary (`/plan`) | ✅ | Fatigue-aware day pacing; `.ics` export | Wire to AI planning + live readiness (UI) |
| Carbon Estimate | ✅ | Per-trip CO2e from route distance × versioned emission model (`carbon-v1`); mode inferred per leg; honest "estimate" labeling | Per-mode overrides from real itinerary legs; UI surfacing |
| Food & Drink Customs | ✅ (seed) | Editorial per-destination profile (popular dishes, signature drink, pork/beef prevalence, veg-friendliness, alcohol-in-supermarkets, public-drinking) + derived honest flags; `CULINARY_DATA_NOTE` disclaimer | Live/expanded coverage; UI surfacing |
| Local Gems (Eats & Drinks) | ✅ (seed) | Curated standout eats/drinks per destination with area, what-to-order, and why; `getLocalGems` / `gemsByKind`; `GEMS_DATA_NOTE` | User/UGC picks (via ratings core + auth), expanded coverage, UI |
| City Vibe & Friendliness | ✅ (seed) | Per-destination friendliness (0..5), vibe tags, tourist-ease, English-spoken, summary + `expectLanguageBarrier`; `CITY_VIBE_NOTE` | Fold into City Energy engine as a live signal; UI |
| Festivals & Holidays | ✅ (seed) | Notable festivals/holidays per destination with significance, what-to-expect, and whether visitors can join; `festivalsInMonth` / `joinableFestivals`; typical months; `FESTIVALS_DATA_NOTE` | Live calendar + exact dates; tie to events engine; UI |
| Religion & Places of Worship | ✅ (seed) | Predominant religions + major mosques/temples/churches/synagogues per destination; `getReligionProfile` / `placesOfWorshipByKind`; `RELIGION_DATA_NOTE` | Geo/live listings, expanded coverage, UI |
| Tipping Norms | ✅ (seed) | Restaurant/taxi/hotel tipping expectations + service-charge norms + `tippingSummaryLine`; `TIPPING_DATA_NOTE` | Expanded coverage, UI |
| Connectivity & Power | ✅ (seed) | Plug types/voltage, SIM/eSIM options, tap-water potability + `tapWaterAdvice`, coverage notes; `CONNECTIVITY_DATA_NOTE` | Live coverage data, UI |
| Know-Before-You-Go Essentials | ✅ (seed) | Per-destination emergency numbers (+ flat list), healthcare note, courtesy phrases (hello/thanks/please/yes/no in the local language), etiquette do's/don'ts; `ESSENTIALS_DATA_NOTE` disclaimer | Hospital/clinic locations (live), expanded coverage, UI |
| Shopping & Essentials | ✅ (seed) | Per-destination malls, markets/souks, online/e-commerce, fuel networks + EV-charging availability, payment norms + derived tips; `SHOPPING_DATA_NOTE` disclaimer | Live directory/geo, expanded coverage, UI |
| Local Chains | ✅ (seed) | Recognizable chains by category (cinema, coffee, pharmacy, supermarket, fast food, hospital) per destination + `chainsForCategory`; `CHAINS_DATA_NOTE` disclaimer | Live directory/geo, expanded coverage, UI |
| Seasonal Fruits | ✅ (seed) | In-season (by local month) + must-try fruits with editorial global taste/production ratings; `inSeasonFruits` / `mustTryFruits`; `FRUITS_DATA_NOTE` disclaimer | Live/expanded coverage, UI |
| Airport & Terminal Intel | ✅ (seed) | Per-destination airports: terminals, inter-terminal transfer mode, boarding method, airport→city distance + access modes; `getAirportsProfile` / `primaryAirport`; `AIRPORTS_DATA_NOTE` | Live/geo source, more airports, UI |
| Ratings core | ✅ (pure) | `aggregateRatings` (count, mean, confidence-weighted/Bayesian score, confidence) + `rankByRating`, versioned (`rating-v1`) — the shared core for rating restaurants/places/users | Persistence + auth + UI (⛔) |
| Airport & Airline Ratings | ✅ (seed) | Editorial service ratings (staff/cleanliness/comfort/value) for catalogued airports + airlines **by cabin class**; `overallScore`, accessors by code/destination/name/class; `TRANSIT_RATINGS_NOTE` | User-submitted ratings (via ratings core + auth/persistence), more airlines, UI |
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
6. Per-destination editorial-confidence signal.

## Requested / candidate features (queued — built in order, seed-backed first)

Captured as they're proposed; each is built behind the existing provider/engine
patterns (seed/estimate data, honestly labeled) until a live source is available.

Requested by the product owner; built in roughly this order, seed/estimate
data first (honestly labeled), live sources and UI later.

**Local-knowledge intelligence (seed/editorial, buildable now):**
- **Traveller inclusion & safety** — LGBTQ+ legal status & social climate;
  religious-minority (incl. Jewish) and solo-women safety context. Factual,
  sourced-where-possible, strongly disclaimered (describes laws/climate, **not**
  endorsement); high-stakes so flag "verify current advisories". **(Next up.)**
- **More suggested ideas to consider:** typical costs (meal/coffee/taxi index) ·
  scams to watch for · dress code by venue · public-transport how-to
  (tickets/passes) · accessibility details · time-zone & business hours ·
  packing/seasonal-clothing guidance · photography rules.
- **UV & weather-protection customs** — UV index from the live weather feed
  (Open-Meteo supports it, ⛔ egress) + an editorial seed of how locals protect
  against the elements (siesta, parasols, layering, hammam, etc.).
- **Hospital / clinic locations** — extend the essentials with nearest
  hospital/clinic info (live/geo source later; emergency numbers already shipped).
- **Trip budget / cost estimate** — aggregate seed ticket prices + lodging-tier
  config into a per-trip estimate with confidence.
- **Best-time-to-visit signal** — seasonality + real solar + (seed) events.
- **Accessibility capability** — step-free / wheelchair info, seed-backed.
- **Multi-currency normalization** — seed FX layer over ticket prices (labeled).
- **"Explain my ranking" endpoint** — expose the scoring contribution breakdown.
- **Itinerary GeoJSON / route export** — complement the `.ics` export.

**Community / UGC & social (needs auth + persistence + UI — ⛔ blocked; build
the pure cores now):**
- **Public notes & travel blogs/vlogs** — users author posts/journals to share
  publicly. Pure content model + validation buildable now; storage/UI blocked.
- **Follow graph & journey feed** — follow other travellers; a feed of their
  posts/journeys. Pure feed-composition algorithm buildable now.
- **Ratings & recommendations** — users rate and recommend restaurants, places,
  and each other's posts/profiles. Pure **rating-aggregation** core (mean +
  count + confidence-weighted/Bayesian score to avoid the "1 five-star review =
  best" trap) buildable now; persistence/auth/UI blocked.

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
