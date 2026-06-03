# Journee — Code → UI Mapping

> For each UI surface in [`ui-inventory.md`](./ui-inventory.md), this is the
> **wiring reference**: what already exists in the codebase to map to it
> (components, functions, types, content, API routes, flags), and what's still
> missing. Use it to start building without re-discovering the backend.

**Legend:** ✅ ready to wire · 🟡 partial (logic exists, data/feed roadmap) · ❌ not present (build it)

Conventions that hold everywhere:
- **Data is resolved, not imported.** Pages call `resolve<T>(capability)` from
  `@/lib/providers/registry` after importing `@/lib/providers/register`. Falls
  back to seed content when no provider is configured.
- **Copy/content lives in config**, not components: `@/lib/config/site.ts`,
  `@/content/*`. Add new copy there.
- **Feature flags** gate optional surfaces: `isFeatureEnabled(flag)` from
  `@/lib/config/flags.ts`. Known flags: `supabase-destinations`,
  `affiliate-catalog`, `mock-weather`, `mock-intelligence`, `pathfinder`,
  `travel-dna`, `ai-planning`.
- **Explainable scores** share one shape — `IntelligenceScore` (`@/lib/intelligence/types.ts`):
  `{ score: 0..100, confidence: 0..1, contributions: [{key,value,weight,weighted,note}], weightsVersion }`.
  Every engine emits this; one score-display component can render them all.

---

## Shared building blocks (reused across many surfaces)

| Concern | What exists | Where |
| --- | --- | --- |
| Site copy (name, tagline, description, hero image) | `site` config | `@/lib/config/site.ts` |
| Provider resolution + fallback | `resolve<T>()`, `allProviders()` | `@/lib/providers/registry` (+ `register`) |
| Feature flags | `isFeatureEnabled`, `KNOWN_FLAGS` | `@/lib/config/flags.ts` |
| SEO / JSON-LD | `siteJsonLd`, `jsonLdScript` | `@/lib/seo/jsonld.ts` |
| Logging / metrics | `log`, `getCounters` | `@/lib/observability/*` |
| A/B assignment | deterministic bucket from `jid` cookie | `@/lib/experiments/assignment.ts` |
| Saved set ops (pure) | `toggleId`, `parseSaved` | `@/lib/saved/collection.ts` |
| Saved hook (client) | `useSaved` | `@/components/useSaved.ts` |
| Explainable score core | `score()`, types, versioned `weights` | `@/lib/intelligence/{scoring,types,weights}.ts` |
| ❌ UI primitives (Button, Chip, Card, Modal, Toast, Skeleton, EmptyState) | none — styles are inlined per page | build in `@/components/ui/` |

---

## 0. Global shell

| UI item | Code available | Status |
| --- | --- | --- |
| Top nav | `Nav.tsx` (hardcoded `LINKS` array) | ✅ exists; ❌ mobile menu, ❌ saved-count badge, ❌ account entry |
| Footer | `Footer.tsx` (About, Privacy links) | ✅ exists; ❌ columns/social/newsletter |
| Loading / Error / 404 | `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` | ✅ |
| Design tokens | `globals.css` (fonts, gold/warm palette, animations) | ✅ |
| Primitives library | — | ❌ build |
| Cookie/consent banner | — | ❌ build |

---

## 1. Home / Landing (`app/page.tsx`)

| Section | Code available | Status |
| --- | --- | --- |
| Hero copy + image | `site.tagline`, `site.description`, `site.heroImageUrl` | ✅ |
| Rotating quotes | `heroQuotes` (`@/content/destinations`) + `QuoteRotator` | ✅ |
| Hero CTAs | static `<Link>` → `/plan`, `/discover`, `/saved` | ✅ |
| Featured grid + mood filter/search | `DestinationExplorer` over `resolve("destinations")` | ✅ |
| Affiliate CTA | `AffiliateCta category="hotels"` | ✅ (renders only if catalog resolves) |
| "How it works" pillars | `platformSystems` (`@/content/systems`) can seed copy | 🟡 data exists, ❌ section |
| Live-conditions showcase | `LightBadge`/`AtmosphericScore` (need lat/lon) | 🟡 components exist, ❌ section |
| Discover/Plan teasers | reuse `pathfind`, `buildItinerary` | 🟡 |
| Newsletter / testimonials / final CTA | — | ❌ build (+ content source) |

