export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold-bright">
          Journee
        </p>
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand/20 border-t-gold"
          aria-hidden
        />
        <span className="sr-only">Loading</span>
      </div>
    </main>
  );
}
