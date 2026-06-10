# Security Policy

## Reporting a vulnerability

Please report security issues **privately** to the repository owner rather than
opening a public issue. Include steps to reproduce and impact. We will
acknowledge and work on a fix; a formal coordinated-disclosure process will be
published before any public launch.

## Posture

Journee is **not** SOC 2 certified. Current security posture and the full SOC 2
**readiness program** are documented honestly in
[`docs/security/security-overview.md`](docs/security/security-overview.md) and
[`docs/compliance/`](docs/compliance/README.md) (a beginner-friendly explainer,
a criteria→control→evidence matrix, a complete policy set, and an honest gap
analysis).

Highlights:

- No secrets in git (`.gitignore` + `.env.example` placeholders); secret
  scanning via gitleaks (`.github/workflows/secret-scan.yml`).
- CI quality gate (least-privilege token) + dependency audit on every PR;
  Dependabot enabled; CodeQL SAST (`.github/workflows/codeql.yml`).
- Supabase anon/service-role keys separated; RLS deny-by-default in migrations.
- Affiliate event tables are not publicly readable.
- Baseline security headers + two-tier CSP on every response.

Do not include real credentials in issues, PRs, or commits.
