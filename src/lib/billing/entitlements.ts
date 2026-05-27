/**
 * Entitlement logic (pure) — decides whether a metered action is allowed.
 *
 * Free quota is consumed first, then purchased credits. Deterministic and
 * unit-tested; storage and identity live elsewhere (store.ts) so this stays a
 * pure policy that a billing-config provider can reuse unchanged.
 */
export interface UsageState {
  /** Free metered actions already used by this subject. */
  readonly usedFree: number;
  /** Purchased credits remaining. */
  readonly credits: number;
}

export type EntitlementSource = "free" | "credit" | "none";

export interface Entitlement {
  readonly allowed: boolean;
  readonly source: EntitlementSource;
  /** Free actions still available after this point (0 once into credits). */
  readonly remainingFree: number;
  /** Credits still available. */
  readonly credits: number;
}

export const EMPTY_USAGE: UsageState = { usedFree: 0, credits: 0 };

export function evaluateEntitlement(state: UsageState, freeQuota: number): Entitlement {
  const remainingFree = Math.max(0, freeQuota - state.usedFree);
  if (remainingFree > 0) {
    return { allowed: true, source: "free", remainingFree, credits: state.credits };
  }
  if (state.credits > 0) {
    return { allowed: true, source: "credit", remainingFree: 0, credits: state.credits };
  }
  return { allowed: false, source: "none", remainingFree: 0, credits: state.credits };
}

/** Next usage state after consuming one action, or null if not allowed. */
export function consumeEntitlement(
  state: UsageState,
  freeQuota: number,
): { next: UsageState; source: EntitlementSource } | null {
  const ent = evaluateEntitlement(state, freeQuota);
  if (!ent.allowed) return null;
  if (ent.source === "free") {
    return { next: { ...state, usedFree: state.usedFree + 1 }, source: "free" };
  }
  return { next: { ...state, credits: state.credits - 1 }, source: "credit" };
}
