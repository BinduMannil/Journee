# AI Agent Audit Trail

_Purpose: traceability for autonomous engineering actions, per the AI agent
governance policy. Each entry records who/what acted, the scope, and the
validation evidence so changes are reviewable without tribal knowledge._

## Entry format

- **Agent / session** — identifier of the automated actor.
- **Scope** — what it was authorized to do.
- **Branch** — where work landed.
- **Changes** — commits / areas touched.
- **Validation** — checks run (typecheck/lint/test/build) and results.
- **Assumptions** — decisions made autonomously (see ADRs for rationale).
- **Human review** — readiness / outstanding items.

---

## 2026-05-26 — Foundation + first scoped increments

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Bootstrap a greenfield repo into a runnable foundation and build
  scoped increments (provider/config seams, affiliate model, intelligence
  scoring) with honest documentation. Explicit user authorization to proceed
  autonomously, create `main`, and push to `claude/quirky-keller-2S10c`.
- **Branch:** `claude/quirky-keller-2S10c` (base: `main`).
- **Changes (commit-scoped):**
  1. Foundation: Next.js 15 app, design system, provider registry + seed,
     config boundary, docs/ADRs 001–004, CI, PR template.
  2. Config validation (zod env boundary), feature flags, Supabase destinations
     adapter + RLS migration scaffold.
  3. Affiliate routing model + pure resolver + RLS migration + ADR-005.
  4. Intelligence scoring core + destination/events/disruption engine scaffolds
     + ADR-006.
  5. Unit tests (node:test), CI test + dependency-audit steps, dependency map,
     this audit trail.
- **Validation:** `npm run typecheck`, `npm run lint`, `npm test` (13 passing),
  and `npm run build` all green at each increment.
- **Assumptions made autonomously (rationale in ADRs):**
  - Tailwind v4 CSS-first tokens; zod for validation; tsx + node:test for tests.
  - Detailed per-engine operational docs are deferred until each engine has
    real data integration — scaffolds are labeled as such rather than described
    as production systems (no fabricated operational claims).
  - `main` established as the baseline from the foundation commit; increments
    layered on the feature branch.
- **Human review readiness:** All work is on the feature branch with passing
  checks; ready for PR review against `main`. No secrets committed; no
  destructive or production actions taken.

---

## 2026-05-26 — Resume path: local Supabase enablement + failover verification

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Make the Supabase-backed providers connectable locally without real
  secrets, and verify provider failover end-to-end. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green at start; no
  open review comments).
- **Changes:** Supabase local CLI config (`supabase/config.toml`), seed data
  mirroring the in-repo catalog + a sample affiliate catalog (`supabase/seed.sql`),
  a local-setup + failover-verification runbook (`docs/runbooks/`), and an
  end-to-end failover test (`test/providers.failover.test.ts`).
- **Validation:** typecheck, lint, and `npm test` (now 16 passing, incl. 3 new
  failover/registry tests) green.
- **Assumptions / safety:** No `.env.local` or secrets committed — only
  documented placeholders. Migrations are NOT applied to any live DB (no access);
  the runbook covers applying them locally via `supabase db reset`. Feature flags
  are documented for local enablement, not enabled in committed config (enabling
  without config is a no-op due to `isAvailable()` gating — safe either way).
- **Human review readiness:** Folded into PR #1; ready for review/merge.

---

## 2026-05-26 — Observability seam

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Make the observability mandate concrete; replace the registry's
  silent error-swallow with structured logging.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** structured JSON logger (`src/lib/observability/logger.ts`),
  registry now logs `provider_failover` / `provider_capability_exhausted`,
  `GET /api/health` (booleans only, no secret leakage), monitoring architecture
  doc, logger unit tests.
- **Validation:** typecheck, lint, `npm test` (19 passing), and `npm run build`
  (health route present) all green.
- **Assumptions:** metrics/tracing/alerting remain roadmap and are not claimed.

---

