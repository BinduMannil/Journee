import Link from "next/link";
import { site } from "@/lib/config/site";

/** Shared site footer, rendered in the root layout on every page. */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-sand/10 px-6 py-12 text-sm text-stone sm:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>
          {site.name} — {site.tagline}. An early foundation; systems roadmap lives in{" "}
          <span className="text-sand/70">/docs</span>.
        </p>
        <nav aria-label="Footer" className="flex gap-5 uppercase tracking-[0.2em]">
          <Link href="/destinations" className="transition-colors hover:text-gold-bright">
            Destinations
          </Link>
          <Link href="/about" className="transition-colors hover:text-gold-bright">
            About
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-gold-bright">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
