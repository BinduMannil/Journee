# Trust Services Criteria → Control Matrix

_Last updated: 2026-06-10._

This is the heart of the readiness program. It maps each **Trust Services
Criterion** to the **control** that satisfies it, the **evidence** (the exact
file or setting that proves it), and an **honest status**.

## How to read this

- **Criterion** — the SOC 2 requirement, in the auditor's numbering. The
  "Common Criteria" (CC1–CC9) cover **Security** and apply to every SOC 2
  report. They are then followed by the additional-category criteria
  (Availability `A`, Processing Integrity `PI`, Confidentiality `C`,
  Privacy `P`).
- **What it means** — the same requirement in plain language.
- **Control** — what Journee does about it.
- **Evidence** — where to look to verify the control is real.
- **Status** — one of:
  - ✅ **In place** — implemented and verifiable today.
  - ◻️ **Partial** — partly implemented; remainder tracked in the gap analysis.
  - 🔜 **Planned** — not implemented; a configuration step or roadmap item.

> Status reflects the _code in this repository_. Controls that depend on GitHub
> org settings or a hosting account (branch protection, MFA, native secret
> scanning) are marked **Planned** even when trivial to enable, because they are
> not provable from the code alone. The exact toggle is named so an owner can
> close the gap in minutes — see
> [`gap-analysis-and-roadmap.md`](gap-analysis-and-roadmap.md).

---

## CC1 — Control Environment (governance, people, accountability)

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC1.1 | The org demonstrates a commitment to integrity and ethical values. | "No fiction" documentation rule; honest status labels throughout. | [`docs/README.md`](../README.md), root [`README.md`](../../README.md) status table | ✅ |
| CC1.2 | Those in charge oversee the system. | Named owner with final accountability; CODEOWNERS auto-requests owner review. | [`.github/CODEOWNERS`](../../.github/CODEOWNERS), [`soc2-readiness-overview.md`](soc2-readiness-overview.md) roles table | ✅ |
| CC1.3 | Roles, responsibilities, and reporting lines are defined. | Roles table (Owner/Engineer/Reviewer/Agent) with responsibilities. | [`soc2-readiness-overview.md`](soc2-readiness-overview.md), [`policies/information-security-policy.md`](policies/information-security-policy.md) | ✅ |
| CC1.4 | The org attracts/develops/retains competent people. | Contribution standards; strict typing + tests raise the competence floor. | [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md), [`policies/secure-sdlc-policy.md`](policies/secure-sdlc-policy.md) | ◻️ |
| CC1.5 | Individuals are held accountable for their responsibilities. | Every change is attributable (git history, PR author, agent audit trail). | [`../governance/ai-agent-audit-trail.md`](../governance/ai-agent-audit-trail.md), git log | ✅ |

## CC2 — Communication & Information

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC2.1 | Quality information is used to support controls. | Structured JSON logs + counter metrics + health endpoint. | [`src/lib/observability/logger.ts`](../../src/lib/observability/logger.ts), [`src/lib/observability/metrics.ts`](../../src/lib/observability/metrics.ts), `/api/health` | ✅ |
| CC2.2 | Internal control information is communicated internally. | Architecture/decision/governance docs; docs updated in the same PR as code. | [`docs/`](../) tree, documentation principles in [`docs/README.md`](../README.md) | ✅ |
| CC2.3 | The org communicates with external parties. | Public vulnerability-reporting path and `security.txt`. | [`../../SECURITY.md`](../../SECURITY.md), [`../../public/.well-known/security.txt`](../../public/.well-known/security.txt) | ✅ |

## CC3 — Risk Assessment

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC3.1 | Objectives are specified clearly enough to assess risk. | Stated product scope + explicit "what exists vs roadmap." | root [`README.md`](../../README.md), [`soc2-readiness-overview.md`](soc2-readiness-overview.md) | ✅ |
| CC3.2 | Risks to objectives are identified and analyzed. | Risk register with likelihood/impact + dependency failure analysis. | [`policies/risk-management-and-register.md`](policies/risk-management-and-register.md), [`../architecture/service-dependency-map.md`](../architecture/service-dependency-map.md) | ✅ |
| CC3.3 | Potential for fraud is considered. | Server-only ingestion writes; admin endpoints secure-by-default; no client-trusted money paths. | [`src/app/api/affiliate/`](../../src/app/api/affiliate), [`src/app/api/admin/status/route.ts`](../../src/app/api/admin/status/route.ts) | ◻️ |
| CC3.4 | Significant changes are assessed for risk. | Change-management policy requires risk note for architectural changes. | [`policies/change-management-policy.md`](policies/change-management-policy.md), [`.github/pull_request_template.md`](../../.github/pull_request_template.md) | ◻️ |

