# Changelog

All notable changes to Journee. Dates are UTC. This is a pre-1.0 foundation;
entries describe what genuinely shipped (roadmap items are labeled as such).

## [Unreleased] — foundation (branch `claude/quirky-keller-2S10c`, PR #1)

### Platform
- Next.js 15 App Router, React 19 Server Components, TypeScript strict,
  Tailwind v4 cinematic design system; self-hosted brand fonts.
- Provider-agnostic adapter registry with priority + fallback; zod-validated
  env/config boundary; typed feature flags; deterministic A/B assignment.
- Observability: structured logging, counter metrics, `/api/health`,
  `/api/metrics`; secure-by-default `/api/admin/status`.
- Baseline security headers, `robots.txt` (`/api/` disallowed), `security.txt`.

### Product
- Cinematic landing with mood filter + search; destination detail pages with a
  live (solar) light-phase signal and an explainable atmosphere score.
- `/discover` (Pathfinder vibe ranking), `/plan` (fatigue-aware itinerary),
  `/saved` (collections), `/about` (honest systems status).
- Dynamic OG images per destination + brand; PWA manifest; shared nav; a11y
  skip link + focus styles.

### Monetization
- Data-driven affiliate vertical: catalog loader, pure routing resolver with
  per-visitor A/B, safe URL rendering, gated CTA, click/conversion ingestion,
  paginated time-windowed analytics. No hardcoded links.

### Intelligence
- Shared explainable scoring core (versioned weights, contribution breakdown,
  confidence). Engines: destination, events, disruption, safety, visa, culture,
  conditions, city-energy, memory, Travel Confidence aggregate, environmental
  comfort, Travel DNA, Pathfinder, dynamic itinerary.

### Governance
- ADRs 001–006; architecture docs with diagrams; dependency map; incident +
  recovery + Supabase runbooks; postmortem template; AI agent audit trail;
  CONTRIBUTING / SECURITY / CODEOWNERS / Dependabot; CI (typecheck/lint/test/
  build + audit, concurrency, Node pinning).

### Tested
- 101 unit tests (node:test) over the pure logic; key routes runtime-verified.

### Roadmap / externally blocked
- Hosted Supabase (secrets), live weather feed (egress allowlist), AI planning
  (LLM provider), branch protection (repo-admin). See
  `docs/governance/continuation-handoff.md`.