---

## 2. Destinations

**Catalog data:** `Destination` (`@/content/destinations`): `id, name, country, headline, mood, imageUrl, coordinates?, description?, bestTime?`. Resolve via `resolve("destinations")`; HTTP mirror at `GET /api/destinations`. Mood intensity via `intensityForMood(mood)`.

### 2a. Detail (`app/destinations/[id]/page.tsx`) — ✅ built

| Element | Code available | Status |
| --- | --- | --- |
| Editorial fields | `Destination` record | ✅ |
| Live light phase | `LightBadge`, `SunSchedule` + `solar.ts` (`solarAltitudeDeg`, `lightPhase`, `sunTimes`, `formatSolarTime`) | ✅ |
| Atmosphere score | `AtmosphericScore` (renders `IntelligenceScore`) | ✅ |
| Save | `SaveButton` + `useSaved` | ✅ |
| Affiliate CTA | `AffiliateCta` | ✅ |
| Map | `coordinates` present; `geo.ts` `haversineKm` | 🟡 data ready, ❌ map UI |
| Related/nearby | `geo.ts` `routeDistanceKm`/`haversineKm` | 🟡 logic, ❌ UI |
| Moon phase | `moon.ts` `moonPhase()` | 🟡 logic, ❌ UI |
| Weather panel | `weather` provider (`mock`) → `comfortScore(ComfortInput)`; gated by `mock-weather` | 🟡 mock only (live egress-blocked) |
| Safety / Visa / Culture / Events / Disruption / Conditions / City-energy | engines below | 🟡 engines exist, data roadmap |
| Photo gallery, share, "add to trip" | — | ❌ build |

**Engines available for detail enrichment** (all in `@/lib/intelligence`, all emit `IntelligenceScore` via `score()` with versioned weights):
`destinationEngine`, `eventEngine`, `disruptionEngine`, `safetyEngine`, `visaEngine`, `cultureEngine`, `conditionsEngine`, `cityEnergyEngine`, `memoryEngine`, `comfortScore`. Each takes an injected `*Context` input (no live feed yet) — perfect for wiring UI against seed/sample inputs now.

### 2b. Destinations index `/destinations` — ❌ page missing
Data + `DestinationCard`/`DestinationExplorer` exist; build the route, filters, pagination.

---

## 3. Discover (`app/discover/page.tsx`) — ✅ built

| Element | Code available | Status |
| --- | --- | --- |
| Vibe ranking | `pathfind(destinations, {vibe, avoid})` → `{id, score, reason}` | ✅ |
| Client UI | `DiscoverClient` | ✅ |
| HTTP | `GET /api/pathfinder?vibe=&avoid=` | ✅ |
| Flag | `pathfinder` | ✅ |
| Travel-DNA ranking (alt/extra) | `rankByDNA(dna, destinations)`, `affinityFor`, `MatchResult.reason`; flag `travel-dna` | 🟡 logic ready, ❌ UI |
| Multi-select chips, expandable "why" | reasons already returned by `pathfind` | 🟡 data, ❌ UI |

---

## 4. Plan (`app/plan/page.tsx`) — ✅ built

| Element | Code available | Status |
| --- | --- | --- |
| Plannable list | maps `Destination` → `PlannableDestination {id,name,mood,intensity,coordinates}` | ✅ |
| Deterministic itinerary | `buildItinerary(items, pacing)` → `Itinerary{pacing, days[]}`; `Pacing = relaxed\|balanced\|packed` | ✅ |
| Builder UI | `TripBuilder` | ✅ |
| Readiness panel | `TravelReadiness` + `composeTripReadiness`/`assembleTripReadiness` (`TripStop`, `TripReadiness`, `TripStopSummary`) | ✅ |
| Distance/route | `geo.ts` `routeDistanceKm` | ✅ |
| **AI planning** | `POST /api/plan/ai` { destinations, pacing, notes? } → `PlanningResult{summary, days[], providerId, model}`; provider seam `PlanningProvider` (Anthropic adapter); **503 when off** → fall back to `buildItinerary` | 🟡 wired server-side, gated by `ai-planning` + LLM key; ❌ client UI |
| Itinerary export | `@/lib/intelligence/itinerary-export.ts` | 🟡 logic, ❌ export UI |
| Save/name/share trip | — | ❌ build |
| Budget summary | `creditPackages`, pricing config | 🟡 |

