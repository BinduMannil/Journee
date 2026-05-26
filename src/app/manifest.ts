import type { MetadataRoute } from "next";
import { site } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#11100e",
    theme_color: "#11100e",
  };
}
