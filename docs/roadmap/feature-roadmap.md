# Journee Feature Roadmap

_Last updated: 2026-05-29._

This document turns the platform vision into **concrete, phased, buildable
plans**. It is the single source of truth for "what could be built next and how."
Each feature lists: intent, the seam it builds on, a concrete implementation
sketch, dependencies, and acceptance criteria.

Two honesty rules carry over from the rest of the repo:

1. **No fake operational claims.** A feature that needs a live data feed is not
   "done" until the feed is real; until then it ships behind a flag and is
   labelled as seed/mock (see `docs/architecture/intelligence-engine-architecture.md`).
2. **Config-driven, explainable, pure where possible.** New intelligence reuses
   the scoring core (`src/lib/intelligence/scoring.ts`) and versioned weights
   (`src/lib/intelligence/weights.ts`); no hardcoded numbers in components.

Legend: `[scaffold]` = activates existing groundwork · `[new]` = net-new ·
`[blocked]` = needs external secret/integration not available in-repo.

---

## Phasing overview

| Phase | Theme | Gate |
| --- | --- | --- |
| **0 — Pure wins** | Self-contained, no secrets, fully unit-testable | None — buildable today |
| **1 — Identity** | Auth + cloud-synced user data | Supabase hosted project |
| **2 — Live signals** | Wire real feeds into the dormant engines | Vendor API keys |
| **3 — Engagement** | Notifications, AI concierge, collaboration | Phase 1 |
| **4 — Monetization** | Pro tier, expanded affiliate verticals, dashboards | Phase 1 |
| **5 — Ecosystem** | B2B API, white-label, integrations, native/PWA | Phases 1–2 |

Phase 0 is implemented incrementally starting now because it needs nothing
external. Everything else is sequenced behind its real dependency rather than
mocked-as-done.

---

## Phase 0 — Pure wins (buildable today, no secrets)

### 0.1 Sustainability / Eco-Travel intelligence engine `[new]` ✅ implemented
- **Intent:** Score a destination/trip on environmental and social
  sustainability so travellers can weigh impact alongside vibe.
- **Seam:** New engine on the shared scoring core, identical shape to
  `engines/safety.ts`. Pure `toSignals` + versioned `sustainability-v1` weights.
- **Signals (0..1, 1 = most sustainable):** `transport` (low-carbon access),
  `overtourism` (inverse crowding pressure), `conservation` (environmental
  stewardship), `local_benefit` (low economic leakage), `resource_resilience`
  (water/energy headroom).
- **Companion:** `intelligence/carbon.ts` — pure CO₂e estimator using published
  per-passenger-km emission factors + great-circle distance (`geo.ts`), and a
  `footprintToTransportSignal` bridge into the engine.
- **Acceptance:** unit tests (engine + carbon math), full-confidence on full
  context, empty context is safe (score 0, confidence 0), distinct stable id.

### 0.2 Trip carbon footprint surfacing `[new]`
- **Intent:** Show estimated CO₂e for a planned multi-stop trip on `/plan`.
- **Seam:** `carbon.ts` + existing `routeDistanceKm` over chosen stops'
  coordinates; render a labelled estimate ("approx, standard factors").
- **Dependencies:** 0.1.
- **Acceptance:** estimate updates as stops change; clearly labelled as an
  approximation; comparison vs flying baseline shown.

### 0.3 Packing list generator `[new]` ✅ implemented
- **Intent:** Generate a packing checklist from destination comfort signals +
  trip pacing/activities.
- **Seam:** Pure `intelligence/packing.ts` mapping comfort band (temp/precip/AQI
  from `comfort.ts` inputs) + activities → categorized item list. No I/O.
- **Acceptance:** deterministic output per input; unit-tested bands (cold/hot/
  wet/sun); empty input yields the universal baseline only.

### 0.4 Itinerary calendar (.ics) export ✅ already in repo
- **State:** `intelligence/itinerary-export.ts` already serializes an itinerary
  to a standards-compliant RFC-5545 VCALENDAR (one all-day VEVENT per day, text
  escaping, stable UIDs). Remaining work is only the user-facing download
  button + an optional public share link (a UI/Phase-1 task, not engine work).

### 0.5 Faceted filtering + "similar destinations" `[scaffold]`
- **Intent:** Filter the catalog (mood, country, best-time) and show "if you
  liked X" via Travel DNA affinity.
