# Runbook: Incident Response

_Scope: the system as it exists today. Sections for unbuilt infrastructure are
marked. Honest over aspirational._

## Severity quick guide

| Sev | Example | First move |
| --- | --- | --- |
| SEV1 | Site down / build broken on `main` | Roll back to last green deploy. |
| SEV2 | A capability degraded (e.g. DB unavailable) | Confirm fallback engaged; assess scope. |
| SEV3 | Single non-critical feature off | Open issue; fix in normal flow. |

## First 10 minutes

1. **Confirm impact.** Hit `GET /api/health` — `status`, `config.supabaseConfigured`,
   and which flags are on. Hit `GET /api/metrics` — look for rising
   `provider_failover` / `provider_capability_exhausted`.
2. **Check the deploy.** Did a recent merge/deploy correlate? If so, roll back
   first, investigate second (see `recovery.md`).
3. **Localize.** Logs are structured JSON; filter by `msg` (e.g.
   `provider_failover`) and `fields.capability` / `fields.providerId`.

## Common signatures

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `provider_capability_exhausted{capability=destinations}` | Seed import broke (should never exhaust — seed is always-available) | Treat as code bug; roll back. |
| Many `provider_failover{providerId=supabase-*}` | Supabase down/misconfigured | Fallback to seed is automatic; verify content acceptable; fix config. |
| `/api/affiliate/* -> 503` | Ingestion unconfigured (no service role) | Expected when unconfigured; configure or accept no ingestion. |

## Communication

Record a timeline (detection → actions → resolution). After resolution, write a
postmortem in `docs/postmortems/` (blameless: what happened, why, what reduces
recurrence). Append autonomous-agent actions to the AI audit trail.

## Roadmap (not yet wired)

Alerting thresholds, on-call rotation, and external status page depend on a
metrics/alerting backend that does not exist yet.
