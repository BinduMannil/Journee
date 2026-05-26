/**
 * Saved-collection set operations (pure).
 *
 * The persistence layer (localStorage today, a user account later) calls these;
 * keeping the logic pure makes it testable and storage-agnostic.
 */
export function toggleId(ids: readonly string[], id: string): readonly string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function parseSaved(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
