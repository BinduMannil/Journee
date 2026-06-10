# SOC 2 Readiness Overview

_Last updated: 2026-06-10._

This document gives the big picture: what we are scoping in, what "ready" means,
who is responsible, and the overall status. New here? Read
[`README.md`](README.md) first.

## Scope: which Trust Services Criteria apply to Journee

SOC 2 always includes **Security**. The other four criteria are included only
when they are relevant to the service being audited. Journee's current scope:

| Criterion | In scope? | Why |
| --- | --- | --- |
| **Security** | ✅ Yes (mandatory) | The codebase, build pipeline, and (future) hosting must be protected from unauthorized access. |
| **Availability** | ✅ Yes | The app makes uptime/fallback commitments (provider failover to seed, health endpoints). |
| **Processing Integrity** | ✅ Yes | The intelligence/affiliate engines must process data completely and accurately; we make explainability claims. |
| **Confidentiality** | ◻️ Partial | Today the app holds almost no confidential data (no accounts). The control set is documented now so it is ready when hosted data arrives. |
| **Privacy** | ◻️ Partial | The app collects minimal personal data (one anonymous cookie). A formal Privacy criterion engagement is premature but the handling is documented. |

> **Why "Partial" is the honest answer for Confidentiality and Privacy.** Journee
> is at the foundation stage. There are no user accounts, no stored personal
> profiles, and no hosted production database yet (see the root
> [`README.md`](../../README.md) status table). We document the controls for
> these criteria now so that turning on hosted data is a _configuration + review_
> step against an existing policy — not a scramble.

## The system boundary (what the audit would cover)

An auditor needs a precise definition of "the system." For Journee today:

```
IN SCOPE (the system under control):
  • The Journee Next.js application (src/**)
  • The build & CI pipeline (.github/workflows/**)
  • The configuration boundary (src/lib/config/**) and provider adapters
  • The Supabase schema & RLS migrations (supabase/migrations/**)
  • The GitHub repository, its branch protection, and access roles
  • The (future) hosting platform and hosted Supabase project

SUPPORTING / SUB-SERVICE ORGANIZATIONS (third parties we rely on):
  • GitHub        — source control, CI, secret/secret-scanning
  • Supabase      — Postgres data platform (when hosted)
  • Hosting (TBD) — e.g. Vercel/host for the Next.js app
  • LLM provider  — AI planning (optional, flag- + key-gated)
  See policies/vendor-management-policy.md for how each is governed.

OUT OF SCOPE:
  • The end user's browser and device (e.g. localStorage saves never leave it)
  • Roadmap intelligence engines with no live implementation (labeled in /docs)
```

The dependency register in
[`../architecture/service-dependency-map.md`](../architecture/service-dependency-map.md)
is the authoritative, code-backed list of what actually exists today.

## What "ready" means here

"SOC 2 ready" is a defined, honest milestone — not a certification:

1. **Every in-scope criterion is mapped** to a named control. → see
   [`trust-services-criteria-matrix.md`](trust-services-criteria-matrix.md).
2. **Every control points to evidence** — a file, a setting, or a runbook — so
   an auditor can verify it without a tour-guide.
3. **Every policy an auditor expects exists** in plain language. → see
   [`policies/`](policies).
4. **Gaps are written down, not hidden**, with an owner and a priority. → see
   [`gap-analysis-and-roadmap.md`](gap-analysis-and-roadmap.md).

When all four are true and the recommended GitHub/org settings (branch
protection, MFA, native secret scanning) are switched on, Journee can engage an
auditor for a Type I assessment with confidence.

## Roles & responsibilities (the "control environment")

SOC 2 starts with people (Criterion CC1). For a small project the roles are held
by few individuals, but the _responsibilities_ must be explicit:

| Role | Responsibility | Held by (today) |
| --- | --- | --- |
| **Owner / Security lead** | Final accountability for security & compliance; approves policy; reviews PRs; manages access. | Repository owner (`@BinduMannil`, see [`../../.github/CODEOWNERS`](../../.github/CODEOWNERS)) |
| **Engineer / Contributor** | Follows the Secure SDLC; writes code + tests; opens PRs; updates docs in the same PR. | All contributors (human and autonomous agents) |
| **Reviewer** | Independently reviews every change before merge. | Owner / designated reviewer |
| **Autonomous agent** | Produces changes under explicit scope; records actions in the audit trail; a human reviews before merge. | Claude / CI agents, per [`../governance/ai-agent-audit-trail.md`](../governance/ai-agent-audit-trail.md) |

As the team grows, separation of duties (the person who writes code is not the
sole person who approves it) becomes enforceable via branch protection — see the
[Access Control Policy](policies/access-control-policy.md).

## Overall status at a glance

| Area | Status |
| --- | --- |
| Security control mapping (CC1–CC9) | ✅ Documented with code evidence |
| Written policy set | ✅ Complete (this folder) |
| Change management (PR + CI + CODEOWNERS) | ✅ In place; branch protection = settings to enable |
| Static analysis (CodeQL SAST) | ✅ In place (`.github/workflows/codeql.yml`) |
| Dependency scanning (`npm audit` + Dependabot) | ✅ In place |
| Secret scanning (gitleaks + recommend native) | ✅ gitleaks in place; native = settings to enable |
| Least-privilege CI token | ✅ In place (`permissions: contents: read`) |
| Audit logging of admin/data actions | ◻️ Partial — structured app logs exist; tamper-evident audit log = roadmap |
| MFA, branch protection, env separation | ◻️ Org/settings to enable (documented) |
| Independent auditor engagement | 🔜 Future (after the above) |

The full, line-by-line picture is in
[`trust-services-criteria-matrix.md`](trust-services-criteria-matrix.md) and the
remediation order is in
[`gap-analysis-and-roadmap.md`](gap-analysis-and-roadmap.md).
