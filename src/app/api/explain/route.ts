import { z } from "zod";
import {
  score,
  explainScore,
  destinationWeights,
  eventWeights,
  disruptionWeights,
  safetyWeights,
  conditionsWeights,
  DESTINATION_SIGNAL_KEYS,
  EVENT_SIGNAL_KEYS,
  DISRUPTION_SIGNAL_KEYS,
  SAFETY_SIGNAL_KEYS,
  CONDITIONS_SIGNAL_KEYS,
  type ScoringWeights,
} from "@/lib/intelligence";

/**
 * "Explain my ranking" — exposes the explainable scoring core. POST a set of
 * normalized signals (key/value 0..1) and a named engine; the response is the
 * 0..100 score plus a ranked contribution breakdown (which signals drove it,
 * their share of the weighted total, what boosts vs. drags it). Pure + honest:
 * the caller supplies the signals, weights are the versioned server-side config,
 * and nothing is fabricated. GET is not supported (405).
 */
export const dynamic = "force-dynamic";

interface EngineConfig {
  readonly weights: ScoringWeights;
  readonly expectedKeys: readonly string[];
}

const ENGINES: Readonly<Record<string, EngineConfig>> = {
  destination: { weights: destinationWeights, expectedKeys: DESTINATION_SIGNAL_KEYS },
  events: { weights: eventWeights, expectedKeys: EVENT_SIGNAL_KEYS },
  disruption: { weights: disruptionWeights, expectedKeys: DISRUPTION_SIGNAL_KEYS },
  safety: { weights: safetyWeights, expectedKeys: SAFETY_SIGNAL_KEYS },
  conditions: { weights: conditionsWeights, expectedKeys: CONDITIONS_SIGNAL_KEYS },
};

const ENGINE_NAMES = Object.keys(ENGINES) as [string, ...string[]];

const requestSchema = z.object({
  engine: z.enum(ENGINE_NAMES).default("destination"),
  signals: z
    .array(
      z.object({
        key: z.string().min(1).max(60),
        value: z.number().finite(),
        note: z.string().max(200).optional(),
      }),
    )
    .min(1)
    .max(40),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_body", supportedEngines: Object.keys(ENGINES), issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { engine, signals } = parsed.data;
  const config = ENGINES[engine]!;
  const result = score(signals, config.weights, config.expectedKeys);
  const explanation = explainScore(result);

  return Response.json({ engine, score: result, explanation }, { status: 200 });
}
