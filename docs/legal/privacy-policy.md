# Privacy Policy — DRAFT

> **⚠️ DRAFT — NOT LEGAL ADVICE.** Engineering-authored starting point for
> counsel. Complete all `[PLACEHOLDERS]`, confirm legal bases and transfer
> mechanisms, and obtain legal review for every target market before publishing.
> _Last updated: [EFFECTIVE DATE]._
>
> This expands the honest, plain-language `/privacy` page into a formal policy
> oriented to the EU/UK GDPR and California CCPA/CPRA. **Sections marked _(planned)_
> describe data handling that only applies once accounts, hosted data, live LLM
> planning, or payments are enabled — they must not be presented as active until
> those features ship.**

## 1. Who we are (Controller)

`[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]` is the data controller for personal
data processed through Journee. Contact: `[PRIVACY CONTACT EMAIL]`. `[If required:
EU/UK representative under Art. 27 GDPR — NAME/ADDRESS; Data Protection Officer —
CONTACT.]`

## 2. What we collect

### Today (live)

- **`jid` cookie** — a random, anonymous, first-party, HTTP-only identifier used
  to keep experiences consistent within your visit (e.g. which variant of a link
  you see) and to count free AI trip plans. It contains no personal information
  and is not linked to your identity. See the [Cookie Policy](./cookie-policy.md).
- **Approximate technical data** — standard server logs and an anonymous client
  IP-derived signal used to enforce free-tier limits and protect the Service from
  abuse. We do not build advertising profiles.
- **Aggregate, anonymous operational metrics** — counters (e.g. how often a
  feature is used) with no personal data.
- **Device-local saved destinations** — stored in your browser's local storage on
  your device; **never transmitted to us**.

We do **not** currently collect names, emails, passwords, or payment details,
and we do **not** use third-party advertising or analytics trackers.

### Planned (only when the relevant feature is enabled)

- **Account data** _(planned)_ — e.g. email and authentication identifiers when
  sign-in launches.
- **User-generated content** _(planned)_ — posts/blogs/vlogs/reviews/ratings and
  related metadata you choose to publish.
- **AI-planning inputs** _(planned)_ — trip parameters you submit are sent to our
  LLM provider to generate a plan; see [Sub-processors](./sub-processors.md).
- **Payment data** _(planned)_ — handled by a third-party payment processor; we do
  not store full card details.

## 3. Why we use it and our legal bases (GDPR)

| Purpose | Data | Legal basis (GDPR Art. 6) |
| --- | --- | --- |
| Keep the Service working and consistent within a visit | `jid` cookie | Legitimate interests / strictly-necessary `[confirm — see cookie policy]` |
| Enforce free-tier limits, prevent abuse/fraud | `jid`, approximate IP signal | Legitimate interests |
| Understand aggregate feature usage | anonymous counters | Legitimate interests (no personal data) |
| Provide accounts and UGC _(planned)_ | account/UGC data | Performance of a contract |
| Generate AI trip plans _(planned)_ | trip inputs | Performance of a contract |
| Process payments _(planned)_ | payment metadata | Performance of a contract / legal obligation |
| Optional analytics/experimentation cookies in the EU | cookie data | **Consent** `[confirm]` |

## 4. Sharing

We do not sell personal data. We share data only with service providers
("processors"/"sub-processors") that help us run the Service, under contract and
only as needed — see [Sub-processors](./sub-processors.md). We may disclose data
where required by law or to protect rights and safety. Following an affiliate link
records an anonymous click event (the link/campaign, not who you are).

## 5. International transfers

Where data is transferred outside your region (e.g. EEA/UK), we rely on an
appropriate safeguard such as Standard Contractual Clauses or an adequacy
decision. `[Confirm mechanism per sub-processor before launch.]`

## 6. Retention

We keep personal data only as long as necessary for the purposes above; see the
[Data Retention policy](./data-retention.md). The `jid` cookie expires after
`[DURATION]`. Device-local saves persist until you clear your browser storage.

## 7. Your rights

Subject to your jurisdiction, you may have the right to access, correct, delete,
restrict, or object to processing of your personal data; to data portability; and
to withdraw consent. **EU/UK (GDPR):** you also have the right to lodge a complaint
with your supervisory authority. **California (CCPA/CPRA):** you have rights to
know, delete, correct, and opt out of "sale"/"sharing" (we do not sell or share as
defined), and not to be discriminated against for exercising them. To exercise any
right, contact `[PRIVACY CONTACT EMAIL]`. We will verify requests as required by
law. Note: because the `jid` cookie is anonymous and device-local saves never
reach us, we often hold no data tied to your identity to act on.

## 8. Children

The Service is not directed to children and we do not knowingly collect their
personal data. See the age requirement in the [Terms of Service](./terms-of-service.md).

## 9. Security

We apply technical and organisational measures appropriate to the data
(secure-by-default endpoints, HTTP-only cookies, security headers/CSP, no secrets
in code). No method is perfectly secure. Report concerns via
`[PRIVACY CONTACT EMAIL]` or our security contact (`/.well-known/security.txt`).

## 10. Changes

We will update this policy as the product evolves (accounts, live data, payments)
and revise the "Last updated" date. Material changes will be notified appropriately.

## 11. Contact

`[LEGAL ENTITY NAME]`, `[REGISTERED ADDRESS]` — `[PRIVACY CONTACT EMAIL]`.
