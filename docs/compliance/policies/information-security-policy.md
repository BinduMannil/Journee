# Information Security Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review: at
least annually, or after any significant change._

This is the **umbrella policy**. It states Journee's security commitments and
points to the specific policies that implement each one. Every other policy in
this folder hangs off this document.

## 1. Purpose

To protect the confidentiality, integrity, and availability of Journee's system
and any data it processes, and to establish the controls required for SOC 2
readiness. Written in plain language so every contributor can follow it.

## 2. Scope

Applies to:

- All code, configuration, and documentation in this repository.
- The build/CI pipeline and the GitHub organization.
- The hosted application and data platform (when they exist).
- Everyone who contributes — human or autonomous agent — and anyone granted
  access to the repository or hosting accounts.

## 3. Guiding principles

1. **Secure by default.** Dangerous defaults are not allowed. A missing config
   disables a feature (admin endpoints return 503; providers fall back to seed),
   it never opens it up.
2. **Least privilege.** People and systems get the minimum access they need —
   the CI token is read-only, the service-role key is server-only, RLS denies by
   default.
3. **Defense in depth.** Multiple independent layers (headers + CSP + RLS +
   validation + scanning), so one failure is not catastrophic.
4. **No fiction.** We document what is true today and label everything else as
   planned. Honesty is itself a control (CC1.1).
5. **Everything changes through review.** No direct pushes to `main`; PR + CI +
   review (see Change Management).
6. **Data minimization.** Collect as little personal data as possible.

## 4. Roles & responsibilities

See the roles table in
[`../soc2-readiness-overview.md`](../soc2-readiness-overview.md). In short: the
**Owner/Security Lead** is accountable for security and approves this policy;
**Contributors** follow the Secure SDLC; **Reviewers** independently approve
changes; **Autonomous agents** act under explicit scope and record their actions.

## 5. The policy set (what implements this umbrella)

| Area | Policy |
| --- | --- |
| Who can access what | [Access Control Policy](access-control-policy.md) |
| How code reaches production | [Change Management Policy](change-management-policy.md) |
| How we build securely | [Secure SDLC Policy](secure-sdlc-policy.md) |
| Finding & tracking risk | [Risk Management & Register](risk-management-and-register.md) |
| Vetting third parties | [Vendor Management Policy](vendor-management-policy.md) |
| What data we hold & how we treat it | [Data Classification & Handling Policy](data-classification-and-handling-policy.md) |
| What we record & watch | [Logging, Monitoring & Alerting Policy](logging-monitoring-and-alerting-policy.md) |
| Staying up / coming back | [Business Continuity & Disaster Recovery Policy](business-continuity-and-disaster-recovery-policy.md) |
| When something goes wrong | [Incident Response Policy](incident-response-policy.md) |

## 6. Compliance & exceptions

- Controls and their evidence are mapped in the
  [Trust Services Criteria Matrix](../trust-services-criteria-matrix.md).
- Gaps are tracked openly in the
  [Gap Analysis & Roadmap](../gap-analysis-and-roadmap.md).
- **Exceptions** to this policy must be documented (what, why, risk, expiry) and
  approved by the Owner, then recorded in the
  [risk register](risk-management-and-register.md).

## 7. Enforcement

Violations (e.g. committing a secret, bypassing review) are addressed by the
Owner. Automated controls (secret scanning, branch protection, CI gates) enforce
much of this policy mechanically so compliance is the path of least resistance.

## 8. Review

This policy is reviewed at least annually and whenever a significant change
(new data type, new vendor, new environment) occurs. The review date and
reviewer are recorded at the top of the file.
