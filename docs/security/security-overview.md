# Security Overview

_Last updated: 2026-05-26. Honest snapshot of an early-stage repository._

This document states the **current** posture and the **path** toward SOC 2
readiness. It distinguishes what is in place from what is recommended/planned so
it can serve as truthful audit input rather than aspirational marketing.

## In place today

- **No secrets in the repo.** `.gitignore` excludes `.env*`; `.env.example`
  holds placeholders only. Server-only keys (e.g. Supabase service role) are
  documented as server-only.
- **CI quality gate.** Typecheck, lint, and build run on every PR.
- **Strict typing.** Reduces a class of runtime/security bugs.
- **Provider boundary.** Outbound integrations and credentials are funneled
  through adapters, giving a single place to audit external access.
- **Baseline security headers** on every response (`next.config.mjs`):
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict
  `Referrer-Policy`, a restrictive `Permissions-Policy`, and HSTS.
  `robots.txt` disallows `/api/`; `/.well-known/security.txt` points here.
  A **Report-Only CSP** is live (monitoring phase) reporting violations to
  `/api/csp-report`; switching to an enforcing nonce-based CSP is the next step
  once reports confirm the allow-list.

## Recommended next (not yet enforced)

| Control | Action |
| --- | --- |
| Branch protection on `main` | Require PR + passing CI + review; block force-push. |
| Secret scanning | Enable GitHub secret scanning + push protection. |
| Dependency scanning | Enable Dependabot / `npm audit` in CI. |
| MFA | Require MFA for all org members. |
| Least privilege | Document and apply minimal GitHub + cloud roles. |
| Environment separation | Distinct local/staging/prod with separate credentials. |

## SOC 2 readiness (direction, not a claim)

Journee is **not** SOC 2 certified. The engineering practices here are chosen to
make eventual readiness straightforward:

- **Change management** → PR-only, reviewed, CI-gated, traceable git history.
- **Access control** → MFA + least privilege (to be enforced), RLS at the data
  layer (ADR-002).
- **Audit logging / deployment traceability** → to be added with the deployment
  pipeline and data platform.
- **Incident response & recovery** → runbooks will be authored alongside the
  systems they cover, not before.

## Reporting

Security issues should be reported privately to the repository owner. A formal
disclosure policy will be added before any public launch.
