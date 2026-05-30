import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config/env";
import { featuredDestinations } from "@/content/destinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/plan`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/discover`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...featuredDestinations.map((d) => ({
      url: `${base}/destinations/${d.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
