# Evidence Collection Guide

_Last updated: 2026-06-10._

When an auditor (or a customer's security team) says **"prove it,"** this guide
tells you exactly what to show and where to get it. It is written so that
someone who has never been through an audit can produce the right artifact.

## What "evidence" means

Evidence is a concrete artifact that demonstrates a control **operated** — not a
description of it. For SOC 2 Type I the auditor wants evidence the control is
_designed_ correctly (a screenshot of the setting, a config file). For Type II
they want evidence it _ran over time_ (e.g. CI logs for every PR in the period).

Two kinds you will produce:

- **Configuration evidence** — "the control exists": a file in this repo, a
  GitHub setting, a screenshot.
- **Operational evidence** — "the control ran": CI run history, PR history,
  Dependabot/Security-tab alerts, logs.

---

## Evidence by control

| Control (criterion) | What to show | Exactly where to get it |
| --- | --- | --- |
| **Change management** (CC8.1) | A sample of merged PRs showing review + green CI before merge. | GitHub → Pull Requests → filter `is:merged`; open a few and show the "Checks passed" + approval. |
| **CI quality gate ran** (CC4.1) | The CI run for a given commit. | GitHub → Actions → "CI" workflow → pick runs across the audit period. |
| **SAST ran** (CC7.1) | CodeQL analysis history + any alerts and their resolution. | GitHub → Actions → "CodeQL"; GitHub → Security → Code scanning alerts. |
| **Dependency scanning** (CC6.8) | `npm audit` step output + Dependabot PRs. | GitHub → Actions → CI → "Dependency audit" step; GitHub → Pull Requests authored by `dependabot`. |
| **Secret scanning** (CC6.1) | gitleaks runs (passing = no secrets) + native secret-scanning status once enabled. | GitHub → Actions → "Secret Scan"; GitHub → Security → Secret scanning. |
| **Least-privilege CI token** (CC6.1) | The `permissions: contents: read` block. | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). |
| **Access control / ownership** (CC1.2, CC6.2) | CODEOWNERS + the org members list + their roles. | [`.github/CODEOWNERS`](../../.github/CODEOWNERS); GitHub → Settings → Collaborators/Teams. |
| **MFA enforced** (CC6.1) | Org security setting screenshot. | GitHub → Org → Settings → Authentication security → "Require two-factor". |
| **Branch protection** (CC8.1) | The protection rule on `main`. | GitHub → Settings → Branches → branch protection rules. |
| **Security headers / CSP** (CC6.6) | The header config + a live `curl -I` of a deployed response. | [`next.config.mjs`](../../next.config.mjs), [`src/middleware.ts`](../../src/middleware.ts); `curl -I https://<site>`. |
| **RLS deny-by-default** (CC6.1, C1.1) | The migration files + (when hosted) the policy list from Supabase. | `supabase/migrations/0001_*.sql`, `0002_*.sql`; Supabase dashboard → Auth → Policies. |
| **Input validation / processing integrity** (PI1.x) | The Zod schemas + the passing test suite. | `src/lib/config/env.ts`, `src/lib/providers/travel-data/contracts.ts`; `npm test` output. |
| **Logging & monitoring** (CC2.1, CC7.2) | Sample structured log lines + metrics snapshot. | App stdout/stderr; `GET /api/metrics`, `GET /api/health`. |
| **Incident response** (CC7.3–7.5) | The runbook + any postmortems written for real incidents. | [`../runbooks/incident-response.md`](../runbooks/incident-response.md), [`../postmortems/`](../postmortems). |
| **Recovery / BCDR** (CC9.1, A1.x) | The recovery runbook + (when hosted) a tested restore-drill record. | [`../runbooks/recovery.md`](../runbooks/recovery.md). |
| **Risk assessment** (CC3.x) | The risk register with dates/owners. | [`policies/risk-management-and-register.md`](policies/risk-management-and-register.md). |
| **Vendor management** (CC9.2) | The vendor list + each vendor's SOC 2/security posture. | [`policies/vendor-management-policy.md`](policies/vendor-management-policy.md), [`../architecture/service-dependency-map.md`](../architecture/service-dependency-map.md). |
| **Autonomous-agent changes** (CC1.5) | The agent audit-trail entries tied to PRs. | [`../governance/ai-agent-audit-trail.md`](../governance/ai-agent-audit-trail.md). |

---

## A repeatable monthly evidence routine

Doing a little each month makes a Type II audit painless. Suggested checklist
(assign an owner; record the date you ran it):

- [ ] Export the month's merged PRs and confirm each had review + green CI.
- [ ] Review the Security tab: triage any CodeQL / Dependabot / secret alerts;
      record resolution or accepted-risk decision.
- [ ] Confirm CI, CodeQL, and Secret-Scan workflows ran (no long outages).
- [ ] Review access: does the collaborator list still match who needs access?
      Remove anyone who left. (CC6.3)
- [ ] Update the [risk register](policies/risk-management-and-register.md) if
      anything material changed.
- [ ] Write postmortems for any incidents and link them from the runbook.

A row in a simple log ("2026-06-10, ran monthly evidence routine, no
exceptions") is itself evidence of monitoring (CC4.1).

---

## Tips for first-timers

- **Screenshots are fine** for GitHub/cloud settings; include the URL bar and a
  timestamp.
- **Don't paste real secrets** into evidence. Redact tokens; show the _setting_,
  not the value.
- **Point to the file, then the run.** Configuration evidence proves design;
  operational evidence (the workflow run, the PR) proves it operated.
- **When a control is Partial/Planned, say so** and show the gap-analysis entry.
  Auditors trust honesty far more than a wall of green checkmarks.
