# Logging, Monitoring & Alerting Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually._

What Journee records, what it watches, and how it will alert. Implements CC2.1,
CC4.1–4.2, CC7.1–7.2.

## 1. Principle

You cannot operate or secure what you cannot see. The app emits machine-readable
signals; controls are continuously evaluated; problems become visible.

## 2. What we log

- **Structured JSON logs** — one object per line via
  [`src/lib/observability/logger.ts`](../../../src/lib/observability/logger.ts).
  Levels `debug/info/warn/error`; warn/error → stderr, rest → stdout (standard
  stream hygiene so any log pipeline can ingest them). `formatLog` is pure and
  unit-tested.
- **Counter metrics** — [`src/lib/observability/metrics.ts`](../../../src/lib/observability/metrics.ts),
  e.g. `provider_failover`, `provider_capability_exhausted`, `csp_violation`,
  surfaced at `GET /api/metrics`.
- **Health** — `GET /api/health` reports liveness, whether Supabase is
  configured, and which flags are on.
- **CSP violations** — reported to `/api/csp-report` and counted as
  `csp_violation`.

### Logging hygiene (privacy & confidentiality)

**Never log secrets, credentials, full request bodies, or personal data.** Log
stable identifiers and outcomes (`providerId`, `capability`, status code), not
contents. This keeps logs from becoming a personal-data store (see
[Data Handling](data-classification-and-handling-policy.md)).

## 3. What we monitor

| Signal | Where | Healthy looks like | Concern |
| --- | --- | --- | --- |
| Build/CI status | GitHub Actions | All green on `main` | Red on `main` (SEV1 candidate) |
| Code-scanning alerts | Security tab (CodeQL) | Zero open high/critical | New high/critical alert |
| Dependency alerts | Security tab / Dependabot | Triaged promptly | Unaddressed high/critical |
| Secret-scan | Actions (gitleaks) + Security | Passing / zero findings | Any finding → rotate immediately |
| `provider_failover` rate | `/api/metrics` | Low/zero | Sustained rise → dependency trouble |
| `csp_violation` | `/api/metrics` | Low; expected during rollout | Spike → investigate injected content |
| Liveness/config | `/api/health` | `ok`, expected flags | Unexpected config drift |

## 4. Alerting (current state — honest)

**Today:** signals are emitted and observable on demand (`/api/health`,
`/api/metrics`, Security tab, Actions). There is **no automated alerting backend
or on-call rotation** — this is gap **P1-11**, and the
[incident-response runbook](../../runbooks/incident-response.md) says so plainly
rather than implying alerts exist.

**Planned:** forward logs/metrics to a monitoring backend; define alert
thresholds (e.g. failover rate, error rate, `main` build red); establish an
on-call path and an external status page.

## 5. Control self-evaluation (CC4.1)

The controls are continuously evaluated by the automated gates: CI on every PR,
CodeQL + secret-scan on push and weekly schedules. Failures surface as failed
checks / Security-tab alerts and are corrected via PR (CC4.2). The recommended
[monthly evidence routine](../evidence-collection-guide.md) records that this
review happens.

## 6. Log retention (roadmap)

Retention depends on the hosting/log backend, which does not exist yet. When it
does, define a retention window sufficient for a Type II observation period and
protect logs from tampering (append-only / restricted access) — this also
supports the tamper-evident audit log in gap **P1-12**.

## 7. Evidence

Sample log lines, a `/api/metrics` snapshot, CI/CodeQL/secret-scan run history,
and the Security tab are the evidence; see the
[Evidence Collection Guide](../evidence-collection-guide.md).
