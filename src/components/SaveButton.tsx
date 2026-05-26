"use client";

import { useSaved } from "./useSaved";

export function SaveButton({ id }: { id: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      onClick={() => toggle(id)}
      aria-pressed={saved}
      className={
        saved
          ? "rounded-full border border-gold bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-bright"
          : "rounded-full border border-sand/30 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sand/80 transition-colors hover:border-gold/50 hover:text-gold-bright"
      }
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