**Metering for AI plans:** `evaluateEntitlement`/`consumeEntitlement` (`@/lib/billing/entitlements`), `EMPTY_USAGE`, store `getUsageStore`, identity `getClientIp`, quotas `FREE_AI_PLANS=3`, `FREE_AI_PLANS_PER_IP=15` (`@/content/pricing`). → drives the paywall/upgrade UI (§13/§18).

---

## 5. Saved (`app/saved/page.tsx`) — ✅ built
`SavedList` + `useSaved` (localStorage) + pure `toggleId`/`parseSaved`. Collections/folders and account-sync are ❌.

---

## 6. Static / legal / pricing

| Page | Code available | Status |
| --- | --- | --- |
| About | `platformSystems` roster + `site` | ✅ |
| Privacy | static copy | ✅ |
| Pricing | `creditPackages` (Starter/Explorer/Voyager), `findPackage(id)`, `FREE_AI_PLANS` | 🟡 content ready, ❌ page |
| Terms / Contact / FAQ / Help | — | ❌ build (+ content source) |

---

## 7. Monetization

| Element | Code available | Status |
| --- | --- | --- |
| Affiliate CTA | `AffiliateCta` (client) → `GET /api/affiliate/link?category=` → `{href, campaignId} \| null` | ✅ |
| Categories | `AFFILIATE_CATEGORIES` (flights, hotels, experiences, tours, restaurants, insurance, esim, ticketing, luxury, transportation) | ✅ |
| Routing/URL | `resolveAffiliateLink`, `renderAffiliateUrl`, A/B via `jid` cookie | ✅ |
| Click/conversion ingest | `POST /api/affiliate/click`, `/conversion` | ✅ |
| Catalog source | `getAffiliateCatalog()`; flag `affiliate-catalog`; Supabase adapter scaffold | 🟡 unconfigured → CTA hidden |
| Disclosure / comparison module | — | ❌ build |

---

## 8. Account & Auth — ❌ no UI

No auth UI exists. **Available to build against:** billing/entitlement logic (`@/lib/billing/*`), `creditPackages`, `TravelDNA` shape for a profile. **Missing:** all auth screens, Supabase Auth wiring, session handling (roadmap — see `docs/architecture/authentication-architecture.md`).

---

## 9. Intelligence surfaces — 🟡 engines ready, feeds roadmap

All engines live in `@/lib/intelligence` and share `IntelligenceScore`. ✅ The
reusable widget exists: **`ScorePanel`** (`@/components/ui`) renders any
`IntelligenceScore` — number, honest confidence line, and per-signal
breakdown. `AtmosphericScore` now delegates to it; point every other engine
surface at the same component.

| UI surface | Engine / fn | Signal keys export | Data feed |
| --- | --- | --- | --- |
| Travel Confidence | `aggregateTravelConfidence` + `travelConfidenceWeights` | `EngineResult` | 🟡 sample |
| Real-time conditions | `conditionsEngine` | `CONDITIONS_SIGNAL_KEYS` | roadmap |
| Festival & cultural | `eventEngine` | `EVENT_SIGNAL_KEYS` | roadmap |
| Political & disruption | `disruptionEngine` | `DISRUPTION_SIGNAL_KEYS` | roadmap |
| Safety & risk | `safetyEngine` | `SAFETY_SIGNAL_KEYS` | roadmap |
| Visa & entry | `visaEngine` | `VISA_SIGNAL_KEYS` | roadmap |
| Local culture | `cultureEngine` | `CULTURE_SIGNAL_KEYS` | roadmap |
| City energy | `cityEnergyEngine` | `CITY_ENERGY_SIGNAL_KEYS` | roadmap |
| Memory & reflection | `memoryEngine` | `MEMORY_SIGNAL_KEYS` | roadmap |
| Destination readiness | `assembleDestinationReadiness` → `DestinationReadiness` (+ `SourceProvenance`) | — | 🟡 seed-fed (see `/api/admin/readiness`) |
| Weather/comfort | `comfortScore(ComfortInput)` via `weather` provider | — | 🟡 mock (`mock-weather`) |
| AI planning assistant | `PlanningProvider` / `POST /api/plan/ai` | — | 🟡 needs LLM key |
| Travel DNA profile | `rankByDNA`, `affinityFor`, `TravelDNA` | — | 🟡 model only |

