import type { DestinationReadiness } from "@/lib/intelligence/destination-readiness";

/**
 * Travel Confidence — the REAL, seed-fed aggregate (server-rendered).
 *
 * Unlike the flag-gated `TravelReadiness` preview (which runs the engines on
 * sample contexts), this is fed by the actual travel-data assembler
 * (`assembleDestinationReadiness`): advisories + local events resolved through
 * the provider registry, scored by the engines, aggregated by the shared core.
 * Today the providers are SEED adapters, so every source is labelled `seed` and
 * the coverage-based confidence reflects how much real data backed the score.
 * A live feed slots in behind the same contract with no change here.
 *
 * Presentational only — the readiness object is assembled upstream and passed in.
 */
const SOURCE_LABEL: Record<string, string> = {
  seed: "seed",
  live: "live",
  cache: "cache",
};

export function TravelConfidence({ readiness }: { readiness: DestinationReadiness }) {
  // No source contributed → nothing honest to show (don't render an empty box).
  if (readiness.parts.length === 0) return null;

  const { overall, parts, sources } = readiness;

  return (
    <div className="mt-12 rounded-2xl border border-sand/10 p-7">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Travel confidence</p>
        <span className="rounded-full border border-sand/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-stone">
          Seed-fed · {Math.round(overall.confidence * 100)}% coverage
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-semibold text-gold-bright">
          {overall.score}
        </span>
        <span className="text-sm uppercase tracking-[0.25em] text-stone">
          {overall.weightsVersion}
        </span>
      </div>

      <ul className="mt-4 space-y-1 text-sm text-sand/75">
        {parts.map((p) => (
          <li key={p.key} className="flex justify-between gap-4">
            <span className="capitalize">{p.key}</span>
            <span className="text-stone">{p.result.score}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-sand/10 pt-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-stone">Sources</p>
        <ul className="space-y-1 text-xs text-sand/60">
          {sources.map((s) => (
            <li key={s.kind} className="flex items-center justify-between gap-3">
              <span>{s.kind.replace(/-/g, " ")}</span>
              <span className="flex items-center gap-2">
                <span className="rounded-full border border-sand/20 px-2 py-0.5 uppercase tracking-[0.15em] text-stone">
                  {SOURCE_LABEL[s.sourceType] ?? s.sourceType}
                </span>
                <span className={s.contributed ? "text-gold/70" : "text-stone/50"}>
                  {s.contributed ? "contributed" : "no data"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-sand/50">
        Real assembler over seed travel-data — advisories &amp; local events
        scored by the engines. Live feeds replace the seed under the same
        contract, with no change to this surface.
      </p>
    </div>
  );
}
