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
}

export const site: SiteConfig = {
  name: "Journee",
  tagline: "Cinematic travel intelligence",
  description:
    "Journee is a cinematic travel intelligence platform — an editorial, " +
    "context-aware way to discover destinations through mood, atmosphere, and " +
    "real-world conditions rather than static listings.",
};
