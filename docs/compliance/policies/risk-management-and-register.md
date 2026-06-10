# Risk Management Policy & Risk Register

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
quarterly (or after any significant change)._

How Journee identifies, rates, and tracks risk. Implements Common Criteria
CC3.1–CC3.4. The **live register** is in section 5.

## 1. Principle

You cannot protect what you have not thought about. We keep a written,
regularly-reviewed list of what could go wrong, how bad it would be, and what we
are doing about it.

## 2. How we rate risk

Each risk gets a **Likelihood** (Low/Med/High) and an **Impact** (Low/Med/High).
The combination gives a priority:

| | Impact: Low | Impact: Med | Impact: High |
| --- | --- | --- | --- |
| **Likelihood: High** | Medium | High | **Critical** |
| **Likelihood: Med** | Low | Medium | High |
| **Likelihood: Low** | Low | Low | Medium |

## 3. How we treat risk

For each risk we choose one: **Mitigate** (add a control), **Accept** (document
and live with it), **Transfer** (e.g. rely on a vendor's control), or **Avoid**
(don't do the risky thing). Accepted risks must be documented with an owner and
an expiry/review date.

## 4. Process

1. **Identify** — from the dependency map, threat thinking, audit findings,
   incidents, and significant changes (every architectural PR considers risk).
2. **Analyze & rate** — likelihood × impact.
3. **Treat** — pick a response; if mitigating, the control lands as a tracked
   item (often a [gap-analysis](../gap-analysis-and-roadmap.md) entry).
4. **Review** — re-rate quarterly; close or update entries.

## 5. Risk register (live)

_Rate as of the "Last updated" date above. Update in the same PR as any change
that adds or closes a risk._

| ID | Risk | Likelihood | Impact | Priority | Treatment | Control / reference |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | A secret is committed to git | Low | High | Medium | Mitigate | `.gitignore` excludes `.env*`; gitleaks scan; `.env.example` placeholders; native secret scanning (P0-3) |
| R-02 | Unreviewed/malicious change reaches `main` | Med | High | High | Mitigate | PR + CI + CODEOWNERS; branch protection (P0-1) |
| R-03 | Vulnerable dependency ships | Med | Med | Medium | Mitigate | `npm audit` in CI; Dependabot; lockfile pinning |
| R-04 | Code-level vulnerability (injection, unsafe flow) | Med | Med | Medium | Mitigate | CodeQL SAST; strict TS; Zod validation; CSP backstops |
| R-05 | Service-role/admin key exposed to client | Low | High | Medium | Mitigate | Server-only config; secure-by-default admin; review |
| R-06 | Data platform (Supabase) outage | Med | Med | Medium | Mitigate/Transfer | Automatic failover to always-available seed provider; Supabase SLA |
| R-07 | Bad deploy breaks the site | Med | High | High | Mitigate | CI gate; fast rollback via `git revert`; flag kill-switches |
| R-08 | Unauthorized read of private event/data tables | Low | Med | Low | Mitigate | RLS deny-by-default; no SELECT policy on event tables |
| R-09 | Clickjacking / framing / `<base>` hijack | Low | Med | Low | Mitigate | Enforced CSP (`frame-ancestors 'none'`, `base-uri 'self'`) + `X-Frame-Options: DENY` |
| R-10 | Excess personal-data collection / privacy harm | Low | Med | Low | Avoid/Mitigate | Data minimization: one anonymous `jid` cookie; device-local saves; honest privacy page |
| R-11 | No alerting → slow incident detection | Med | Med | Medium | Accept (interim) | Logs/metrics emit now; alerting backend is gap P1-11 |
| R-12 | No tested backup/restore (pre-hosting) | Low (today) | High | Medium | Accept until hosted | Local `db reset` rebuilds; drill is gap P2-13 |
| R-13 | Loss of access (single owner / bus factor) | Med | High | High | Mitigate | Document access; add a second admin; record procedures (Access Control Policy) |
| R-14 | Vendor changes terms / shuts down | Low | Med | Low | Transfer/Avoid | Provider-adapter pattern isolates vendors; dependency register |

## 6. Linking risk to remediation

Mitigation work for open risks is tracked in
[`../gap-analysis-and-roadmap.md`](../gap-analysis-and-roadmap.md). When a gap
closes, update the corresponding risk row (lower the rating or mark mitigated).

## 7. Evidence

The register itself (with dated reviews) is the evidence for CC3.x. Record each
quarterly review date and reviewer at the top of this file.
