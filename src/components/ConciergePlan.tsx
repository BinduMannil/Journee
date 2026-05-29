"use client";

import { useState } from "react";
import type { Pacing, Itinerary } from "@/lib/intelligence/itinerary";

export interface ConciergeDestination {
  readonly id: string;
  readonly name: string;
  readonly mood: string;
}

interface PlannedDay {
  readonly title: string;
  readonly detail: string;
}
interface PlanResult {
  readonly summary: string;
  readonly days: readonly PlannedDay[];
  /** Where the narrative came from — labelled honestly in the UI. */
  readonly source: string;
}

type Status = "idle" | "loading" | "done" | "blocked";

/**
 * AI concierge: turns the selected stops + pacing into a narrative day-by-day
 * plan. Posts to /api/plan/ai when an LLM provider is enabled; when it isn't
 * (503) — or on any error — it falls back to a deterministic narrative built
 * from the same itinerary, and says so. The product never breaks on a missing
 * key; the AI is an enhancement, not a dependency.
 */
export function ConciergePlan({
  destinations,
  pacing,
  itinerary,
}: {
  destinations: readonly ConciergeDestination[];
  pacing: Pacing;
  itinerary: Itinerary;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const deterministicPlan = (): PlanResult => ({
    summary: `A ${pacing} ${itinerary.days.length}-day plan across ${destinations
      .map((d) => d.name)
      .join(", ")}.`,
    days: itinerary.days.map((day, i) => {
      const names = day.items.map((it) => it.title).join(", ") || "rest & wander";
      return {
        title: `Day ${i + 1} — ${names}`,
        detail: `A ${pacing} day (intensity load ${day.load}/${itinerary.budget}) focused on ${names}.`,
      };
    }),
    source: "Generated locally (no AI key configured)",
  });

  const generate = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/plan/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destinations: destinations.map((d) => ({ id: d.id, name: d.name, mood: d.mood })),
          pacing,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const plan = await res.json();
        setResult({
          summary: plan.summary,
          days: plan.days,
          source: `${plan.providerId} · ${plan.model}`,
        });
        setStatus("done");
        return;
      }

      if (res.status === 402 || res.status === 429) {
        setMessage("You've used your free AI plans for now — here's a locally generated plan instead.");
        setResult(deterministicPlan());
        setStatus("done");
        return;
      }

      // 503 (AI not enabled) or any other error → deterministic fallback.
      setResult(deterministicPlan());
      setStatus("done");
    } catch {
      setResult(deterministicPlan());
      setStatus("done");
    }
  };

  if (itinerary.days.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-sand/10 p-5">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">Concierge</p>
      <label htmlFor="concierge-notes" className="sr-only">
        Trip intent
      </label>
      <textarea
        id="concierge-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional: photography-focused, slow mornings, great food…"
        rows={2}
        maxLength={500}
        className="w-full rounded-lg border border-sand/20 bg-transparent px-4 py-2.5 text-sand placeholder:text-sand/40 focus:border-gold/60 focus:outline-none"
      />
      <button
        type="button"
        onClick={generate}
        disabled={status === "loading"}
        className="mt-3 rounded-full border border-gold/50 px-5 py-2 text-xs uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10 disabled:opacity-50"
      >
        {status === "loading" ? "Composing…" : "Compose a narrative plan"}
      </button>

      {message && <p className="mt-3 text-xs text-stone">{message}</p>}

      {result && (
        <div className="mt-5">
          <p className="text-sand/90">{result.summary}</p>
          <ol className="mt-4 space-y-3">
            {result.days.map((day, i) => (
              <li key={i} className="rounded-xl border border-sand/10 p-4">
                <p className="font-display text-lg text-sand">{day.title}</p>
                <p className="mt-1 text-sm text-sand/70">{day.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone">
            Source: {result.source}
          </p>
        </div>
      )}
    </div>
  );
}
