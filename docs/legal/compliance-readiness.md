# Compliance Readiness Checklist — DRAFT

> **⚠️ DRAFT — NOT LEGAL ADVICE.** A gap checklist to hand to counsel, mapping
> each required policy/control to its status and what triggers it. _Last updated:
> [EFFECTIVE DATE]._

## Document status

| Policy / control | Status | Trigger to finalise |
| --- | --- | --- |
| Privacy page (`/privacy`) | ✅ Live (honest, minimal) | Superseded by full policy below at launch |
| Security disclosure (`SECURITY.md`, `security.txt`) | ✅ Live | — |
| Terms of Service | 📝 Draft | **Before public launch** |
| Privacy Policy (GDPR/CCPA) | 📝 Draft | **Before public launch** |
| Cookie Policy + consent banner | 📝 Draft (banner not built) | **Before EU launch** |
| Acceptable Use Policy | 📝 Draft | Before accounts/UGC |
| Content Moderation & Takedown (DSA/DMCA) | 📝 Draft (tooling not built) | Before UGC |
| Accessibility Statement | 📝 Draft (audit pending) | Before UI launch |
| Billing & Refunds | 📝 Draft | Before payments |
| Sub-processors list | 📝 Draft | Before live data |
| Data Retention | 📝 Draft | Before accounts |
| DPA (for any B2B/partners) | ❌ Not started | If/when B2B |
| Cookie-consent UI | ❌ Not built (no UI this phase) | Before EU launch |
| Age-gate / children's-data handling | ❌ Not built | Before accounts |

## Jurisdiction triggers (non-exhaustive)

- **EU/EEA & UK — GDPR/UK-GDPR + ePrivacy:** lawful basis, transparency, data-subject
  rights, cookie consent for non-essential cookies, international-transfer
  safeguards, possible Art. 27 representative.
- **EU — Digital Services Act:** notice-and-action, statements of reasons,
  complaint handling, point of contact (scales with size/role).
- **EU — European Accessibility Act (2025):** accessibility of consumer digital
  services.
- **EU — Consumer Rights Directive:** 14-day withdrawal for digital purchases,
  clear pre-contract info.
- **US — California CCPA/CPRA** (and other US state laws): notice, rights, opt-out
  of sale/sharing; **COPPA** for under-13 data; **FTC** affiliate-disclosure
  guidance.
- **Global:** clear "informational only, not professional advice" travel
  disclaimer; export/sanctions considerations for destination coverage.

## Engineering controls already supporting compliance

- Secure-by-default admin/API endpoints (503 until configured); HTTP-only `jid`
  cookie; enforced security headers + Report-Only CSP; no third-party trackers;
  no secrets in code; anonymous aggregate metrics only; device-local saves.
- Rating system designed to resist fake-review manipulation (confidence-weighted).
- Honest per-feature `*_DATA_NOTE` disclaimers on all seed/estimated data.

## Recommended order before global launch

1. Counsel review + finalise **ToS + Privacy + Cookie** (the blockers).
2. Build the **cookie-consent UI** and (if needed) gate experimentation cookies on
   consent.
3. Before enabling UGC: finalise **AUP + Moderation/DSA/DMCA** and the reporting/
   moderation tooling.
4. Before payments: finalise **Billing & Refunds** + processor DPA.
5. Before/at UI launch: complete an **accessibility audit** and finalise the
   statement.
6. Keep **Sub-processors + Data Retention** accurate as integrations go live.
