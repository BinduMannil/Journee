import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold-bright">
        404
      </p>
      <h1 className="font-display text-4xl font-semibold text-sand sm:text-5xl">
        This destination isn&rsquo;t on the map yet.
      </h1>
      <p className="mt-4 max-w-md text-sand/70">
        The page you were looking for can&rsquo;t be found.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-gold/50 px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10"
      >
        Back home
      </Link>
    </main>
  );
}
