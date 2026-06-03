import type { Metadata, Viewport } from "next";
// Self-hosted variable fonts (no build-time Google Fonts fetch). The family
// names are mapped to design tokens in globals.css. See ADR-001 / dependency map.
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/montserrat";
import { site } from "@/lib/config/site";
import { getSiteUrl } from "@/lib/config/env";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ui";
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

// Mobile browser chrome theming to match the cinematic dark palette.
export const viewport: Viewport = {
  themeColor: "#11100e", // --color-ink
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-gold-bright"
        >
          Skip to content
        </a>
        <ToastProvider>
          <Nav />
          <div id="content" className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
