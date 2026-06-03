# Changelog

All notable changes to Journee. Dates are UTC. This is a pre-1.0 foundation;
entries describe what genuinely shipped (roadmap items are labeled as such).

## [Unreleased] — security hardening (branch `claude/magical-fermat-8xmQB`)

### Security
- Admin-gate the revenue analytics endpoint (`/api/affiliate/analytics`) and the
  `/api/metrics` snapshot. Both previously returned privileged data without
  authentication; they now use the same secure-by-default `x-admin-token` guard
  as `/api/admin/*`. Centralized that guard in `src/lib/auth/admin.ts` with a
  **constant-time** token comparison (replacing the prior plain `!==`).
- Rate-limit the unauthenticated public write endpoints (`/api/affiliate/click`,
  `/api/affiliate/conversion`, `/api/csp-report`) per client IP to bound
  fake-event and log-flood injection (`src/lib/http/rate-limit.ts` +
  `guard.ts`); over-limit callers get `429` with `Retry-After`, and a
  `rate_limited` counter surfaces the pressure on `/api/metrics`.
- Pin transitive `postcss` to a patched line via `overrides`, clearing the two
  moderate `npm audit` advisories (`npm audit` now reports 0 vulnerabilities).
- Added unit tests for the limiter, the request guard, the admin guard, and the
  newly-gated analytics endpoint (273 tests pass; typecheck, lint, build green).
- See `docs/CODE_AUDIT.md` for the full audit and remaining follow-ups.

## [Unreleased] — foundation (branch `claude/quirky-keller-2S10c`, PR #1)

### Platform
- Next.js 15 App Router, React 19 Server Components, TypeScript strict,
  Tailwind v4 cinematic design system; self-hosted brand fonts.
- Provider-agnostic adapter registry with priority + fallback; zod-validated
  env/config boundary; typed feature flags; deterministic A/B assignment.
- Observability: structured logging, counter metrics, `/api/health`,
  `/api/metrics`; secure-by-default `/api/admin/status`.
- Baseline security headers, `robots.txt` (`/api/` disallowed), `security.txt`.
  Two-tier CSP: structural directives (`base-uri`, `object-src`,
  `frame-ancestors`, `form-action`) enforced; script/style/content directives
  Report-Only pending a browser hydration check (`/api/csp-report` +
  `csp_violation` metric).

### Product
- Cinematic landing with mood filter + search; destination detail pages with a
  live (solar) light-phase signal and an explainable atmosphere score.
- `/discover` (Pathfinder vibe + avoid ranking, live light badge per result),
  `/plan` (fatigue-aware itinerary with a per-day load meter vs. the pacing
  budget), `/saved` (collections with inline remove + count),
  `/about` (honest systems status).
- Dynamic OG images per destination + brand; PWA manifest; shared nav; a11y
  skip link + focus styles.

### Monetization
- Data-driven affiliate vertical: catalog loader, pure routing resolver with
  per-visitor A/B, safe URL rendering, gated CTA, click/conversion ingestion,
  paginated time-windowed analytics. No hardcoded links.

### Intelligence
- Shared explainable scoring core (versioned weights, contribution breakdown,
  confidence). Engines: destination, events, disruption, safety, visa, culture,
  conditions, city-energy, memory, Travel Confidence aggregate (v2 — spans
  destination/events/disruption/safety/conditions), environmental comfort,
  Travel DNA, Pathfinder, dynamic itinerary.

### Governance
- ADRs 001–006; architecture docs with diagrams; dependency map; incident +
  recovery + Supabase runbooks; postmortem template; AI agent audit trail;
  CONTRIBUTING / SECURITY / CODEOWNERS / Dependabot; CI (typecheck/lint/test/
  build + audit, concurrency, Node pinning).

### Tested
- 112 unit tests (node:test) over the pure logic; key routes runtime-verified;
  e2e smoke (`scripts/smoke.mjs`) asserts route status + security headers in CI.

### Roadmap / externally blocked
- Hosted Supabase (secrets), live weather feed (egress allowlist), AI planning
  (LLM provider), branch protection (repo-admin). See
  `docs/governance/continuation-handoff.md`.
