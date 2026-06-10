# Incident Response Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually + after any SEV1/SEV2 incident._

What we do when something goes wrong — a security incident, an outage, or a data
concern. Implements CC7.3–7.5 and CC2.3. The **operational steps** are in
[`../../runbooks/incident-response.md`](../../runbooks/incident-response.md); this
policy sets the framework around them.

## 1. Principle

Respond calmly and in a defined order: **detect → triage → contain → recover →
learn.** Mitigate impact first, investigate second, and always write down what
happened.

## 2. What counts as an incident

Any event that harms (or threatens) the confidentiality, integrity, or
availability of the system or its data. Examples: site down or `main` build
broken; a leaked secret; an unauthorized-access attempt; a vulnerability being
exploited; a vendor breach affecting us; a privacy concern.

## 3. Severity levels

| Sev | Example | First move |
| --- | --- | --- |
| **SEV1** | Site down / `main` build broken / active security breach | Roll back to last green deploy; contain. |
| **SEV2** | A capability degraded (e.g. DB unavailable) | Confirm fallback engaged; assess scope. |
| **SEV3** | Single non-critical feature off | Open an issue; fix in normal flow. |

(Mirrors the runbook's quick guide.)

## 4. The response lifecycle

1. **Detect.** From CI/Security-tab alerts, `/api/health`, `/api/metrics`,
   structured logs, or a report to the [security contact](../../../SECURITY.md).
2. **Triage.** Assign a severity. Confirm impact (`GET /api/health`; check
   `provider_failover` / error rates).
3. **Contain.** Stop the bleeding: roll back the bad change (`git revert`),
   disable the affected feature flag, or rotate a leaked secret **immediately**.
4. **Recover.** Follow [`../../runbooks/recovery.md`](../../runbooks/recovery.md)
   to restore normal service; verify via health + metrics.
5. **Learn.** Write a **blameless postmortem** in
   [`../../postmortems/`](../../postmortems) (use the
   [TEMPLATE](../../postmortems/TEMPLATE.md)): timeline, root cause, what reduces
   recurrence. Append any autonomous-agent actions to the
   [AI Agent Audit Trail](../../governance/ai-agent-audit-trail.md).

## 5. Special case: a leaked secret

If gitleaks/secret-scanning or anyone finds a committed credential:

1. **Rotate the secret now** (it is compromised the moment it's in history).
2. Remove it from the codebase/config; confirm scans pass.
3. Review access logs (when available) for misuse.
4. Postmortem: how it got in, and which control to strengthen (push protection,
   pre-commit scan).

A secret in git is **not** fixed by deleting the commit — history persists.
Rotation is mandatory.

## 6. Special case: a privacy/data concern

Because the app minimizes data (anonymous `jid` cookie; device-local saves),
exposure of server-side personal data is unlikely today. If user data is
introduced later and a concern arises, assess scope against the
[Data Classification Policy](data-classification-and-handling-policy.md) and
follow any applicable breach-notification obligations (to be defined with the
hosting/data platform).

## 7. Communication (CC2.3)

- **External reports** come in privately via [`SECURITY.md`](../../../SECURITY.md)
  and `/.well-known/security.txt`. Acknowledge, triage, and fix; coordinate
  disclosure responsibly.
- **Record a timeline** for every SEV1/SEV2 (detection → actions → resolution).
- A formal coordinated-disclosure process and (if needed) customer/regulator
  notification steps are finalized before public launch.

## 8. Roadmap (honest)

Alerting thresholds, an on-call rotation, and an external status page depend on a
monitoring/alerting backend that does not exist yet (gap **P1-11**). Until then,
detection is via on-demand signals and reports — the runbook states this plainly.

## 9. Evidence

The runbook, any postmortems, and the audit trail are the evidence for CC7.3–7.5;
see the [Evidence Collection Guide](../evidence-collection-guide.md).
