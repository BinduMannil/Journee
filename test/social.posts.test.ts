import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePost } from "../src/lib/social/posts";

const base = {
  id: "p1",
  authorId: "u1",
  kind: "note" as const,
  title: "A morning in Gion",
  body: "Quiet lanes before the crowds.",
  createdAt: "2026-05-01T08:00:00.000Z",
};

test("parses a valid note and applies array defaults", () => {
  const r = parsePost(base);
  assert.ok(r.ok);
  assert.deepEqual(r.post.destinationIds, []);
  assert.deepEqual(r.post.tags, []);
  assert.equal(r.post.kind, "note");
});

test("rejects missing/empty required fields without throwing", () => {
  assert.equal(parsePost({ ...base, title: "" }).ok, false);
  assert.equal(parsePost({ ...base, id: undefined }).ok, false);
  assert.equal(parsePost({ ...base, createdAt: "not-a-date" }).ok, false);
  assert.equal(parsePost(null).ok, false);
});

test("a vlog requires a mediaUrl; a note does not", () => {
  assert.equal(parsePost({ ...base, kind: "vlog" }).ok, false);
  const withMedia = parsePost({ ...base, kind: "vlog", mediaUrl: "https://example.com/v.mp4" });
  assert.ok(withMedia.ok);
  assert.equal(withMedia.post.mediaUrl, "https://example.com/v.mp4");
});

test("mediaUrl must be an http(s) URL", () => {
  assert.equal(parsePost({ ...base, mediaUrl: "ftp://x/y" }).ok, false);
  assert.equal(parsePost({ ...base, mediaUrl: "javascript:alert(1)" }).ok, false);
  assert.ok(parsePost({ ...base, mediaUrl: "http://example.com/a.png" }).ok);
});

test("enforces collection bounds", () => {
  const tooMany = Array.from({ length: 51 }, (_, i) => `d${i}`);
  assert.equal(parsePost({ ...base, destinationIds: tooMany }).ok, false);
});
