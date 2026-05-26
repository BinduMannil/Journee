import Link from "next/link";
import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { SavedList } from "@/components/SavedList";

export const metadata: Metadata = {
  title: "Saved",
  description: "Your saved destinations.",
};

export default async function SavedPage() {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;

  return (
    <main className="mx-auto max-w-4xl px-6 py-20 sm:px-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
      >
        &larr; Home
      </Link>
      <h1 className="mb-10 font-display text-4xl font-semibold text-sand sm:text-5xl">
        Saved collection
      </h1>
      <SavedList destinations={destinations} />
    </main>
  );
}
