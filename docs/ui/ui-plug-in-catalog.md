# Journee — UI Plug-in Catalog

> The definitive reference of **everything currently available to plug into the
> UI**: components, hooks, primitives, content/config, intelligence engines,
> providers, billing, helpers, and API endpoints — with import paths and
> signatures. This is a catalog of building blocks, **not** a UI spec. For
> per-surface mapping see [`ui-code-map.md`](./ui-code-map.md); for the screen
> checklist see [`ui-inventory.md`](./ui-inventory.md).
>
> Scope note: lists only what exists in the codebase today. Items whose live
> data feed is still roadmap are marked 🟡 (the logic/contract is callable now
> with injected/seed input).

---

## 0. The three consumption patterns

Everything below is consumed one of three ways:

1. **Data** — resolve through the provider registry (with seed fallback):
   ```ts
   import { resolve } from "@/lib/providers/registry";
   import "@/lib/providers/register"; // wires adapters (import once per entry)
   const destinations = (await resolve<readonly Destination[]>("destinations")) ?? [];
   ```
2. **Copy / config** — import typed content; never hardcode strings in components:
   `@/lib/config/site`, `@/content/*`.
3. **Feature flags** — gate optional surfaces:
   ```ts
   import { isFeatureEnabled } from "@/lib/config/flags";
   if (isFeatureEnabled("ai-planning")) { /* … */ }
   ```

---

## 1. React components (`@/components/*`)

| Component | Props | Notes |
| --- | --- | --- |
| `Nav` | — | Sticky primary nav (links are an internal array). |
| `Footer` | — | Site footer. |
| `QuoteRotator` | `{ quotes: readonly string[] }` | Rotating hero quotes. |
| `DestinationCard` | `{ destination: Destination }` | Cinematic card → `/destinations/[id]`. |
| `DestinationExplorer` | `{ destinations: readonly Destination[] }` | Mood filter + search + grid (client). |
| `SaveButton` | `{ id: string }` | Toggle save (localStorage). |
| `SavedList` | `{ destinations: readonly Destination[] }` | Saved collection w/ empty state. |
| `LightBadge` | `{ lat: number; lon: number }` | Live light-phase pill (solar math). |
| `SunSchedule` | `{ lat: number }` | Sunrise/sunset/golden-hour times. |
| `AtmosphericScore` | `{ lat: number; lon: number }` | Live explainable score (delegates to `ScorePanel`). |
| `DiscoverClient` | `{ destinations: readonly Destination[] }` | Pathfinder vibe ranking UI. |
| `TripBuilder` | `{ destinations: readonly PlannableDestination[] }` | Itinerary builder + `.ics` export + AI panel. |
| `AiTripPlan` | `{ destinations: readonly AiPlannableDestination[]; pacing: Pacing }` | Calls `POST /api/plan/ai`, honest fallbacks. |
| `TravelReadiness` | (see file) | Trip readiness panel. |
| `AffiliateCta` | `{ category: AffiliateCategory; label: string }` | Renders only when a link resolves. |

Exported prop types: `PlannableDestination` (`{id,name,mood,intensity,coordinates?}`), `AiPlannableDestination` (`{id,name,mood}`).

---

## 2. UI primitives (`@/components/ui`)

| Export | Signature / props |
| --- | --- |
| `Button` | `{ variant?: "primary"\|"ghost"\|"solid"; size?: "sm"\|"md" } & button attrs` |
| `ButtonLink` | same variants/size + next/link props |
| `buttonClasses` | `(variant?, size?, className?) => string` (style without the element) |
| `Tag` | `{ variant?: "gold"\|"neutral"\|"muted" }` |
| `Card` | `{ interactive?: boolean }` |
| `SectionHeading` | `{ eyebrow?; title; description?; as?: "h1"\|"h2"\|"h3"; align?: "left"\|"center" }` |
| `Skeleton` | `{ className? }` (reduced-motion aware) |
| `EmptyState` | `{ title; description?; action? }` |
| `ScorePanel` | `{ score: IntelligenceScore; label: string; totalSignals: number; note? }` — renders ANY engine score |
| `Modal` | `{ open; onClose; title?; children }` (Esc/backdrop/scroll-lock) |
| `ToastProvider` / `useToast` | `useToast().toast(message, tone?)`; tone `"default"\|"success"\|"error"` (provider already in root layout) |
| `cn` | `(...parts) => string` class combiner |

