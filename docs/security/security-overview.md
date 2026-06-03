# Security Overview

_Last updated: 2026-05-26. Honest snapshot of an early-stage repository._

This document states the **current** posture and the **path** toward SOC 2
readiness. It distinguishes what is in place from what is recommended/planned so
it can serve as truthful audit input rather than aspirational marketing.

## In place today

- **No secrets in the repo.** `.gitignore` excludes `.env*`; `.env.example`
  holds placeholders only. Server-only keys (e.g. Supabase service role) are
  documented as server-only.
- **CI quality gate.** Typecheck, lint (ESLint CLI), and build run on every PR.
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
- **Admin-gated introspection.** Every endpoint that exposes privileged data or
  operational signal is secure-by-default (503 unless `JOURNEE_ADMIN_TOKEN` is
  set, then a matching `x-admin-token` header is required), via a single shared
  guard (`src/lib/auth/admin.ts`): `/api/admin/status`, `/api/admin/readiness`,
  `/api/affiliate/analytics` (revenue data — reads event tables through the
  service-role client, which bypasses RLS), and `/api/metrics`. The token check
  is **constant-time** (SHA-256 + `timingSafeEqual`) so it can't be probed by
  timing.
- **Rate-limited public writes.** The unauthenticated browser-beacon endpoints
  (`/api/affiliate/click`, `/api/affiliate/conversion`, `/api/csp-report`) are
  rate-limited per client IP (`src/lib/http/`) to bound fake-event and
  log-flood injection. The limiter is in-memory/per-instance today — a shared
  store (e.g. Redis) is the documented next step for a global limit under
  horizontal scaling.
- **Clean dependency audit.** `npm audit` reports zero vulnerabilities; a
  transitive `postcss` advisory is pinned to a patched line via `overrides`.

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
