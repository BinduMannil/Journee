/**
 * Shared UI copy and placement config reused across pages.
 *
 * Per ADR-004 (config-driven, no hardcoding), even small repeated labels live
 * here rather than as string literals in components, so wording stays
 * consistent and a CMS/i18n layer can later supply them centrally.
 */
import type { AffiliateCategory } from "@/lib/affiliate/types";

export const commonCopy = {
  backToHome: "← Home",
} as const;

/**
 * The "stay" affiliate placement (category + label) used on the home and
 * destinations pages. Category is data, never a hardcoded link — the actual URL
 * is resolved at runtime by the affiliate router (ADR-005).
 */
export const stayAffiliate: {
  readonly category: AffiliateCategory;
  readonly label: string;
} = {
  category: "hotels",
  label: "Plan your stay",
};
