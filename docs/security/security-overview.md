# Security Overview

_Last updated: 2026-05-26. Honest snapshot of an early-stage repository._

This document states the **current** posture and the **path** toward SOC 2
readiness. It distinguishes what is in place from what is recommended/planned so
it can serve as truthful audit input rather than aspirational marketing.

> **The full SOC 2 readiness program now lives in
> [`../compliance/`](../compliance/README.md):** a beginner-friendly explainer,
> a [criteria→control→evidence matrix](../compliance/trust-services-criteria-matrix.md),
> a complete [policy set](../compliance/policies), an
> [evidence-collection guide](../compliance/evidence-collection-guide.md), and an
> honest [gap analysis](../compliance/gap-analysis-and-roadmap.md). This page
> remains the concise security-posture summary; the compliance folder is the
> detailed program.

## In place today

- **No secrets in the repo.** `.gitignore` excludes `.env*`; `.env.example`
  holds placeholders only. Server-only keys (e.g. Supabase service role) are
  documented as server-only.
- **CI quality gate.** Typecheck, lint, test, build, and a smoke test run on
  every PR, with a **least-privilege token** (`permissions: contents: read`).
- **Automated security scanning.** CodeQL **SAST**
  (`.github/workflows/codeql.yml`), dependency audit (`npm audit` in CI) +
  Dependabot, and **secret scanning** via gitleaks
  (`.github/workflows/secret-scan.yml`) — all on PRs/pushes and weekly schedules.
- **Strict typing.** Reduces a class of runtime/security bugs.
- **Provider boundary.** Outbound integrations and credentials are funneled
  through adapters, giving a single place to audit external access.
- **Baseline security headers** on every response (`next.config.mjs`):
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict
  `Referrer-Policy`, a restrictive `Permissions-Policy`, and HSTS.
  `robots.txt` disallows `/api/`; `/.well-known/security.txt` points here.
- **Two-tier CSP** (`src/middleware.ts`, rollout phase 2):
  - *Enforced* (`Content-Security-Policy`): the structural directives the app
    never exercises — `base-uri 'self'`, `object-src 'none'`,
    `frame-ancestors 'none'`, `form-action 'self'`. These add clickjacking,
    plugin-injection, `<base>`-hijack, and form-exfiltration protection with no
    effect on rendering/hydration and no need for per-request nonces (static
    rendering is preserved).
  - *Report-Only* (`Content-Security-Policy-Report-Only`): the script/style/
    content directives (`default-src`, `script-src 'self'`, `style-src`,
    `img-src`, `font-src`, `connect-src`) stay monitored, reporting to
    `/api/csp-report` (surfaced via the `csp_violation` counter on
    `/api/metrics`). Promoting these to enforcing needs a browser hydration
    check (Next.js injects inline bootstrap scripts/styles) and would require
    nonces — which force dynamic rendering — so it remains the next deliberate
    step once reports confirm a zero-violation allow-list.

## Recommended next (not yet enforced)

| Control | Action |
| --- | --- |
| Branch protection on `main` | Require PR + passing CI + review; block force-push. (gap P0-1) |
| Native secret scanning | Enable GitHub secret scanning + **push protection** to complement the gitleaks workflow. (gap P0-3) |
| MFA | Require MFA for all org members. (gap P0-2) |
| Least privilege (org/cloud) | Document and apply minimal GitHub + cloud roles. (CI token is already read-only.) |
| Environment separation | Distinct local/staging/prod with separate credentials. (gap P1-8) |

The "gap" references above point to
[`../compliance/gap-analysis-and-roadmap.md`](../compliance/gap-analysis-and-roadmap.md),
where each item has a priority, owner, and exact action.

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