## 2026-05-26 — Affiliate URL rendering + Travel Confidence aggregate

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Secret-free, real increments continuing PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** safe affiliate URL renderer (`src/lib/affiliate/url.ts`,
  encodes values + rejects non-http(s) schemes), catalog accessor
  (`catalog.ts`), and the Travel Confidence aggregate engine
  (`engines/confidence.ts`) reusing the scoring core with mean-of-inputs
  confidence. Added weights + index exports, doc update, and unit tests.
- **Validation:** typecheck, lint, `npm test` (28 passing), build all green.
- **Assumptions:** aggregate uses linear weighting consistent with ADR-006;
  no new external dependencies.

---

## 2026-05-26 — App resilience states + SEO

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Real product polish on the running app; secret-free.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** branded `loading.tsx` / `error.tsx` / `not-found.tsx`;
  Open Graph + Twitter metadata; `robots.ts` + `sitemap.ts`; `getSiteUrl()`
  config getter (env `NEXT_PUBLIC_SITE_URL`, localhost default).
- **Validation:** typecheck, lint, tests (28), build (now emits /robots.txt,
  /sitemap.xml) all green.
- **Assumptions:** canonical URL defaults to localhost until configured.

---

## 2026-05-26 — Affiliate click ingestion (server-only write path)

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Real, secret-free feature continuing PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** privileged `getSupabaseServiceClient` + `getSupabaseServiceConfig`
  (server-only); pure validation/row builder (`src/lib/affiliate/events.ts`);
  `POST /api/affiliate/click` (400 invalid, 503 unconfigured, 202 accepted);
  unit tests (incl. route-level behavior without a DB).
- **Validation:** typecheck, lint, `npm test` (33 passing), build all green.
- **Assumptions:** unconfigured ingestion returns 503 (honest about data loss)
  rather than accept-and-drop; conversion endpoint deferred as next step.

---

## 2026-05-26 — Affiliate conversion ingestion + revenue analytics

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Complete the affiliate vertical slice; secret-free.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** `POST /api/affiliate/conversion` (mirrors click); pure
  `aggregateCampaignMetrics` + `GET /api/affiliate/analytics` (per-campaign
  clicks/conversions/rate/revenue-by-currency, 503 when unconfigured). Unit
  tests for all pure logic + route 503 behavior; doc roadmap updated.
- **Validation:** typecheck, lint, `npm test` (41 passing), build all green;
  all affiliate routes present in build output.
- **Result:** affiliate flow now end-to-end — catalog → resolve → render → CTA
  → click/conversion ingestion → analytics. Remaining: A/B assignment +
  time-windowed/paginated analytics.

---

## 2026-05-26 — Live product surface + runtime verification

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Real, network-free product features + first runtime verification.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** live light-phase signal from real solar math (`solar.ts`,
  `LightBadge`); destination detail pages with per-destination SEO; mood-first
  filtering + text search; explainable atmosphere score in UI (honest ~20%
  confidence); A/B assignment helper; JSON `/api/destinations`; time-windowed
  analytics; environmental `comfortScore` (weather-feed ready — Open-Meteo egress
  blocked by network policy).
- **Runtime verification (`npm start` + curl):** `/api/health`,
  `/api/destinations`, affiliate click 400/503, robots, home, and detail pages
  all correct. **Found & fixed a real bug:** unknown destination ids returned a
  soft-404 (HTTP 200); switched to `generateStaticParams` + `dynamicParams=false`
  so they now return a true 404. Re-verified.
- **Validation:** typecheck, lint, `npm test` (58 passing), build all green.

---

## 2026-05-26 — Platform maturity batch (observability, control plane, ops, fonts, discovery)

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Continue all non-blocked workstreams after hitting external
  dependency boundaries (hosted Supabase, weather egress). Mark blocked items;
  keep building.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** provider contract tests + mock weather/event/disruption
  dev-providers; counter metrics + `/api/metrics`; secure-by-default
  `/api/admin/status`; incident/recovery runbooks; analytics indexes (`0003`) +
  migrations README; failure-recovery / data-flow / auth / deployment-env
  architecture docs (mermaid); CI concurrency + Node pinning; **self-hosted
  fonts** (removed build-time Google Fonts dependency, runtime-verified);
  Travel DNA + Pathfinder discovery (`/api/pathfinder`) + dynamic itinerary
  engine; postmortem template.
