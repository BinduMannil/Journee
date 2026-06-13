import { test } from "node:test";
import assert from "node:assert/strict";
import { isSameOrigin } from "../src/lib/http/origin";

function reqWithOrigin(origin?: string): Request {
  const headers: Record<string, string> = {};
  if (origin) headers["origin"] = origin;
  return new Request("http://localhost/api/affiliate/click", { method: "POST", headers });
}

test("allows requests from our own site (default site url is localhost:3000)", () => {
  assert.equal(isSameOrigin(reqWithOrigin("http://localhost:3000")), true);
});

test("rejects requests from a foreign origin", () => {
  assert.equal(isSameOrigin(reqWithOrigin("https://evil.example")), false);
});

test("allows requests with no Origin header (server-to-server / test callers)", () => {
  assert.equal(isSameOrigin(reqWithOrigin()), true);
});
