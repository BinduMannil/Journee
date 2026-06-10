# Access Control Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
quarterly access review + annual policy review._

Controls **who** can access **what**, and how access is granted, reviewed, and
removed. Implements Common Criteria CC6.1–CC6.3 and CC6.6.

## 1. Principle: least privilege, deny by default

Everyone and every system gets the **minimum** access needed, for the shortest
time needed. The default is "no access"; access is an explicit grant.

## 2. Identities & authentication

| Access path | Who | Authentication | Control |
| --- | --- | --- | --- |
| GitHub repository/org | Contributors, owner | GitHub login + **MFA (required — see gap P0-2)** | Org membership, teams |
| CI pipeline | Automation | GitHub-provided `GITHUB_TOKEN`, **read-only** | `permissions: contents: read` in workflows |
| Admin control plane (`/api/admin/*`) | Operators | `x-admin-token` header matching `JOURNEE_ADMIN_TOKEN` | Secure-by-default: disabled (503) until a token is set |
| Database — public reads | App (anon) | Supabase anon key | RLS deny-by-default; only SELECT policies granted |
| Database — privileged writes | Server only | Supabase **service-role** key | Server-only config (`getSupabaseServiceConfig`), never client-exposed |
| LLM provider | Server only | `LLM_API_KEY` | Optional; flag- + key-gated |

**MFA:** all human access to GitHub (and to the hosting/Supabase consoles once
they exist) must require multi-factor authentication. Enabling org-wide
enforcement is gap **P0-2**.

## 3. Authorization model

- **Code ownership:** [`.github/CODEOWNERS`](../../../.github/CODEOWNERS) makes
  the owner a required reviewer for all paths.
- **Separation of duties:** as the team grows, the author of a change must not be
  its sole approver. Branch protection (gap **P0-1**) enforces "≥1 review."
- **Secrets are not access grants in git:** secrets live only in environment
  configuration, never in the repository (see Data Handling + `.gitignore`).

## 4. Granting access (onboarding)

1. Owner verifies the person needs access and which level (read vs write vs
   admin).
2. Add to the GitHub org/team with the **least** role that fits.
3. Confirm MFA is enabled on their account.
4. Share secrets (if any) out-of-band — never in issues, PRs, or chat logs.
5. Record the grant (who, what level, date, why).

## 5. Reviewing access (quarterly)

Every quarter the Owner runs an **access review** (CC6.3):

- [ ] List all org members/collaborators and their roles.
- [ ] Confirm each still needs their current level; downgrade or remove
      otherwise.
- [ ] Confirm MFA is on for everyone.
- [ ] Rotate the `JOURNEE_ADMIN_TOKEN` and any service keys if anyone with
      access has left.
- [ ] Record the review (date, who ran it, changes made) — this is audit
      evidence.

## 6. Removing access (offboarding)

When someone leaves or no longer needs access, **same day**:

1. Remove them from the GitHub org/teams.
2. Rotate any shared secrets they could have seen (`JOURNEE_ADMIN_TOKEN`,
   service-role key, LLM key).
3. Revoke any personal access tokens / deploy keys they created.
4. Record the offboarding.

## 7. Secret rotation

- Rotate on suspicion of exposure, on offboarding, and on a routine cadence.
- After rotation, update the environment configuration only (never commit the
  value). The env boundary (`src/lib/config/env.ts`) reads the new value with no
  code change.

## 8. Evidence

See the [Evidence Collection Guide](../evidence-collection-guide.md) rows for
"Access control," "MFA," "Branch protection," and "Least-privilege CI token."
