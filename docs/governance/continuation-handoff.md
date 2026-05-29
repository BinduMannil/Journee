# Continuation Handoff

_Last updated: 2026-05-29 (end of session 6). Paste the "Continuation Prompt"
below to start the next session with zero context loss._

The single source of truth for what's built and what's left is
[`docs/roadmap.md`](../roadmap.md) (mirrored as machine-readable status in
`src/content/systems.ts`, rendered on `/about`). Read it first, then
[`docs/ui-backlog.md`](../ui-backlog.md), then this file.

---

## Continuation Prompt (paste this to start the next session)

You are continuing autonomous development of the Journee travel-intelligence
platform (Next.js 15 / React 19 / TS strict / Tailwind v4). Repo:
`bindumannil/journee`. Work on `main` (branch each PR off `main`).

Operating mode: go ahead and do everything on your own. Do NOT ask for approval
mid-task. Pick the next non-blocked item from the queue, implement → audit →
test → open PR → merge when CI (verify) is green, then continue to the next
item. Only stop to ask if something is genuinely ambiguous, architecturally
significant, or destructive. Keep going PR after PR until you are almost out of
context tokens.

The single source of truth for what's built and what's left is
`docs/roadmap.md` (mirrored as machine-readable status in `src/content/systems.ts`,
rendered on `/about`). Read it first. Also read
`docs/governance/continuation-handoff.md` and `docs/ui-backlog.md`.

### Hard constraints (do NOT violate — verbatim)

- **No UI work.** No `.tsx` components, no Next.js page files. The only
  `src/app` changes allowed are API routes.
- **No Supabase work.** No `supabase/` files. No hosted DB migrations applied or
  attempted. Supabase remains externally blocked.
- **No LLM-planning changes.** `src/lib/providers/llm/*` and
  `src/app/api/plan/ai/*` stay untouched unless shared types force a change.
- **No secrets in commits.** No real API keys, no environment values.
- **No fake live-data claims.** Every external-data response must carry
  `SourceMetadata` labeling it seed, mock, or live honestly. Seed data is never
  presentable as live. Every editorial seed feature carries a `*_DATA_NOTE`
  disclaimer.
- **Provider-gated, config-driven, tested, honestly documented** for every change.

### What was shipped last session (session 6 — all merged to main, CI-green)

PRs #53–#67, test count **367 → 495**. All built on the established
content + pure-accessor + test + barrel + `/about` + roadmap pattern (or, for
the engineering items, as pure cores / an API route). Seed batches were built
with parallel sub-agents (one feature each writes only its 3 files, self-tested),
then wired in one pass and gated as a single PR.

- **#53 — UV-protection, dress-code, photography & transit-howto (seed batch).**
  UV peak band/months + protective customs; dress code by venue + strictness;
  photo/drone permission by subject; public-transport ticketing how-to. +20 tests.
- **#54 — accessibility, timezone, packing & best-time (seed batch).**
  Accessibility by facet; IANA timezone + business hours + `currentTimeAt` (live
  local time derived purely from the zone); seasonal packing; per-month
  best-time-to-visit (southern-hemisphere Patagonia handled). +20 tests.
- **#55 — itinerary GeoJSON route export.** Pure `itineraryToGeoJSON(waypoints)`:
  RFC 7946 FeatureCollection of `Point`s + a route `LineString` with great-circle
  length (reuses `geo.ts`); complements the `.ics` export. +7 tests.
- **#56 — multi-currency normalization (seed FX).** `content/fx.ts` (`fx-seed-v1`
  indicative table + `FX_DATA_NOTE`: never a live quote) + `currency.ts`:
  `convertUsd` / `convertCurrency` / `costPricesIn`. +7 tests.
- **#57 — "explain my ranking" (`explainScore` + `POST /api/explain`).** Ranks a
  score's contributions by share, classifies boosts/neutral/drags, top driver +
  weakest signal + summary. Endpoint zod-validated, GET→405, weights are
  server-side config. Smoke +2. +5 tests.
- **#58 — healthcare & medical facilities (seed).** Hospitals/clinics/pharmacies/
  dental per destination with area + English-spoken; not medical advice. +5 tests.
