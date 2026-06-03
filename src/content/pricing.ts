/**
 * Monetization config (data-driven, per ADR-004 — no hardcoded prices in code).
 *
 * Costly actions (today: AI trip planning) are metered. New visitors get a small
 * free quota; beyond that they spend credits from a purchased package. Prices
 * here are PLACEHOLDERS — set real values (and confirm currency) before launch.
 * A CMS/billing-config provider can later supply these without code changes.
 */
export interface CreditPackage {
  readonly id: string;
  readonly name: string;
  /** AI plans (metered units) granted by this package. */
  readonly credits: number;
  /** Price in minor units (e.g. cents) to stay currency-agnostic. */
  readonly priceMinor: number;
  /** ISO 4217 currency code. */
  readonly currency: string;
}

/** Free metered actions a new (anonymous) visitor gets before needing credits. */
export const FREE_AI_PLANS = 3;

/**
 * Abuse ceiling: total free plans allowed per client IP, regardless of how many
 * cookies/"accounts" are cycled. Set higher than the per-visitor quota since one
 * IP (corporate/mobile NAT) legitimately fronts many visitors. Paid usage is
 * exempt. NOTE: a robust limit needs a *windowed, durable* store (see
 * docs/runbooks/hosted-enablement.md) — the in-memory default is per-instance.
 */
export const FREE_AI_PLANS_PER_IP = 15;

export const creditPackages: readonly CreditPackage[] = [
  { id: "starter", name: "Starter", credits: 10, priceMinor: 500, currency: "USD" },
  { id: "explorer", name: "Explorer", credits: 30, priceMinor: 1200, currency: "USD" },
  { id: "voyager", name: "Voyager", credits: 100, priceMinor: 3500, currency: "USD" },
];

export function findPackage(id: string): CreditPackage | undefined {
  return creditPackages.find((p) => p.id === id);
}

/** What one credit buys, surfaced as the unit label on the pricing page. */
export const creditUnitLabel = "AI trip plans";

/** Editorial + structural copy for the /pricing page (no literals in JSX). */
export interface PricingCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly freeTierName: string;
  readonly freeTierCtaLabel: string;
  readonly freeTierCtaHref: string;
  readonly packagesHeading: string;
  /** Suffix after the credit count on each pack, e.g. "AI trip plans". */
  readonly packageCreditsSuffix: string;
  /** Pack CTA label. Honest: checkout is not built yet. */
  readonly packageCtaLabel: string;
  readonly footnote: string;
}

export const pricingCopy: PricingCopy = {
  eyebrow: "Pricing",
  title: "Plan freely. Pay only when you plan with AI.",
  description:
    "Every visitor gets a handful of AI-generated trip plans free. Beyond "
    + "that, top up with credits — no subscription, and no account required to "
    + "start.",
  freeTierName: "Free to start",
  freeTierCtaLabel: "Start planning",
  freeTierCtaHref: "/plan",
  packagesHeading: "Credit packs",
  packageCreditsSuffix: creditUnitLabel,
  packageCtaLabel: "Available at launch",
  footnote: "Prices are illustrative while billing is being finalized.",
};

/** Free-quota sentence, parameterized by the configured free allowance. */
export function freeQuotaNote(freePlans: number): string {
  return `${freePlans} free ${creditUnitLabel} for every new visitor — no card, no account.`;
}
