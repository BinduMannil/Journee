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

/** Copy for the /saved collection page and its list/empty states. */
export const savedCopy = {
  title: "Saved collection",
  empty: {
    title: "Nothing saved yet",
    description:
      "Open a destination and tap Save to start a collection. It lives on "
      + "this device — no account needed.",
    ctaLabel: "Browse destinations",
    ctaHref: "/destinations",
  },
  countSuffix: "saved",
  removeLabel: "Remove",
} as const;

/**
 * Copy for the AI trip-planner panel on /plan. Every status the endpoint can
 * return has an honest message — including the 503 "not enabled here" case, so
 * the UI never pretends a capability that is switched off.
 */
export const aiPlannerCopy = {
  heading: "Or let AI compose it",
  intro:
    "Hand your selection to an AI planner for a richer, narrative day-by-day "
    + "itinerary. Falls back to the paced planner above when it's unavailable.",
  notesLabel: "Anything to tailor it? (optional)",
  notesPlaceholder: "photography-focused, slow mornings, vegetarian food…",
  submit: "Plan with AI",
  loading: "Composing…",
  needSelection: "Pick at least one destination above first.",
  unavailable:
    "AI planning isn't switched on in this environment — the paced planner "
    + "above still works.",
  quotaExhausted: "You've used your free AI plans.",
  quotaCtaLabel: "See pricing",
  quotaCtaHref: "/pricing",
  rateLimited:
    "A lot of free plans are coming from this network right now. Try again "
    + "shortly.",
  error: "Something went wrong composing that plan. Please try again.",
  summaryHeading: "AI itinerary",
} as const;

/** Remaining-free-plans note, parameterized by the count the API returns. */
export function remainingFreeNote(remaining: number): string {
  return `${remaining} free AI ${remaining === 1 ? "plan" : "plans"} left.`;
}

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