Each engine accepts an **injected `*Context`** so you can build and demo the UI against sample inputs today; swapping in a live feed later doesn't touch the UI.

---

## 10. Admin / control plane — 🟡 APIs exist, ❌ no UI

| Dashboard | API available | Notes |
| --- | --- | --- |
| System status / providers / flags / counters | `GET /api/admin/status` | secure-by-default: 503 unless `JOURNEE_ADMIN_TOKEN` set, then `x-admin-token` header |
| End-to-end readiness (destination/trip) | `GET /api/admin/readiness?destinationId=&stop=` | returns real `DestinationReadiness`/`TripReadiness` with provenance |
| Affiliate revenue analytics | `GET /api/affiliate/analytics?since=&until=&limit=&offset=` | per-campaign metrics; 503 unconfigured |
| Health / liveness | `GET /api/health` | config presence as booleans |
| Metrics counters | `GET /api/metrics` | `getCounters()` snapshot |
| Travel-data readiness | `reportTravelDataReadiness()` | `@/lib/providers/travel-data/registry` |
| Feature-flag viewer | `KNOWN_FLAGS` + `isFeatureEnabled` | — |

All data exists; build the gated dashboard UI on top.

---

## 11–20. Newer surfaces — mostly ❌, with these footholds

| Surface (inventory §) | What exists to build on | Status |
| --- | --- | --- |
| Search/results (§11) | catalog data + `pathfind`; no search index | ❌ UI |
| Onboarding/first-run (§12) | `TravelDNA` shape to capture prefs | ❌ UI |
| Checkout/billing (§13) | `creditPackages`, `findPackage`, entitlement engine, usage store | 🟡 logic, ❌ checkout UI + payment provider |
| Notifications/email (§14) | `log`/metrics; no mail layer | ❌ build |
| Editorial/guides/collections (§15) | provider pattern + `Destination`; no content model for articles | ❌ content model + UI |
| Trips management (§16) | `Itinerary`, export logic; no persistence | ❌ persistence + UI |
| Sharing/social (§17) | per-destination OG (`opengraph-image.tsx`), `manifest.ts` | 🟡 destination OG only |
| System states/paywall (§18) | entitlement result (`allowed/source/remaining`), quotas | 🟡 logic, ❌ states |
| Company/marketing (§19) | — | ❌ build |
| i18n / a11y / theme (§20) | copy centralized in config/content; dark default in `globals.css` | 🟡 foundation, ❌ switchers |

---

## Quick "what can I build right now with zero new backend?"

These have **all data/logic present** — pure UI work:

1. **Reusable primitives** (`@/components/ui/`) — unblocks everything.
2. **Destinations index `/destinations`** — catalog + cards + `DestinationExplorer` exist.
3. **Pricing page `/pricing`** — `creditPackages` + `FREE_AI_PLANS` ready.
4. **Home sections** (how-it-works, teasers) — `platformSystems`, `pathfind`, `buildItinerary`, `LightBadge`/`AtmosphericScore` all present.
5. ✅ **Generalized explainable-score widget** — `ScorePanel` (`@/components/ui`) renders any `IntelligenceScore`; reuse for every §9 engine.
6. **AI-planning client UI** — `POST /api/plan/ai` is wired; just needs a form + graceful 503 fallback to `buildItinerary`.
7. **Admin dashboard** — every `/api/admin/*` + analytics endpoint already returns JSON.

---

_Last updated: 2026-05-29 · Keep in sync with `ui-inventory.md` and the code it references._
