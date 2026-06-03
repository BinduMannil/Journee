/**
 * Home page editorial copy (config-driven, per ADR-004). The hero lives in
 * `site` config; the rest of the landing narrative — the "Featured" heading and
 * the "How it works" pillars — is sourced here so the page composes from data,
 * never literals.
 */

/** Heading for the featured-destinations section. */
export const homeFeaturedCopy = {
  eyebrow: "Featured",
  title: "Destinations chosen by mood, not by map.",
} as const;

/** Closing call-to-action band at the foot of the landing page. */
export const homeFinalCta = {
  title: "Ready when you are.",
  primaryLabel: "Plan a trip",
  primaryHref: "/plan",
  secondaryLabel: "Browse destinations",
  secondaryHref: "/destinations",
} as const;

/** The three-pillar value proposition shown beneath the hero. */
export interface HomePillar {
  readonly title: string;
  readonly description: string;
}

export const homeHowItWorks: {
  readonly eyebrow: string;
  readonly title: string;
  readonly pillars: readonly HomePillar[];
} = {
  eyebrow: "How it works",
  title: "Three ideas, one way of seeing.",
  pillars: [
    {
      title: "Mood first",
      description:
        "Start from the feeling you're chasing — contemplative, electric, "
        + "untamed — and let the place follow, instead of scrolling a map of pins.",
    },
    {
      title: "Real-world conditions",
      description:
        "Light, weather, crowds, events, and disruption shift by the hour. "
        + "Journee reads the live state of a place, not a static listing.",
    },
    {
      title: "Explainable scoring",
      description:
        "Every score shows its work — the signals, their weights, and how "
        + "confident we are. No black box, and no false certainty.",
    },
  ],
};
