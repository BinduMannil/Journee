import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

/**
 * The pill button used across Journee. Two renderers share one look:
 * `Button` for actions (<button>) and `ButtonLink` for navigation (next/link)
 * — so the cinematic pill styling lives in one place instead of being re-inlined
 * on every page (home hero, detail pages, etc.).
 */
export type ButtonVariant = "primary" | "ghost" | "solid";
export type ButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full uppercase " +
  "tracking-[0.2em] transition-colors focus-visible:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  // Gold-outlined, the default cinematic CTA.
  primary:
    "border border-gold/50 text-gold-bright hover:bg-gold/10",
  // Quieter, sand-outlined secondary action.
  ghost:
    "border border-sand/30 text-sand/80 hover:border-gold/50 hover:text-gold-bright",
  // Filled gold for the single most important action on a surface.
  solid:
    "border border-gold bg-gold text-ink hover:bg-gold-bright hover:border-gold-bright",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-7 py-3 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
