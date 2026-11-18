# Changelog

## v1.1.0 — 2026-11-18 (proper rebuild)

- **Static export for Cloudflare Pages.** `next.config.ts`: `output: 'export'`
  (was `standalone`), `images.unoptimized: true`. All data fetching moved
  from server components to a client-side Jikan client (`lib/api.ts`, replaces
  `lib/scraper.ts`): request queue (≥400 ms apart), one retry on 429, 10-min
  in-memory cache, honest empty/error states.
- **Fixed: 10 dead links.** The 4 list routes linked from home (`/top`,
  `/popular`, `/upcoming`, `/movies`) and the 7 footer links (`/terms`,
  `/policy`, `/faq`, `/contact`, `/movies`, `/tv-shows`, `/ongoing`) never
  existed — every page load prefetched their flight payloads and got 404s.
  They are real pages now: honest Terms / Privacy / FAQ / Contact pages,
  a TV-series list, and an ongoing-airing list.
- **Routes are query params now** (`/anime?id=`, `/episode?e=`, `/genre?g=`)
  because a static export cannot serve dynamic `[slug]` routes. All internal
  links updated (AnimeCard, detail, episode, genre chips, schedule).
- **Landing page (SaaS-style).** First visit shows a landing with a
  two-column hero with a live preview of the trending posters, feature grid,
  how-it-works, CTA band. `Mulai Nonton` stores `wibu-final-entered` in
  localStorage; returning visitors skip it. Unlike its sibling, the landing
  reuses the app navbar (logo left, GitHub link right) instead of a second
  header — the first version had both stacked and looked doubled.
- **GitHub link in the app navbar** (desktop + mobile menu), in the landing
  hero ("Open Source"), and in the footer (Project column).
- **Removed 9 unused dependencies** (`@google/genai`, `axios`, `cheerio`,
  `motion`, `@hookform/resolvers`, `firebase-tools`, `@tailwindcss/typography`,
  `autoprefixer`, `tw-animate-css`) — none were imported anywhere. Removed
  the AI Studio leftovers: `.env.example` (GEMINI_API_KEY, never used),
  `metadata.json` (Gemini capability claim), the HMR webpack hack in
  `next.config.ts`, `.eslintrc.json` (duplicate of the flat config),
  committed `tsconfig.tsbuildinfo`.
- **Brand color unified to orange.** Leftover blue accents from the template
  (Next Episode button, Return Home links, View All) are `#ff4e00` now.
- **Security: 2 HIGH advisories fixed in production.** The advisory sweep
  found postcss@8.4.31 nested in next (GHSA-r28c-9q8g-f849 +
  GHSA-6g55-p6wh-862q) — patched via `overrides` postcss `^8.5.18`
  (now 8.5.33). `npm audit --omit=dev` was NOT used as the gate: it still
  reports dev-only advisories, so the sweep checks production only
  (see `scripts/advisory-sweep.py`).
- **Loading + error states everywhere.** Skeletons while fetching; a clear
  error panel with retry when the Jikan API fails (rate limit / blocked
  connection) instead of an empty page.
- **CI** (`.github/workflows/ci.yml`, 4 jobs): build (typecheck + lint +
  build + upload `out/`), production advisory sweep, smoke test as its own
  job (`scripts/smoke.mjs` serves `out/` and checks all 18 routes), and a
  non-gating live smoke test against `https://wibufinal.pages.dev`.
- **Docs**: PRD, architecture, API, deployment, testing + SVG data-flow
  diagram (`docs/`). README rewritten honestly (Jikan limits, third-party
  stream, CORS dependency). Screenshots + silent video demo recorded from the
  live build (fixture Jikan data + real MAL posters served locally — see
  `docs/testing.md`).
- **Lint is now clean** (was 1 warning: an unused eslint-disable directive
  in `hooks/use-favorites.ts`).

## v0.1.0 — 2026-11-05 (baseline, as pushed)

Next.js 15 anime catalog on the Jikan API: home with 11 sections, detail,
episode iframe, genres, schedule, search, localStorage favorites.
README pointed at a Cloudflare Workers live demo
(`wibu-final.nblauliadka.workers.dev`); the 4 list routes linked from home
and the 7 footer links did not exist. The build needed a Node server
(`output: 'standalone'`) and the repo carried 9 dependencies no code
imported, including a Gemini API key placeholder.
