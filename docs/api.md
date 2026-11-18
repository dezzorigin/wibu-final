# API — Jikan v4 (MyAnimeList, unofficial)

Base URL: `https://api.jikan.moe/v4`. No key, no auth. All calls are `GET`
from the visitor's browser.

## Endpoints used

| Call in `lib/api.ts` | Jikan endpoint |
| --- | --- |
| `getHome` | `GET /seasons/now?page=` |
| `getNew` | `GET /anime?status=airing&order_by=start_date&sort=desc` |
| `getTop` | `GET /top/anime` |
| `getPopular` | `GET /top/anime?filter=bypopularity` |
| `getUpcoming` | `GET /seasons/upcoming` |
| `getMovies` | `GET /anime?type=movie&order_by=popularity&sort=desc` |
| `getTV` | `GET /anime?type=tv&order_by=popularity&sort=desc` |
| `getAction / getRomance / getComedy / getAdventure / getSciFi / getFantasy` | `GET /anime?genres=<id>&order_by=popularity&sort=desc` |
| `getSearch` | `GET /anime?q=<query>` |
| `getGenresList` | `GET /genres/anime` |
| `getGenre` | `GET /anime?genres=<id>` |
| `getDetail` | `GET /anime/<id>/full` + `GET /anime/<id>/episodes` |
| `getEpisode` | `GET /anime/<id>` + `GET /anime/<id>/episodes/<ep>` + `GET /anime/<id>/episodes` |
| `getSchedule` | `GET /schedules?filter=<english day>` |

## Rate limits

**3 requests/second, 60/minute per IP** (Jikan's published policy, strictly
enforced). The client enforces ≥400 ms spacing and retries once on 429.
The home page makes ~11 requests in staggered groups; expect sections to
fill in over ~2–4 s on first load.

## Response shape (what the app actually uses)

- List endpoints: `data[]` with `mal_id`, `title`, `images.webp.image_url`
  (fallback `images.jpg.image_url`), `status`, `type`, `episodes`,
  `season`, `year`; `pagination.has_next_page`.
- Detail: `data` with `score`, `studios[0].name`, `aired.string`,
  `duration`, `genres[]` (`mal_id`, `name`), `synopsis`,
  `images.webp.large_image_url`.
- Episodes: `data[]` with `mal_id`, `title`, `aired`.
- Schedule: `data[]` with `broadcast.time` (may be missing → shown as `TBA`).

## What Jikan is not

- **Unofficial.** It scrapes and caches MyAnimeList. It is not affiliated
  with MAL, offers no uptime guarantee, and its data can lag MAL by hours.
- **Not a streaming API.** Jikan has no video. The episode stream comes from
  a separate third-party mirror (`animeplay.cfd`), framed by the episode
  page. If that mirror is down, the player is empty — that is outside this
  app's control and the page says so.
- **CORS.** The app depends on Jikan sending `Access-Control-Allow-Origin`.
  Multiple independent API directories list Jikan v4 as CORS-enabled. If
  that ever changes, the catalog fails with an honest error state, not a
  blank page.

## Verifying the API is up

From any machine that can reach the internet (the sandbox VM's egress
currently stalls on `api.jikan.moe` — see `docs/testing.md`):

```bash
curl 'https://api.jikan.moe/v4/top/anime?limit=1'
```
