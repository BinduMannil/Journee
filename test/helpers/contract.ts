import assert from "node:assert/strict";
import type { Provider, ProviderCapability } from "../../src/lib/providers/types";

/**
 * Reusable assertion that a value satisfies the Provider contract. Import this
 * from any provider test so new adapters get contract coverage for free.
 * (Lives under test/helpers so it is not auto-discovered as a test file.)
 */
const CAPABILITIES: ProviderCapability[] = [
  "content",
  "destinations",
  "affiliate",
  "weather",
  "events",
];

export function assertProviderContract(p: Provider<unknown>): void {
  assert.equal(typeof p.id, "string");
  assert.ok(p.id.length > 0, "id must be non-empty");
  assert.equal(typeof p.name, "string");
  assert.ok(p.name.length > 0, "name must be non-empty");
  assert.ok(CAPABILITIES.includes(p.capability), `unknown capability ${p.capability}`);
  assert.equal(typeof p.priority, "number");
  assert.ok(Number.isFinite(p.priority));
  assert.equal(typeof p.isAvailable, "function");
  assert.equal(typeof p.fetch, "function");
}
