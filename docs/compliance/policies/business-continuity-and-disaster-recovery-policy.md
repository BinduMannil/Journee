# Business Continuity & Disaster Recovery (BCDR) Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually + after any restore drill._

How Journee stays available and how it recovers from disruption. Supports the
**Availability** criteria (A1.1–A1.3) and CC9.1. Operational detail lives in
[`../../runbooks/recovery.md`](../../runbooks/recovery.md) and
[`../../runbooks/incident-response.md`](../../runbooks/incident-response.md);
this policy sets the expectations around them.

## 1. Principle

Degrade, don't fail. When a dependency breaks, the system serves a reduced but
working experience and recovers quickly via documented procedures.

## 2. Key terms (for newcomers)

- **RPO (Recovery Point Objective):** how much data loss is tolerable, measured
  in time ("at most 5 minutes of data"). Set per data store.
- **RTO (Recovery Time Objective):** how fast service must be restored ("back in
  30 minutes").
- **Failover:** automatically switching to a backup path when the primary fails.

## 3. Resilience that exists today

- **Provider failover.** The registry tries the highest-priority available
  provider and falls over to the next, down to an **always-available in-repo seed
  provider** ([`src/lib/providers/registry.ts`](../../../src/lib/providers/registry.ts)).
  So the destinations catalog can always answer even if Supabase is down.
- **Feature-flag kill switches.** Any capability can be disabled instantly by
  editing `JOURNEE_ENABLED_FEATURES` — a config change, no deploy
  ([`src/lib/config/flags.ts`](../../../src/lib/config/flags.ts)).
- **Fast, safe rollback.** Because every change lands via PR + green CI, the
  previous `main` commit is a safe target. Recover with `git revert <bad-merge>`
  (forward fix; never force-push).
- **Stateless app.** The Next.js app holds no critical local state; redeploying
  the last good build restores service.

## 4. Backups (data platform)

- **Locally:** `supabase db reset` rebuilds schema + seed from
  `supabase/migrations/*` and `supabase/seed.sql`.
- **When hosted:** Supabase provides managed point-in-time backups (dashboard /
  CLI). **Concrete RPO/RTO targets and a tested restore drill will be documented
  once a hosted project exists** — not claimed before then (gaps **P2-13**,
  **A1.2/A1.3**). This honesty is deliberate.

## 5. Recovery scenarios (summary)

| Scenario | Automatic behavior | Manual recovery | Target |
| --- | --- | --- | --- |
| Bad deploy | — | `git revert` → CI → redeploy | RTO: minutes |
| Supabase down | Falls back to seed catalog | Fix config; provider re-enables when `isAvailable()` passes — no deploy | Degraded, not down |
| Affiliate catalog down | No CTA rendered | Restore Supabase + flag | Non-critical |
| Misbehaving provider | — | Disable its feature flag | Instant kill switch |

Full detail and a recovery flowchart are in
[`../../runbooks/recovery.md`](../../runbooks/recovery.md).

## 6. Continuity of people & access

- **Bus-factor risk (R-13):** today access concentrates on a single owner. Add a
  second administrator and ensure procedures (this folder + runbooks) are written
  so recovery does not depend on one person's memory.
- Access during an incident still follows the
  [Access Control Policy](access-control-policy.md); no emergency backdoors.

## 7. Testing the plan (A1.3)

- **Today:** rollback is exercised naturally through normal PR/revert flow;
  failover is covered by unit tests (`test/providers.failover.test.ts`).
- **When hosted:** run a **restore drill** at least annually — restore a backup
  to a scratch environment, verify integrity, record RPO/RTO actually achieved,
  and file the record as audit evidence. Tracked as gap **P2-13**.

## 8. Evidence

The recovery runbook, failover tests, and (once hosted) a dated restore-drill
record are the evidence for A1.x / CC9.1; see the
[Evidence Collection Guide](../evidence-collection-guide.md).