## CC4 — Monitoring Activities

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC4.1 | The org evaluates whether controls are working. | CI runs typecheck/lint/test/build/smoke/audit on every PR; CodeQL + secret scan on push/schedule. | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), [`codeql.yml`](../../.github/workflows/codeql.yml), [`secret-scan.yml`](../../.github/workflows/secret-scan.yml) | ✅ |
| CC4.2 | Control deficiencies are communicated and corrected. | Findings surface as failed checks / Security-tab alerts; fixed via PR. | GitHub Checks & Security tab, [`policies/logging-monitoring-and-alerting-policy.md`](policies/logging-monitoring-and-alerting-policy.md) | ◻️ |

## CC5 — Control Activities

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC5.1 | Controls are selected/developed to mitigate risk. | This matrix + policy set + automated gates. | This document | ✅ |
| CC5.2 | Controls over technology are selected/developed. | Config boundary, provider adapters, RLS, headers, CSP. | [`src/lib/config/`](../../src/lib/config), [`src/middleware.ts`](../../src/middleware.ts), `supabase/migrations/**` | ✅ |
| CC5.3 | Controls are deployed through policies and procedures. | Policies in this folder; procedures in runbooks. | [`policies/`](policies), [`../runbooks/`](../runbooks) | ✅ |

## CC6 — Logical & Physical Access Controls

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC6.1 | Logical access is restricted by identity/credentials; secrets are protected. | Admin endpoints token-gated & secure-by-default (503 when unset, 401 on mismatch). Supabase anon vs service-role split. Secrets never in git. Least-privilege CI token. Secret scanning. | [`src/app/api/admin/status/route.ts`](../../src/app/api/admin/status/route.ts), [`src/lib/config/env.ts`](../../src/lib/config/env.ts) (`getAdminToken`, `getSupabaseServiceConfig`), [`.gitignore`](../../.gitignore), [`secret-scan.yml`](../../.github/workflows/secret-scan.yml), CI `permissions: contents: read` | ✅ |
| CC6.2 | Access is granted/registered for authorized users only. | GitHub org membership + CODEOWNERS; MFA recommended. | [`.github/CODEOWNERS`](../../.github/CODEOWNERS), [`policies/access-control-policy.md`](policies/access-control-policy.md) | ◻️ |
| CC6.3 | Access is modified/removed when no longer appropriate. | Access-review procedure (quarterly) defined; offboarding checklist. | [`policies/access-control-policy.md`](policies/access-control-policy.md) | 🔜 |
| CC6.6 | The system protects against external threats. | Security headers (nosniff, DENY frame, HSTS, Permissions-Policy) + two-tier CSP. | [`next.config.mjs`](../../next.config.mjs), [`src/middleware.ts`](../../src/middleware.ts), [`../security/security-overview.md`](../security/security-overview.md) | ✅ |
| CC6.7 | Data in transit/at rest is protected. | HSTS forces HTTPS; Supabase encrypts at rest; data-classification policy. | [`next.config.mjs`](../../next.config.mjs) (HSTS), [`policies/data-classification-and-handling-policy.md`](policies/data-classification-and-handling-policy.md) | ◻️ |
| CC6.8 | Unauthorized/malicious software is prevented/detected. | Pinned lockfile; `npm audit`; Dependabot; CodeQL; CSP `object-src 'none'`. | [`package-lock.json`](../../package-lock.json), [`.github/dependabot.yml`](../../.github/dependabot.yml), CI audit step | ✅ |

## CC7 — System Operations

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC7.1 | Vulnerabilities are detected. | CodeQL SAST + `npm audit` + Dependabot + gitleaks; CSP violation reporting. | [`codeql.yml`](../../.github/workflows/codeql.yml), [`src/app/api/csp-report/route.ts`](../../src/app/api/csp-report/route.ts) | ✅ |
| CC7.2 | The system is monitored for anomalies. | Counter metrics (`provider_failover`, `csp_violation`, …) + structured logs + health. | [`src/lib/observability/metrics.ts`](../../src/lib/observability/metrics.ts), `/api/metrics`, `/api/health` | ◻️ |
| CC7.3 | Security incidents are evaluated. | Incident-response runbook with severity guide + signatures. | [`../runbooks/incident-response.md`](../runbooks/incident-response.md), [`policies/incident-response-policy.md`](policies/incident-response-policy.md) | ✅ |
| CC7.4 | Incidents are responded to (contain/remediate). | Recovery runbook: rollback via `git revert`, provider failover, flag disable. | [`../runbooks/recovery.md`](../runbooks/recovery.md) | ✅ |
| CC7.5 | Recovery from incidents. | Forward-fix rollback; automatic provider fallback to always-available seed. | [`../runbooks/recovery.md`](../runbooks/recovery.md), [`src/lib/providers/registry.ts`](../../src/lib/providers/registry.ts) | ✅ |

