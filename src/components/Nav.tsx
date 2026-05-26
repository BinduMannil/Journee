import Link from "next/link";
import { site } from "@/lib/config/site";

/** Shared sticky navigation, rendered in the root layout on every page. */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand/10 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        <Link href="/" className="font-display text-xl tracking-wide text-sand">
          {site.name}
        </Link>
        <nav className="flex gap-6 text-xs uppercase tracking-[0.2em] text-sand/70">
          <Link href="/discover" className="transition-colors hover:text-gold-bright">
            Discover
          </Link>
          <Link href="/plan" className="transition-colors hover:text-gold-bright">
            Plan
          </Link>
          <Link href="/saved" className="transition-colors hover:text-gold-bright">
            Saved
          </Link>
          <Link href="/about" className="transition-colors hover:text-gold-bright">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
