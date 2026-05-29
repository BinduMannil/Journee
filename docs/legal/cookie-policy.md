# Cookie Policy — DRAFT

> **⚠️ DRAFT — NOT LEGAL ADVICE.** Engineering-authored starting point for
> counsel. _Last updated: [EFFECTIVE DATE]._

## What cookies we use

Journee currently uses a **single first-party cookie** and **no third-party
cookies, advertising, or analytics trackers**.

| Cookie | Type | Purpose | Properties | Duration |
| --- | --- | --- | --- | --- |
| `jid` | First-party | Keeps experiences consistent within your visit (e.g. which variant of an A/B-tested link you see) and counts your free AI trip plans | HTTP-only; random anonymous value; no personal data; not sold/shared | `[DURATION — confirm in code]` |

We also use your browser's **local storage** (not a cookie) to keep your saved
destinations on your device; this never leaves your device.

## Consent posture — **open question for counsel**

Under the EU ePrivacy Directive / national implementations, only **strictly
necessary** cookies are exempt from prior consent. The `jid` cookie serves two
roles:

1. **Free-quota counting / abuse prevention** — arguably closer to strictly
   necessary to deliver a service the user requested.
2. **A/B experimentation (which link variant you see)** — experimentation/
   optimisation cookies are **generally not** considered strictly necessary.

**Therefore a consent mechanism (cookie banner) is likely required in the EU/UK
before launch**, _or_ the experimentation use must be separated from the
strictly-necessary use so that experimentation only runs after consent. This must
be confirmed by counsel and, if needed, implemented in the UI phase (a consent
banner + a way to decline non-essential cookies). See `docs/ui-backlog.md`.

## Managing cookies

You can block or delete cookies via your browser settings; doing so may affect
how consistently the Service behaves. Clearing browser storage also removes your
saved destinations.

## Changes

If we introduce additional cookies (e.g. for accounts, payments, or analytics),
we will update this policy and the consent mechanism accordingly.

_Related: [Privacy Policy](./privacy-policy.md)._