- **Validation:** typecheck, lint, `npm test` (86 passing), build all green;
  pathfinder + fonts runtime-verified via `npm start` + curl.
- **Blocked (marked, not faked):** hosted Supabase (secrets), live weather feed
  (egress allowlist), branch protection (repo-admin).

---

## 2026-05-26 — Completing the non-blocked queue

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Finish all remaining non-blocked queue items autonomously.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** per-visitor A/B (jid cookie middleware + `/api/affiliate/link` +
  client `AffiliateCta`, host pages stay static); completed the engine roster
  (conditions, city-energy, memory) — ~14 engines on the shared core; reusable
  provider contract harness; intelligence-doc roster parity.
- **Validation:** typecheck, lint, `npm test` (98 passing), build all green;
  A/B cookie + link endpoint runtime-verified.
- **Result:** core platform/engine queue complete (more product work followed).

---

## 2026-05-26 — Product/UX batch (collections, discovery, OG, nav)

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Continue building user-facing, non-blocked product surface.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** saved collections (localStorage, pure set logic tested) + `/saved`;
  `/discover` vibe-ranking UI (Pathfinder); dynamic cinematic OG images per
  destination + brand favicon (next/og); PWA manifest; shared sticky nav;
  `/.well-known/security.txt`.
- **Validation:** typecheck, lint, `npm test` (101 passing), build all green;
  routes + OG/manifest/security.txt runtime-verified via `npm start` + curl.
- **Note:** corrects an earlier premature "nothing left" call — substantial
  non-blocked product work remained and was delivered.

---

## 2026-05-26 — Hardening + editorial + readiness batch

- **Agent / session:** Claude Code (web), session `01Y1CrecRRnhezjW717nDEXS`.
- **Scope:** Continue non-blocked hardening, content, and a11y.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** baseline security headers (nosniff/frame/referrer/permissions/HSTS)
  + robots `/api/` disallow; per-destination + brand OG images; editorial
  description/best-time on detail pages; gated Travel Readiness aggregate
  preview; accessibility skip link + focus-visible; `/about` honest systems
  status page.
- **Validation:** typecheck, lint, `npm test` (101 passing), build all green;
  headers/OG/robots runtime-verified; readiness panel verified off-by-default.

---

## 2026-05-26 — Deepen Travel Readiness aggregate (safety + conditions)

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Continue the non-blocked queue — add safety/conditions to the
  Travel Readiness preview. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green at start).
- **Changes:** extended the Travel Confidence aggregate from 3 to 5 sub-engines
  by surfacing Safety & Risk and Real-Time Conditions in the gated
  `TravelReadiness` preview; bumped `travelConfidenceWeights` to
  `travel-confidence-v2` (safety weighted with disruption; conditions with
  destination); added deterministic `mockSafetyContext`/`mockConditionsContext`
  (clearly-labeled sample data, no network); updated honesty labels in the
  component; refreshed the intelligence-engine architecture doc.
- **Validation:** typecheck, lint, `npm test` (**108** passing, +3), and
  `npm run build` all green; key routes (home/detail/unknown-404/health)
  runtime-verified via `npm start` + curl (200/200/404/200). The readiness
  panel is client-computed (renders after hydration), so its aggregate output
  is covered by unit tests rather than curl.
- **Assumptions / safety:** no secrets, no network; safety/conditions inputs are
  deterministic sample contexts and remain explicitly labeled "sample" in the UI
  until live feeds are wired. Weight change is versioned (v1→v2) for traceability.

---

## 2026-05-26 — Discovery UX: surface the Pathfinder `avoid` arm

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Continue the non-blocked discovery-UX queue. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** `/discover` now surfaces both arms of the pure `pathfind` query —
  a single "Chasing" vibe plus multi-select "Not feeling" moods to downrank
  (mutually exclusive per mood). Reuses the existing tested engine; no new
  engine logic. Updated page copy to match.
- **Validation:** typecheck, lint, `npm test` (108 passing), build all green;
  `/discover` runtime-verified via `npm start` + curl — 200, both selector
  groups present, all destinations ranked with explainable reasons in the
  server-rendered markup (ranking computed in render, not post-hydration).
