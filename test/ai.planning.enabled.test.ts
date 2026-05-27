import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/plan/ai/route";
import {
  anthropicPlanningProvider,
  parsePlanResponse,
} from "../src/lib/providers/llm/anthropic";
import { getPlanningProvider } from "../src/lib/providers/llm";
import { resetEnvCache } from "../src/lib/config/env";
import { resetFlagsCache } from "../src/lib/config/flags";
import { getUsageStore, resetUsageStore } from "../src/lib/billing/store";
import { FREE_AI_PLANS, FREE_AI_PLANS_PER_IP } from "../src/content/pricing";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

/**
 * Exercises the AI planning route on the *enabled* path. The provider is the
 * real Anthropic adapter (gated on env + flag, both set here); only the network
 * boundary (`fetch`) is mocked, so no key and no egress are needed. This keeps
 * the test honest — it covers the actual provider parsing/validation and the
 * route's entitlement/abuse gates, not a stand-in.
 */
const realFetch = globalThis.fetch;
let fetchCalls = 0;
let lastFetchInit: RequestInit | undefined;

const validDay = { title: "Day 1 — Eastern temples", detail: "Kiyomizu at dawn, tea after." };
const validPlan = {
  summary: "A contemplative loop through Kyoto.",
  days: [validDay],
};

/** Shape an Anthropic Messages response carrying `text` as the model output. */
function anthropicResponse(text: string, status = 200): Response {
  return new Response(JSON.stringify({ content: [{ type: "text", text }] }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockFetch(impl: () => Response | Promise<Response>): void {
  globalThis.fetch = (async (_url: string, init?: RequestInit) => {
    fetchCalls += 1;
    lastFetchInit = init;
    return impl();
  }) as typeof fetch;
}

function req(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/plan/ai", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  destinations: [{ id: "kyoto", name: "Kyoto", mood: "Contemplative" }],
  pacing: "balanced",
};

beforeEach(() => {
  // Baseline: AI planning enabled (key + flag). Individual tests may override.
  process.env.LLM_API_KEY = "test-key";
  process.env.LLM_MODEL = "test-model";
  process.env.JOURNEE_ENABLED_FEATURES = "ai-planning";
  resetEnvCache();
  resetFlagsCache();
  resetUsageStore();
  resetCounters();
  fetchCalls = 0;
  lastFetchInit = undefined;
  mockFetch(() => anthropicResponse(JSON.stringify(validPlan)));
});

after(() => {
  globalThis.fetch = realFetch;
});

test("provider is available when both the LLM key and the ai-planning flag are set", async () => {
  assert.equal(anthropicPlanningProvider.isAvailable(), true);
  assert.notEqual(await getPlanningProvider(), null);
});

test("flag disabled -> provider unavailable even with a key (503)", async () => {
  process.env.JOURNEE_ENABLED_FEATURES = "";
  resetEnvCache();
  resetFlagsCache();
  assert.equal(anthropicPlanningProvider.isAvailable(), false);
  assert.equal(await getPlanningProvider(), null);
  const res = await POST(req(validBody));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "ai_planning_unavailable");
  assert.equal(fetchCalls, 0);
});

test("missing key -> provider unavailable even with the flag on (503)", async () => {
  delete process.env.LLM_API_KEY;
  resetEnvCache();
  resetFlagsCache();
  assert.equal(anthropicPlanningProvider.isAvailable(), false);
  assert.equal(await getPlanningProvider(), null);
  const res = await POST(req(validBody));
  assert.equal(res.status, 503);
  assert.equal(fetchCalls, 0);
});

test("rejects an over-large destinations array with 400 (cost/abuse bound)", async () => {
  const tooMany = Array.from({ length: 21 }, (_, i) => ({
    id: `d${i}`,
    name: `Place ${i}`,
    mood: "Calm",
  }));
  const res = await POST(req({ destinations: tooMany, pacing: "balanced" }));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "invalid_body");
  assert.equal(fetchCalls, 0);
});

test("successful structured response -> 200 with parsed plan and consumed free quota", async () => {
  const res = await POST(req(validBody, { cookie: "jid=user-success" }));
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.summary, validPlan.summary);
  assert.equal(json.days.length, 1);
  assert.equal(json.days[0].title, validDay.title);
  assert.equal(json.providerId, anthropicPlanningProvider.id);
  assert.equal(json.model, "test-model");
  assert.equal(json.entitlement.source, "free");
  assert.equal(json.entitlement.remainingFree, FREE_AI_PLANS - 1);
  assert.equal(fetchCalls, 1);
  // The upstream call is given an abort signal (the request-timeout guard).
  assert.ok(lastFetchInit?.signal instanceof AbortSignal);
  // Free quota was consumed exactly once for this subject.
  const after = await getUsageStore().get("jid:user-success");
  assert.equal(after.usedFree, 1);
  // Success is counted for observability.
  assert.equal(getCounters()["ai_planning_success{providerId=anthropic-planning}"], 1);
});

test("LLM failure (upstream non-2xx) -> 502 and free quota NOT consumed", async () => {
  mockFetch(() => anthropicResponse("", 500));
  const res = await POST(req(validBody, { cookie: "jid=user-fail" }));
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, "ai_planning_failed");
  const after = await getUsageStore().get("jid:user-fail");
  assert.equal(after.usedFree, 0);
  // Failure is counted for observability.
  assert.equal(getCounters()["ai_planning_failed"], 1);
});

test("malformed LLM response shape -> 502 and free quota NOT consumed", async () => {
  mockFetch(() => anthropicResponse(JSON.stringify({ not: "a plan" })));
  const res = await POST(req(validBody, { cookie: "jid=user-bad" }));
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, "ai_planning_failed");
  const after = await getUsageStore().get("jid:user-bad");
  assert.equal(after.usedFree, 0);
});

test("quota exhausted -> 402 before any LLM call", async () => {
  await getUsageStore().save("jid:user-quota", { usedFree: FREE_AI_PLANS, credits: 0 });
  const res = await POST(req(validBody, { cookie: "jid=user-quota" }));
  assert.equal(res.status, 402);
  const json = await res.json();
  assert.equal(json.error, "quota_exhausted");
  assert.equal(json.remainingFree, 0);
  assert.equal(fetchCalls, 0);
});

test("per-IP free limit reached -> 429 before any LLM call", async () => {
  // A fresh visitor (free quota available) but the IP has hit its free ceiling.
  await getUsageStore().save("ip:9.9.9.9", {
    usedFree: FREE_AI_PLANS_PER_IP,
    credits: 0,
  });
  const res = await POST(
    req(validBody, { cookie: "jid=user-new", "x-forwarded-for": "9.9.9.9" }),
  );
  assert.equal(res.status, 429);
  assert.equal((await res.json()).error, "ip_free_limit_reached");
  assert.equal(fetchCalls, 0);
});

test("parsePlanResponse validates shape: accepts valid, rejects malformed", () => {
  const ok = parsePlanResponse(JSON.stringify(validPlan));
  assert.equal(ok.summary, validPlan.summary);
  const okDay = ok.days[0];
  assert.ok(okDay);
  assert.equal(okDay.detail, validDay.detail);
  // defaults a missing detail to an empty string
  const defaulted = parsePlanResponse('{"summary":"x","days":[{"title":"t"}]}').days[0];
  assert.ok(defaulted);
  assert.equal(defaulted.detail, "");
  // throws on a structurally wrong payload
  assert.throws(() => parsePlanResponse('{"summary":"x"}'));
  assert.throws(() => parsePlanResponse('{"summary":"x","days":[]}'));
});