- **#59 — social pure cores.** `src/lib/social/`: `posts.ts` (note/blog/vlog
  content model + zod `parsePost`), `follow-graph.ts` (build + following/followers
  /mutuals/`suggestFollows`), `journey-feed.ts` (`composeFeed`, recency rank +
  paging). Storage/auth/UI blocked. +13 tests.
- **#60 — neighborhoods & where-to-stay (seed).** Areas per destination with
  character tags, who they suit, and a relative `stayCostTier`;
  `getNeighborhoods` / `neighborhoodsByType` / `neighborhoodsByCostTier` /
  `areasWithinBudget`. +6 tests.
- **#61 — ratings & recommendations glue.** `social/recommendations.ts`:
  de-dupe per rater (latest wins), aggregate via the `rating-v1` Bayesian core,
  `rankTargets` / `recommendTargets` (min count/confidence + limit). +4 tests.
- **#62 — trip budget / cost estimate.** `content/lodging.ts` (`lodging-seed-v1`
  nightly rates by tier) + `estimateTripBudget`: lodging + cost-index daily spend
  × nights/travelers, in any currency, per-stop breakdown + confidence. +7 tests.
- **#63 — per-destination editorial-confidence signal.** `editorialCoverage` /
  `editorialConfidence`: present/missing seed features + 0..1 coverage — honest
  data-completeness meta-signal. +4 tests.
- **#64 — day trips & excursions (seed).** Trips within reach with type tags +
  approx travel time + why; folded into the editorial-coverage registry. +4 tests.
- **#65 — transport-modes, tourist-prices & attractions (seed batch).**
  Comprehensive transport-mode catalog (metro/…/tuk-tuk/ferry/ATV/caleche/…);
  fair USD base-price ranges + bargaining flag (anti-overcharging); top sites
  with cost band, best time of day + why, busyness, hours, honest booking note
  (no fabricated URLs, asserted in tests). +15 tests.
- **#66 — intercity options & itinerary combos (seed batch).** Best onward
  travel to key cities (flight/train/HSR/bus/ferry/car/van) + recommended pick;
  best cities/sites to club together (pairing reasons + suggested days). +10 tests.
- **#67 — best-sites-by-experience.** Added an `Experience` union + `experienceTags`
  to attractions + `sitesForExperience` / `experiencesAvailable`. +1 test case.

### Real vs. roadmap + branch/PR state

- `main` contains everything from sessions 1–6: full backend + ~40 seed/pure
  feature accessors (all `/about`-registered), the explainable scoring core +
  `POST /api/explain`, the editorial-confidence meta-signal, travel-data backend,
  affiliate vertical, observability/control plane, and the social pure cores
  (posts, follow graph, journey feed, recommendations).
- Built, inert (config-only): AI planning (`LLM_API_KEY` + `ai-planning` flag),
  live weather Open-Meteo (`live-weather` flag + egress), hosted Supabase
  adapters — all ⛔ externally blocked here.
- Open Dependabot PRs (incl. major `next` 15→16 and `zod` 3→4) are left for human
  review — do NOT merge blindly; **zod 4 may affect**
  `src/lib/providers/travel-data/json-schema.ts` (uses `zod/v4`). New validation
  (`social/posts.ts`, `api/plan/ai`, `api/explain`) uses the classic `zod` entry.
- Session-6 feature branches (`claude/*-2S10c`) are stale; **branch fresh from
  `main`**.
- UI is deferred; the UI to build later is tracked in `docs/ui-backlog.md`.

### Non-blocked next steps (pick in order; build independent seed features IN PARALLEL)

1. **Fold standalone seed signals into engines** — city-vibe friendliness → City
   Energy; inclusion → Safety; hazards/advisory → Conditions; reviews → Safety
   (engine-bridge expansion). Editorial-confidence could temper engine output.
2. **Per-kind latency histograms** (`_duration_ms_bucket{le=…}`) in the
   travel-data resolver/metrics.
3. **More seed local-knowledge** (or expand coverage / more destinations on
   existing seed features): nightlife & bars, beaches & swimming spots, kids/
   family activities, romantic spots, local apps to install, restroom/water
   etiquette, queue/booking culture, common-phrases guidance.
