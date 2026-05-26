# Postmortem: <title>

- **Date:** YYYY-MM-DD
- **Severity:** SEV1 | SEV2 | SEV3
- **Authors:**
- **Status:** draft | reviewed

> Blameless. Focus on systems and contributing factors, not individuals.

## Summary

One paragraph: what happened, impact, duration.

## Impact

Who/what was affected and for how long (users, capabilities, data).

## Timeline (UTC)

| Time | Event |
| --- | --- |
| | Detection (how — alert, report, metric) |
| | Mitigation actions |
| | Resolution |

## Root cause

What actually caused it (and why it wasn't caught earlier).

## Detection

How we found out, and how fast. Could `GET /api/health` / `GET /api/metrics`
or logs have surfaced it sooner?

## What went well / what didn't

- Went well:
- Didn't:

## Action items

| Action | Owner | Issue | Priority |
| --- | --- | --- | --- |
| | | | |

## Prevention

Concrete changes (tests, guards, alerts, docs) that reduce recurrence. Link the
PRs. If an autonomous agent acted during the incident, link the AI audit-trail
entry.
