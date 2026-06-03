import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * Centered "nothing here yet" panel with an optional call to action. Used on
 * Saved (no saves), Discover (no matches), search (no results) — so every empty
 * surface reads the same instead of each page inventing its own copy block.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-sand/15 px-8 py-16 text-center",
        className,
      )}
    >
      <h3 className="font-display text-2xl text-sand">{title}</h3>
      {description && (
        <p className="max-w-md text-sand/60">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
