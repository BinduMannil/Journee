import type { PlanningProvider, PlanningRequest, PlanningResult } from "./types";
import { getLlmConfig } from "@/lib/config/env";
import { isFeatureEnabled } from "@/lib/config/flags";

/**
 * Anthropic (Claude) AI planning provider.
 *
 * Gated by `isAvailable()` = an `LLM_API_KEY` is set AND the `ai-planning` flag
 * is on, so it is completely inert until deliberately enabled — connecting a key
 * is the only step needed to switch it on. It asks the model for a structured
 * day-by-day plan and parses the JSON it returns; any failure throws so the
 * caller can fall back to the deterministic itinerary engine. Server-only.
 */
const ENDPOINT = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

function buildPrompt(request: PlanningRequest): string {
  const places = request.destinations
    .map((d) => `- ${d.name} (mood: ${d.mood})`)
    .join("\n");
  return [
    `Plan a ${request.pacing}-paced trip across these destinations:`,
    places,
    request.notes ? `Traveler notes: ${request.notes}` : "",
    "",
    "Respond with ONLY a JSON object of the form:",
    '{"summary": string, "days": [{"title": string, "detail": string}]}',
    "Keep it evocative but practical; one entry per day.",
  ]
    .filter(Boolean)
    .join("\n");
}

interface AnthropicTextBlock {
  readonly type: string;
  readonly text?: string;
}

export const anthropicPlanningProvider: PlanningProvider = {
  id: "anthropic-planning",
  isAvailable: () => getLlmConfig() !== null && isFeatureEnabled("ai-planning"),
  async generate(request: PlanningRequest): Promise<PlanningResult> {
    const config = getLlmConfig();
    if (!config) throw new Error("LLM not configured");

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1024,
        messages: [{ role: "user", content: buildPrompt(request) }],
      }),
    });

    if (!res.ok) {
      throw new Error(`Anthropic API error ${res.status}`);
    }

    const body = (await res.json()) as { content?: AnthropicTextBlock[] };
    const text = (body.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("");
    const parsed = JSON.parse(text) as {
      summary?: unknown;
      days?: { title?: unknown; detail?: unknown }[];
    };
    if (typeof parsed.summary !== "string" || !Array.isArray(parsed.days)) {
      throw new Error("Unexpected LLM response shape");
    }
    return {
      summary: parsed.summary,
      days: parsed.days.map((d) => ({
        title: String(d.title ?? ""),
        detail: String(d.detail ?? ""),
      })),
      providerId: anthropicPlanningProvider.id,
      model: config.model,
    };
  },
};
