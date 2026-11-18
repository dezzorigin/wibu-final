# Architecture

## Stack

- **Next.js 15.5 (App Router) + React 19 + TypeScript**, Tailwind CSS v4.
- **Static export** (`output: 'export'`) → plain files in `out/`, hosted on
  Cloudflare Pages. No server, no env vars, no secrets.
- **Data**: Jikan API v4 (`https://api.jikan.moe/v4`), called from the
  browser. Posters from `cdn.myanimelist.net`. Stream iframe from the
  third-party mirror `animeplay.cfd`.
- **State**: favorites in `localStorage` (`animeFavorites`); landing-entered
  flag in `localStorage` (`wibu-final-entered`).

## Why everything is client-side

Pages is static hosting: there is no Node server to fetch Jikan at request
time. The old code fetched server-side (`next: { revalidate: 3600 }`) and
deployed with `output: 'standalone'`, which Pages cannot run. Two options
were considered:

1. **Pages Functions proxy** (`/api/*` → Jikan) — kills the CORS question
   entirely, but needs a wrangler deploy path instead of the proven
   direct-upload flow, and adds a server component to maintain.
2. **Direct browser fetch** — Jikan v4 serves CORS headers (verified in
   multiple independent API directories: "CORS enabled — callable directly
   from browser JavaScript"), so the browser can call it directly.

Option 2 was chosen: simpler, no server, and the standard way Jikan-backed
front-ends work. The risk (Jikan dropping CORS) is handled with an explicit
error state + retry, and documented in the README and PRD.

## Routes and the query-param decision

A static export cannot serve dynamic `[slug]` routes: `next build` requires
`generateStaticParams()` for every dynamic segment, and the ids are only
knowable at runtime. So dynamic segments were replaced by static pages that
read an id from the query string:

- `/anime/[slug]` → `/anime?id=<mal_id>`
- `/episode/[slug]` → `/episode?e=<mal_id>-<ep_id>`
- `/genre/[slug]` → `/genre?g=<genre_id>`

All 20 routes are real static files (see `next build` output: 20 pages
including `/_not-found` and `/icon.svg`).

## Data flow

See `docs/diagram.html` (SVG). In short:

```
Visitor browser ──► Cloudflare Pages (static out/)
      │  fetch (CORS)            │  <img> posters
      ▼                          ▼
api.jikan.moe/v4 ──►       cdn.myanimelist.net
      │  iframe src
      ▼
animeplay.cfd (third-party stream mirror)
      │  localStorage only
      ▼
favorites + entered flag (this browser, never leaves it)
```

## The Jikan client (`lib/api.ts`)

Same function surface as the old `lib/scraper.ts` (`getHome`, `getTop`,
`getPopular`, `getUpcoming`, `getMovies`, genre helpers, `getSearch`,
`getGenresList`, `getGenre`, `getDetail`, `getEpisode`, `getSchedule`).

- **Queue**: requests are spaced ≥400 ms apart (Jikan allows 3/s).
- **Retry**: one retry after 1 s on HTTP 429.
- **Cache**: successful responses cached in memory for 10 minutes, so
  navigating back does not re-hit the API.
- **Failure shape**: on any error the fetch resolves to
  `{ data: [], pagination: { has_next_page: false } }` — pages render their
  empty/error state instead of throwing.
- `getDetail` returns `null` when the anime does not exist (old code returned
  a fake `"Unknown"` title, so its "not found" branch could never trigger).

## Rendering

Every data page is a client component (`'use client'`) with three states:
skeleton → content / empty / error. Pages that read `useSearchParams` are
wrapped in `<Suspense>` (required by Next for static prerendering).
The home page keeps the original staggered fetch groups (3 parallel, 600 ms
between groups) on top of the client's own spacing.

## What was removed, and why

| Removed | Reason |
| --- | --- |
| `@google/genai`, `GEMINI_API_KEY` (.env.example), `metadata.json` | AI Studio template leftovers. No code imported them; there is no AI feature in this app. |
| `axios`, `cheerio` | The old scraper used them before the Jikan rewrite; nothing imports them now. |
| `motion`, `@hookform/resolvers`, `firebase-tools`, `@tailwindcss/typography`, `autoprefixer`, `tw-animate-css` | Installed, never imported. Tailwind v4 does not need autoprefixer; no animation classes used the library. |
| `lib/scraper.ts` | Replaced by `lib/api.ts` (same surface, client-safe). |
| `.eslintrc.json`, committed `tsconfig.tsbuildinfo` | Duplicate / build artifact. |
