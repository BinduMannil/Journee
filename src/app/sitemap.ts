import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/env";
import { featuredDestinations } from "@/content/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...featuredDestinations.map((d) => ({
      url: `${base}/destinations/${d.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
