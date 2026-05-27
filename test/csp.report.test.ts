import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/csp-report/route";
import { getCounters, resetCounters } from "../src/lib/observability/metrics";

function cspReq(body: string): Request {
  return new Request("http://localhost/api/csp-report", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

test("records a legacy csp-report wrapper and returns 204", async () => {
  resetCounters();
  const res = await POST(
    cspReq(
      JSON.stringify({
        "csp-report": {
          "violated-directive": "script-src",
          "blocked-uri": "https://evil.example",
          "document-uri": "https://journee.example",
        },
      }),
    ),
  );
  assert.equal(res.status, 204);
  assert.equal(getCounters()["csp_violation"], 1);
});

test("records a modern report body (effectiveDirective/blockedURL) and returns 204", async () => {
  resetCounters();
  const res = await POST(
    cspReq(
      JSON.stringify({
        effectiveDirective: "img-src",
        blockedURL: "https://evil.example/x.png",
        documentURL: "https://journee.example",
      }),
    ),
  );
  assert.equal(res.status, 204);
  assert.equal(getCounters()["csp_violation"], 1);
});

test("fails safe on a malformed body: no count, still 204", async () => {
  resetCounters();
  const res = await POST(cspReq("not json"));
  assert.equal(res.status, 204);
  assert.equal(getCounters()["csp_violation"], undefined);
});
