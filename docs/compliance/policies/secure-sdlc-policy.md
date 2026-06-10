# Secure Software Development Lifecycle (SDLC) Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually._

How we build software securely, from writing a line of code to shipping it.
Supports CC1.4, CC5.2, CC7.1, CC8.1.

## 1. Principle

Security is built in, not bolted on. Every stage of development has a control
that makes the secure path the easy path.

## 2. Secure coding standards

- **Strict TypeScript.** `tsconfig.json` enables strict mode incl.
  `noUncheckedIndexedAccess` and no-unused checks — this removes a whole class
  of runtime/security bugs at compile time.
- **Validate at every boundary.** External input is parsed with **Zod** before
  use: environment (`src/lib/config/env.ts`), provider contracts
  (`src/lib/providers/travel-data/contracts.ts`), and API request bodies.
  Reject invalid input with a clear error (e.g. ingestion returns `400`).
- **No hardcoding / no secrets in code.** All config flows through
  `src/lib/config`. Secrets live only in the environment; `.gitignore` excludes
  all `.env*` files; `.env.example` holds placeholders only.
- **Server/client separation.** Privileged config (service-role key, LLM key,
  admin token) is server-only and must never be imported where it could reach
  the browser. The `getSupabaseServiceConfig` comment states this explicitly.
- **Secure defaults.** New features fail closed (disabled) when unconfigured.
- **No `dangerouslySetInnerHTML` / unsanitized HTML** without review; CSP
  `object-src 'none'` and `base-uri 'self'` are enforced as backstops.

## 3. Testing

- **Unit tests required** for new logic, especially scoring, validation, and
  data transforms (100+ tests today, `node:test`). Pure functions are separated
  for testability (e.g. `formatLog`, scoring core).
- CI runs the full suite on every PR; a **smoke test** boots the server and
  asserts key routes/APIs return expected statuses.

## 4. Automated security checks (every change)

| Check | Tool | Catches |
| --- | --- | --- |
| SAST | CodeQL (`.github/workflows/codeql.yml`) | Vulnerable code patterns in our TS/JS |
| Dependency advisories | `npm audit --audit-level=high` (CI) | Known-vulnerable packages |
| Dependency updates | Dependabot (`.github/dependabot.yml`) | Out-of-date / vulnerable deps |
| Secret leakage | gitleaks (`.github/workflows/secret-scan.yml`) | Credentials in code/history |
| Type safety | `tsc` (CI) | Type/coercion bugs |
| Lint | ESLint (CI) | Risky patterns / dead code |

All are part of the change gate (see [Change Management](change-management-policy.md)).

## 5. Dependency management

- The lockfile (`package-lock.json`) pins exact versions; CI uses `npm ci` for
  reproducible installs.
- Dependabot proposes updates weekly; security updates are prioritized.
- New dependencies are added deliberately — prefer the standard library / zero
  added deps where reasonable (the logger is dependency-free by design). A new
  third-party runtime dependency is a "significant change" (ADR + review).

## 6. Code review

Every change is reviewed by someone other than the author (CODEOWNERS). Review
covers correctness, tests, security implications, and whether docs were updated.

## 7. Documentation as part of development

A change that alters architecture, a control, or data handling **must** update
the relevant doc/policy/ADR in the **same PR**. "Co-evolve with code" is a
documentation principle ([`../../README.md`](../../README.md)) and a control
(CC2.2): docs never drift from reality.

## 8. Roadmap discipline

Unbuilt systems are labeled "roadmap" and get architecture docs/ADRs **when
implementation begins**, not before. We never document or "secure" code that
doesn't exist — that keeps the security posture truthful.
