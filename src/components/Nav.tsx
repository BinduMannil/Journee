"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/config/site";

const LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/discover", label: "Discover" },
  { href: "/plan", label: "Plan" },
  { href: "/saved", label: "Saved" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

/** Shared sticky navigation, rendered in the root layout on every page. Marks
 * the active route with `aria-current` for assistive tech. */
export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-sand/10 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <Link href="/" className="font-display text-xl tracking-wide text-sand">
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="flex gap-6 text-xs uppercase tracking-[0.2em] text-sand/70"
        >
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-gold-bright"
                    : "transition-colors hover:text-gold-bright"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
