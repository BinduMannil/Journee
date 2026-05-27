import type { Pacing } from "@/lib/intelligence/itinerary";

/**
 * AI planning provider contract.
 *
 * Like the weather contract, this is a small capability-specific seam (not the
 * generic registry) so a concrete LLM adapter is a drop-in. Any provider
 * (Anthropic, etc.) implements this exact shape; `isAvailable()` gates it on a
 * configured key + the `ai-planning` flag so the app stays inert until enabled,
 * and callers fall back to the deterministic itinerary engine when it returns
 * null. See docs/runbooks/hosted-enablement.md.
 */
export interface PlanningRequest {
  readonly destinations: readonly { id: string; name: string; mood: string }[];
  readonly pacing: Pacing;
  /** Optional free-form traveler intent ("photography-focused, slow mornings"). */
  readonly notes?: string;
}

export interface PlannedDay {
  readonly title: string;
  readonly detail: string;
}

export interface PlanningResult {
  readonly summary: string;
  readonly days: readonly PlannedDay[];
  readonly providerId: string;
  readonly model: string;
}

export interface PlanningProvider {
  readonly id: string;
  isAvailable(): boolean | Promise<boolean>;
  generate(request: PlanningRequest): Promise<PlanningResult>;
}
