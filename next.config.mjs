/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote imagery is allow-listed here rather than hardcoded in components.
    // Sources are driven by configuration so the catalog can grow without code changes.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Baseline security headers on every response. A strict nonce-based CSP is
  // deferred (needs per-request nonces); these are the safe, high-value headers
  // that don't risk breaking rendering. See docs/security/security-overview.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
