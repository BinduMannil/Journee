/**
 * Natural-language discovery query parser (pure, no network).
 *
 * Maps free text ("somewhere warm and lively, but not too touristy") to a
 * structured `PathfinderQuery` (desired vibe + moods to avoid) using a mood
 * synonym vocabulary and simple negation detection. Deterministic and
 * unit-tested — no LLM required, so search works with zero configuration.
 *
 * This is the honest fallback layer: when an LLM provider is enabled it can
 * produce the same `{ vibe, avoid }` shape with richer understanding, but the
 * product never depends on a key being present to do useful query parsing.
 */
/** Mood synonyms → a catalog mood. Lowercase keys; extend as the catalog grows. */
export const MOOD_SYNONYMS: Readonly<Record<string, string>> = {
  // Contemplative
  calm: "Contemplative", quiet: "Contemplative", peaceful: "Contemplative",
  slow: "Contemplative", serene: "Contemplative", contemplative: "Contemplative",
  tranquil: "Contemplative", meditative: "Contemplative", restful: "Contemplative",
  relaxing: "Contemplative", relaxed: "Contemplative", zen: "Contemplative",
  // Luminous
  bright: "Luminous", sunny: "Luminous", luminous: "Luminous", radiant: "Luminous",
  sunshine: "Luminous", sun: "Luminous", beach: "Luminous", coastal: "Luminous",
  light: "Luminous", warm: "Luminous",
  // Electric
  lively: "Electric", vibrant: "Electric", energetic: "Electric", electric: "Electric",
  bustling: "Electric", nightlife: "Electric", party: "Electric", buzzing: "Electric",
  exciting: "Electric", busy: "Electric",
  // Untamed
  wild: "Untamed", rugged: "Untamed", untamed: "Untamed", adventurous: "Untamed",
  adventure: "Untamed", remote: "Untamed", nature: "Untamed", outdoors: "Untamed",
  dramatic: "Untamed", raw: "Untamed", wilderness: "Untamed",
};

/** Words that flip a nearby mood term into something to avoid. */
const NEGATIONS = new Set([
  "no", "not", "non", "without", "avoid", "skip", "hate", "dislike",
  "never", "less", "anti", "except", "minus",
]);

/** How many preceding tokens to scan for a negation. */
const NEGATION_WINDOW = 3;

export interface ParsedQuery {
  /** Desired mood/vibe (assignable to PathfinderQuery.vibe). */
  readonly vibe?: string;
  /** Moods to downrank. */
  readonly avoid: readonly string[];
  /** Mood terms the parser recognized (for "did you mean" UX / transparency). */
  readonly matched: readonly string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Parse free text into a Pathfinder query. The first positively-expressed mood
 * becomes the `vibe`; any negated moods are collected into `avoid`. A mood that
 * appears both positively and negatively is treated as avoided (the explicit
 * "not" wins). Empty/unrecognized input yields an empty query, not an error.
 */
export function parseQuery(text: string): ParsedQuery {
  const tokens = tokenize(text);
  const matched: string[] = [];
  const positives: string[] = [];
  const avoid = new Set<string>();

  tokens.forEach((tok, i) => {
    const mood = MOOD_SYNONYMS[tok];
    if (!mood) return;
    matched.push(tok);
    const negated = tokens
      .slice(Math.max(0, i - NEGATION_WINDOW), i)
      .some((t) => NEGATIONS.has(t));
    if (negated) avoid.add(mood);
    else positives.push(mood);
  });

  // A negated mood overrides any positive mention of the same mood.
  const vibe = positives.find((m) => !avoid.has(m));

  return {
    vibe,
    avoid: [...avoid],
    matched,
  };
}
