# Continuation Handoff

_Last updated: 2026-05-26. Snapshot for the next engineer/agent to resume
without context loss._

## Where things stand

Greenfield repo bootstrapped into a **runnable, building** platform foundation
with a complete affiliate vertical and the core architectural seams in place.
Every increment passes `typecheck`, `lint`, `test` (48), and `build`.

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

## What is real vs. roadmap (read before extending)

- **Real & tested (48 tests):** provider registry + fallback, config/flag
  boundary, the full affiliate vertical (resolver, URL render, ingestion
  validation/rows, analytics aggregation, time-window parsing), intelligence
  scoring core + engine mappings + confidence aggregate, A/B assignment,
  structured logging.
- **Scaffold (logic/contracts real, data NOT wired):** intelligence engines have
  no live weather/events/advisory feeds; Supabase providers + migrations are not
  applied to any *hosted* project (local-only verified).
- **Not started:** auth, AI planning, Travel DNA, dynamic itinerary, real-time
  conditions, safety/risk, visa, local culture, city energy, memory/reflection,
  social/creator.

No operational claims are made for unbuilt systems — keep it that way.

## Recommended next priorities (in order)

1. **Merge PR #1** (or split if review prefers) — it is comprehensive and green;
   further large workstreams should branch off `main` once it lands.
2. **Hosted Supabase** for staging/prod — needs real secrets (agent stop
   condition); apply migrations, set env, enable flags.
3. **First live intelligence feed** (e.g. weather → `DisruptionContext`), then
   surface an explainable score in the UI with its confidence.
4. **Wire A/B assignment into affiliate priority** rules; add analytics row
   pagination.
5. **Self-host brand fonts** to remove the build-time Google Fonts dependency.
6. **Branch protection** — enable the recommended controls once collaborators
   exist.

## Conventions to keep

- New external integrations go **behind a provider adapter**, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use `config`/`content`/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.
