# Data Retention & Deletion — DRAFT

> **⚠️ DRAFT — NOT LEGAL ADVICE.** Engineering-authored starting point for
> counsel. Finalise durations with legal/operational input before launch. _Last
> updated: [EFFECTIVE DATE]._

We keep personal data only for as long as necessary for the purposes set out in
the [Privacy Policy](./privacy-policy.md), then delete or anonymise it.

| Data | Where | Retention | Deletion |
| --- | --- | --- | --- |
| `jid` cookie | Your browser | Expires after `[DURATION]` | Cleared on expiry or when you clear cookies |
| Saved destinations | Your browser's local storage | Until you clear it | Device-local; never reaches us |
| Server request logs | Hosting/CDN | `[e.g. 30–90 days]` | Rotated/auto-deleted |
| Aggregate metrics | Our systems | Indefinite (no personal data) | n/a (anonymous counters) |
| Free-quota / abuse signals | Our systems | `[short, e.g. rolling window]` | Auto-expired |
| Account data _(planned)_ | Supabase | For the life of the account + `[grace period]` | On account deletion request |
| User-generated content _(planned)_ | Supabase | While published + `[period]` | On deletion by user or moderation |
| AI-planning inputs _(planned)_ | Transient → LLM provider | `[minimised; confirm provider retention]` | Per provider terms |
| Payment records _(planned)_ | Payment processor | As required by tax/accounting law | Per legal obligation |

## Deletion requests

To request deletion of any personal data we hold about you, contact
`[PRIVACY CONTACT EMAIL]`. Because the `jid` cookie is anonymous and saved
destinations never leave your device, we frequently hold no identifiable data to
delete. We may retain limited data where required by law (e.g. tax records) or to
resolve disputes and enforce agreements.