---

## 3. Hooks

| Hook | Import | Returns |
| --- | --- | --- |
| `useSaved` | `@/components/useSaved` | `{ ids: string[], toggle(id), … }` localStorage-backed |
| `useToast` | `@/components/ui` | `{ toast(msg, tone?) }` |

---

## 4. Content & copy (`@/content/*`)

All page/section copy is data — bind to these, don't inline strings.

**`destinations.ts`**
- `featuredDestinations: readonly Destination[]` (seed catalog)
- `Destination` interface: `id, name, country, headline, mood, imageUrl, coordinates?, description?, bestTime?`
- `moodIntensity`, `defaultMoodIntensity`, `intensityForMood(mood) => number`
- `heroQuotes: readonly string[]`
- `destinationsIndexCopy` `{ eyebrow, title, description }`

**`home.ts`**
- `homeFeaturedCopy` `{ eyebrow, title }`
- `homeHowItWorks` `{ eyebrow, title, pillars: HomePillar[] }` (`HomePillar = {title, description}`)
- `homeFinalCta` `{ title, primaryLabel, primaryHref, secondaryLabel, secondaryHref }`

**`pages.ts`**
- `discoverCopy`, `planCopy` `{ title, description }`
- `aboutCopy` `{ title, metaDescription, intro: string[] }`
- `savedCopy` `{ title, empty:{title,description,ctaLabel,ctaHref}, countSuffix, removeLabel }`
- `aiPlannerCopy` `{ heading, intro, notesLabel, notesPlaceholder, submit, loading, needSelection, unavailable, quotaExhausted, quotaCtaLabel, quotaCtaHref, rateLimited, error, summaryHeading }`
- `remainingFreeNote(remaining) => string`

**`common.ts`**
- `commonCopy` `{ backToHome }`
- `stayAffiliate` `{ category: AffiliateCategory, label }`

**`pricing.ts`**
- `creditPackages: readonly CreditPackage[]` (`{id,name,credits,priceMinor,currency}`)
- `FREE_AI_PLANS = 3`, `FREE_AI_PLANS_PER_IP = 15`
- `findPackage(id) => CreditPackage | undefined`
- `creditUnitLabel`, `pricingCopy: PricingCopy`, `freeQuotaNote(freePlans) => string`

**`systems.ts`**
- `platformSystems: readonly PlatformSystem[]` (`{name, status:"live"|"scaffold"|"roadmap", note}`) — drives the /about status roster

---

## 5. Config & flags (`@/lib/config/*`)

| Export | Import | Returns |
| --- | --- | --- |
| `site: SiteConfig` | `config/site` | `{name, tagline, description, heroHeadlineLead, heroHeadlineAccent, heroImageUrl}` |
| `getSiteUrl()` | `config/env` | string base URL |
| `getAdminToken()` | `config/env` | `string \| null` |
| `getSupabaseConfig()` / `getSupabaseServiceConfig()` | `config/env` | config or `null` |
| `getLlmConfig()` | `config/env` | config or `null` |
| `isFeatureEnabled(flag)` | `config/flags` | boolean |
| `KNOWN_FLAGS` | `config/flags` | `supabase-destinations, affiliate-catalog, mock-weather, mock-intelligence, pathfinder, travel-dna, ai-planning` |

---

## 6. Intelligence (`@/lib/intelligence`)

### Scoring core (the shared contract)
- `score(signals, weights, expectedKeys) => IntelligenceScore`
- `IntelligenceScore` = `{ score: 0..100, confidence: 0..1, contributions: [{key,value,weight,weighted,note?}], weightsVersion }`
- `IntelligenceSignal`, `ScoringWeights`, `ScoreContribution`, `IntelligenceEngine<TInput>`
- **One widget renders all of these:** `ScorePanel` (§2).

