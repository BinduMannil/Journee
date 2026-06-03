import { cn } from "./cn";

/**
 * Loading placeholder. A muted, softly pulsing block used while client surfaces
 * (light phase, atmosphere score, affiliate CTA, search results) resolve.
 * Honors reduced-motion via the shared `motion-reduce` utility.
 */
export function Skeleton({ className }: { readonly className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block animate-pulse rounded-md bg-sand/10 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
