# Security Policy

## Reporting a vulnerability

Please report security issues **privately** to the repository owner rather than
opening a public issue. Include steps to reproduce and impact. We will
acknowledge and work on a fix; a formal coordinated-disclosure process will be
published before any public launch.

## Posture

Journee is **not** SOC 2 certified. Current security posture and the path toward
readiness are documented honestly in
[`docs/security/security-overview.md`](docs/security/security-overview.md).

Highlights:

- No secrets in git (`.gitignore` + `.env.example` placeholders).
- CI quality gate + dependency audit on every PR; Dependabot enabled.
- Supabase anon/service-role keys separated; RLS deny-by-default in migrations.
- Affiliate event tables are not publicly readable.

Do not include real credentials in issues, PRs, or commits.
