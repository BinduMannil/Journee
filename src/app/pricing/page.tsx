import type { Metadata } from "next";
import { ButtonLink, Card, SectionHeading, Tag } from "@/components/ui";
import { commonCopy } from "@/content/common";
import {
  creditPackages,
  FREE_AI_PLANS,
  freeQuotaNote,
  pricingCopy,
} from "@/content/pricing";
import { formatPriceMinor } from "@/lib/billing/format";

export const metadata: Metadata = {
  title: pricingCopy.eyebrow,
  description: pricingCopy.description,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-12">
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        {commonCopy.backToHome}
      </ButtonLink>

      <SectionHeading
        eyebrow={pricingCopy.eyebrow}
        title={pricingCopy.title}
        description={pricingCopy.description}
        as="h1"
        className="mb-14"
      />

      {/* Free tier — the only currently actionable path (links to the planner). */}
      <Card className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Tag variant="gold">{pricingCopy.freeTierName}</Tag>
          <p className="mt-3 text-lg text-sand/80">
            {freeQuotaNote(FREE_AI_PLANS)}
          </p>
        </div>
        <ButtonLink href={pricingCopy.freeTierCtaHref} variant="solid">
          {pricingCopy.freeTierCtaLabel}
        </ButtonLink>
      </Card>

      <h2 className="mb-6 font-display text-2xl text-sand">
        {pricingCopy.packagesHeading}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {creditPackages.map((pack) => (
          <Card key={pack.id} className="flex flex-col gap-4">
            <h3 className="font-display text-2xl text-sand">{pack.name}</h3>
            <p className="text-3xl font-semibold text-gold-bright">
              {formatPriceMinor(pack.priceMinor, pack.currency)}
            </p>
            <p className="text-sand/70">
              {pack.credits} {pricingCopy.packageCreditsSuffix}
            </p>
            <div className="mt-auto pt-2">
              <Tag variant="muted">{pricingCopy.packageCtaLabel}</Tag>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-sm text-stone">{pricingCopy.footnote}</p>
    </main>
  );
}
