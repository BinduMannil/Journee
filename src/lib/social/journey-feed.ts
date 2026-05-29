/**
 * Journey feed composition (pure, no storage).
 *
 * Given a viewer, a follow graph, and a pool of posts, composes the viewer's
 * feed: posts authored by the people they follow (optionally including their
 * own), newest first, with paging. PURE CORE only — the post pool comes from a
 * storage adapter later (blocked). Ranking is honest recency (createdAt desc,
 * id as a stable tie-break); no engagement signals are fabricated.
 */
import { following, type FollowGraph } from "./follow-graph";
import type { TravelPost } from "./posts";

export interface FeedOptions {
  /** Include the viewer's own posts in their feed (default false). */
  readonly includeOwn?: boolean;
  /** Page size (default 20, min 1). */
  readonly limit?: number;
  /** Page offset (default 0, min 0). */
  readonly offset?: number;
}

export interface FeedResult {
  readonly posts: readonly TravelPost[];
  /** Total matching posts before paging. */
  readonly total: number;
  /** Whether more posts exist beyond this page. */
  readonly hasMore: boolean;
}

const byRecency = (a: TravelPost, b: TravelPost): number => {
  const at = Date.parse(a.createdAt);
  const bt = Date.parse(b.createdAt);
  if (bt !== at) return bt - at; // newest first
  return a.id.localeCompare(b.id);
};

export function composeFeed(
  graph: FollowGraph,
  viewerId: string,
  posts: readonly TravelPost[],
  opts: FeedOptions = {},
): FeedResult {
  const authors = new Set(following(graph, viewerId));
  if (opts.includeOwn) authors.add(viewerId);

  const limit = Math.max(1, Math.trunc(opts.limit ?? 20));
  const offset = Math.max(0, Math.trunc(opts.offset ?? 0));

  const matching = posts.filter((p) => authors.has(p.authorId)).sort(byRecency);
  const page = matching.slice(offset, offset + limit);

  return {
    posts: page,
    total: matching.length,
    hasMore: offset + limit < matching.length,
  };
}
