import Link from "next/link";
import type { Metadata } from "next";
import { PackingPlanner } from "@/components/PackingPlanner";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { getFxRates } from "@/lib/providers/fx";

export const metadata: Metadata = {
  title: "Travel tools",
  description: "Packing planner and currency converter for your trip.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage() {
  const fxRates = await getFxRates("USD");

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
      >
        &larr; Home
      </Link>
      <h1 className="mb-3 font-display text-4xl font-semibold text-sand sm:text-5xl">
        Travel tools
      </h1>
      <p className="mb-16 max-w-2xl text-sand/70">
        Practical helpers for getting ready. Pair them with your{" "}
        <Link href="/plan" className="text-gold-bright hover:text-gold">
          trip plan
        </Link>
        .
      </p>

      <section>
        <h2 className="mb-3 font-display text-3xl font-semibold text-sand">Pack smart</h2>
        <p className="mb-10 max-w-2xl text-sand/70">
          Tell us the climate you expect and what you&rsquo;ll be doing; we&rsquo;ll
          build a checklist. (When live weather lands, this pre-fills from your
          destinations and dates.)
        </p>
        <PackingPlanner />
      </section>

      <section className="mt-24 border-t border-sand/10 pt-16">
        <h2 className="mb-3 font-display text-3xl font-semibold text-sand">Currency</h2>
        <p className="mb-10 max-w-2xl text-sand/70">
          Quick conversions for budgeting. Rates are indicative reference values,
          not live quotes.
        </p>
        <CurrencyConverter rates={fxRates} />
      </section>
    </main>
  );
}
