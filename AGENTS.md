# AGENTS.md — Inderaloka Government Portal

## Mission

Maintain a simple, premium-looking, accessible official government portal. Prefer clear code and built-in platform features over extra dependencies.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Plain CSS in `app/globals.css`
- JSON-backed content in `data/site-content.json`
- Vercel deployment
- Optional GitHub Contents API publishing from Content Studio

## Architecture

- Server pages call `getContent()` from `lib/content.ts`.
- Public data contracts are defined in `lib/types.ts`.
- Dynamic news route: `app/berita/[slug]/page.tsx`.
- Dynamic custom-page route: `app/halaman/[slug]/page.tsx`.
- Content Studio is a client component at `components/AdminStudio.tsx`.
- Authentication helpers are in `lib/auth.ts`.
- GitHub commit logic is isolated in `lib/github.ts`.
- API endpoints must verify `isAuthenticated()` before any write.

## Rules

1. Do not expose `GITHUB_TOKEN`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` to client components.
2. Do not add dependencies unless the feature cannot reasonably be implemented with Next.js, React or native browser APIs.
3. Preserve Malay as the default language.
4. Preserve keyboard navigation, visible focus states, semantic headings and meaningful labels.
5. Keep public content in `data/site-content.json`; do not hardcode new policy copy into page components unless it is structural UI copy.
6. Update `lib/types.ts` before changing the JSON schema.
7. Keep old JSON content compatible when practical.
8. For image uploads, maintain the allowlist and size limit in `app/api/admin/upload/route.ts`.
9. Run `npm run build` and `npm run lint` before finalizing changes.
10. Do not modify `.env.example` with real credentials.

## Design language

- Sovereign, calm and contemporary.
- Deep green primary, muted gold accent, warm paper backgrounds.
- Serif display headings and system sans-serif body text.
- Generous spacing, subtle borders, restrained shadows.
- Avoid excessive gradients, glass effects, animation or generic dashboard styling.

## Common tasks

### Add a new public collection

1. Add its type to `lib/types.ts`.
2. Add sample data to `data/site-content.json`.
3. Create a page/component.
4. Include it in search through `getSearchIndex()` when appropriate.
5. Add an editor section to Content Studio if non-technical editors need access.

### Add a new dynamic page field

1. Extend `CustomPage` in `lib/types.ts`.
2. Update all existing pages in JSON or provide a safe fallback.
3. Render it in `app/halaman/[slug]/page.tsx`.
4. Add the corresponding Content Studio control.

### Change branding

Edit the `site` object in `data/site-content.json` or use `/admin`. CSS colors are supplied to the root layout as `--primary` and `--accent`.
