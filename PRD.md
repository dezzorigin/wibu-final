# WibuFinal — PRD v1.1.0

## 1. What it is

WibuFinal is an anime catalog + streaming front-end: browse the MyAnimeList
catalog (seasonal chart, top lists, genres, weekly schedule), read details
(score, studio, synopsis, episode list), keep favorites in the browser, and
watch episodes in place.

It is a **fully static site** (Next.js static export on Cloudflare Pages).
There is no backend of its own. All catalog data comes from the **Jikan API**
(the unofficial MyAnimeList REST API, `https://api.jikan.moe/v4`, no key),
called directly from the visitor's browser.

## 2. Users & jobs

- **Viewer**: find something to watch tonight → browse trending / search /
  genre → check score + synopsis → watch episode 1.
- **Tracker**: check what airs on a given day (schedule Senin–Minggu).
- **Collector**: heart anime to keep a favorites list without an account.

Non-goals: accounts, comments, own video hosting, downloads, recommendations
engine, manga.

## 3. Routes

| Route | What it does |
| --- | --- |
| `/` | Landing on first visit (localStorage `wibu-final-entered`); catalog after entering. Hero = #1 trending anime. 11 sections: Trending, Now Playing, Most Popular, Upcoming, Top Movies, Action, Romance, Comedy, Adventure, Sci-Fi, Fantasy. Pagination for Now Playing. |
| `/top`, `/popular`, `/upcoming`, `/movies` | Full paginated lists. (These were linked from home since v0.1 but the pages never existed — 404. Fixed in v1.1.0.) |
| `/anime?id=<mal_id>` | Detail: poster, score, status, duration, release, studio, type, episode count, genres, synopsis, episode list, favorite button. |
| `/episode?e=<mal_id>-<ep>` | Stream iframe + prev/next navigation + full episode list. |
| `/genre?g=<mal_id>` | Paginated list for one genre. |
| `/genres` | All genres with counts. |
| `/schedule` | 7-day release schedule with airing times. |
| `/search?q=...` | Title search, paginated. |
| `/favorites` | Favorites from localStorage (`animeFavorites`). |
| `/tv-shows` | TV series, most popular first. (Footer linked here since v0.1; the page never existed — 404. Fixed in v1.1.0.) |
| `/ongoing` | Currently-airing anime, newest first. (Same story as `/tv-shows`.) |
| `/terms`, `/policy`, `/faq`, `/contact` | Static info pages. (Footer linked all four since v0.1; none existed — 404. Fixed in v1.1.0.) |

Why query params instead of `/anime/<id>`: a static export cannot serve
dynamic `[slug]` routes without pre-generating every id at build time.
Query params keep every page a real static file while the client reads the
id from the URL. See `docs/architecture.md`.

## 4. Data & limits (honest)

- **Jikan rate limit: 3 req/s, 60 req/min per IP.** The client spaces
  requests (≥400 ms apart, one 429 retry). The home page fires ~11 requests
  in staggered groups; first paint shows skeletons, sections fill in over
  ~2–4 s. That is the design, not a bug.
- **Catalog data is a cache of MyAnimeList**, hours old. Scores and airing
  status can lag MAL.
- **Streaming is NOT ours.** The episode player is an iframe to a
  third-party mirror (`animeplay.cfd`). It can be down, region-blocked, or
  show its own ads. The app only frames it and says so on the page.
- **Favorites live only in this browser** (localStorage). Clearing site data
  deletes them; there is no sync.
- **CORS dependency.** The browser calls `api.jikan.moe` directly. If Jikan
  ever drops its CORS headers, the catalog stops loading and the app shows
  an honest error state with a retry button instead of a blank page.

## 5. Design

Dark cinematic theme (#050505 background, orange `#ff4e00` / amber `#ffbd00`
accent), top navbar on desktop and mobile. Landing page is SaaS-style:
the app navbar itself is the landing navbar (logo left, GitHub link
right), two-column hero with a live preview of the trending posters,
feature grid, how-it-works, CTA band.

## 6. Quality gates

- `npm run typecheck` (tsc --noEmit), `npm run lint` (eslint, 0 errors),
  `npm run build` (static export, 20 routes), `npm run smoke` (serves `out/`,
  18 routes × 200 + markers in bundle).
- Play-test in headless Chromium against the built output with fixture
  Jikan responses (the sandbox egress cannot reach `api.jikan.moe`, so live
  data is verified in a real browser instead — see `docs/testing.md`).
- CI (`.github/workflows/ci.yml`) runs typecheck + lint + build, a
  production advisory sweep, and the smoke test (separate jobs), plus a
  non-gating live smoke test, on every push and PR to main.

## 7. Deploy

Cloudflare Pages direct upload of `out/` (see `docs/deployment.md`).
Live URL is set as the repo About homepage. No environment variables, no
secrets, no server.
