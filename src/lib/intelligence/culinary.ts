/**
 * Food & drink customs accessor (pure, no I/O).
 *
 * Reads the editorial culinary seed data and derives concise, honest traveller
 * flags — dietary prevalence (pork/beef), vegetarian friendliness, alcohol
 * availability + public-drinking norms — plus a "what to try" tip. Deterministic
 * and unit-tested. Always pair output with `CULINARY_DATA_NOTE` (re-exported) so
 * it reads as planning guidance, not legal advice.
 */
import {
  CULINARY_DATA_NOTE,
  culinaryProfiles,
  type CulinaryProfile,
  type Prevalence,
} from "@/content/culinary";

export { CULINARY_DATA_NOTE };
export type { CulinaryProfile } from "@/content/culinary";

/** The culinary profile for a destination, or null when none is catalogued. */
export function getCulinaryProfile(destinationId: string): CulinaryProfile | null {
  return culinaryProfiles.find((p) => p.destinationId === destinationId) ?? null;
}

export type CulinaryFlagKind = "diet" | "alcohol" | "tip";

export interface CulinaryFlag {
  readonly kind: CulinaryFlagKind;
  readonly text: string;
}

function prevalenceFlag(food: string, prevalence: Prevalence): CulinaryFlag | null {
  switch (prevalence) {
    case "unavailable":
      return { kind: "diet", text: `${food} is not available here.` };
    case "rare":
      return { kind: "diet", text: `${food} is rarely served here.` };
    case "limited":
      return { kind: "diet", text: `${food} is less common here.` };
    case "common":
      return null; // no flag needed — the default expectation
  }
}

/**
 * Derive concise traveller flags + a recommendation from a culinary profile.
 * Only surfaces *deviations from the default expectation* (e.g. pork being rare)
 * plus alcohol cautions and a "what to try" tip, so the list stays signal-dense.
 */
export function culinaryFlags(profile: CulinaryProfile): readonly CulinaryFlag[] {
  const flags: CulinaryFlag[] = [];

  const pork = prevalenceFlag("Pork", profile.dietary.pork);
  if (pork) flags.push(pork);
  const beef = prevalenceFlag("Beef", profile.dietary.beef);
  if (beef) flags.push(beef);

  if (profile.dietary.vegetarianFriendly === "limited") {
    flags.push({ kind: "diet", text: "Vegetarian options can be limited." });
  } else if (profile.dietary.vegetarianFriendly === "easy") {
    flags.push({ kind: "diet", text: "Vegetarian-friendly — plenty of meat-free options." });
  }

  if (!profile.alcohol.inSupermarkets) {
    flags.push({
      kind: "alcohol",
      text: "Alcohol isn't sold in ordinary supermarkets — look for licensed shops or venues.",
    });
  }
  if (!profile.alcohol.publicDrinkingAllowed) {
    flags.push({ kind: "alcohol", text: "Drinking in public is not acceptable/permitted here." });
  }

  flags.push({
    kind: "tip",
    text: `Try the local drink: ${profile.signatureDrink}.`,
  });

  return flags;
}
