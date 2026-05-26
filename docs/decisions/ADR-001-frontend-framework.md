# ADR-001: Next.js 15 App Router + TypeScript strict + Tailwind

- **Status:** Accepted
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

Journee is a greenfield, content-rich, cinematic web product that needs strong
SEO, fast first paint, server-side data composition, and a maintainable
component model.

## Problem

Choose a frontend foundation that supports server-first rendering, a typed
codebase, and a design-system-driven styling approach without over-engineering
the starting point.

## Decision

Use **Next.js 15 (App Router)** with **React 19 Server Components**,
**TypeScript in strict mode** (plus `noUncheckedIndexedAccess`, no-unused
checks), and **Tailwind CSS v4** with CSS-first design tokens.

## Alternatives considered

- **Vite + React SPA.** Lighter, but loses SSR/SEO and server data composition
  that an editorial travel product needs.
- **Remix.** Strong data story; smaller ecosystem fit for our planned Supabase +
  Vercel-style deployment and team familiarity.
- **Plain CSS / CSS Modules.** More boilerplate to enforce a token-based design
  system than Tailwind v4's `@theme`.

## Tradeoffs

- (+) Server Components keep client JS small; great SEO; first-class TS.
- (+) Tailwind tokens centralize the cinematic identity.
- (−) App Router has a learning curve and some sharp edges around client/server
  boundaries.
- (−) Coupling to a React/Next deployment model.

## Security implications

Server Components keep secrets and data access on the server by default,
reducing accidental client exposure. Strict TS catches a class of bugs early.

## Operational implications

`next build` runs typecheck + lint, giving a single quality gate. CI runs the
same commands (see `.github/workflows/ci.yml`).

## Rollback strategy

The presentation layer is thin and token-driven; migrating away would mean
re-housing components in another React framework. The provider/config layers are
framework-agnostic and would carry over unchanged.

## Scaling considerations

Server-first rendering and route-level code splitting scale well. Heavy logic
belongs behind provider contracts, not in route files.