- **Assumptions / safety:** no secrets, no network; the `avoid` branch is already
  covered by `test/intelligence.discovery.test.ts`.

---

## 2026-05-26 — CSP rollout phase 2: enforce the safe structural subset

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Advance the #1 non-blocked queue item (CSP) without the browser
  hydration verification that a full nonce-based enforcing policy requires.
  Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1.
- **Changes:** `src/middleware.ts` now emits a **two-tier CSP**. The structural
  directives the app never exercises (`base-uri 'self'`, `object-src 'none'`,
  `frame-ancestors 'none'`, `form-action 'self'`) move to an **enforcing**
  `Content-Security-Policy`; the script/style/content directives stay in the
  existing `Content-Security-Policy-Report-Only`. This hardens clickjacking /
  plugin-injection / `<base>`-hijack / form-exfiltration now, with no effect on
  rendering or hydration and no per-request nonce (static rendering preserved).
  Verified the app has no `<form>`/`<object>`/`<iframe>`/`<base>` before
  enforcing. Security-overview doc updated.
- **Validation:** typecheck, lint, `npm test` (108 passing), build all green.
  Runtime-verified via `npm start` + curl on a clean server: both CSP headers
  present with the expected directives; `/`, `/discover`, `/plan`, `/saved`,
  `/about`, `/destinations/kyoto`, `/api/metrics` all 200.
- **Note (process):** an orphaned `next-server` child from a prior `npm start`
  initially masked the new header (killing the npm parent leaves the child
  bound to :3000). Re-verified after a process-group kill — a reminder to use
  `setsid` + `kill -- -PGID` (as `scripts/smoke.mjs` already does).
- **Assumptions / safety:** the report-only tier is unchanged, so promoting the
  remaining directives to enforcing still needs a browser hydration check
  (Next.js injects inline bootstrap scripts/styles) — left as the next
  deliberate step; the `csp_violation` counter on `/api/metrics` gives the
  zero-violation signal an operator needs to flip it.
