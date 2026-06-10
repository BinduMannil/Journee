# Gap Analysis & Remediation Roadmap

_Last updated: 2026-06-10._

This is the **honest to-do list**. It names every control that is not fully in
place, why it matters, and what closing it requires — in priority order. Nothing
here is hidden behind optimistic language; that is the point.

## How to read priority

- **P0 — Do now.** Cheap (minutes) and high-impact. Mostly GitHub/org settings.
- **P1 — Do before an audit / before hosting real data.** Needs a small project.
- **P2 — Do when the dependent system is built.** Tied to hosting, a data
  platform, or scale that does not exist yet (kept honest, not pretended).

---

## P0 — Settings to enable now (minutes each, no code)

These convert several **Partial/Planned** matrix rows to **In place** the moment
they are toggled in GitHub. They cannot be set from code, which is why they are
not already green.

| # | Gap | Criterion | Action | Owner |
| --- | --- | --- | --- | --- |
| 1 | Branch protection on `main` | CC8.1 | GitHub → Settings → Branches → add rule on `main`: require PR, require status checks (CI, CodeQL), require ≥1 review, dismiss stale approvals, block force-push & deletion. | Owner |
| 2 | Require MFA org-wide | CC6.1, CC6.2 | GitHub → Org → Settings → Authentication security → "Require two-factor authentication." | Owner |
| 3 | Native secret scanning + push protection | CC6.1, CC7.1 | GitHub → Settings → Code security → enable Secret scanning **and** Push protection (complements the gitleaks workflow). | Owner |
| 4 | Enable CodeQL default setup / confirm Actions on | CC7.1 | Confirm `codeql.yml` runs (Security → Code scanning). For private repos ensure GitHub Advanced Security is available. | Owner |
| 5 | Dependabot security updates | CC6.8 | GitHub → Settings → Code security → enable "Dependabot security updates" (version updates are already configured in `dependabot.yml`). | Owner |

> Once 1–5 are done, update the affected rows in
> [`trust-services-criteria-matrix.md`](trust-services-criteria-matrix.md) from
> ◻️/🔜 to ✅ and note the date.

---

## P1 — Small projects before an audit or before storing real user data

| # | Gap | Criterion | What's needed | Notes |
| --- | --- | --- | --- | --- |
| 6 | Access review + offboarding procedure operating | CC6.3 | Run the quarterly access review described in the [Access Control Policy](policies/access-control-policy.md); log each run. | Procedure exists; it needs to actually run on a cadence to be Type II evidence. |
| 7 | Change-management risk note enforced | CC3.4, CC8.1 | Add a "risk / rollback" checkbox to the PR template and require it for architectural changes. | Policy written; template prompt to be added. |
| 8 | Environment separation (local/staging/prod) | CC6.x | Stand up distinct environments with separate Supabase projects + credentials. | See [`../architecture/deployment-and-environment-architecture.md`](../architecture/deployment-and-environment-architecture.md). |
| 9 | Data-in-transit/at-rest evidence | CC6.7 | Once hosted: capture TLS config + Supabase encryption-at-rest attestation. | HSTS already forces HTTPS in-app. |
| 10 | Vendor due-diligence records | CC9.2 | Collect SOC 2 / security pages for GitHub, Supabase, hosting, LLM provider; record review dates in the [Vendor Policy](policies/vendor-management-policy.md). | List exists; the _records_ are the deliverable. |
| 11 | Monitoring → alerting | CC4.2, CC7.2 | Forward structured logs/metrics to a backend with alert thresholds + an on-call path. | Logs/metrics emit today; no alerting backend yet. |
| 12 | Tamper-evident audit log for admin/data actions | CC6.1, CC7.2 | Record privileged actions (admin endpoint hits, service-role writes) to an append-only store. | App logs exist but are not yet a dedicated, immutable audit trail. |

---

## P2 — Tied to systems that do not exist yet (honest deferral)

We do **not** claim controls for components that have no implementation. These
land when the underlying system does.

| # | Gap | Criterion | Trigger to do it |
| --- | --- | --- | --- |
| 13 | Backup RPO/RTO targets + tested restore drill | A1.2, A1.3 | When a hosted Supabase project exists. Record a real restore drill in [`../runbooks/recovery.md`](../runbooks/recovery.md). |
| 14 | Capacity / availability SLOs | A1.1 | When hosting + traffic exist; define SLOs and monitor. |
| 15 | Confidential-data retention/disposal enforcement | C1.2 | When the app stores confidential/user data. |
| 16 | Full Privacy-criterion engagement (notice/choice/access/DSAR) | P1–P8 | When user accounts or richer personal data are introduced. |
| 17 | Fraud-risk controls for monetary flows | CC3.3 | When live affiliate revenue / payouts are wired (ingestion is server-only today). |
| 18 | Promote CSP report-only directives to enforced | CC6.6 | After CSP reports confirm a zero-violation allow-list; needs the nonce/hydration work noted in [`../security/security-overview.md`](../security/security-overview.md). |

---

## Summary scoreboard

| Priority | Items | Effort | Blocks audit? |
| --- | --- | --- | --- |
| **P0** | 5 | Minutes (settings only) | Yes — do first |
| **P1** | 7 | Small projects | Yes — before Type I / real data |
| **P2** | 6 | Tied to roadmap systems | No — deferred honestly |

**The fastest path to a credible Type I posture:** complete all five **P0**
items today, then work P1 in order. P2 items are correctly deferred until the
systems they protect exist — pretending otherwise would violate the
repository's no-fiction rule and would not survive an auditor's questions.
