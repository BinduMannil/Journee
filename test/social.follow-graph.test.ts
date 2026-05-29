import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildFollowGraph,
  following,
  followers,
  isFollowing,
  mutuals,
  suggestFollows,
  type FollowEdge,
} from "../src/lib/social/follow-graph";

const edges: readonly FollowEdge[] = [
  { followerId: "a", followeeId: "b" },
  { followerId: "a", followeeId: "c" },
  { followerId: "b", followeeId: "c" },
  { followerId: "b", followeeId: "d" },
  { followerId: "c", followeeId: "d" },
  { followerId: "a", followeeId: "a" }, // self-follow ignored
  { followerId: "a", followeeId: "b" }, // duplicate ignored
];

const graph = buildFollowGraph(edges);

test("following/followers are sorted and ignore self/duplicate edges", () => {
  assert.deepEqual(following(graph, "a"), ["b", "c"]);
  assert.deepEqual(followers(graph, "d"), ["b", "c"]);
  assert.deepEqual(following(graph, "z"), []);
});

test("isFollowing reflects directed edges", () => {
  assert.equal(isFollowing(graph, "a", "b"), true);
  assert.equal(isFollowing(graph, "b", "a"), false);
});

test("mutuals returns followees shared by two users", () => {
  // a follows {b,c}; b follows {c,d} -> shared {c}
  assert.deepEqual(mutuals(graph, "a", "b"), ["c"]);
  assert.deepEqual(mutuals(graph, "a", "z"), []);
});

test("suggestFollows ranks friend-of-friends, excluding self and already-followed", () => {
  // a follows b,c. b follows c,d; c follows d. Candidates (excl a + {b,c}): d (2x).
  assert.deepEqual(suggestFollows(graph, "a"), ["d"]);
  assert.deepEqual(suggestFollows(graph, "a", 0), []);
  assert.deepEqual(suggestFollows(graph, "z"), []);
});