- **Follow-up:** added header assertions to `scripts/smoke.mjs` (e2e) so the
  enforced `Content-Security-Policy` (`frame-ancestors 'none'`) and the
  `Content-Security-Policy-Report-Only` (`script-src 'self'`) can't silently
  regress in CI. Verified substrings against a live server; `node --check`
  passes. (The smoke runner self-manages its server via a process-group kill,
  which is correct in CI's isolated session but kills a shared shell locally —
  so it's exercised in CI rather than the dev shell.)

---

## 2026-05-26 — Trip planner: surface the fatigue budget + per-day load meter

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Deepen the `/plan` UX so the fatigue-aware pacing is legible.
  Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** `buildItinerary` now returns its per-day `budget` (so the UI reads
  the config instead of duplicating thresholds). `TripBuilder` shows a trip
  summary (days · pacing · budget/day) and a per-day intensity load meter
  (`role="meter"` with aria bounds) so users see *why* days split. +1 test
  asserting the budget is reported and increases with denser pacing.
- **Validation:** typecheck, lint, `npm test` (**109** passing), build all green;
  `/plan` runtime-verified via `npm start` + curl (200; controls + empty-state
  render server-side; enforced CSP header confirmed still present). The load
  meter is client-rendered after selection, so its math is covered by the
  itinerary unit tests.
- **Note (process):** earlier local server checks were flaky because a
  `pkill -f next-server` pattern matched the dev shell's own command line; fixed
  by starting on a dedicated port without the self-matching pkill.

---

## 2026-05-26 — Saved collection: inline remove + count

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Close a `/saved` UX gap — items couldn't be removed without opening
  each destination. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** `SavedList` now shows a saved count and an inline, accessible
  "Remove" button per item (reuses the already-tested `useSaved().toggle`, which
  persists to localStorage and syncs across tabs). No new persistence logic.
- **Validation:** typecheck, lint, `npm test` (109 passing), build all green;
  `/saved` runtime-verified via `npm start` + curl (200; empty-state renders
  server-side). Remove affordance is client-side over the tested set logic
  (`test/saved.collection.test.ts`).

---

## 2026-05-26 — Test coverage: CSP report endpoint

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Cover the previously-untested `/api/csp-report` handler on the
  security observability path. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** `test/csp.report.test.ts` asserts the endpoint extracts both the
  legacy `{"csp-report": …}` wrapper and the modern `effectiveDirective`/
  `blockedURL` report body (incrementing `csp_violation` and returning 204), and
  fails safe on a malformed body (no count, still 204). No source change.
- **Validation:** typecheck, lint, `npm test` (**112** passing, +3), build all
  green.

---

## 2026-05-26 — Discovery coherence: live light badge on /discover

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Surface the real (solar) light-phase signal on `/discover` rows for
  parity with the home cards. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** `DiscoverClient` renders the existing `LightBadge` per ranked
  result that has coordinates — reuses the proven component; no new logic.
- **Validation:** typecheck, lint, `npm test` (112 passing), build all green;
  `/discover` runtime-verified via `npm start` + curl (200; ranked rows render).
  The badge is client-computed (as on home cards), so its live phase isn't in
  SSR markup.
- **Also confirmed (blocked, not faked):** re-tested Open-Meteo egress —
  `https://api.open-meteo.com/...` returns HTTP 403 from the network allowlist,
  so the real `OpenMeteoWeatherProvider` stays blocked per the handoff.

---

## 2026-05-26 — Real sun-times / golden-hour schedule (no network)

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Add genuinely-computed (not mock) intelligence that needs no
  external resource — a per-destination light schedule. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** extended `solar.ts` with `sunTimes(date, lat)` (sunrise, sunset,
  solar noon, day length, morning/evening golden-hour windows) + `formatSolarTime`,
  refactoring declination into one shared source. Handles polar day/night
  (midnight-sun / polar-night). New `SunSchedule` component surfaces it on
  destination detail pages, honestly labeled *local solar time* (omits tz/DST/
  equation-of-time). All values are real solar geometry — no network, no mock.
- **Validation:** typecheck, lint, `npm test` (**116** passing, +4 solar cases
  incl. equator-equinox, polar edge cases, hemisphere asymmetry, formatting),
  build all green; detail route runtime-verified (200, no regression). The panel
  is client-computed (like the atmosphere score), so its rendered times are
  covered by the solar unit tests.
- **Assumptions / safety:** times are approximate local solar time and labeled as
  such — no civil-clock claim without a timezone source; no fabricated data.

---

## 2026-05-26 — Distance-aware trip planner (haversine over real coordinates)

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Give `/plan` real spatial context from the catalog coordinates — no
  external API. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** new pure `geo.ts` (`haversineKm`, `routeDistanceKm` → total +
  longest leg). `TripBuilder` now shows the selected trip's span (~total km and
  longest leg) computed from real coordinates; `PlannableDestination` carries
  optional `coordinates`, passed through from the plan page. Memoized the
  selected-destinations derivation so dependent memos stay stable.
- **Validation:** typecheck, lint, `npm test` (**122** passing, +6 geo cases
  incl. equator-degree checks, symmetry, route total/longest-leg, <2-stop zero),
  build all green; `/plan` runtime-verified (200, no regression). The span line
  is client-computed after selection; the distance math is unit-tested.
- **Assumptions / safety:** straight-line great-circle distance (labeled "spans"),
  not routed travel distance; no network, no fabricated data.

---

## 2026-05-26 — Moon phase signal (pure astronomy)

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Round out the celestial "how the night feels" story alongside the
  sun schedule — no external resource. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** new pure `moon.ts` (`moonPhase(date)` → age, illuminated fraction,
  phase name) from a known new-moon epoch + the mean synodic month. Surfaced as a
  "Moon · <phase> · N% lit" line in the existing `SunSchedule` detail card.
- **Validation:** typecheck, lint, `npm test` (**127** passing, +5 moon cases
  incl. new/full/first-quarter anchors, 0..1 bound, synodic wrap), build all
  green. Rendered within the already-verified detail card (client-computed; math
  unit-tested).
