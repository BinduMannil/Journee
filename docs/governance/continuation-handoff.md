# Continuation Handoff

_Last updated: 2026-05-26. Snapshot for the next engineer/agent to resume
without context loss._

## Where things stand

Greenfield repo bootstrapped into a **runnable, runtime-verified** platform with
a complete affiliate vertical, live (network-free) intelligence signals, a
working browsable UI (incl. a trip planner), an observability + control-plane
layer, and operational runbooks. ~14 of the product-vision intelligence engines
are scaffolded on one explainable, versioned scoring core. Every increment
passes `typecheck`, `lint`, `test` (**98**), and `build`; key routes verified
via `npm start` + curl.

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
  verified).
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

Done: self-hosted fonts; Travel DNA + Pathfinder + dynamic itinerary; postmortem
template; safety/visa/culture + conditions/city-energy/memory engines; analytics
pagination; trip planner UI; **per-visitor A/B** (jid cookie + client CTA +
`/api/affiliate/link`, without forcing pages dynamic); reusable provider
contract harness; engine-roster doc parity.

**No meaningful non-blocked work remains.** What's left is genuinely blocked:
- **Hosted Supabase** (staging/prod) — real secrets.
- **Live weather feed** — Open-Meteo egress blocked; `WeatherProvider` +
  `comfortScore` ready.
- **AI planning engine** — needs an LLM/provider (network).
- **Branch protection** — repo-admin access.

Optional marginal polish if desired later: a ranked Pathfinder discovery view in
the UI (overlaps the existing mood filter); DB-side group-by analytics at scale.

## Blocked queue (resume when access is granted)

- Hosted Supabase: apply `supabase/migrations/*`, set env, enable flags,
  verify provider failover against the real DB; then make
  `generateStaticParams` async (or ISR) so DB destinations get detail pages.
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
