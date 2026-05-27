/**
 * Usage store seam for metering.
 *
 * Tracks per-subject usage (subject = the anonymous `jid` today, an account id
 * once auth exists). The default is in-memory and therefore NON-DURABLE and
 * per-instance — fine for local/dev and as a soft gate, but real enforcement
 * needs a shared, durable store. A Supabase-backed `UsageStore` is the drop-in
 * (see docs/runbooks/hosted-enablement.md); swap it in `getUsageStore()`.
 */
import { EMPTY_USAGE, type UsageState } from "./entitlements";

export interface UsageStore {
  get(subject: string): Promise<UsageState>;
  save(subject: string, state: UsageState): Promise<void>;
}

const memory = new Map<string, UsageState>();

export const memoryUsageStore: UsageStore = {
  async get(subject) {
    return memory.get(subject) ?? EMPTY_USAGE;
  },
  async save(subject, state) {
    memory.set(subject, state);
  },
};

/** Exposed for tests. */
export function resetUsageStore(): void {
  memory.clear();
}

export function getUsageStore(): UsageStore {
  return memoryUsageStore;
}
