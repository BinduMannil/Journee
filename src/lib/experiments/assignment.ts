/**
 * Deterministic experiment / A-B assignment (pure).
 *
 * Buckets a stable key (e.g. session or user id) into a weighted variant. Same
 * key + same variants always yields the same variant — no storage needed, so it
 * works in stateless server rendering. This is the seam monetization A/B tests
 * and gradual rollouts build on (e.g. weighting affiliate priority rules). Pure
 * and unit-tested.
 */
export interface Variant {
  readonly id: string;
  /** Relative weight; need not sum to 1. */
  readonly weight: number;
}

/** FNV-1a 32-bit hash — fast, stable, dependency-free. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function assignVariant(
  key: string,
  variants: readonly Variant[],
): string | null {
  const total = variants.reduce((sum, v) => sum + Math.max(0, v.weight), 0);
  if (total <= 0) return null;

  const point = (hash(key) / 0x100000000) * total;
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += Math.max(0, variant.weight);
    if (point < cumulative) return variant.id;
  }
  // Floating-point edge: fall back to the last positive-weight variant.
  for (let i = variants.length - 1; i >= 0; i--) {
    const v = variants[i];
    if (v && v.weight > 0) return v.id;
  }
  return null;
}
