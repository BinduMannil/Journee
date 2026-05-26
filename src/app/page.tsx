import { QuoteRotator } from "@/components/QuoteRotator";
import { DestinationExplorer } from "@/components/DestinationExplorer";
import { AffiliateCta } from "@/components/AffiliateCta";
import { site } from "@/lib/config/site";
import { heroQuotes, type Destination } from "@/content/destinations";
import { resolve } from "@/lib/providers/registry";
// Importing the registration module wires up all provider adapters.
import "@/lib/providers/register";

export default async function Home() {
  // Resolved via the provider registry, not imported directly — this is the
  // same call shape a Supabase/CMS-backed provider will satisfy later.
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? [];

  return (
    <main className="min-h-screen">
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 sm:px-12">
        <div className="journee-kenburns absolute inset-0 -z-10">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80')",
            }}
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />

        <div className="mx-auto w-full max-w-5xl">
          <p className="journee-fade-up mb-6 text-sm uppercase tracking-[0.4em] text-gold-bright">
            {site.tagline}
          </p>
          <h1 className="journee-fade-up font-display text-5xl font-semibold leading-[1.05] text-sand sm:text-7xl">
            See the world the way it
            <span className="text-gold"> actually feels.</span>
          </h1>
          <p className="journee-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-sand/80">
            {site.description}
          </p>
          <div className="mt-10">
            <QuoteRotator quotes={heroQuotes} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            Featured
          </p>
          <h2 className="font-display text-4xl font-semibold text-sand sm:text-5xl">
            Destinations chosen by mood, not by map.
          </h2>
        </div>

        <DestinationExplorer destinations={destinations} />

        {/* Renders only when an affiliate catalog is configured and a link
            resolves; otherwise nothing is shown (no fabricated links). */}
        <div className="mt-12 flex justify-center">
          <AffiliateCta category="hotels" label="Plan your stay" />
        </div>
      </section>

      <footer className="border-t border-sand/10 px-6 py-12 text-center text-sm text-stone sm:px-12">
        {site.name} — {site.tagline}. An early foundation; systems roadmap lives in{" "}
        <span className="text-sand/70">/docs</span>.
      </footer>
    </main>
  );
}
