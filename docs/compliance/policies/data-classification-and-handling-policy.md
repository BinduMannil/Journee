# Data Classification & Handling Policy

_Owner: Repository Owner / Security Lead. Last updated: 2026-06-10. Review:
annually + on any change to what data is collected._

Defines the kinds of data Journee handles and the rules for each. Implements
Confidentiality (C1.1–C1.2), Privacy (P series), and parts of CC6 (CC6.1, 6.7).
The user-facing summary is the [privacy page](../../../src/app/privacy/page.tsx).

## 1. Data classification levels

| Level | Meaning | Examples in Journee | Handling |
| --- | --- | --- | --- |
| **Public** | Safe to disclose to anyone. | Destination catalog, editorial content, public affiliate links, docs | No restriction; public-read RLS where DB-backed |
| **Internal** | Operational, not secret, not for public APIs. | Metrics counters, structured logs, admin status snapshot | Behind admin token; not indexed (`robots.txt` disallows `/api/`) |
| **Confidential** | Would cause harm if exposed. | Affiliate **event** data (clicks/conversions), revenue analytics | RLS: **no public SELECT**; write-only via server; service-role only |
| **Secret** | Credentials. Exposure = breach. | `SUPABASE_SERVICE_ROLE_KEY`, `JOURNEE_ADMIN_TOKEN`, `LLM_API_KEY` | **Never in git**; env-only; server-only; rotated |
| **Personal data** | Relates to an identifiable person. | The `jid` cookie (anonymous), device-local saves | Minimized; see §3 |

## 2. Handling rules by level

- **Secret:** lives only in environment configuration, read through
  `src/lib/config/env.ts`. Excluded from git by `.gitignore`. Scanned for by
  gitleaks. Server-only helpers (`getSupabaseServiceConfig`, `getAdminToken`,
  `getLlmConfig`) must never be imported into client code. Rotate on
  offboarding/suspicion ([Access Control](access-control-policy.md) §7).
- **Confidential:** protected at the data layer by RLS deny-by-default. Affiliate
  event tables have **no SELECT policy** — not publicly readable; writes happen
  only through privileged server paths
  ([`supabase/migrations/0002_affiliate.sql`](../../../supabase/migrations/0002_affiliate.sql)).
- **Internal:** the admin control plane is secure-by-default (disabled until a
  token is set; 401 on mismatch). `robots.txt` disallows crawling `/api/`.
- **Public:** served freely; public-read RLS policies where DB-backed.

## 3. Personal data & privacy (minimization first)

Journee is built to collect **as little personal data as possible**:

- **The `jid` cookie** — a random UUID set in `src/middleware.ts`. It is
  `httpOnly`, `sameSite: lax`, contains **no personal information**, is not
  linked to any identity, and is used only for deterministic A/B assignment and
  counting free AI plans. It is never sold or shared.
- **Saved destinations** — stored in the browser's `localStorage`. They **never
  leave the device** and are never sent to a server. Clearing browser storage
  removes them.
- **No accounts, no third-party trackers, no advertising pixels** today.

The [privacy page](../../../src/app/privacy/page.tsx) states exactly this in
plain language and is updated in the **same PR** as any change to data handling
(this co-evolution is itself the Privacy "notice" control).

### Logging hygiene (don't turn logs into personal data)

The structured logger accepts a `fields` object. **Do not put personal data,
secrets, or full request bodies in log fields.** Log identifiers and outcomes
(e.g. `providerId`, `capability`, status), not contents. See
[Logging & Monitoring](logging-monitoring-and-alerting-policy.md).

## 4. Data in transit & at rest (CC6.7)

- **In transit:** HSTS (`next.config.mjs`) forces HTTPS for two years incl.
  subdomains; cookies are `sameSite`/`httpOnly`.
- **At rest:** Supabase/Postgres encrypts data at rest (vendor control — record
  attestation per [Vendor Management](vendor-management-policy.md)). Capturing
  the at-rest/in-transit attestation once hosted is gap **P1-9**.

## 5. Retention & disposal (C1.2)

- **Today:** the app stores essentially no server-side personal/confidential data
  (saves are device-local; events are not yet wired to a hosted DB).
- **When hosted data exists:** define retention windows per table and a disposal
  routine (e.g. periodic purge of raw event rows after aggregation). Enforcing
  retention/disposal is gap **P2-15** — documented now, enforced when there is
  data to retain.

## 6. Data-subject requests (roadmap)

With no accounts and only anonymous, device-local data, there is little personal
data to act on today. A formal access/deletion (DSAR) process is gap **P2-16**,
to be built alongside user accounts.

## 7. Evidence

RLS migrations, the env boundary, the privacy page, and `.gitignore` are the
configuration evidence; see the
[Evidence Collection Guide](../evidence-collection-guide.md).
