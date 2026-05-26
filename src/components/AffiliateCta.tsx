"use client";

import { useEffect, useState } from "react";
import type { AffiliateCategory } from "@/lib/affiliate/types";

/**
 * Renders an affiliate CTA only when a link actually resolves for the visitor
 * (per-visitor A/B via the `jid` cookie, server-side in /api/affiliate/link).
 * Fetches client-side so host pages stay statically rendered; renders nothing
 * when no catalog is configured — no fabricated links, ever.
 */
export function AffiliateCta({
  category,
  label,
}: {
  category: AffiliateCategory;
  label: string;
}) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/affiliate/link?category=${encodeURIComponent(category)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { link?: { href?: string } } | null) => {
        if (active) setHref(d?.link?.href ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [category]);

  if (!href) return null;

  return (
    <a
      href={href}
      rel="sponsored noopener"
      target="_blank"
      className="inline-block rounded-full border border-gold/50 px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold-bright transition-colors hover:bg-gold/10"
    >
      {label}
    </a>
  );
}
