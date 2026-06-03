# Journee — Code Audit Report

_Date: 2026-06-03 · Scope: full repository (`src/`, `supabase/`, `test/`, config)_

## In one sentence

The codebase is **healthy and well-built** — all tests pass, types are clean, no
secrets are leaked, and the architecture is disciplined. There is **one real
security gap** (a revenue endpoint anyone can read) and a handful of smaller
hardening items worth fixing.

---

## The numbers

| Check | Result |
| --- | --- |
| Tests | ✅ 260 / 260 pass |
| TypeScript typecheck (strict) | ✅ clean (0 errors) |
| ESLint (`next lint`) | ✅ no warnings or errors |
| Secrets committed to git | ✅ none found; `.env*` properly ignored |
| `npm audit` (prod deps) | ⚠️ 2 moderate (transitive, via Next.js) |
| Source size | 117 TS/TSX files, ~7,700 lines, 47 test files |

---

## What's done well (the good news)

- **Strict by default.** TypeScript runs with `strict`, `noUncheckedIndexedAccess`,
  `noUnusedLocals/Parameters`, `noImplicitOverride`. This catches a whole class
  of bugs at compile time.
- **Every input is validated.** Environment variables and all API request bodies
  go through `zod` schemas before anything trusts them.
- **Secure-by-default admin.** `/api/admin/*` endpoints are *off* (503) unless an
  admin token is configured, and then require a matching header.
- **Database is locked down.** Row-Level Security is deny-by-default; only public
  catalog tables allow read, and the click/conversion event tables have **no**
  public read policy at all.
- **Safe affiliate links.** The URL renderer encodes values and rejects anything
  that isn't `http(s)` — so a bad template can't produce a `javascript:` link.
- **Good security headers.** HSTS, `X-Frame-Options: DENY`, `nosniff`,
  `Permissions-Policy`, plus a thoughtfully staged two-tier CSP (enforced
  structural rules + report-only for script/style).
- **Server secrets stay server-side.** The privileged service-role key is read
  only through server-only helpers and never wired into client code.
- **Honest documentation.** The README clearly separates what's built from what's
  roadmap, rather than overclaiming.

---

## Findings (what to fix), worst first

### 🔴 1. The affiliate analytics endpoint has no password on it
**File:** `src/app/api/affiliate/analytics/route.ts`

This endpoint reports your **revenue and conversion numbers**. It reads them
using the privileged service-role database client, which *bypasses* the
Row-Level Security that otherwise hides those tables. But unlike the
`/api/admin/*` endpoints, it has **no token check** — anyone on the internet who
knows the URL can pull your campaign-by-campaign revenue.

**Fix:** Gate it behind the same `JOURNEE_ADMIN_TOKEN` check the admin routes
already use (a few lines, copy the pattern from `admin/status/route.ts`).

### 🟠 2. Anyone can submit fake clicks and conversions
**Files:** `src/app/api/affiliate/click/route.ts`, `.../conversion/route.ts`

These write endpoints are public and unauthenticated by design (they're meant to
be called from the browser as tracking beacons). But there's no rate limiting or
integrity check, so someone could flood them with fake events and pollute your
analytics — or inflate "conversions." Worth a shared secret, a signature, or at
least rate limiting before this data is trusted for real business decisions.

### 🟠 3. No rate limiting anywhere
The only abuse control in the codebase is the per-IP free-plan ceiling on AI
planning. The public POST endpoints (`csp-report`, `affiliate/click`,
`affiliate/conversion`) and `/api/metrics` can be hit as fast as a script can
send requests. Add basic rate limiting at the edge/proxy or in middleware.

### 🟡 4. Admin token comparison isn't constant-time
**File:** `src/app/api/admin/status/route.ts` (and `admin/readiness`)

The check is `header !== token`. A normal string compare can, in theory, leak
the token one character at a time via timing. Use a constant-time comparison
(`crypto.timingSafeEqual`). Low real-world risk, easy fix.

### 🟡 5. `/api/metrics` is open
**File:** `src/app/api/metrics/route.ts`

It returns counters only (no secrets), but it still leaks operational signal
(traffic volume, CSP-violation counts). Consider gating it behind the admin
token like the other introspection endpoints.

### 🟡 6. Client IP is spoofable
**File:** `src/lib/billing/identity.ts`

It trusts the first `x-forwarded-for` value. The code already documents this and
only uses it as an "abuse ceiling," which is fine — just don't ever promote it to
real identity without accounts behind it.

### 🔵 7. Two moderate dependency vulnerabilities
`npm audit` flags `postcss <8.5.10` (an XSS in CSS stringify output), pulled in
transitively through Next.js. It's a build-time tool, so real-world impact is
low, but the clean fix is a Next.js upgrade. Track it; don't run
`npm audit fix --force` blindly (it wants to downgrade Next to v9).

### 🔵 8. `next lint` is deprecated
Next.js 16 will remove `next lint`. Plan to migrate to the ESLint CLI
(`npx @next/codemod next-lint-to-eslint-cli .`) so linting keeps working after
the next major upgrade.

---

## Suggested order of work

1. Add the admin-token check to `affiliate/analytics` (fixes #1) — highest value,
   lowest effort.
2. Decide on a rate-limiting strategy and apply it to public endpoints (#2, #3).
3. Switch the admin comparison to constant-time and gate `/api/metrics` (#4, #5).
4. Schedule the Next.js upgrade to clear the dependency advisory and the lint
   deprecation (#7, #8).

Nothing here blocks the app from running; items 1–3 are the ones that matter
before real traffic or real money flows through it.
