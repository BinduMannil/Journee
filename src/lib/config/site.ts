/**
 * Central site configuration.
 *
 * Per the no-hardcoding policy (docs/decisions/ADR-004), user-facing copy and
 * structural content are sourced here rather than embedded in components. This
 * module is the seam where a CMS or database-backed config provider will plug
 * in later without touching the presentation layer.
 */
export interface SiteConfig {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  /** Hero headline, split so the accent fragment can be styled separately
   *  without embedding copy in JSX. */
  readonly heroHeadlineLead: string;
  readonly heroHeadlineAccent: string;
  /** Hero backdrop image (data-driven, not hardcoded in the component). */
  readonly heroImageUrl: string;
}

export const site: SiteConfig = {
  name: "Journee",
  tagline: "Cinematic travel intelligence",
  description:
    "Journee is a cinematic travel intelligence platform — an editorial, " +
    "context-aware way to discover destinations through mood, atmosphere, and " +
    "real-world conditions rather than static listings.",
  heroHeadlineLead: "See the world the way it",
  heroHeadlineAccent: "actually feels.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
};
