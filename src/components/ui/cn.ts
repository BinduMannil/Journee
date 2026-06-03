/**
 * Minimal className combiner. Joins truthy class fragments with a space.
 *
 * Deliberately tiny and dependency-free (no clsx/tailwind-merge) — the design
 * system composes a small, controlled set of utility strings, so order-based
 * Tailwind conflicts are avoided by construction rather than resolved at
 * runtime. Pass conditional classes as `cond && "class"`.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...parts: readonly ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