- **Assumptions / safety:** mean-synodic approximation (well within a day),
  labeled as a derived signal; a real ephemeris can replace it behind the same
  shape; no network, no fabricated data.

---

## 2026-05-26 — Supabase schema parity: destination coordinates + editorial

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Audit the Supabase file structure for completeness/consistency and
  close a gap that would regress the product on connect. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Audit result:** for the built surfaces (destinations + affiliate) the schema,
  RLS, seed, local `config.toml`, clients, env boundary, provider `select`s, and
  write/analytics paths all line up. **Gap found:** the `destinations` table
  carried only `id/name/country/headline/mood/image_url`, but the app's
  `Destination` type also has `coordinates`/`description`/`bestTime` — so a
  DB-backed catalog would silently lose the coordinate-driven signals (light
  phase, sun/moon schedule, atmosphere score, trip distance) and editorial copy.
- **Changes:** new forward-only `0004_destination_details.sql`
  (`add column if not exists` latitude/longitude/description/best_time); provider
  `mapRow`/`select` now read + map them (coordinates only when both lat/lon
  present); `seed.sql` carries the four destinations' real coordinates + copy;
  migrations README updated; `mapRow` exported + unit-tested.
- **Validation:** typecheck, lint, `npm test` (**130** passing, +3 mapping cases),
  build all green. (Seed SQL applies on `supabase db reset` locally — not run
  here; no hosted DB.)
- **Still open (documented, needs DB to exercise):** when Supabase is connected,
  make `generateStaticParams` async/ISR so DB-only destinations get detail pages
  (per the handoff blocked queue). No schema for not-yet-built surfaces
  (auth/users/saved) — expected, not a defect.

---

## 2026-05-26 — Itinerary export (.ics) for the trip planner

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Let travelers take a built plan into any calendar app — no external
  dependency. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** new pure `itinerary-export.ts` (`itineraryToICS`) emitting a
  RFC-5545 VCALENDAR with one all-day VEVENT per itinerary day (RFC text
  escaping, CRLF line endings, UTC date-only values). `TripBuilder` adds a
  "Download .ics" button (client Blob download) when a plan exists.
- **Validation:** typecheck, lint, `npm test` (**134** passing, +4 export cases:
  per-day VEVENT count, date advance, comma escaping/CRLF, empty calendar),
  build all green; `/plan` runtime-verified (200, no regression). The download
  trigger is client-only; the ICS string is unit-tested.
- **Assumptions / safety:** all-day events from a UTC-midnight start (today by
  default); no network, no fabricated data.

---

## 2026-05-26 — SEO: schema.org structured data (JSON-LD)

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Add the structured data world-standard sites expose for rich search
  results — no external dependency. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** new pure `seo/jsonld.ts` — `destinationJsonLd` (TouristAttraction
  with PostalAddress + GeoCoordinates when known), `siteJsonLd` (WebSite +
  Organization @graph), and `jsonLdScript` (serializes + escapes `<` so the
  inline data block can't break out of the `<script>`). Server-rendered on the
  home page and destination detail pages.
- **Validation:** typecheck, lint, `npm test` (**138** passing, +4 SEO cases incl.
  geo/headline fallback + the `<`-escape safety case), build all green.
  **Runtime-verified in the SSR HTML** (not just client): home emits WebSite +
  Organization; `/destinations/kyoto` emits TouristAttraction + GeoCoordinates
  (lat 35.0116) + `addressCountry: Japan`.
- **Notes:** `<script type="application/ld+json">` is a non-executable data block,
  so it's unaffected by the `script-src` CSP; no policy change needed. No
  fabricated data — all fields come from the catalog.
- **Follow-up:** added per-page `alternates.canonical` to home, discover, plan,
  saved, about, and destination detail pages (resolved against `metadataBase`).
  Runtime-verified: every route emits a correct `<link rel="canonical">` in SSR.

---

## 2026-05-26 — Core Web Vitals: optimize the LCP hero image

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Replace the home hero's raw CSS background-image (unoptimized,
  hardcoded URL) with an optimized, preloaded `next/image` — a real LCP win and
  a no-hardcoding cleanup. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** moved the hero URL into `site` config (`heroImageUrl`); rendered it
  via `next/image` (`fill`, `priority`, `sizes="100vw"`, decorative `alt=""`)
  inside the existing kenburns wrapper (animation preserved).
