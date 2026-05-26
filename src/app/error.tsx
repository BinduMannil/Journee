"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold-bright">
        Something interrupted the journey
      </p>
      <h1 className="font-display text-4xl font-semibold text-sand sm:text-5xl">
        We hit an unexpected detour.
      </h1>
      <p className="mt-4 max-w-md text-sand/70">
        An error occurred while loading this view. You can try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border border-gold/50 px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10"
      >
        Try again
      </button>
    </main>
  );
}
