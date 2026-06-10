# Control Implementation Guide

_Last updated: 2026-06-10._

This is a guided tour for an engineer who is **new to the repository** and needs
to understand _how_ each SOC 2 control is actually implemented in code — not just
that it exists. For each control we answer three questions: **What is it? Where
is it? How does it work?** Open the linked files alongside this guide.

> The [control matrix](trust-services-criteria-matrix.md) tells you _which
> criterion_ a control satisfies. This guide tells you _how the code works_.

---

## 1. The configuration boundary (the "no hardcoding" seam)

**What:** every environment-driven value enters the app through one validated
gate. Inner code never reads `process.env` directly.

**Where:** [`src/lib/config/env.ts`](../../src/lib/config/env.ts).

**How it works:** `getEnv()` parses `process.env` once through a **Zod schema**
(`envSchema`). Zod is a validation library: it checks each value's shape (e.g.
`NEXT_PUBLIC_SUPABASE_URL` must be a URL) and throws on malformed input. Helper
functions then hand out typed, narrowed config:

- `getSupabaseConfig()` → public anon connection, or `null` if unconfigured.
- `getSupabaseServiceConfig()` → **privileged** service-role connection,
  server-only. The comment warns: _"never import where it could reach the
  client."_ This is the anon-vs-service-role split that backs CC6.1.
- `getAdminToken()` → the admin secret, or `null`. When `null`, admin endpoints
  are **disabled** (secure by default).

**Why it matters for SOC 2:** a single, audited place where all secrets and
external endpoints are declared (CC6.1, CC5.2) and where input validation begins
(Processing Integrity).

---

## 2. Secure-by-default admin control plane

**What:** the `/api/admin/*` endpoints expose internal status. They must never
be open to the public.

**Where:** [`src/app/api/admin/status/route.ts`](../../src/app/api/admin/status/route.ts).

**How it works:** the handler does two checks before doing anything:

```ts
const token = getAdminToken();
if (!token) return Response.json({ error: "admin_disabled" }, { status: 503 });
if (request.headers.get("x-admin-token") !== token)
  return Response.json({ error: "unauthorized" }, { status: 401 });
```

1. If no admin token is configured → **503 (disabled)**. The dangerous default
   (an open admin endpoint) is impossible; you must opt in by setting a secret.
2. If the caller's `x-admin-token` header doesn't match → **401**.

**Why it matters:** "deny by default" is a core access-control principle (CC6.1).
A misconfiguration fails _closed_, not _open_.

---

## 3. HTTP security headers + two-tier Content-Security-Policy (CSP)

**What:** every HTTP response carries headers that harden the browser against
common attacks.

**Where:** [`next.config.mjs`](../../next.config.mjs) (static headers) and
[`src/middleware.ts`](../../src/middleware.ts) (CSP).

**How it works:**

- `next.config.mjs` adds, on every route: `X-Content-Type-Options: nosniff`
  (don't guess content types), `X-Frame-Options: DENY` (can't be iframed →
  clickjacking protection), `Referrer-Policy`, `Permissions-Policy` (camera/mic/
  geolocation all denied), and **HSTS** (force HTTPS for two years).
- `src/middleware.ts` sets CSP in **two tiers**:
  - **Enforced** (`Content-Security-Policy`): only the structural directives the
    app never exercises — `base-uri 'self'`, `object-src 'none'`,
    `frame-ancestors 'none'`, `form-action 'self'`. These add real protection
    (no `<base>` hijack, no plugins, no framing, no cross-origin form posts) with
    zero risk to rendering, so they need no per-request nonce.
  - **Report-Only** (`Content-Security-Policy-Report-Only`): the script/style/
    content directives are _monitored_ and report violations to
    `/api/csp-report`. They are not yet enforced because Next.js injects inline
    bootstrap scripts during hydration; enforcing would need nonces (which force
    dynamic rendering). The honest plan is to promote them once reports confirm
    a zero-violation allow-list. See [`../security/security-overview.md`](../security/security-overview.md).

**Why it matters:** protection against external threats (CC6.6) and malicious
software (CC6.8), with a documented, deliberate rollout rather than a risky
flip-the-switch.

---

## 4. Row-Level Security (RLS), deny-by-default, in the database

**What:** the Postgres schema is locked down so the public (anon) key can only do
what it's explicitly allowed.

**Where:** [`supabase/migrations/0001_destinations.sql`](../../supabase/migrations/0001_destinations.sql)
and [`supabase/migrations/0002_affiliate.sql`](../../supabase/migrations/0002_affiliate.sql).

**How it works:** each table runs `alter table ... enable row level security`.
With RLS on, **no row is accessible unless a policy grants it**. The migrations
add _only_ `for select using (true)` policies on catalog tables (public read),
and **no policy at all** on the affiliate event tables — so click/conversion
events are **write-only via privileged server paths** and not publicly readable.
The service role bypasses RLS and is used only on the server.

**Why it matters:** least privilege at the data layer (CC6.1, Confidentiality
C1.1). Even if the anon key leaks, it can't read private event data.

---