- **Seam:** Pure selectors over `featuredDestinations`; reuse `travel-dna.ts`
  `affinityFor` for similarity ranking. UI-only state.
- **Acceptance:** filter predicates unit-tested; similarity excludes the seed
  item and is ordered by affinity.

### 0.6 "Best time to go" month model `[new]`
- **Intent:** Turn the free-text `bestTime` into a structured month-suitability
  model so a calendar view and "where to go now" can be derived.
- **Seam:** Add optional structured `seasonality` to the `Destination` type;
  pure `intelligence/seasonality.ts` scoring a month 0..1. Backward compatible
  (field optional; falls back to existing prose).
- **Acceptance:** month scoring unit-tested; "where to go this month" selector
  ranks destinations for a given month.

### 0.7 World clock / light-phase / timezone card `[scaffold]`
- **Intent:** Per-destination local time + live light phase already computed by
  `solar.ts`; add timezone-aware local clock.
- **Seam:** Reuse solar altitude; derive local time from longitude (approx) or a
  static tz field on the catalog. Pure.
- **Acceptance:** light phase matches `solar.ts`; clock labelled approximate
  unless a real tz field is present.

---

## Phase 1 — Identity (Supabase Auth)

> Dependency: a hosted Supabase project (`docs/runbooks/hosted-enablement.md`).
> The auth model is already specced in `docs/architecture/authentication-architecture.md`.

### 1.1 End-user authentication `[scaffold] [blocked]`
- **Plan:** Supabase Auth (email magic-link + Google/Apple OAuth). Session via
  `@supabase/supabase-js` SSR helper; JWT consumed by RLS. New `lib/auth/`
  module + middleware session refresh. Feature-flagged (`auth.enabled`).
- **Acceptance:** sign-in/out flow; server components read the session; RLS
  denies cross-user reads; no service-role key on the client.

### 1.2 Cloud-synced saved collections `[scaffold] [blocked]`
- **Plan:** Migrate `useSaved`/`lib/saved/collection.ts` from localStorage to a
  user-scoped `saved_items` table behind the same interface. Anonymous→account
  merge on first sign-in. Offline-first: localStorage stays the cache.
- **Acceptance:** saves persist across devices; logged-out still works locally;
  merge has no duplicates (collection set semantics already unit-tested).

### 1.3 User profile + Travel DNA persistence `[scaffold] [blocked]`
- **Plan:** Profile (home airport, nationality, pace, avoid-moods) + persisted
  `TravelDNA` vector. Onboarding quiz seeds it. Nationality feeds the visa
  engine; home airport feeds carbon/transport.
- **Acceptance:** DNA persists and re-ranks discovery; profile edits audited.

### 1.4 Trip history & travel log `[new] [blocked]`
- **Plan:** `trips` + `trip_stops` tables; "been there" map; feeds `memory.ts`.
- **Acceptance:** trips CRUD under RLS; visited set influences "novelty" signal.

### 1.5 Operator RBAC `[scaffold] [blocked]`
- **Plan:** Replace the interim `JOURNEE_ADMIN_TOKEN` with role-based access;
  audit admin actions (governance docs already exist).

---

## Phase 2 — Live signals (wire the dormant engines)

> Each engine already maps inputs→signals; only the **feed** is missing. Every
> feed lands behind a provider adapter (`src/lib/providers/*`) + flag, carrying
> source/freshness/confidence metadata so a stale/seed source lowers confidence
> rather than faking authority.

| Feed | Powers engine | Adapter seam |
| --- | --- | --- |
| Weather + AQI `[scaffold]` | `comfort`, `destination` | `providers/weather` (mock exists) |
| Gov travel advisories `[scaffold]` | `disruption`, `safety` | `providers/travel-data` (advisory contract exists) |
| Events / festivals `[scaffold]` | `events` | `providers/travel-data` (events contract exists) |
| Crowd / seasonality `[scaffold]` | `destination`, `city-energy` | `providers/travel-data` |
| Visa & entry (by nationality) `[scaffold]` | `visa` | new `providers/visa` |
| Flight/transit disruption `[scaffold]` | `conditions` | new `providers/transit` |
| FX + cost-of-living `[new]` | budget/sustainability | new `providers/fx` |

- **Cross-cutting acceptance:** live "Travel Confidence" badge replaces the
  mock preview on cards/detail; provenance UI shows seed vs live vs stale
  (`destination-readiness.ts` already returns provenance).

---

## Phase 3 — Engagement

