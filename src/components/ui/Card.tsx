import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * Bordered surface used for grouped content (readiness panels, list rows,
 * pricing tiers). The `bordered` border + soft radius matches the existing
 * `rounded-xl border border-sand/10` pattern; `interactive` adds the hover lift
 * for clickable cards.
 */
export function Card({
  interactive = false,
  className,
  children,
}: {
  readonly interactive?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sand/10 bg-ink-soft/40 p-5",
        interactive && "transition-colors hover:border-gold/40",
        className,
      )}
    >
      {children}
    </div>
  );
}
