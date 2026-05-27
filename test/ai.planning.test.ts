import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/plan/ai/route";
import { anthropicPlanningProvider } from "../src/lib/providers/llm/anthropic";
import { getPlanningProvider } from "../src/lib/providers/llm";

function req(body: unknown): Request {
  return new Request("http://localhost/api/plan/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  destinations: [{ id: "kyoto", name: "Kyoto", mood: "Contemplative" }],
  pacing: "balanced",
};

test("AI planning is unavailable (503) when no LLM key is configured", async () => {
  // LLM_API_KEY is unset in the test env -> provider reports unavailable.
  assert.equal(anthropicPlanningProvider.isAvailable(), false);
  assert.equal(await getPlanningProvider(), null);
  const res = await POST(req(validBody));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "ai_planning_unavailable");
});

test("rejects malformed JSON with 400", async () => {
  const res = await POST(req("not json"));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "invalid_json");
});

test("rejects an invalid body (missing destinations) with 400", async () => {
  const res = await POST(req({ pacing: "balanced" }));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "invalid_body");
});

test("rejects an unknown pacing with 400", async () => {
  const res = await POST(req({ ...validBody, pacing: "frantic" }));
  assert.equal(res.status, 400);
});