- **Validation:** typecheck, lint, `npm test` (138 passing), build all green;
  home runtime-verified — emits `<link rel="preload" as="image">` and
  `/_next/image?...&w=…&q=75` srcset (Next image optimization active); the raw
  `backgroundImage` style is gone.
- **Assumptions / safety:** `images.unsplash.com` already allow-listed in
  `next.config`; decorative hero so empty alt is the correct a11y choice.

---

## 2026-05-26 — Trust + a11y: privacy page, shared footer, active-nav semantics

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** World-standard trust + accessibility basics, no external dependency.
  Continuation of PR #1. (Service worker deliberately deferred — sticky in
  clients and not browser-verifiable here; wrong risk/verify tradeoff for now.)
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:** new `/privacy` page (honest, plain-language disclosure of the
  anonymous `jid` cookie, device-local saves, and the no-trackers/no-accounts
  posture) + canonical + sitemap entry. New shared `Footer` (labeled landmark,
  About + Privacy links) rendered in the layout; removed the duplicate inline
  home footer; body switched to a min-height flex column so the footer sits at
  the bottom. `Nav` now marks the active route with `aria-current="page"` and
  carries `aria-label="Primary"`.
- **Validation:** typecheck, lint, `npm test` (138 passing), build all green;
  runtime-verified — `/privacy` 200 with expected content; footer + Privacy link
  on `/about`; `aria-current="page"` on the active nav link; `/privacy` in the
  sitemap.
- **Assumptions / safety:** privacy copy reflects only what the app does today
  and is committed to be updated alongside any data-handling change; no
  fabricated claims.
- **Follow-up:** added `/privacy` to the e2e smoke checks (CI regression guard)
  and a `viewport` `themeColor`/`colorScheme` so mobile browser chrome matches
  the dark palette. Runtime-verified: `<meta name="theme-color" content="#11100e">`.

---

## 2026-05-27 — Make Supabase + LLM integration drop-in ready

- **Agent / session:** Claude Code (web), session `01Juf5y7hd431tmBs8UzjJkq`.
- **Scope:** Get the externally-gated integrations to "config-only to enable" so
  connecting Supabase or an LLM needs no code change. Continuation of PR #1.
- **Branch / PR:** `claude/quirky-keller-2S10c` → PR #1 (CI green).
- **Changes:**
  - **Detail pages DB-ready:** `generateStaticParams` is now async and resolves
    through the provider, so DB destinations get pages at build once Supabase is
    on. Kept `dynamicParams = false` (true 404s) after confirming `dynamicParams
    = true` regressed `/destinations/nope` to a 200 soft-404.
  - **LLM seam:** `PlanningProvider` contract + Anthropic adapter (real Messages
    API call, gated by `getLlmConfig()` + the new `ai-planning` flag, so it is
    inert until a key + flag are set) + selection (`getPlanningProvider`) +
    `POST /api/plan/ai` (400 invalid, 503 when unconfigured, 502 on provider
    error, 200 with a plan). `LLM_API_KEY`/`LLM_MODEL` added to the env boundary.
  - **Docs/ops:** `docs/runbooks/hosted-enablement.md` (exact turn-on steps for
    Supabase + LLM + weather); `.env.example`, docs README, and the handoff
    blocked queue updated; smoke now covers `GET /api/plan/ai` (405, POST-only).
- **Validation:** typecheck, lint, `npm test` (**142** passing, +4 AI cases),
  build all green. Runtime-verified: `/destinations/kyoto` 200, `/destinations/
  nope` 404 (preserved), `POST /api/plan/ai` 503 unconfigured, `GET` 405,
  invalid body 400.
- **Assumptions / safety:** the Anthropic call is standard but unrun here (no key,
  egress restricted) — it is fully gated and inert until enabled, with the
  deterministic planner as the fallback; no secrets committed; no fabricated
  data. DB rows added after a build appear on the next build (ISR is a later
  opt-in) — documented.
