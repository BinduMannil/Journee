# Vendor (Third-Party) Management Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually + on adding any vendor._

How Journee vets and governs the third parties ("sub-service organizations") it
relies on. Implements Common Criteria CC9.2. Complements the code-backed
dependency register in
[`../../architecture/service-dependency-map.md`](../../architecture/service-dependency-map.md).

## 1. Principle

We are only as secure as the vendors we depend on. Each vendor is chosen
deliberately, isolated behind an adapter where possible, and reviewed for its
own security posture.

## 2. Before adopting a vendor (due diligence)

When a change introduces a new vendor (a "significant change" — needs an ADR):

- [ ] **Need** — why is this vendor required? Is there a lower-dependency option?
- [ ] **Security posture** — does it publish a SOC 2 / ISO 27001 report or a
      security page? Record the link and date reviewed.
- [ ] **Data exposure** — what data would it see? Map it to the
      [Data Classification Policy](data-classification-and-handling-policy.md).
      Prefer vendors that see the least.
- [ ] **Isolation** — can we put it behind a provider adapter so it's swappable
      and its blast radius is contained? (This is the default pattern — ADR-003.)
- [ ] **Credentials** — what keys does it need, and are they server-only?
- [ ] **Exit** — what happens if it disappears? Is there a fallback?

## 3. Vendor register

| Vendor | Purpose | Data it sees | Isolation | Fallback / exit | Security posture |
| --- | --- | --- | --- | --- | --- |
| **GitHub** | Source control, CI, secret scanning | Source code, CI logs, metadata | n/a (platform) | Git is portable; mirrors possible | Publishes SOC 2 / security docs — record link + review date |
| **Supabase** (when hosted) | Postgres data platform | Catalog + (future) app data | Provider adapter; RLS deny-by-default; anon vs service-role split | Automatic fallback to seed provider; data is standard Postgres (portable) | Publishes SOC 2 — record link + review date |
| **Hosting** (TBD, e.g. Vercel) | Serves the Next.js app | Request traffic, env vars | Standard Next.js; portable build | Redeploy elsewhere from the same repo | Record SOC 2 / security page when chosen |
| **LLM provider** (optional) | AI trip planning | Trip-planning prompts only | Provider adapter; flag- + key-gated; degrades to deterministic planner | Turn off `ai-planning` flag → deterministic planner | Record provider's security/data-use terms |
| **Unsplash** (runtime images) | Seed imagery | None (public image fetch) | Allow-listed host in `next.config.mjs` | Swap to owned assets via config | Public CDN; low risk |
| **npm registry** | Dependency install | None (public packages) | Lockfile pinning; `npm audit` | Vendored cache possible | Public; mitigated by scanning |

> **Action (gap P1-10):** collect and record each vendor's current SOC 2 /
> security-page link with a review date. The register above lists _what_ to
> collect; the dated records are the audit evidence.

## 4. Ongoing governance

- **Re-review annually** (and when a vendor materially changes terms or has a
  breach): re-check the security posture and data exposure.
- **Sub-processor awareness:** if a vendor adds sub-processors that touch our
  data, note it here.
- **Credential hygiene:** vendor keys follow the
  [Access Control Policy](access-control-policy.md) — server-only, rotated on
  offboarding/suspicion.
- **Incidents:** a vendor incident is handled via the
  [Incident Response Policy](incident-response-policy.md); failover/kill-switch
  options are in [`../../runbooks/recovery.md`](../../runbooks/recovery.md).

## 5. Why the adapter pattern is a vendor control

Every external integration is funneled through a provider adapter
([ADR-003](../../decisions/ADR-003-provider-adapter-pattern.md)). This gives a
single place to audit external access, contains each vendor's blast radius, and
makes swapping or removing a vendor a configuration change — directly reducing
vendor lock-in and concentration risk (R-14 in the risk register).
