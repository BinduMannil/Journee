import type { PlanningProvider } from "./types";
import { anthropicPlanningProvider } from "./anthropic";

/**
 * AI planning provider selection.
 *
 * Returns the first available provider, or null when AI planning is not enabled
 * (no key and/or the `ai-planning` flag off) — callers then fall back to the
 * deterministic itinerary engine. To add another vendor, implement the
 * `PlanningProvider` contract and add it to this list in priority order.
 */
const providers: readonly PlanningProvider[] = [anthropicPlanningProvider];

export async function getPlanningProvider(): Promise<PlanningProvider | null> {
  for (const p of providers) {
    if (await p.isAvailable()) return p;
  }
  return null;
}

/** Whether any AI planning provider is currently enabled (for status surfaces). */
export async function isAiPlanningEnabled(): Promise<boolean> {
  return (await getPlanningProvider()) !== null;
}

export type {
  PlanningProvider,
  PlanningRequest,
  PlanningResult,
  PlannedDay,
} from "./types";
