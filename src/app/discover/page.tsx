import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { discoverCopy } from "@/content/pages";
import { commonCopy } from "@/content/common";
import { DiscoverClient } from "@/components/DiscoverClient";
import { ButtonLink, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: discoverCopy.title,
  description: discoverCopy.description,
  alternates: { canonical: "/discover" },
};

export default async function DiscoverPage() {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;

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
      <SectionHeading
        title={discoverCopy.title}
        description={discoverCopy.description}
        as="h1"
        className="mb-12"
      />
      <DiscoverClient destinations={destinations} />
    </main>
  );
}
