import { test } from "node:test";
import assert from "node:assert/strict";
import { GET } from "../src/app/api/health/route";

/**
 * The readiness probe reports config presence as booleans only (never values),
 * so it is safe to expose. In the test env no LLM key is set, so AI planning is
 * not ready.
 */
test("health reports status ok and AI planning readiness (false without a key)", async () => {
  const res = await GET();
  assert.equal(res.status, 200);
  const json = (await res.json()) as {
    status: string;
    config: { aiPlanningReady: boolean; supabaseConfigured: boolean };
  };
  assert.equal(json.status, "ok");
  assert.equal(json.config.aiPlanningReady, false);
  // Sanity: it stays a boolean, never a key/value.
  assert.equal(typeof json.config.aiPlanningReady, "boolean");
  assert.equal(typeof json.config.supabaseConfigured, "boolean");
});
