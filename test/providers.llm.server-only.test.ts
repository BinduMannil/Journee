import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Structural guard for the "AI planning provider is server-only" invariant
 * (docs/architecture/ai-planning-architecture.md). Two regressions would break
 * it, and both are caught here without a bundler:
 *  1. A Client Component importing the LLM provider — that would pull the
 *     adapter (and its key read) toward the browser bundle.
 *  2. The provider reading a `NEXT_PUBLIC_` env var — Next.js inlines those into
 *     the client bundle, so the key must never be sourced that way.
 */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const SRC = join(process.cwd(), "src");
const LLM_IMPORT = /from\s+["'][^"']*providers\/llm/;

test("no Client Component imports the LLM planning provider", () => {
  const offenders = walk(SRC).filter((file) => {
    const src = readFileSync(file, "utf8");
    const isClient = /^\s*["']use client["']/m.test(src);
    return isClient && LLM_IMPORT.test(src);
  });
  assert.deepEqual(
    offenders,
    [],
    `LLM provider must stay server-only; imported by client component(s): ${offenders.join(", ")}`,
  );
});

test("the LLM provider never reads a NEXT_PUBLIC_ (client-exposed) env var", () => {
  const llmDir = join(SRC, "lib", "providers", "llm");
  const leaks = walk(llmDir).filter((file) => readFileSync(file, "utf8").includes("NEXT_PUBLIC_"));
  assert.deepEqual(leaks, [], `LLM provider must not reference NEXT_PUBLIC_ env: ${leaks.join(", ")}`);
});
