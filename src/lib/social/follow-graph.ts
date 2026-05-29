/**
 * Follow graph (pure, no storage).
 *
 * A directed social graph built from follow edges, with the read operations a
 * feed/discovery layer needs: who someone follows / is followed by, mutual
 * follows, and friend-of-friend suggestions. PURE CORE only — edges come from a
 * storage adapter later (blocked); here the algorithm is deterministic and
 * tested. Self-follows and duplicate edges are ignored.
 */
export interface FollowEdge {
  readonly followerId: string;
  readonly followeeId: string;
}

export interface FollowGraph {
  /** userId -> set of users they follow. */
  readonly following: ReadonlyMap<string, ReadonlySet<string>>;
  /** userId -> set of users who follow them. */
  readonly followers: ReadonlyMap<string, ReadonlySet<string>>;
}

function add(map: Map<string, Set<string>>, key: string, value: string): void {
  const set = map.get(key) ?? new Set<string>();
  set.add(value);
  map.set(key, set);
}

export function buildFollowGraph(edges: readonly FollowEdge[]): FollowGraph {
  const following = new Map<string, Set<string>>();
  const followers = new Map<string, Set<string>>();
  for (const { followerId, followeeId } of edges) {
    if (!followerId || !followeeId || followerId === followeeId) continue;
    add(following, followerId, followeeId);
    add(followers, followeeId, followerId);
  }
  return { following, followers };
}

const sorted = (set: ReadonlySet<string> | undefined): readonly string[] =>
  set ? [...set].sort() : [];

/** Users `userId` follows (sorted; [] if none/unknown). */
export function following(graph: FollowGraph, userId: string): readonly string[] {
  return sorted(graph.following.get(userId));
}

/** Users who follow `userId` (sorted; [] if none/unknown). */
export function followers(graph: FollowGraph, userId: string): readonly string[] {
  return sorted(graph.followers.get(userId));
}

export function isFollowing(graph: FollowGraph, followerId: string, followeeId: string): boolean {
  return graph.following.get(followerId)?.has(followeeId) ?? false;
}

/** Users that BOTH `a` and `b` follow (sorted). */
export function mutuals(graph: FollowGraph, a: string, b: string): readonly string[] {
  const aFollows = graph.following.get(a);
  const bFollows = graph.following.get(b);
  if (!aFollows || !bFollows) return [];
  return [...aFollows].filter((id) => bFollows.has(id)).sort();
}

/**
 * Friend-of-friend suggestions: users followed by the people `userId` follows,
 * excluding `userId` and anyone already followed. Ranked by how many of
 * `userId`'s followees also follow them (descending), then id for stability.
 */
export function suggestFollows(
  graph: FollowGraph,
  userId: string,
  limit = 5,
): readonly string[] {
  const direct = graph.following.get(userId);
  if (!direct || direct.size === 0 || limit <= 0) return [];
  const counts = new Map<string, number>();
  for (const followee of direct) {
    for (const candidate of graph.following.get(followee) ?? []) {
      if (candidate === userId || direct.has(candidate)) continue;
      counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id]) => id);
}
