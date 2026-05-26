import { NextResponse, type NextRequest } from "next/server";

/**
 * Assigns a stable anonymous visitor id (`jid`) cookie used for deterministic
 * A/B assignment (e.g. affiliate variant routing). No PII; httpOnly. Kept in
 * middleware so the rest of the app stays statically renderable — A/B selection
 * happens at the edge/client via /api/affiliate/link.
 */
export function middleware(req: NextRequest): NextResponse {
  if (req.cookies.get("jid")) return NextResponse.next();
  const res = NextResponse.next();
  res.cookies.set("jid", crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
