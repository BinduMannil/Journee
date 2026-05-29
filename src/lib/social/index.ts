/**
 * Social pure cores — public posts content model, follow graph, journey feed.
 *
 * Storage, authorship/auth, moderation and UI are intentionally absent (blocked
 * externally); these are the deterministic, tested cores a future storage layer
 * adopts unchanged.
 */
export {
  travelPostSchema,
  parsePost,
  type TravelPost,
  type PostKind,
  type ParsePostResult,
} from "./posts";
export {
  buildFollowGraph,
  following,
  followers,
  isFollowing,
  mutuals,
  suggestFollows,
  type FollowEdge,
  type FollowGraph,
} from "./follow-graph";
export {
  composeFeed,
  type FeedOptions,
  type FeedResult,
} from "./journey-feed";
export {
  groupRatingsByTarget,
  aggregateTarget,
  rankTargets,
  recommendTargets,
  type Rating,
  type RatingTargetKind,
  type RecommendOptions,
} from "./recommendations";
