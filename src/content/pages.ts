/**
 * Page-level editorial copy for surfaces without a dedicated domain content
 * file (discover, plan, about). Per ADR-004, page headings and intros are
 * config, not literals in components — so wording is consistent and a CMS/i18n
 * layer can supply it later. Copy that references the brand composes it from
 * `site` rather than re-spelling the name.
 */
import { site } from "@/lib/config/site";

export const discoverCopy = {
  title: "Discover by vibe",
  description:
    "Pick the mood you're chasing and any you'd rather avoid. Pathfinder "
    + "ranks destinations toward the vibe, away from the rest, and tells you why.",
} as const;

export const planCopy = {
  title: "Plan a trip",
  description:
    "Pick destinations and a pace. We pack them into days under a "
    + "fatigue-aware intensity budget — fewer days when relaxed, denser when "
    + "packed.",
} as const;

export const aboutCopy = {
  title: `How ${site.name} thinks`,
  metaDescription: `How ${site.name} thinks about travel — and what's built so far.`,
  intro: [
    `${site.name} treats a destination not as a listing but as a living state `
      + "— light, weather, crowds, events, culture, and safety shifting by the "
      + "hour. We score that context transparently: every number can explain "
      + "itself, and we show our confidence instead of pretending to certainty.",
    "This page is honest about maturity. Below is the real status of each "
      + "system — what genuinely runs today versus what is scaffolded or still "
      + "ahead.",
  ],
} as const;