## 5. Change management: PR + CI + CODEOWNERS

**What:** code reaches `main` only after review and automated checks.

**Where:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml),
[`.github/CODEOWNERS`](../../.github/CODEOWNERS),
[`.github/pull_request_template.md`](../../.github/pull_request_template.md).

**How it works:** the CI workflow runs on every PR: `install → typecheck → lint
→ test → build → smoke → npm audit`. `CODEOWNERS` (`* @BinduMannil`)
auto-requests the owner's review on every file. The PR template prompts for
scope and validation. The workflow's token is **read-only**
(`permissions: contents: read`) — least privilege for CI (CC6.1).

**The one gap:** _requiring_ the review and passing checks before merge is a
**branch-protection setting** in GitHub, not code. It is the top item in the
[gap analysis](gap-analysis-and-roadmap.md).

---

## 6. Vulnerability detection: CodeQL, npm audit, Dependabot, gitleaks

**What:** automated scanning finds vulnerable code, vulnerable dependencies, and
leaked secrets.

**Where:**
- [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml) — **SAST**
  (static analysis of our own TS/JS), runs on PR, push, and weekly.
- CI `npm audit --audit-level=high` — dependency advisories.
- [`.github/dependabot.yml`](../../.github/dependabot.yml) — automated dependency
  update PRs (npm + GitHub Actions), weekly.
- [`.github/workflows/secret-scan.yml`](../../.github/workflows/secret-scan.yml) —
  **gitleaks** scans full git history for leaked credentials.

**How it works:** each runs independently; findings appear as failed checks or
alerts in the repository's **Security** tab. The weekly schedules mean newly
disclosed issues are caught even when code hasn't changed — that's the
_continuous_ monitoring SOC 2 looks for (CC4.1, CC7.1, CC6.8).

---

## 7. Observability: structured logs, metrics, health

**What:** the app emits machine-readable signals about what it's doing.

**Where:** [`src/lib/observability/logger.ts`](../../src/lib/observability/logger.ts),
[`src/lib/observability/metrics.ts`](../../src/lib/observability/metrics.ts),
`/api/health`, `/api/metrics`.

**How it works:** `logger.ts` emits one JSON object per line (`formatLog` is pure
and unit-tested) — warns/errors to stderr, the rest to stdout. `metrics.ts`
keeps counters (e.g. `provider_failover`, `csp_violation`) surfaced at
`/api/metrics`. `/api/health` reports liveness + which config/flags are on.

**Why it matters:** quality information supporting controls (CC2.1) and anomaly
monitoring (CC7.2). **Privacy note:** logs take a `fields` object — keep
personal data out of it (see the [data-handling policy](policies/data-classification-and-handling-policy.md)).

---

## 8. Resilience: provider failover + feature-flag kill switches

**What:** when a dependency fails, the app degrades instead of crashing.

**Where:** [`src/lib/providers/registry.ts`](../../src/lib/providers/registry.ts),
[`src/lib/config/flags.ts`](../../src/lib/config/flags.ts).

**How it works:** providers register with a priority. The registry tries the
highest-priority available provider and **falls over** to the next on failure,
down to an always-available in-repo **seed** provider. Any capability can be
turned off instantly by removing its flag from `JOURNEE_ENABLED_FEATURES` — a
config change, no deploy.

**Why it matters:** availability and business-disruption mitigation (CC9.1, A
series); the seed provider guarantees the catalog can always answer.

---

## 9. Privacy by minimization

**What:** the app collects as little personal data as possible.

**Where:** [`src/middleware.ts`](../../src/middleware.ts) (the `jid` cookie) and
[`src/app/privacy/page.tsx`](../../src/app/privacy/page.tsx).

**How it works:** middleware sets one first-party cookie, `jid` — a random UUID,
`httpOnly`, `sameSite: lax`, used only for deterministic A/B assignment and
counting free AI plans. It contains no personal information. Saved destinations
live in the browser's `localStorage` and **never leave the device**. The privacy
page describes exactly this, in plain language, and is updated alongside any
change to data handling.

**Why it matters:** Privacy criterion + Confidentiality; the less you collect,
the less you can leak.

---

## Quick reference: control → file

| Control | Primary file(s) |
| --- | --- |
| Config/secret boundary | `src/lib/config/env.ts` |
| Admin auth (deny-by-default) | `src/app/api/admin/status/route.ts` |
| Security headers | `next.config.mjs` |
| CSP (two-tier) | `src/middleware.ts` |
| RLS deny-by-default | `supabase/migrations/0001_*.sql`, `0002_*.sql` |
| Change management | `.github/workflows/ci.yml`, `.github/CODEOWNERS` |
| SAST | `.github/workflows/codeql.yml` |
| Secret scanning | `.github/workflows/secret-scan.yml` |
| Dependency scanning | CI `npm audit`, `.github/dependabot.yml` |
| Logging / metrics | `src/lib/observability/*` |
| Failover / kill switch | `src/lib/providers/registry.ts`, `src/lib/config/flags.ts` |
| Privacy / minimization | `src/middleware.ts`, `src/app/privacy/page.tsx` |
