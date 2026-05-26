"use client";

import { useEffect, useState } from "react";

/**
 * Cross-fades through a set of atmospheric quotes. Quotes are passed in from a
 * data source (never hardcoded here) so editorial can change them freely.
 */
export function QuoteRotator({ quotes }: { quotes: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(id);
  }, [quotes.length]);

  const current = quotes[index] ?? "";

  return (
    <p
      key={index}
      className="journee-fade-up max-w-2xl font-display text-xl italic leading-relaxed text-sand/90 sm:text-2xl"
    >
      &ldquo;{current}&rdquo;
    </p>
  );
}