## CC8 — Change Management

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC8.1 | Changes are authorized, designed, tested, and approved before deployment. | PR-only flow; CODEOWNERS review; CI gate (typecheck/lint/test/build/smoke); ADRs for significant choices; docs updated in same PR. | [`../governance/branch-and-pr-governance.md`](../governance/branch-and-pr-governance.md), [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), [`../decisions/`](../decisions), [`policies/change-management-policy.md`](policies/change-management-policy.md) | ◻️ (branch protection = settings to enable) |

## CC9 — Risk Mitigation

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| CC9.1 | The org mitigates risk from business disruptions. | Provider failover + flag kill-switches + rollback runbook. | [`../runbooks/recovery.md`](../runbooks/recovery.md), [`src/lib/config/flags.ts`](../../src/lib/config/flags.ts) | ✅ |
| CC9.2 | The org manages vendor/business-partner risk. | Vendor-management policy + dependency register with security column. | [`policies/vendor-management-policy.md`](policies/vendor-management-policy.md), [`../architecture/service-dependency-map.md`](../architecture/service-dependency-map.md) | ◻️ |

---

## Availability (A series)

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| A1.1 | Capacity is managed to meet objectives. | Stateless app; CI concurrency control; capacity planning = roadmap with hosting. | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | 🔜 |
| A1.2 | Recovery infrastructure (backups) is in place. | Supabase managed point-in-time backups (when hosted); local `db reset` rebuilds from migrations + seed. | [`../runbooks/recovery.md`](../runbooks/recovery.md) (Database recovery) | ◻️ |
| A1.3 | Recovery procedures are tested. | Restore-drill + RPO/RTO targets to be documented once a hosted project exists. | [`../runbooks/recovery.md`](../runbooks/recovery.md), [`policies/business-continuity-and-disaster-recovery-policy.md`](policies/business-continuity-and-disaster-recovery-policy.md) | 🔜 |

## Processing Integrity (PI series)

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| PI1.1–PI1.3 | Inputs/processing/outputs are complete, accurate, valid, and timely. | Zod schema validation at the env + provider + travel-data contract boundaries; strict TypeScript; deterministic, explainable scoring with unit tests; ingestion endpoints validate and return 400 on bad input. | [`src/lib/config/env.ts`](../../src/lib/config/env.ts), [`src/lib/providers/travel-data/contracts.ts`](../../src/lib/providers/travel-data/contracts.ts), [`src/lib/intelligence/scoring.ts`](../../src/lib/intelligence/scoring.ts), `test/**` (100+ unit tests) | ✅ |
| PI1.4–PI1.5 | Output is delivered to the right place; processing is traceable. | Explainable scoring records its reasoning; structured logs trace provider resolution/failover. | [`docs/decisions/ADR-006-explainable-intelligence-scoring.md`](../decisions/ADR-006-explainable-intelligence-scoring.md), [`src/lib/observability/logger.ts`](../../src/lib/observability/logger.ts) | ✅ |

## Confidentiality (C series)

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| C1.1 | Confidential information is identified and protected. | Data-classification policy; service-role key server-only; event tables not publicly readable (no SELECT policy). | [`policies/data-classification-and-handling-policy.md`](policies/data-classification-and-handling-policy.md), [`supabase/migrations/0002_affiliate.sql`](../../supabase/migrations/0002_affiliate.sql) | ◻️ |
| C1.2 | Confidential information is disposed of when no longer needed. | Retention/disposal rules defined; enforcement = roadmap with hosted data. | [`policies/data-classification-and-handling-policy.md`](policies/data-classification-and-handling-policy.md) | 🔜 |

## Privacy (P series)

| Criterion | What it means | Control | Evidence | Status |
| --- | --- | --- | --- | --- |
| P1–P8 (notice, choice, collection, use, retention, access, disclosure, quality, monitoring) | Personal data is handled per a stated privacy notice and minimized. | Plain-language privacy page reflecting actual behavior; data minimization (one anonymous, non-identifying `jid` cookie; saves are device-local and never sent to a server). | [`src/app/privacy/page.tsx`](../../src/app/privacy/page.tsx), [`policies/data-classification-and-handling-policy.md`](policies/data-classification-and-handling-policy.md) | ◻️ |

---

## Status summary

| Status | Count (approx.) | Meaning |
| --- | --- | --- |
| ✅ In place | ~24 | Implemented and verifiable from this repo today. |
| ◻️ Partial | ~13 | Partly done; remainder tracked in the gap analysis. |
| 🔜 Planned | ~6 | Settings to enable or roadmap tied to hosting/data. |

The remediation order for every ◻️ and 🔜 item is in
[`gap-analysis-and-roadmap.md`](gap-analysis-and-roadmap.md).
