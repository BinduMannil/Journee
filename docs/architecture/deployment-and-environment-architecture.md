# Deployment & Environment Architecture

_Last updated: 2026-05-26. Current reality + intended separation (labeled)._

## Current state

- **Build:** standard Next.js 15 production build (`next build`) producing static
  + server-rendered routes. No deploy target is provisioned yet.
- **Quality gate:** CI runs install → typecheck → lint → test → build +
  dependency audit on every PR (`.github/workflows/ci.yml`).
- **Config:** all runtime config flows through the validated env boundary
  (`src/lib/config/env.ts`); `.env.local` (git-ignored) locally, `.env.example`
  documents every variable.

## Intended environment separation (roadmap)

| Env | Purpose | Data | Secrets |
| --- | --- | --- | --- |
| local | dev | local Supabase (CLI) or seed | dev keys only |
| preview | per-PR review | isolated/seeded project | preview-scoped |
| production | live | hosted Supabase | prod-scoped, least privilege |

Principles: distinct credentials per environment; never share prod secrets;
flags (`JOURNEE_ENABLED_FEATURES`) and config differ per env so rollout is
controlled. Provisioning these requires real infrastructure + secrets —
**externally blocked** for now and not claimed as done.

## Known deployment-time dependency

`next/font` fetches Google Fonts at **build time**. A blocked egress or outage
fails the build. Mitigation (roadmap): self-host the brand fonts via
`next/font/local`. Tracked in the dependency map.

## Release & rollback

PR-only, CI-gated merges keep `main` releasable. Rollback = `git revert` the
offending merge → CI → redeploy (see `../runbooks/recovery.md`). No destructive
history rewrites.