4. **Itinerary intelligence**: tie `itinerary-combos` + `intercity` + `geo.ts`
   into a pure multi-stop route optimizer; a "smart day plan" that orders a
   destination's attractions by `bestTimeOfDay` + busyness.
5. **More API routes** (the only allowed `src/app` change): expose existing pure
   cores read-only (e.g. `GET /api/destinations/[id]/intel` aggregating the seed
   accessors + editorial-confidence; `POST /api/trip-budget`; `GET /api/feed`).
6. **Community/UGC depth (pure)**: post moderation rules, report/flag model,
   comment threads, feed ranking variants — all storage-agnostic cores.

### The repeatable pattern for a seed feature (follow exactly)

`src/content/<x>.ts` (types + data for the 4 seed destinations kyoto, santorini,
marrakech, patagonia + a `<X>_DATA_NOTE` disclaimer) → `src/lib/intelligence/<x>.ts`
(pure accessor + small derived helpers, `@/content/<x>` alias) →
`test/intelligence.<x>.test.ts` (`node:test`) → barrel export in
`src/lib/intelligence/index.ts` → a row in `src/content/systems.ts` → a row in
`docs/roadmap.md` → (if it's a per-destination accessor) add it to the
`FEATURE_CHECKS` registry in `editorial-confidence.ts`. `readonly` everywhere,
no `any`.

**Parallelism:** independent seed features can be built concurrently — spawn one
sub-agent per feature that writes ONLY its 3 new files (no shared-file edits, no
git, self-test with `node --import tsx --test test/<file>`); then YOU wire the
barrel/`systems.ts`/roadmap/editorial-registry for all of them in one pass and
run a single gate + PR. (#53, #54, #65 shipped as batches this way.)

### Conventions to keep (verbatim)

- New external integrations go behind a provider adapter, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use config/content/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.
- Do NOT ask for approval mid-task. Implement → audit → test → open PR → merge if
  clean. Only stop to ask if something is genuinely ambiguous, architecturally
  significant, or destructive.
- Each PR scope: ONE focused layer (or one parallel batch). Squash-merge. Branch
  off the latest `main` before opening the PR so the diff shows only the new layer.
- For every PR run `npm run typecheck && npm run lint && npm test && npm run
  build && npm run smoke` locally before pushing (`rm -rf .next` before typecheck
  to avoid stale Next route-types from a previous branch). Subscribe to PR
  activity and merge when CI is green.

### Session-end handoff requirement (propagate forward — do not drop)

Operate autonomously: do everything on your own without asking. Keep going across
multiple PRs until you run out of context tokens. When tokens are almost full (or
whenever the user says to stop), produce a detailed handoff prompt for the next
session in this same format, containing: (1) the hard constraints verbatim, (2)
"What was shipped last session" listing every PR merged with number + title +
one-paragraph summary, (3) updated real-vs-roadmap + branch/PR state, (4) updated
non-blocked next-steps, (5) the conventions verbatim, (6) this Session-end
handoff requirement section verbatim so the chain continues across every future
session until the architecture is genuinely done or the user stops it. Also
mirror it into `docs/governance/continuation-handoff.md` in your last PR of the
session. The goal: any new session can pick up cold with zero context loss.

---

## Externally blocked (resume when access is granted)

The seams are **config-only to enable** — see
[`docs/runbooks/hosted-enablement.md`](../runbooks/hosted-enablement.md).

| Blocked item | Needs |
| --- | --- |
| Hosted Supabase (destinations, affiliate catalog, event ingestion) | Real project secrets + `supabase db push` + flags |
| Live weather feed (Open-Meteo) | Weather host on the egress allow-list |
| Live LLM / AI planning | An `LLM_API_KEY` (+ optional `LLM_MODEL`) + the `ai-planning` flag |
| Live travel-data vendors | Vendor access + egress (adapters slot behind the existing contracts) |
| Community/UGC storage, auth, moderation, UI | Supabase Auth + persistence (pure cores already built: ratings, recommendations, posts, follow graph, journey feed) |
| Branch protection / org settings | Repo-admin access |
