import { z } from "zod";

/**
 * Affiliate event ingestion helpers (pure).
 *
 * Validation + row construction live here, separate from the HTTP route, so
 * they're unit-testable without a server runtime or a database. The route is a
 * thin shell around these. Server-only write path — see ADR-005.
 */
export const clickEventSchema = z.object({
  linkId: z.string().min(1),
  campaignId: z.string().min(1),
  /** ISO 3166-1 alpha-2 country code. */
  region: z.string().length(2).optional(),
});

export type ClickEventInput = z.infer<typeof clickEventSchema>;

export interface ClickEventRow {
  readonly id: string;
  readonly link_id: string;
  readonly campaign_id: string;
  readonly region: string | null;
  readonly occurred_at: string;
}

export function buildClickRow(
  input: ClickEventInput,
  now: Date = new Date(),
): ClickEventRow {
  return {
    id: crypto.randomUUID(),
    link_id: input.linkId,
    campaign_id: input.campaignId,
    region: input.region ?? null,
    occurred_at: now.toISOString(),
  };
}

export const conversionEventSchema = z.object({
  campaignId: z.string().min(1),
  clickId: z.string().min(1).optional(),
  /** Money in minor units (e.g. cents) to stay currency/provider agnostic. */
  amountMinor: z.number().int().nonnegative().optional(),
  /** ISO 4217 currency code. */
  currency: z.string().length(3).optional(),
});

export type ConversionEventInput = z.infer<typeof conversionEventSchema>;

export interface ConversionEventRow {
  readonly id: string;
  readonly click_id: string | null;
  readonly campaign_id: string;
  readonly amount_minor: number | null;
  readonly currency: string | null;
  readonly occurred_at: string;
}

export function buildConversionRow(
  input: ConversionEventInput,
  now: Date = new Date(),
): ConversionEventRow {
  return {
    id: crypto.randomUUID(),
    click_id: input.clickId ?? null,
    campaign_id: input.campaignId,
    amount_minor: input.amountMinor ?? null,
    currency: input.currency ?? null,
    occurred_at: now.toISOString(),
  };
}