### 3.1 AI travel concierge `[scaffold]` ✅ implemented (deterministic-fallback)
- **Done:** `components/ConciergePlan.tsx` posts to the existing `/api/plan/ai`
  and renders a narrative day-by-day plan, reusing the route's billing/quota
  guardrails. When no LLM provider is configured (503), on quota (402/429), or
  on any error, it falls back to a deterministic narrative from `buildItinerary`
  and labels the source honestly. Surfaced inside `/plan` (TripBuilder). See
  ADR-007.
- **Next (key-gated):** richer LLM output, tool-calling the engines so answers
  cite real scores, conversational itinerary edits, prompt-cached context.
- **Dependency for the LLM path:** `ANTHROPIC_API_KEY` + `ai-planning` flag.

### 3.2 Notifications & alerts `[new] [blocked]`
- **Plan:** Email digests + push: price drops, advisory changes, trip countdown,
  "best time to visit your saved place is now" (uses 0.6 seasonality). Needs an
  email/push provider.

### 3.3 Collaborative trip planning `[new] [blocked]`
- **Plan:** Share a trip, invite collaborators, vote on stops/activities.
  Realtime via Supabase. Depends on Phase 1.

### 3.4 Natural-language search `[scaffold]` ✅ implemented (deterministic)
- **Done:** `intelligence/nl-query.ts` parses free text → `PathfinderQuery`
  (mood-synonym vocabulary + negation), with zero configuration. Wired into the
  `/discover` search box (live, client-side) and `/api/pathfinder?q=`. An LLM can
  later produce the same shape with no consumer changes. See ADR-007.

---

## Phase 4 — Monetization

### 4.1 Journee Pro subscription `[scaffold] [blocked]`
- **Plan:** Activate `lib/billing/*` (entitlements/identity/store already exist);
  gate premium features (full AI concierge, alerts, exports). Needs Stripe.

### 4.2 Expanded affiliate verticals `[scaffold]`
- **Plan:** The catalog→resolver→safe-URL→gated-CTA chain exists. Add flights,
  hotels, tours, eSIM, insurance categories (catalog config only). Price-drop
  alerts tie into 3.2.

### 4.3 Operator dashboards `[scaffold] [blocked]`
- **Plan:** UI over existing `/api/affiliate/analytics`, `/api/metrics`,
  `/api/admin/status|readiness`. Revenue, funnel, engine-coverage views.

---

## Phase 5 — Ecosystem

- **B2B / white-label intelligence API** exposing the engines under contract.
- **A/B + feature-flag admin UI** on the experiments + flags scaffolds.
- **Calendar / email-parse / wearables / music** integrations.
- **PWA offline + native apps** (manifest already present).
- **i18n + multi-currency + WCAG accessibility** pass.
- **Consent / GDPR export & deletion.**

---

## Implementation order (live tracking)

- [x] 0.1 Sustainability engine + carbon estimator (+ tests)
- [x] 0.2 Trip carbon surfacing on `/plan` (`estimateStopsFootprint` + TripBuilder)
- [x] 0.3 Packing list generator (+ tests)
- [x] 0.4 .ics itinerary export (engine in repo; `/plan` download button live)
- [x] 0.5 Similar destinations (`similar.ts` + detail-page surface; mood/search
      filters already on the homepage)
- [x] 0.6 Seasonality month model (`seasonality.ts` + structured `bestMonths` +
      "in season this month" on `/discover`)
- [x] 3.4 Natural-language discovery (`nl-query.ts` + `/discover` search +
      `/api/pathfinder?q=`) — deterministic, no key
- [x] 3.1 AI concierge UI (`ConciergePlan` on `/plan`) — LLM path key-gated,
      deterministic narrative fallback; ADR-007
- [ ] 0.3 UI: packing-list panel (user-provided conditions — next pass)
- [ ] Phase 2 feeds, Phase 1 auth, Phase 4 billing — gated on hosted Supabase /
      vendor keys; each is a precise plan above, implementable behind its flag

**Pattern that unblocks the "blocked" phases:** features land as real code,
flag-gated, with a deterministic/seed fallback (the repo's existing approach —
ADR-003, ADR-006, ADR-007). The LLM, weather, FX, etc. layers activate on env
without code changes, so "needs a key" never means "can't build it now".

Each Phase 0 item ships as: pure module + unit tests + (where user-facing) a
component wired through the provider/registry seam, with `npm run typecheck`,
`npm run lint`, and `npm test` green before commit.
