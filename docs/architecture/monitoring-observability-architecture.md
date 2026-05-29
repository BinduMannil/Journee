# Monitoring & Observability Architecture

_Last updated: 2026-05-27._

## Status

- **Structured logging seam:** ✅ implemented (`src/lib/observability/logger.ts`).
- **Failover instrumentation:** ✅ provider registry logs + counts
  `provider_resolve_success`, `provider_failover`, `provider_capability_exhausted`.
- **Travel-data registry instrumentation:** ✅ parameterized travel-data
  resolution logs + counts per outcome, labeled `{kind, providerId}` — see table.
- **Counter metrics scaffold:** ✅ `src/lib/observability/metrics.ts` +
  `GET /api/metrics` snapshot.
- **Tracing, alerting, dashboards, metrics export backend:** 🔜 roadmap.

## Structured logging

`logger.ts` emits one JSON object per line (`{ level, msg, time, fields }`) so
any log pipeline can parse it without custom formats. `formatLog` is pure and
unit-tested; emission routes warn/error to stderr and the rest to stdout.

Convention: `msg` is a stable, low-cardinality event name (e.g.
`provider_failover`); variable data goes in `fields`.

## What is instrumented today

| Event | Where | Fields / labels |
| --- | --- | --- |
| `provider_resolve_success` | registry, on a provider answering | capability, providerId |
| `provider_failover` | registry, on a provider throwing | capability, providerId, error |
| `provider_capability_exhausted` | registry, when all providers fail | capability |
| `travel_data_resolve_success` | travel-data registry, on a provider returning `ok` | kind, providerId |
| `travel_data_resolve_unavailable` | travel-data registry, on a provider returning `unavailable` | kind, providerId |
| `travel_data_resolve_error` | travel-data registry, on a provider returning `error` | kind, providerId |
| `travel_data_provider_unavailable` | travel-data registry, when `isAvailable()` is false | kind, providerId |
| `travel_data_provider_throw` | travel-data registry, when a provider throws (caught) | kind, providerId, error |
| `travel_data_kind_exhausted` | travel-data registry, when no registered provider returned `ok` | kind |
| `travel_data_kind_no_provider` | travel-data registry, when no provider is registered for a kind | kind |

These are emitted both as structured logs and as counters
(`src/lib/observability/metrics.ts`, snapshot at `GET /api/metrics`), making the
failover safety property **observable**, not just functional.

## Health endpoint

`GET /api/health` returns `{ status, time, config }` where `config` reports only
**booleans** about configuration presence (Supabase configured? `aiPlanningReady`
— the LLM key + `ai-planning` flag AND-gate? which flags on?) — never secret
values. Suitable for uptime checks and readiness gating.

## Roadmap

- Metrics (counters/histograms) for provider latency, failover rate, score
  confidence distribution.
- Request tracing across RSC → provider → external call.
- Alerting thresholds (e.g. sustained failover rate) once metrics exist.
- Per-engine instrumentation as each intelligence engine gets real data feeds.

Each of these is added when the backing system exists — this doc will not
describe dashboards or alerts that aren't wired.
