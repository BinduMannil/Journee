# Continuation Handoff

_Last updated: 2026-05-26. Snapshot for the next engineer/agent to resume
without context loss._

## Where things stand

Greenfield repo bootstrapped into a **runnable, building** foundation with the
first architectural seams in place. Every increment passes `typecheck`, `lint`,
`test` (13), and `build`.

### Branches & PR

| Ref | State |
| --- | --- |
| `main` | Baseline = foundation commit. |
| `claude/quirky-keller-2S10c` | Active feature branch; all increments below. |
| **PR #1** (`claude/quirky-keller-2S10c` → `main`) | **Open**, awaiting human review/merge. CI runs install→typecheck→lint→test→build + dependency audit. |

### Commit-scoped workstreams (all merged-ready on the feature branch)

1. Foundation — Next.js 15 / React 19 / TS strict / Tailwind v4 design system;
   provider registry + seed; config boundary; ADRs 001–004; CI; PR template.
2. Config validation (zod env) + feature flags; Supabase destinations adapter +
   RLS migration scaffold.
3. Affiliate model + pure routing resolver; RLS migration; ADR-005.
4. Intelligence scoring core + destination/events/disruption engine scaffolds;
   ADR-006.
5. Unit tests; CI test + dependency-audit; dependency map; AI audit trail.
6. Supabase affiliate catalog loader; Dependabot + CODEOWNERS.

## What is real vs. roadmap (read before extending)

- **Real & tested:** provider registry + fallback, config/flag boundary, the
  affiliate routing resolver (pure), the intelligence scoring core (pure), the
  Supabase adapter shapes.
- **Scaffold (logic/contracts real, data NOT wired):** intelligence engines
  (no live weather/events/advisory feeds), affiliate catalog (migrations not
  applied to any live DB), Supabase providers (no project connected).
- **Not started:** auth, AI planning, Travel DNA, dynamic itinerary, real-time
  conditions, safety/risk, visa, local culture, city energy, memory/reflection,
  social/creator, event ingestion + analytics, UI surfacing of scores/links.

No operational claims are made for unbuilt systems — keep it that way.

## Recommended next priorities (in order)

1. ✅ **Local Supabase enablement + failover verification** — done. Local CLI
   config + seed + runbook (`docs/runbooks/supabase-local-setup.md`) and an
   automated end-to-end failover test (`test/providers.failover.test.ts`).
   Remaining: connect a *hosted* Supabase project for staging/prod (needs real
   secrets — out of scope for the agent).
2. **Self-host brand fonts** to remove the build-time Google Fonts dependency
   (see dependency map mitigation).
3. **Affiliate event ingestion**: server-only write endpoints for click/
   conversion events; then revenue analytics.
4. **First live intelligence feed** (e.g. weather): a provider that populates
   `DisruptionContext`/destination weather signal, then surface an explainable
   score in the UI (with confidence).
5. **Branch protection**: turn on the recommended controls in
   `docs/governance/branch-and-pr-governance.md` once collaborators exist.

## Conventions to keep

- New external integrations go **behind a provider adapter**, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use `config`/`content`/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.
