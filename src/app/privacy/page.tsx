import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/config/site";
import { commonCopy } from "@/content/common";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles data — honestly, and minimally.`,
  alternates: { canonical: "/privacy" },
};

/** Honest, plain-language privacy page reflecting what the app actually does
 * today (an anonymous A/B cookie + device-local saves; no accounts, no
 * third-party trackers). Updated alongside any change to data handling. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        {commonCopy.backToHome}
      </ButtonLink>
      <h1 className="mb-3 font-display text-4xl font-semibold text-sand sm:text-5xl">
        Privacy
      </h1>
      <p className="mb-10 max-w-2xl text-sand/70">
        {site.name} is an early-stage project that collects as little as possible.
        This page describes exactly what the app does today — no more, no less.
      </p>

      <section className="space-y-8 text-sand/80">
        <div>
          <h2 className="mb-2 font-display text-2xl text-gold-bright">
            The <code className="text-gold">jid</code> cookie
          </h2>
          <p>
            We set one first-party cookie, <code className="text-gold">jid</code>:
            a random, anonymous identifier used to keep experiences (such as which
            variant of a link you see) consistent across your visit and to count
            your free AI trip plans. It is HTTP-only, contains no personal
            information, is not linked to your identity, and is never sold or
            shared with third parties.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-2xl text-gold-bright">
            Saved destinations
          </h2>
          <p>
            Your saved collection is stored in your browser&rsquo;s local storage
            on this device. It never leaves your device and is not sent to any
            server. Clearing your browser storage removes it.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-2xl text-gold-bright">
            What we don&rsquo;t do
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>No accounts, names, emails, or passwords (there is no sign-in yet).</li>
            <li>No third-party advertising or analytics trackers.</li>
            <li>No selling or sharing of personal data.</li>
          </ul>
          <p className="mt-3">
            Operational metrics are anonymous, aggregate counters (e.g. how often
            a feature is used) with no personal data.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-2xl text-gold-bright">
            Affiliate links
          </h2>
          <p>
            Some outbound links may be affiliate links. When present, following one
            records an anonymous click event (the link and campaign, not who you
            are) so we can understand which recommendations are useful.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-2xl text-gold-bright">Contact</h2>
          <p>
            Security or privacy concerns can be reported via{" "}
            <Link href="/.well-known/security.txt" className="text-gold-bright hover:text-gold">
              our security contact
            </Link>
            . As the product grows (accounts, live data), this page will be updated
            in step.
          </p>
        </div>
      </section>
    </main>
  );
}
