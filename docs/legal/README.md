# Legal & Policy Documents

> **⚠️ DRAFT — NOT LEGAL ADVICE.** Every document in this folder is an
> engineering-authored **draft** intended as a starting point for qualified
> legal counsel. None of it has been reviewed by a lawyer. Do **not** publish
> any of it as-is. Placeholders in `[SQUARE BRACKETS]` (legal entity name,
> address, governing-law jurisdiction, contact emails, effective dates, DPO/EU
> representative, etc.) **must** be completed and the whole set reviewed for each
> target market before Journee is made publicly available.

These documents are written to match **what the app actually does today** and to
flag, explicitly, the parts that only apply **once planned features go live**
(user accounts, hosted database, live LLM planning, paid plans, user-generated
content). They are kept here as Markdown because the current workstream does not
build UI; when the UI phase begins, these become the source content for the
corresponding pages (see `docs/ui-backlog.md`). Today only `/privacy` exists as a
rendered page.

## Documents

| Doc | Purpose | Launch-criticality |
| --- | --- | --- |
| [terms-of-service.md](./terms-of-service.md) | The contract for using Journee; warranty/liability disclaimers; the overarching "informational only, not professional advice" travel disclaimer | **Blocker** |
| [privacy-policy.md](./privacy-policy.md) | GDPR/UK-GDPR + CCPA/CPRA-oriented privacy policy | **Blocker** |
| [cookie-policy.md](./cookie-policy.md) | Cookies used (today: one `jid` cookie) + consent posture | **Blocker (EU)** |
| [acceptable-use-policy.md](./acceptable-use-policy.md) | What users may not do; prohibited content | Needed before UGC |
| [content-moderation-and-takedown.md](./content-moderation-and-takedown.md) | Reporting, moderation, DMCA + EU DSA notice-and-action | Needed before UGC |
| [accessibility-statement.md](./accessibility-statement.md) | Accessibility commitment + conformance target (EU EAA / WCAG) | Needed before UI launch |
| [billing-and-refunds.md](./billing-and-refunds.md) | Paid AI-plan credits, cancellation, EU withdrawal rights | Needed before payments |
| [sub-processors.md](./sub-processors.md) | Third parties that may process data (Supabase, LLM, affiliate networks) | Needed before live data |
| [data-retention.md](./data-retention.md) | What is kept, for how long, and how it is deleted | Needed before accounts |
| [compliance-readiness.md](./compliance-readiness.md) | Master gap checklist + jurisdiction triggers, for counsel | Reference |

## Cross-cutting placeholders to resolve before launch

- `[LEGAL ENTITY NAME]` and `[REGISTERED ADDRESS]` — the operating company.
- `[GOVERNING LAW JURISDICTION]` and `[DISPUTE VENUE]`.
- `[PRIVACY CONTACT EMAIL]`, `[LEGAL CONTACT EMAIL]`, `[DPO / EU REP]` (if required).
- `[EFFECTIVE DATE]` / `[LAST UPDATED]` on each document.
- Confirm whether the `jid` cookie is "strictly necessary" in the EU (it powers
  A/B experimentation + free-quota counting — likely **not** strictly necessary,
  so a consent banner is probably required). See `cookie-policy.md`.

_Maintenance: when data handling, cookies, sub-processors, or paid features
change, update the relevant document here in the same PR — the same discipline as
`systems.ts`/`roadmap.md` for features._
