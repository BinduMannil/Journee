/**
 * Safe affiliate URL rendering.
 *
 * Affiliate links are stored as templates with `{placeholder}` tokens (never
 * final URLs in code). This renders a template into a concrete URL, encoding
 * substituted values and rejecting non-http(s) schemes so a malicious template
 * can't produce e.g. a `javascript:` link. Pure and unit-tested.
 */
export class AffiliateUrlError extends Error {}

export function renderAffiliateUrl(
  template: string,
  params: Readonly<Record<string, string>> = {},
): string {
  const substituted = template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = params[key];
    return value === undefined ? "" : encodeURIComponent(value);
  });

  let parsed: URL;
  try {
    parsed = new URL(substituted);
  } catch {
    throw new AffiliateUrlError(`Invalid affiliate URL from template: ${template}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new AffiliateUrlError(`Unsupported affiliate URL scheme: ${parsed.protocol}`);
  }
  return parsed.toString();
}
