# Continuation Handoff

_Last updated: 2026-05-27. Snapshot for the next engineer/agent to resume
without context loss._

## Where things stand

Greenfield repo bootstrapped into a **runnable, runtime-verified** platform with
a complete affiliate vertical, live (network-free) intelligence signals, a
working browsable UI (incl. a trip planner), an observability + control-plane
layer, operational runbooks, and a full public surface (`/`, `/discover`,
`/plan`, `/saved`, `/about`, `/destinations/[id]`, plus JSON/health/metrics/
affiliate/admin APIs, OG images, manifest, security headers). ~14 product-vision
intelligence engines are scaffolded on one explainable, versioned scoring core.
Every increment passes `typecheck`, `lint`, `test` (**112**), and `build`; key
routes verified via `npm start` + curl, and a 19+ check e2e smoke
(`scripts/smoke.mjs`) runs in CI (now also asserting the security headers).

### Branches & PR

| Ref | State |
| --- | --- |
| `main` | Baseline = foundation commit. |
| `claude/quirky-keller-2S10c` | Active feature branch; all increments below. |
| **PR #1** (`claude/quirky-keller-2S10c` → `main`) | **Open**, awaiting human review/merge. CI runs install→typecheck→lint→test→build + dependency audit. |

### Workstreams completed on the feature branch (all merge-ready)

1. Foundation — Next.js 15 / React 19 / TS strict / Tailwind v4 design system;
   provider registry + seed; config boundary; ADRs 001–004; CI; PR template.
2. Config validation (zod env) + feature flags; Supabase destinations adapter +
   RLS migration; service-role client.
3. **Affiliate vertical (complete):** model + pure resolver (ADR-005); Supabase
   catalog loader; safe URL rendering; gated UI CTA; click + conversion
   ingestion endpoints; revenue analytics with time-windowing.
4. Intelligence scoring core + destination/events/disruption engines + Travel
   Confidence aggregate; versioned weights (ADR-006).
5. Observability — structured logger, registry failover instrumentation,
   `/api/health`.
6. Experiments — deterministic A/B assignment seam (`src/lib/experiments`).
7. App resilience (loading/error/404) + SEO (robots/sitemap/OG).
8. Local Supabase stack (config + seed + runbook) + end-to-end failover test.
9. Governance — dependency map, AI audit trail, Dependabot, CODEOWNERS,
   CONTRIBUTING, SECURITY, issue templates.
10. Live product UI — landing with mood filter + search; detail pages
    (`/destinations/[id]`, true 404 on unknown); live light-phase badge
    (real solar math); explainable atmosphere score (honest confidence);
    JSON `/api/destinations`; environmental comfort scorer (weather-feed ready).
11. Provider hardening — contract tests; mock weather dev-provider; mock
    event/disruption contexts exercising those engines.
12. Observability — counter metrics scaffold + `/api/metrics`; registry counts
    resolve/failover/exhaustion.
13. Control plane — secure-by-default `/api/admin/status` (provider availability,
    flags, counters).
14. Ops + DB — incident-response + recovery runbooks; analytics indexes
    (`0003`); migrations README.
15. Architecture docs + diagrams — failure/recovery, data-flow, auth,
    deployment/environment, request-lifecycle (mermaid).
16. CI/CD — concurrency cancellation; Node pinning (`engines` + `.nvmrc`).
17. Self-hosted fonts (`@fontsource-variable`) — no build-time font fetch.
18. Discovery — Travel DNA (`rankByDNA`), Pathfinder (`/api/pathfinder`),
    dynamic itinerary (fatigue-aware pacing); postmortem template.
19. More engines — safety/risk, visa/entry, local-culture scaffolds (versioned
    weights, tested).
20. Affiliate analytics pagination (`?limit=&offset=`).
21. Trip planner UI (`/plan`) surfacing the dynamic-itinerary engine
    (config-driven mood→intensity).

Done (session 3 — this branch `claude/travel-provider-contracts-*`): **Travel-data
provider contracts** (backend-only). New `src/lib/providers/travel-data` layer:
seven capability contracts (places, opening hours, ticket prices, ticket links,
reviews, local events, safety advisories); a shared **source-attribution model**
(`source.ts` — sourceName/type/providerId/confidence/fetchedAt/expiresAt/
attributionURL, sourceType ∈ seed|mock|live|stale|unavailable); pure
**freshness/confidence** helpers (`freshness.ts` — freshness state, stale
detection, confidence normalization + banding, source ranking, result-quality
classification); a fallback-safe discriminated `TravelDataResponse`
(ok|unavailable|error, `data` always present); a parameterized **registry** with
trust-ordered resolution + `reportTravelDataReadiness()`; **SEED adapters only**
(one per kind, deterministic, ticket links use a neutral `example.com`
placeholder). Readiness is surfaced read-only under `/api/admin/status`. Tests:
**194 total** (added contracts, source, freshness, confidence, registry/readiness,
fallback). **No live vendor wired; no Supabase; no UI; no LLM change.**

### Honesty notes for this session (must stay true)

