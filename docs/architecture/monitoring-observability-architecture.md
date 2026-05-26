# Monitoring & Observability Architecture

_Last updated: 2026-05-26._

## Status

- **Structured logging seam:** ✅ implemented (`src/lib/observability/logger.ts`).
- **Failover instrumentation:** ✅ provider registry logs `provider_failover` and
  `provider_capability_exhausted`.
- **Health endpoint:** ✅ `GET /api/health`.
- **Metrics, tracing, alerting, dashboards:** 🔜 roadmap (no claims made yet).

## Structured logging

`logger.ts` emits one JSON object per line (`{ level, msg, time, fields }`) so
any log pipeline can parse it without custom formats. `formatLog` is pure and
unit-tested; emission routes warn/error to stderr and the rest to stdout.

Convention: `msg` is a stable, low-cardinality event name (e.g.
`provider_failover`); variable data goes in `fields`.

## What is instrumented today

| Event | Where | Fields |
| --- | --- | --- |
| `provider_failover` | registry, on a provider throwing | capability, providerId, error |
| `provider_capability_exhausted` | registry, when all providers fail | capability |

This makes the failover safety property **observable**, not just functional.

## Health endpoint

`GET /api/health` returns `{ status, time, config }` where `config` reports only
**booleans** about configuration presence (Supabase configured? which flags on?)
— never secret values. Suitable for uptime checks and readiness gating.

## Roadmap

- Metrics (counters/histograms) for provider latency, failover rate, score
  confidence distribution.
- Request tracing across RSC → provider → external call.
- Alerting thresholds (e.g. sustained failover rate) once metrics exist.
- Per-engine instrumentation as each intelligence engine gets real data feeds.

Each of these is added when the backing system exists — this doc will not
describe dashboards or alerts that aren't wired.