### Engines — each `toSignals(context)`, then `score(...)`; all 🟡 (logic ready, live feed roadmap unless noted)
| Engine | Signal keys | Weights | Context type |
| --- | --- | --- | --- |
| `destinationEngine` ✅ (live: golden-hour) | `DESTINATION_SIGNAL_KEYS` | `destinationWeights` | `DestinationContext` |
| `eventEngine` | `EVENT_SIGNAL_KEYS` | `eventWeights` | `EventContext` |
| `disruptionEngine` | `DISRUPTION_SIGNAL_KEYS` | `disruptionWeights` | `DisruptionContext` |
| `safetyEngine` | `SAFETY_SIGNAL_KEYS` | `safetyWeights` | `SafetyContext` |
| `visaEngine` | `VISA_SIGNAL_KEYS` | `visaWeights` | `VisaContext` |
| `cultureEngine` | `CULTURE_SIGNAL_KEYS` | `cultureWeights` | `CultureContext` |
| `conditionsEngine` | `CONDITIONS_SIGNAL_KEYS` | `conditionsWeights` | `ConditionsContext` |
| `cityEnergyEngine` | `CITY_ENERGY_SIGNAL_KEYS` | `cityEnergyWeights` | `CityEnergyContext` |
| `memoryEngine` | `MEMORY_SIGNAL_KEYS` | `memoryWeights` | `MemoryContext` |

### Aggregates & feature functions
- `aggregateTravelConfidence(...)` + `travelConfidenceWeights` → `EngineResult` (Travel Confidence)
- `composeDestinationReadiness` / `assembleDestinationReadiness` → `DestinationReadiness` (+ `SourceProvenance`, `ReadinessSources`)
- `composeTripReadiness` / `composeTripReadinessFromSources` / `assembleTripReadiness` + `tripReadinessWeights` → `TripReadiness` (types: `TripStop`, `ResolvedTripStop`, `TripStopSummary`, …)
- `pathfind(items, query)` → `[{id, score, reason}]`; `PathfinderQuery = {vibe?, avoid?}`
- `rankByDNA(dna, destinations)`, `affinityFor(dna, mood)`; types `TravelDNA`, `DestinationLike`, `MatchResult{reason}`
- `buildItinerary(items, pacing)` → `Itinerary{pacing, budget, days:[{load, items}]}`; `Pacing = "relaxed"|"balanced"|"packed"`
- `comfortScore(input)` + `ComfortInput` (weather comfort)

### Pure helpers (no feed needed)
- **Solar** (`intelligence/solar`): `solarAltitudeDeg`, `lightPhase` (`"night"|"golden"|"daylight"`), `isDaytime`, `goldenHourProximity`, `sunTimes`, `formatSolarTime`, types `SunTimes`, `GoldenWindow`, `SunCondition`
- **Geo** (`intelligence/geo`): `haversineKm(a,b)`, `routeDistanceKm(stops) => {totalKm, longestLegKm}`, `Coord`
- **Moon** (`intelligence/moon`): `moonPhase(date) => MoonPhase`, `MoonPhaseName`
- **Itinerary export**: `itineraryToICS(itinerary, opts)` (`intelligence/itinerary-export`)

---

## 7. Providers (`@/lib/providers/*`)

- `resolve<T>(capability)` — primary data accessor (with fallback) → `Promise<T | null>`
- `listProviders(capability)`, `allProviders()`, `registerProvider(p)`
- `ProviderCapability = "content"|"destinations"|"affiliate"|"weather"|"events"`
- `Provider<T>` / `ProviderMeta` (`{id,name,capability,priority,isAvailable(),fetch()}`)
- Weather seam: `WeatherProvider.fetchCurrent(lat,lon)` → `ComfortInput` (mock today, flag `mock-weather`)
- LLM seam: `PlanningProvider.generate(req)` → `PlanningResult{summary, days[], providerId, model}`; types `PlanningRequest`, `PlannedDay`
- Travel-data registry: `reportTravelDataReadiness()` → `TravelDataReadinessReport{generatedAt, kinds[], notes[]}` (kinds carry `blocked`, `hasLiveProvider`, `providers[]`)

---

## 8. Affiliate (`@/lib/affiliate/*`)

- `AFFILIATE_CATEGORIES` → `flights, hotels, experiences, tours, restaurants, insurance, esim, ticketing, luxury, transportation`; `AffiliateCategory`
- `getAffiliateCatalog()` → `AffiliateCatalog | null` (flag `affiliate-catalog`)
- `resolveAffiliateLink(catalog, request)` → `AffiliateResolution | null`
- `renderAffiliateUrl(template, opts)` → string (throws `AffiliateUrlError`)
- Event schemas/builders: `clickEventSchema`, `buildClickRow`, `conversionEventSchema`, `buildConversionRow`
- Analytics: `aggregateCampaignMetrics`, `parseTimeWindow`, `parsePage`, `paginateMetrics`, types `CampaignMetrics`, `PagedMetrics`, `TimeWindow`
- Domain types: `AffiliateCatalog`, `AffiliateCampaign`, `AffiliateLink`, `AffiliateResolution`, `AffiliateRequest`, …

