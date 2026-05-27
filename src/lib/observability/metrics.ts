/**
 * Minimal in-process counter metrics (no dependencies).
 *
 * A scaffold the platform's metrics backend (Prometheus/OTel) will later
 * replace — the call sites (`incrementCounter`) stay the same. Keys encode
 * labels in a stable, low-cardinality form. `getCounters` snapshots for the
 * metrics endpoint; `resetCounters` exists for tests. See
 * docs/architecture/monitoring-observability-architecture.md.
 */
export type Labels = Record<string, string | number>;

const counters = new Map<string, number>();

function keyOf(name: string, labels?: Labels): string {
  if (!labels) return name;
  const parts = Object.keys(labels)
    .sort()
    .map((k) => `${k}=${labels[k]}`);
  return parts.length > 0 ? `${name}{${parts.join(",")}}` : name;
}

export function incrementCounter(name: string, labels?: Labels, by = 1): void {
  const key = keyOf(name, labels);
  counters.set(key, (counters.get(key) ?? 0) + by);
}

export function getCounters(): Readonly<Record<string, number>> {
  return Object.fromEntries(counters);
}

export function resetCounters(): void {
  counters.clear();
}
