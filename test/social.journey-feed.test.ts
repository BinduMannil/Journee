import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFollowGraph } from "../src/lib/social/follow-graph";
import { composeFeed } from "../src/lib/social/journey-feed";
import type { TravelPost } from "../src/lib/social/posts";

const graph = buildFollowGraph([
  { followerId: "me", followeeId: "alice" },
  { followerId: "me", followeeId: "bob" },
]);

const mk = (id: string, authorId: string, createdAt: string): TravelPost => ({
  id,
  authorId,
  kind: "note",
  title: id,
  body: "x",
  destinationIds: [],
  tags: [],
  createdAt,
});

const posts: readonly TravelPost[] = [
  mk("p1", "alice", "2026-05-01T00:00:00.000Z"),
  mk("p2", "bob", "2026-05-03T00:00:00.000Z"),
  mk("p3", "carol", "2026-05-04T00:00:00.000Z"), // not followed
  mk("p4", "me", "2026-05-02T00:00:00.000Z"), // own
  mk("p5", "alice", "2026-05-05T00:00:00.000Z"),
];

test("feed includes only followed authors, newest first", () => {
  const feed = composeFeed(graph, "me", posts);
  assert.deepEqual(feed.posts.map((p) => p.id), ["p5", "p2", "p1"]);
  assert.equal(feed.total, 3);
  assert.equal(feed.hasMore, false);
});

test("includeOwn adds the viewer's own posts", () => {
  const feed = composeFeed(graph, "me", posts, { includeOwn: true });
  assert.deepEqual(feed.posts.map((p) => p.id), ["p5", "p2", "p4", "p1"]);
  assert.equal(feed.total, 4);
});

test("paging via limit/offset reports hasMore", () => {
  const first = composeFeed(graph, "me", posts, { limit: 2, offset: 0 });
  assert.deepEqual(first.posts.map((p) => p.id), ["p5", "p2"]);
  assert.equal(first.hasMore, true);
  const second = composeFeed(graph, "me", posts, { limit: 2, offset: 2 });
  assert.deepEqual(second.posts.map((p) => p.id), ["p1"]);
  assert.equal(second.hasMore, false);
});

test("a viewer following nobody gets an empty feed", () => {
  const feed = composeFeed(graph, "stranger", posts);
  assert.deepEqual(feed.posts, []);
  assert.equal(feed.total, 0);
});
