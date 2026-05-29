/**
 * Traveller inclusion & safety (editorial seed data).
 *
 * A factual, neutral summary of the *laws* and *general social climate* around
 * each destination — covering LGBTQ+ travellers, religious minorities, and solo
 * women — so visitors can stay safe and informed. This describes how things
 * generally are on the ground; it makes no moral judgement and endorses nothing.
 * **Editorial seed data**, not legal advice and not a live source — laws and
 * climate change, so `INCLUSION_DATA_NOTE` is surfaced with every consumer and
 * travellers must verify current official government travel advisories.
 * Mirrors the `festivals.ts` content pattern.
 */

/** Legal standing of a behaviour/identity under local law. */
export type LegalStatus = "legal" | "restricted" | "illegal" | "varies";

/** General social acceptance/visibility — a neutral descriptor, not a rating. */
export type Acceptance = "high" | "moderate" | "low";

export interface InclusionProfile {
  readonly destinationId: string;
  readonly lgbtq: {
    /** Legal standing of same-sex relationships under local law. */
    readonly legalStatus: LegalStatus;
    /** Whether same-sex marriage is legally recognised nationwide. */
    readonly sameSexMarriage: boolean;
    /** General social acceptance/visibility — neutral, not a value judgement. */
    readonly socialClimate: Acceptance;
    readonly note: string;
  };
  readonly religiousMinorities: {
    readonly note: string;
  };
  readonly soloWomen: {
    readonly note: string;
  };
}

/** Shown with any inclusion data so it reads as an informational summary, not advice. */
export const INCLUSION_DATA_NOTE =
  "Editorial summary of laws and the general social climate for traveller " +
  "safety only — it is neither an endorsement nor a guarantee, and not legal " +
  "advice. Laws and conditions change; verify current official government " +
  "travel advisories before you travel.";

export const inclusionProfiles: readonly InclusionProfile[] = [
  {
    destinationId: "kyoto",
    lgbtq: {
      legalStatus: "legal",
      sameSexMarriage: false,
      socialClimate: "moderate",
      note: "Same-sex relationships are legal and Japan is generally tolerant, though attitudes can be reserved and public displays are often kept discreet. There is no nationwide same-sex marriage, but many municipalities (including in Kyoto) issue local partnership certificates.",
    },
    religiousMinorities: {
      note: "Religious minorities are a small share of the population and inter-religious tension is low. Visitors of any faith are generally treated with courtesy.",
    },
    soloWomen: {
      note: "Japan is considered very safe for solo women travellers, with low rates of violent crime and reliable public transport. Normal big-city awareness, especially on crowded trains at night, is still sensible.",
    },
  },
  {
    destinationId: "santorini",
    lgbtq: {
      legalStatus: "legal",
      sameSexMarriage: true,
      socialClimate: "moderate",
      note: "Same-sex relationships are legal and Greece legalised same-sex marriage in 2024. Tourist areas like Santorini are welcoming and LGBTQ-friendly, with moderate-to-high acceptance overall.",
    },
    religiousMinorities: {
      note: "Greece is predominantly Greek Orthodox; minority faiths are present and worship freely, particularly in tourist and urban areas. Visitors of other faiths are generally well received.",
    },
    soloWomen: {
      note: "Santorini and Greece are generally safe for solo women travellers. Standard precautions apply, particularly around nightlife and late-night travel.",
    },
  },
  {
    destinationId: "marrakech",
    lgbtq: {
      legalStatus: "illegal",
      sameSexMarriage: false,
      socialClimate: "low",
      note: "Under Moroccan law, same-sex sexual acts are criminalised; this is stated plainly as a safety fact, not a judgement. Public visibility is low and LGBTQ travellers are advised to be discreet.",
    },
    religiousMinorities: {
      note: "Morocco is predominantly Muslim and has a long-established, historic Jewish community, with coexistence that has generally been peaceful. Visitors of other faiths are usually treated hospitably while local customs are respected.",
    },
    soloWomen: {
      note: "Solo women travellers may experience street harassment, particularly in busy areas of the medina. Modest dress, situational awareness, and confident, firm responses can help reduce unwanted attention.",
    },
  },
  {
    destinationId: "patagonia",
    lgbtq: {
      legalStatus: "legal",
      sameSexMarriage: true,
      socialClimate: "moderate",
      note: "Same-sex relationships are legal and same-sex marriage is recognised (Argentina since 2010, Chile since 2022). Both countries are relatively progressive, with moderate-to-high acceptance, especially in cities and tourist areas.",
    },
    religiousMinorities: {
      note: "Argentina and Chile are predominantly Christian with constitutionally protected freedom of religion. Minority faiths worship freely and visitors of any faith are generally welcomed.",
    },
    soloWomen: {
      note: "Patagonia is generally reasonably safe for solo women travellers, including on its popular hiking routes. Normal precautions apply, particularly in larger towns and after dark.",
    },
  },
];
