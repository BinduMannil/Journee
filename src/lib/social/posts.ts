/**
 * Public travel-post content model + validation (pure, no storage).
 *
 * The shared shape for user-authored public content — short notes, longer blog
 * journals, and vlogs — plus a zod validator. This is the PURE CORE only:
 * persistence, authorship/auth, moderation and UI are intentionally NOT here
 * (they need storage + accounts, which are externally blocked). Keeping the
 * model and its validation pure means the feed/follow-graph cores can be built
 * and tested today, and a storage adapter can adopt this contract unchanged.
 *
 * Uses the classic `zod` entrypoint (the app's main one; the travel-data JSON
 * Schema export uses `zod/v4` separately).
 */
import { z } from "zod";

export type PostKind = "note" | "blog" | "vlog";

export interface TravelPost {
  readonly id: string;
  readonly authorId: string;
  readonly kind: PostKind;
  readonly title: string;
  readonly body: string;
  /** Destinations this post is about (catalog ids); may be empty. */
  readonly destinationIds: readonly string[];
  readonly tags: readonly string[];
  /** Required for a vlog (the video), optional otherwise. http(s) only. */
  readonly mediaUrl?: string;
  /** ISO-8601 timestamp. */
  readonly createdAt: string;
}

const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), { message: "must be an http(s) URL" });

/** Runtime schema; a vlog must carry a media URL. */
export const travelPostSchema = z
  .object({
    id: z.string().min(1).max(100),
    authorId: z.string().min(1).max(100),
    kind: z.enum(["note", "blog", "vlog"]),
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(20_000),
    destinationIds: z.array(z.string().min(1).max(100)).max(50).default([]),
    tags: z.array(z.string().min(1).max(40)).max(20).default([]),
    mediaUrl: httpUrl.optional(),
    createdAt: z.string().datetime(),
  })
  .refine((p) => p.kind !== "vlog" || typeof p.mediaUrl === "string", {
    message: "a vlog requires a mediaUrl",
    path: ["mediaUrl"],
  });

export type ParsePostResult =
  | { readonly ok: true; readonly post: TravelPost }
  | { readonly ok: false; readonly issues: z.ZodFormattedError<unknown> };

/** Validate untrusted input into a TravelPost. Never throws. */
export function parsePost(input: unknown): ParsePostResult {
  const result = travelPostSchema.safeParse(input);
  if (result.success) {
    return { ok: true, post: result.data as TravelPost };
  }
  return { ok: false, issues: result.error.format() };
}
