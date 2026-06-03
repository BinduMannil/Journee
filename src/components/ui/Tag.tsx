import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * Small pill label — the gold mood chip seen on destination cards and detail
 * pages, plus quieter and status variants for filters and readiness badges.
 * Centralizes the `rounded-full border ... uppercase tracking` pattern.
 */
export type TagVariant = "gold" | "neutral" | "muted";

const VARIANTS: Record<TagVariant, string> = {
  gold: "border-gold/40 text-gold-bright",
  neutral: "border-sand/30 text-sand/80",
  muted: "border-stone/40 text-stone",
};

export function Tag({
  variant = "gold",
  className,
  children,
}: {
  readonly variant?: TagVariant;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
