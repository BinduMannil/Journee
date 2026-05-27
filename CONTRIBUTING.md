# Contributing to Journee

## Local setup

```bash
npm install
npm run dev          # http://localhost:3000
```

Optional DB-backed providers: see
[`docs/runbooks/supabase-local-setup.md`](docs/runbooks/supabase-local-setup.md).

## The quality gate (run before pushing)

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs all of these plus a dependency audit on every PR.

## How we work

- Branch from `main`; open a PR using the template. Keep PRs small and focused.
- All changes go through PR review + green CI (see
  [`docs/governance/branch-and-pr-governance.md`](docs/governance/branch-and-pr-governance.md)).
- Architecture-changing PRs **update the relevant `docs/` file in the same PR**,
  and add an ADR (`docs/decisions/`) for significant decisions.

## Principles (non-negotiable)

- **No hardcoding.** Copy, links, providers, and scoring weights come from
  config/data, not literals in components (ADR-004).
- **Provider-agnostic.** External integrations go behind an adapter and the
  registry, gated by `isAvailable()` so fallback holds (ADR-003).
- **Explainable & honest.** Scores carry their breakdown + weights version
  (ADR-006). Don't document systems that don't exist — label roadmap as roadmap.
- **No secrets in git.** Use `.env.local` (git-ignored); `.env.example` holds
  placeholders only.

## Autonomous agents

Changes produced by automated agents must note that in the PR and append an entry
to [`docs/governance/ai-agent-audit-trail.md`](docs/governance/ai-agent-audit-trail.md).