- **Supabase remains blocked** (hosted) — no hosted DB migrations were applied;
  none attempted this session.
- **LLM planning is already provided and tested** — not changed this session.
- **UI is intentionally deferred** — no UI files were touched.
- The travel-data providers are **contract-ready only**. Live data vendors are
  **not wired** — only clearly-labeled SEED adapters exist, and every response
  carries `SourceMetadata` so seed data is never presentable as live.
- **No fake operational/live-data claims** were introduced; readiness reporting
  reports kinds as `blocked` (no live provider) honestly.

## What is real vs. roadmap (read before extending)

- **Real & tested (77 tests):** provider registry + fallback + contract tests;
  config/flag/env boundary; full affiliate vertical (resolver incl. A/B, URL
  render, ingestion validation/rows, analytics aggregation + time-window);
  intelligence scoring core + engine mappings + confidence aggregate + real
  solar signal; deterministic mocks (weather/event/disruption); structured
  logging + counter metrics; admin status endpoint (secure-by-default).
- **Scaffold (logic/contracts real, data NOT wired):** intelligence engines have
  no live weather/events/advisory feeds (mock providers stand in); Supabase
  providers + migrations are not applied to any *hosted* project (local-only
  verified); **travel-data provider contracts** (places/hours/prices/links/
  reviews/events/advisories) exist with source/freshness/confidence model +
  registry, backed only by SEED adapters — no live travel-data vendor wired.
- **EXTERNALLY BLOCKED (cannot proceed without access):**
  - Hosted Supabase (staging/prod) — needs real project secrets.
  - Live weather feed — Open-Meteo egress blocked by the network allowlist
    (`comfortScore` + `WeatherProvider` contract are ready to receive it).
  - Branch protection / org settings — needs repo-admin access.
- **Not started (no external block, just scope):** auth/RLS user sessions, AI
  planning, Travel DNA, dynamic itinerary, real-time conditions, safety/risk,
  visa, local culture, city energy, memory/reflection, social/creator.

No operational claims are made for unbuilt systems — keep it that way.

## Next autonomous execution queue (non-blocked first)

Done (session 1): self-hosted fonts; Travel DNA + Pathfinder + dynamic itinerary;
postmortem template; safety/visa/culture + conditions/city-energy/memory engines;
analytics pagination; trip planner UI; **per-visitor A/B** (jid cookie + client
CTA + `/api/affiliate/link`, without forcing pages dynamic); reusable provider
contract harness; engine-roster doc parity; Report-Only CSP + report endpoint;
e2e smoke + CI step.

Done (session 2 — this branch): Travel Readiness aggregate extended to 5
sub-engines (added safety + conditions; weights `travel-confidence-v2`);
`/discover` now exposes the Pathfinder **avoid** arm + a live light badge per
result; **CSP phase 2** — structural directives (`base-uri`, `object-src`,
`frame-ancestors`, `form-action`) promoted to **enforcing** while script/style/
content stay Report-Only; smoke asserts the CSP headers; `/plan` shows the
fatigue budget + a per-day load meter; `/saved` gained inline remove + a count;
`/api/csp-report` unit-tested.

**Remaining non-blocked work is genuinely thin** — what's left is blocked:
- **Hosted Supabase** (staging/prod) — real secrets.
- **Live weather feed** — Open-Meteo egress still 403 from the allowlist
  (re-verified); `WeatherProvider` + `comfortScore` ready to receive it.
- **AI planning engine** — needs an LLM/provider (network).
- **Branch protection** — repo-admin access.
- **Full nonce-based CSP enforcement** — needs a real-browser hydration check
  (Next.js injects inline bootstrap scripts/styles) and would force dynamic
  rendering; flip the script/style/default directives from Report-Only to
  enforcing once `/api/metrics` shows `csp_violation` at zero after browsing.

Optional marginal polish: DB-side group-by analytics at scale; extracting the
home search/filter into a pure tested helper.

## Blocked queue (resume when access is granted)

The seams are now **config-only to enable** — see
`docs/runbooks/hosted-enablement.md` for exact steps.

- Hosted Supabase: set env + `supabase db push` (migrations `0001`–`0004`) +
  enable flags. Detail pages are already DB-ready — `generateStaticParams` is
  async and resolves through the provider, so DB destinations get pages at build
  (kept `dynamicParams=false` for true 404s; rows added post-build appear on the
  next build, or wire ISR later if desired).
- LLM / AI planning: set `LLM_API_KEY` (+ optional `LLM_MODEL`) and enable the
  `ai-planning` flag. Seam built + tested: `PlanningProvider` contract, Anthropic
  adapter (inert until configured), `POST /api/plan/ai` (503 until enabled).
- Live weather: allowlist the weather host, implement `OpenMeteoWeatherProvider`
  to the existing `WeatherProvider` contract, register ahead of the mock.
- Branch protection: enable required PR review + status checks on `main`.

## Conventions to keep

- New external integrations go **behind a provider adapter**, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use `config`/`content`/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.

## Conventions to keep

- New external integrations go **behind a provider adapter**, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use `config`/`content`/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.
