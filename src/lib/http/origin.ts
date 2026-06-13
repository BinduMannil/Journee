import { getSiteUrl } from "@/lib/config/env";

/**
 * Same-origin guard for state-changing (POST) endpoints.
 *
 * Browsers attach an `Origin` header naming the site that initiated a request.
 * Rejecting POSTs whose `Origin` is not our own site blocks a class of
 * cross-site request forgery (CSRF — tricking a visitor's browser into making
 * a request they did not intend). Requests with no `Origin` (server-to-server
 * callers, signed postbacks, test harnesses) are allowed through — those
 * surfaces are protected by their own token/auth, not by origin.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return origin === new URL(getSiteUrl()).origin;
  } catch {
    return false;
  }
}
