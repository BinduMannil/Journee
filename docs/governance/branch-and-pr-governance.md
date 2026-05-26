# Branch & PR Governance

_Last updated: 2026-05-26._

## Branching

- `main` is the integration branch and should remain releasable.
- Work happens on short-lived feature branches.
- Branches created by autonomous agents use the `claude/<name>` prefix.

## Pull requests

All changes to `main` go through a PR. Use the template in
[`.github/pull_request_template.md`](../../.github/pull_request_template.md).
A PR should be reviewable in one sitting — prefer small, focused changes.

CI (`.github/workflows/ci.yml`) runs install → typecheck → lint → build on every
PR. These must pass before merge.

## Recommended branch protection (configure in GitHub settings)

These are **recommendations** to enable as the team grows; they are not all
enforced yet on this new repository:

- Require PR before merging to `main`.
- Require status checks (CI) to pass.
- Require at least one review.
- Disallow force-pushes to `main`.

## Change management notes (SOC 2 direction)

The intent is a PR-only, reviewed, CI-gated workflow with traceable history —
the backbone of SOC 2 change-management evidence. We document the target state
honestly: branch protection and required reviews are **recommended settings to
turn on**, and the broader control set lives in
[`../security/security-overview.md`](../security/security-overview.md). We do not
claim controls that are not yet enforced.

## Autonomous agent changes

When changes are produced by an automated agent, the PR description should note
that, summarize scope, and list the validation performed (typecheck/lint/build,
and any manual checks). A human reviews before merge.
