# Change Management Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually._

Defines how a change safely reaches production. Implements Common Criteria CC8.1
(and supports CC3.4). This policy formalizes the workflow already described in
[`../../governance/branch-and-pr-governance.md`](../../governance/branch-and-pr-governance.md).

## 1. Principle

**No change reaches `main` without being authorized, tested, reviewed, and
traceable.** `main` is always releasable.

## 2. The change lifecycle

```
idea → branch → implement + tests + docs → open PR → automated checks → review → merge → (deploy) → monitor
```

1. **Branch.** Work on a short-lived branch off `main`. Autonomous agents use
   the `claude/<name>` prefix.
2. **Implement.** Follow the [Secure SDLC Policy](secure-sdlc-policy.md): write
   tests; update the relevant docs/ADR **in the same PR** as the code.
3. **Open a PR.** Use [`.github/pull_request_template.md`](../../../.github/pull_request_template.md):
   describe scope, validation performed, and — for architectural changes — a
   **risk & rollback note** (CC3.4).
4. **Automated checks.** CI runs `typecheck → lint → test → build → smoke →
   npm audit`; CodeQL (SAST) and secret-scan run too. All must pass.
5. **Review.** At least one independent reviewer (the Owner via
   [`CODEOWNERS`](../../../.github/CODEOWNERS)) approves. The author is not the
   sole approver (separation of duties).
6. **Merge.** Squash/merge to `main` with a descriptive message. History is the
   change record.
7. **Deploy & monitor.** Watch `/api/health` and `/api/metrics` after release
   (see [Logging & Monitoring](logging-monitoring-and-alerting-policy.md)).

## 3. What requires a PR

**Everything** that changes code, configuration, schema, CI, or documentation.
There are no direct commits to `main`. Branch protection (gap **P0-1**) enforces
this mechanically.

## 4. Significant / architectural changes

A change is "significant" if it alters architecture, adds a vendor/dependency,
touches the data schema, or changes a security control. These additionally
require:

- An **ADR** ([`../../decisions/`](../../decisions)) explaining the _why_.
- A **risk note** in the PR (what could break, blast radius, rollback plan).
- Update of the affected architecture doc(s) in the same PR.
- If it adds a vendor: a [Vendor Management](vendor-management-policy.md) entry.

## 5. Emergency changes

If an urgent fix is needed (e.g. SEV1), the fastest safe action is usually a
**rollback**, not a hotfix:

1. Mitigate first — `git revert <bad-merge-sha>` (forward fix; never force-push
   history). See [`../../runbooks/recovery.md`](../../runbooks/recovery.md).
2. The revert still goes through PR + CI (it's fast because it's small).
3. Record the incident and write a postmortem
   ([`../../postmortems/`](../../postmortems)).

Even emergencies stay traceable. The kill-switch alternative (disable a feature
flag) is a config change, also recorded.

## 6. Autonomous-agent changes

When a change is produced by an automated agent, the PR notes that, summarizes
scope, and lists validation performed; a **human reviews before merge**; and the
action is recorded in the
[AI Agent Audit Trail](../../governance/ai-agent-audit-trail.md) (CC1.5).

## 7. Traceability (the SOC 2 payoff)

Every change is attributable: git author + commit, PR description + reviewer +
CI run, and (for agents) an audit-trail entry. Together these are the
change-management evidence an auditor samples — see the
[Evidence Collection Guide](../evidence-collection-guide.md).

## 8. Settings to enforce this (gap P0-1)

Branch protection on `main`: require PR, require status checks (CI + CodeQL),
require ≥1 review, dismiss stale approvals, block force-push and deletion.
