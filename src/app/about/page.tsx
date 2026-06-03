import type { Metadata } from "next";
import { platformSystems, type SystemStatus } from "@/content/systems";
import { aboutCopy } from "@/content/pages";
import { commonCopy } from "@/content/common";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.metaDescription,
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
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        {commonCopy.backToHome}
      </ButtonLink>
      <h1 className="mb-6 font-display text-4xl font-semibold text-sand sm:text-5xl">
        {aboutCopy.title}
      </h1>
      {aboutCopy.intro.map((paragraph, i) => (
        <p
          key={i}
          className={`text-lg leading-relaxed text-sand/80 ${
            i === aboutCopy.intro.length - 1 ? "mb-12" : "mb-4"
          }`}
        >
          {paragraph}
        </p>
      ))}

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
