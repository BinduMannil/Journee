# Compliance & SOC 2 Readiness

_Last updated: 2026-06-10._

This folder is the home of Journee's **SOC 2 readiness program**. It is written
for a complete beginner: if you have never heard of SOC 2, start here and read
top to bottom. Every term is explained the first time it is used.

> **Read this first — an honest statement.** Journee is **not** SOC 2 certified,
> and no document in this folder claims that it is. SOC 2 is not something a
> codebase can switch on by itself; it is an independent audit of an
> _organization_ performed by a licensed CPA firm over a period of time. What
> this folder does is make Journee **audit-ready**: it documents the controls
> that already exist, points to the exact code that implements them, writes down
> the policies an auditor expects to see, and lists — honestly — what is still
> missing. This continues the repository's "no fiction" rule (see
> [`../README.md`](../README.md)): we describe what is true today and label
> everything else as planned.

## What is SOC 2, in one paragraph?

SOC 2 (System and Organization Controls 2) is a report, produced by an
independent auditor, that says: _"This company says it protects its system in
these specific ways, and we checked — it really does."_ The "specific ways" are
called **controls** (a control is just a safeguard, e.g. "only reviewed code can
reach production"). The controls are organized under five **Trust Services
Criteria (TSC)** — five broad promises a company can make:

| Criterion | Plain-language promise |
| --- | --- |
| **Security** (required for every SOC 2 report) | The system is protected against unauthorized access. |
| **Availability** | The system is up and usable as committed. |
| **Processing Integrity** | The system processes data completely, accurately, and on time. |
| **Confidentiality** | Information meant to be private stays private. |
| **Privacy** | Personal information is collected and used responsibly. |

Security is mandatory; the other four are included only if relevant to the
service. See [`soc2-readiness-overview.md`](soc2-readiness-overview.md) for which
ones Journee scopes in and why.

## Type I vs Type II (you will hear these terms)

- **SOC 2 Type I** — the auditor checks that the controls are _designed_
  correctly at a single point in time. ("Do you have a lock on the door?")
- **SOC 2 Type II** — the auditor checks that the controls actually _operated_
  correctly over a period (usually 3–12 months). ("Was the door locked every
  night for the last six months?") Type II is the stronger, more common report.

Journee is preparing for Type I first; the practices here (PR-only changes, CI
on every commit, structured logs) are chosen so that Type II evidence
accumulates automatically over time.

## How to use this folder

Read in this order:

1. **[`soc2-readiness-overview.md`](soc2-readiness-overview.md)** — the big
   picture: scope, what "ready" means, and the overall status.
2. **[`trust-services-criteria-matrix.md`](trust-services-criteria-matrix.md)** —
   the heart of the program. Every criterion → the control that satisfies it →
   the exact file that proves it → an honest status (In place / Partial /
   Planned). If you read one document, read this one.
3. **[`control-implementation-guide.md`](control-implementation-guide.md)** — a
   guided tour of _where_ each control lives in the codebase and _how_ it works,
   for an engineer new to the repo.
4. **[`policies/`](policies)** — the written policies an auditor asks for. Each
   is short, plain-language, and links to the code/runbook that enforces it.
5. **[`evidence-collection-guide.md`](evidence-collection-guide.md)** — when an
   auditor says "show me proof," this tells you exactly what to export and from
   where.
6. **[`gap-analysis-and-roadmap.md`](gap-analysis-and-roadmap.md)** — the honest
   to-do list: what is not done yet and in what order to do it.

## Map of this folder

```
docs/compliance/
  README.md                          ← you are here
  soc2-readiness-overview.md         scope, criteria, what "ready" means
  trust-services-criteria-matrix.md  CC1–CC9 + A/PI/C/P → controls → evidence → status
  control-implementation-guide.md    where each control lives in the code
  evidence-collection-guide.md       how to produce audit evidence on request
  gap-analysis-and-roadmap.md        honest gaps + prioritized remediation
  policies/
    information-security-policy.md            the umbrella policy
    access-control-policy.md                  who can touch what
    change-management-policy.md               how code reaches production
    secure-sdlc-policy.md                     how we build securely
    risk-management-and-register.md           how we find/track risk (+ live register)
    vendor-management-policy.md               how we vet third parties
    data-classification-and-handling-policy.md what data we hold and how we treat it
    logging-monitoring-and-alerting-policy.md  what we record and watch
    business-continuity-and-disaster-recovery-policy.md  staying up / coming back
    incident-response-policy.md               what we do when something goes wrong
```

## Related documents already in this repo

The readiness program does not duplicate existing docs — it builds on them:

- Security posture & headers → [`../security/security-overview.md`](../security/security-overview.md)
- Change-management workflow → [`../governance/branch-and-pr-governance.md`](../governance/branch-and-pr-governance.md)
- Autonomous-agent traceability → [`../governance/ai-agent-audit-trail.md`](../governance/ai-agent-audit-trail.md)
- Incident response → [`../runbooks/incident-response.md`](../runbooks/incident-response.md)
- Recovery procedures → [`../runbooks/recovery.md`](../runbooks/recovery.md)
- Dependency register → [`../architecture/service-dependency-map.md`](../architecture/service-dependency-map.md)
- Vulnerability reporting → [`../../SECURITY.md`](../../SECURITY.md)
