import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * The editorial section header — small gold eyebrow over a Playfair display
 * title, optional supporting line. Repeated verbatim on the home page
 * ("Featured" / "Destinations chosen by mood…") and most inner pages; this is
 * the single source for that rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Title = "h2",
  align = "left",
  className,
}: {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly as?: "h1" | "h2" | "h3";
  readonly align?: "left" | "center";
  readonly className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
      )}
      <Title className="font-display text-4xl font-semibold text-sand sm:text-5xl">
        {title}
      </Title>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-sand/70">{description}</p>
      )}
    </div>
  );
}
