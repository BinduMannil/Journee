# Sub-processors — DRAFT

> **⚠️ DRAFT — NOT LEGAL ADVICE.** Engineering-authored starting point for
> counsel. Keep this list accurate and current; update it in the same PR whenever
> a processor is added, changed, or removed. _Last updated: [EFFECTIVE DATE]._

This page lists the third-party service providers ("sub-processors") that may
process data on Journee's behalf. **Today, in this environment, none of the
data-processing integrations below are live** — they are built but inert/blocked
(no hosted database, no live LLM, no payment processor). This list must be made
accurate and complete before any of them is enabled in production.

| Sub-processor | Purpose | Data categories | Region / transfer mechanism | Status |
| --- | --- | --- | --- | --- |
| `[HOSTING / CDN PROVIDER]` | Application hosting, edge delivery | Request logs, IP | `[REGION / SCC]` | `[live?]` |
| Supabase _(planned)_ | Database & auth for destinations, accounts, UGC | Account, UGC, content data | `[REGION / SCC]` | Built, **inert** (hosted access blocked) |
| `[LLM PROVIDER]` _(planned)_ | AI trip-plan generation | Trip inputs you submit | `[REGION / SCC]` | Built, **inert** (no key/egress) |
| `[PAYMENT PROCESSOR]` _(planned)_ | Payments for credits | Payment metadata | `[REGION / SCC]` | Not built |
| `[WEATHER PROVIDER — e.g. Open-Meteo]` _(planned)_ | Live weather signal | Coarse location/query | `[REGION]` | Built, **inert** (egress blocked) |
| Affiliate networks | Outbound affiliate link attribution | Anonymous click/campaign event | `[REGION]` | `[live?]` |

## Notes

- We engage sub-processors under contracts with appropriate data-protection terms
  and only for the purposes described in the [Privacy Policy](./privacy-policy.md).
- For transfers outside the EEA/UK we rely on an appropriate safeguard (e.g.
  Standard Contractual Clauses or an adequacy decision) — confirm per provider.
- Material changes to this list will be notified to customers where required.
