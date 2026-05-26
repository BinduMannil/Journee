/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remote imagery is allow-listed here rather than hardcoded in components.
    // Sources are driven by configuration so the catalog can grow without code changes.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