---

## 9. Billing & entitlements (`@/lib/billing/*`)

- `evaluateEntitlement(state, freeQuota)` → `Entitlement{allowed, source:"free"|"credit"|"none", remainingFree, credits}`
- `consumeEntitlement(state, freeQuota)` → `{next, source} | null`
- `EMPTY_USAGE`, `UsageState`
- `getUsageStore()` / `memoryUsageStore` / `resetUsageStore()` — `UsageStore`
- `getClientIp(headers)` → string
- `formatPriceMinor(priceMinor, currency, locale?)` → localized string (symbol from `Intl`, never hardcoded); `minorUnitDivisor(currency)`

---

## 10. SEO, experiments, observability, saved

- **SEO** (`@/lib/seo/jsonld`): `siteJsonLd(opts)`, `destinationJsonLd(dest, url)`, `jsonLdScript(data)`
- **Experiments** (`@/lib/experiments/assignment`): `assignVariant(...)`, `Variant`
- **Observability** (`@/lib/observability/*`): `log` (`.debug/.info/.warn/.error`), `incrementCounter`, `getCounters`, `resetCounters`, `formatLog`
- **Saved** (`@/lib/saved/collection`): `toggleId(ids, id)`, `parseSaved(raw)` (pure; used by `useSaved`)

---

## 11. HTTP API endpoints

| Endpoint | Method | Input | Success shape | Other statuses |
| --- | --- | --- | --- | --- |
| `/api/destinations` | GET | — | `{ destinations: Destination[] }` | — |
| `/api/pathfinder` | GET | `?vibe=&avoid=` (repeatable) | `{ query, results:[{id,name,mood,score,reason}] }` | — |
| `/api/plan/ai` | POST | `{destinations:[{id,name,mood}], pacing, notes?}` | `{summary, days:[{title,detail}], providerId, model, entitlement}` | 400 invalid · 503 off · 402 quota · 429 IP-limit · 502 fail |
| `/api/affiliate/link` | GET | `?category=` | `{ link: {href, campaignId} \| null }` | 400 invalid category |
| `/api/affiliate/click` | POST | click event | 202 | 400 · 503 |
| `/api/affiliate/conversion` | POST | conversion event | 202 | 400 · 503 |
| `/api/affiliate/analytics` | GET | `?since=&until=&limit=&offset=` | `{ metrics: CampaignMetrics[], … }` | 400 · 503 |
| `/api/admin/status` | GET | header `x-admin-token` | `{time, providers[], travelData, flags, counters}` | 503 disabled · 401 unauthorized |
| `/api/admin/readiness` | GET | `?destinationId=` / `?stop=` + `x-admin-token` | `DestinationReadiness` / `TripReadiness` | 503 · 401 |
| `/api/health` | GET | — | `{status, time, config:{...booleans}}` | — |
| `/api/metrics` | GET | — | `{time, counters}` | — |
| `/api/csp-report` | POST | CSP report | 204 | — |

---

## 12. Quick index — "what can I bind with no new backend?"

Catalog/data: `featuredDestinations`, `resolve("destinations")`, `/api/destinations` ·
Discovery: `pathfind` / `/api/pathfinder` ·
Planning: `buildItinerary`, `itineraryToICS`, `/api/plan/ai` (gated) ·
Scores: every engine + `ScorePanel` ·
Solar/geo/moon helpers ·
Pricing: `creditPackages`, `formatPriceMinor`, `FREE_AI_PLANS` ·
Entitlements: `evaluateEntitlement` ·
Affiliate: `AffiliateCta`, `/api/affiliate/link` ·
Admin/ops: `/api/admin/status`, `/api/admin/readiness`, `/api/metrics`, `/api/health` ·
Saved: `useSaved`, `SavedList` ·
Primitives + Toast/Modal ready in `@/components/ui`.

---

_Reference only — no UI is specified here. Last updated: 2026-05-29._
