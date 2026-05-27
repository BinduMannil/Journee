import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/config/site";
import { platformSystems, type SystemStatus } from "@/content/systems";

export const metadata: Metadata = {
  title: "About",
  description: "How Journee thinks about travel — and what's built so far.",
  alternates: { canonical: "/about" },
};

const STATUS_LABEL: Record<SystemStatus, string> = {
  live: "Live",
  scaffold: "Scaffold",
  roadmap: "Roadmap",
};

const STATUS_CLASS: Record<SystemStatus, string> = {
  live: "border-gold/50 text-gold-bright",
  scaffold: "border-sand/30 text-sand/80",
  roadmap: "border-stone/40 text-stone",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
      >
        &larr; Home
      </Link>
      <h1 className="mb-6 font-display text-4xl font-semibold text-sand sm:text-5xl">
        How {site.name} thinks
      </h1>
      <p className="mb-4 text-lg leading-relaxed text-sand/80">
        {site.name} treats a destination not as a listing but as a living state —
        light, weather, crowds, events, culture, and safety shifting by the hour.
        We score that context transparently: every number can explain itself, and
        we show our confidence instead of pretending to certainty.
      </p>
      <p className="mb-12 text-lg leading-relaxed text-sand/80">
        This page is honest about maturity. Below is the real status of each
        system — what genuinely runs today versus what is scaffolded or still
        ahead.
      </p>

      <ul className="space-y-3">
        {platformSystems.map((s) => (
          <li
            key={s.name}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-sand/10 px-5 py-4"
          >
            <span className="font-display text-xl text-sand">{s.name}</span>
            <span
              className={`rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${STATUS_CLASS[s.status]}`}
            >
              {STATUS_LABEL[s.status]}
            </span>
            <span className="w-full text-sm text-sand/60">{s.note}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
