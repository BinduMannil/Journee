import { z } from "zod";
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

/** Models often wrap JSON in a ```json fence; strip it before parsing. */
export function stripCodeFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

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

/**
 * The structured plan we require back from the model. Validating the parsed JSON
 * here (rather than trusting its shape) means a malformed/truncated completion
 * throws cleanly — the route turns that into a 502 and the deterministic planner
 * takes over. Bounds keep a runaway response from becoming a runaway payload.
 */
const planResponseSchema = z.object({
  summary: z.string().min(1),
  days: z
    .array(
      z.object({
        title: z.string().min(1),
        detail: z.string().default(""),
      }),
    )
    .min(1)
    .max(60),
});

/** Parse the model's text into a validated plan, or throw on a bad shape. */
export function parsePlanResponse(text: string): z.infer<typeof planResponseSchema> {
  return planResponseSchema.parse(JSON.parse(stripCodeFence(text)));
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
        max_tokens: 4096,
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
    const parsed = parsePlanResponse(text);
    return {
      summary: parsed.summary,
      days: parsed.days.map((d) => ({ title: d.title, detail: d.detail })),
      providerId: anthropicPlanningProvider.id,
      model: config.model,
    };
  },
};
