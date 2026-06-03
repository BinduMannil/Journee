import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { savedCopy } from "@/content/pages";
import { commonCopy } from "@/content/common";
import { SavedList } from "@/components/SavedList";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Saved",
  description: "Your saved destinations.",
  alternates: { canonical: "/saved" },
};

export default async function SavedPage() {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;

  return (
    <main className="mx-auto max-w-4xl px-6 py-20 sm:px-12">
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        {commonCopy.backToHome}
      </ButtonLink>
      <h1 className="mb-10 font-display text-4xl font-semibold text-sand sm:text-5xl">
        {savedCopy.title}
      </h1>
      <SavedList destinations={destinations} />
    </main>
  );
}
