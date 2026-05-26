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
