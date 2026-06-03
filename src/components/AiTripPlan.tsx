"use client";

import { useState } from "react";
import type { Pacing } from "@/lib/intelligence/itinerary";
import { Button, ButtonLink, Card } from "@/components/ui";
import { aiPlannerCopy, remainingFreeNote } from "@/content/pages";

/** Minimal destination shape the AI planning endpoint needs. */
export interface AiPlannableDestination {
  readonly id: string;
  readonly name: string;
  readonly mood: string;
}

interface AiPlanResponse {
  readonly summary: string;
  readonly days: readonly { readonly title: string; readonly detail: string }[];
  readonly entitlement?: { readonly remainingFree: number };
}

type AiState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "done"; readonly result: AiPlanResponse }
  | { readonly status: "error"; readonly message: string; readonly showPricing: boolean };

/**
 * AI trip-planner panel. Posts the current selection + pacing to
 * `POST /api/plan/ai` and renders the narrative itinerary. Honest about every
 * failure mode: 503 (not enabled) falls back to the deterministic planner,
 * 402 (quota) links to pricing, 429 (rate limit) asks to retry. Reuses the
 * selection/pacing already chosen in the planner above, so there's no second
 * picker.
 */
export function AiTripPlan({
  destinations,
  pacing,
}: {
  readonly destinations: readonly AiPlannableDestination[];
  readonly pacing: Pacing;
}) {
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<AiState>({ status: "idle" });

  async function planWithAi() {
    if (destinations.length === 0) {
      setState({
        status: "error",
        message: aiPlannerCopy.needSelection,
        showPricing: false,
      });
      return;
    }
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/plan/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destinations: destinations.map((d) => ({
            id: d.id,
            name: d.name,
            mood: d.mood,
          })),
          pacing,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const result = (await res.json()) as AiPlanResponse;
        setState({ status: "done", result });
        return;
      }

      const message =
        res.status === 503
          ? aiPlannerCopy.unavailable
          : res.status === 402
            ? aiPlannerCopy.quotaExhausted
            : res.status === 429
              ? aiPlannerCopy.rateLimited
              : aiPlannerCopy.error;
      setState({ status: "error", message, showPricing: res.status === 402 });
    } catch {
      setState({
        status: "error",
        message: aiPlannerCopy.error,
        showPricing: false,
      });
    }
  }

  return (
    <section className="mt-12 border-t border-sand/10 pt-10">
      <h2 className="font-display text-2xl text-sand">{aiPlannerCopy.heading}</h2>
      <p className="mt-2 max-w-2xl text-sand/70">{aiPlannerCopy.intro}</p>

      <label className="mt-6 block text-sm uppercase tracking-[0.2em] text-gold">
        {aiPlannerCopy.notesLabel}
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={aiPlannerCopy.notesPlaceholder}
        rows={2}
        maxLength={500}
        className="mt-2 w-full rounded-xl border border-sand/20 bg-ink-soft px-4 py-3 text-sand placeholder:text-stone focus:border-gold/60 focus:outline-none"
      />

      <div className="mt-4">
        <Button
          variant="solid"
          onClick={planWithAi}
          disabled={state.status === "loading"}
        >
          {state.status === "loading" ? aiPlannerCopy.loading : aiPlannerCopy.submit}
        </Button>
      </div>

      {state.status === "error" && (
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sand/70">
          {state.message}
          {state.showPricing && (
            <ButtonLink href={aiPlannerCopy.quotaCtaHref} variant="ghost" size="sm">
              {aiPlannerCopy.quotaCtaLabel}
            </ButtonLink>
          )}
        </p>
      )}

      {state.status === "done" && (
        <div className="mt-6">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gold">
            {aiPlannerCopy.summaryHeading}
          </p>
          <p className="mb-6 text-lg leading-relaxed text-sand/80">
            {state.result.summary}
          </p>
          <ol className="space-y-4">
            {state.result.days.map((day, i) => (
              <Card key={i}>
                <h3 className="font-display text-xl text-sand">{day.title}</h3>
                <p className="mt-2 leading-relaxed text-sand/70">{day.detail}</p>
              </Card>
            ))}
          </ol>
          {state.result.entitlement && (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone">
              {remainingFreeNote(state.result.entitlement.remainingFree)}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
