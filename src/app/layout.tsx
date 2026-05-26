import type { Metadata } from "next";
// Self-hosted variable fonts (no build-time Google Fonts fetch). The family
// names are mapped to design tokens in globals.css. See ADR-001 / dependency map.
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/montserrat";
import { site } from "@/lib/config/site";
import { getSiteUrl } from "@/lib/config/env";
import { Nav } from "@/components/Nav";
import "./globals.css";

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    siteName: site.name,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
