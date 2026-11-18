# Testing

## What runs in CI

`.github/workflows/ci.yml` (Node 20), four jobs:

1. `build`: `npm ci` → `npm run typecheck` → `npm run lint` →
   `npm run build` → upload `out/`.
2. `advisory-sweep`: `python3 scripts/advisory-sweep.py` — production
   dependencies against the GitHub Advisory Database; FAILs on any
   high/critical finding in prod (replaces `npm audit --omit=dev`, which
   still reports dev-only advisories — see below).
3. `smoke`: downloads the `out/` artifact, runs `npm run smoke`.
4. `live-smoke` (non-gating): HTTP 200 + marker on
   `https://wibu-final.pages.dev/`.

Jobs 1–3 must pass. `live-smoke` is `continue-on-error`: it can go red
when the newest code is not deployed yet, which is not a code failure.

### Advisory sweep — why not `npm audit`

`npm audit --omit=dev` is documented to exclude dev dependencies, but in
practice it still reports advisories only reachable through dev packages.
The sweep queries the same data source Dependabot uses (GitHub Advisory
Database) and checks ONLY the production tree. It caught 2 real HIGHs on
2026-11-18 (postcss@8.4.31 nested in next, GHSA-r28c-9q8g-f849 +
GHSA-6g55-p6wh-862q), fixed with an `overrides` entry for postcss
`^8.5.18` (now 8.5.33). Locally the sweep needs a token
(`GITHUB_TOKEN=... python3 scripts/advisory-sweep.py`); unauthenticated
calls hit the 60/hour GitHub rate limit fast on the shared egress IP.

## Smoke test (`scripts/smoke.mjs`)

Serves `out/` on localhost and checks all 18 routes return HTTP 200 with the
app shell. Because every page is client-rendered, the visible copy lives in
the JS chunks, not the static HTML — so markers are asserted against the
built chunks (same technique as the live check in `docs/deployment.md`).

```
PASS / -> 200 (shell ok, marker "Mulai Nonton" in bundle found, ...)
... (18/18)
SMOKE OK: all routes 200, all markers found, flight payloads present
```

## Play-test (headless Chromium)

`~/workspace/absensirapat-audit/diag/play-wibufinal.mjs` drives the built site
in headless Chromium (via the local forwarder proxy) and asserts, with
screenshots — **45 checks, all passing, 0 console/page errors**:

1. Landing renders (hero, GitHub link, "Mulai Nonton").
2. Clicking "Mulai Nonton" shows the catalog: hero banner + 11 sections with
   real cards.
3. Search for "frieren" returns results; opening one shows the detail page
   (score, genres, episode list).
4. Favorite toggle adds the anime; `/favorites` lists it in the same session.
5. `/schedule` renders all 7 days; `/genre?g=1` renders Action; `/top`,
   `/popular`, `/upcoming`, `/movies`, `/tv-shows`, `/ongoing` all render
   (the routes that used to 404).
6. Episode page renders the player iframe + prev/next + episode list.
7. Mobile viewport (390px): landing + catalog render without horizontal
   overflow.

### Fixture data — read this before trusting the screenshots

The sandbox VM's egress **cannot reach `api.jikan.moe`**: the CONNECT
tunnel establishes, then the GET hangs with 0 bytes (verified multiple
times, 2026-11-18). The API itself is up globally (independent checks show
it live). The same stall affects `cdn.myanimelist.net` **through the
headless browser's forwarder proxy** — curl via the env egress proxy
fetches the same poster files fine (HTTP 200), but through the forwarder
they hang with 0 bytes (verified 2026-11-18, two poster URLs + fonts
control: fonts.gstatic.com works through the forwarder, the MAL CDN does
not).

So the play-test intercepts in the browser:

- `https://api.jikan.moe/v4/*` → **fixture JSON**
  (`~/workspace/absensirapat-audit/diag/wibu-final-fixtures.mjs`) shaped
  exactly like real Jikan v4 responses (real anime, real MAL ids, real
  poster URLs).
- `https://cdn.myanimelist.net/*` → the **real poster files, downloaded
  verbatim** from the CDN (`~/workspace/wibu-final/posters/`, 11 JPEGs)
  and served from disk. Only the transport is local; the pixels are the
  actual MAL CDN files.

That verifies all the app logic — routing, rendering, favorites,
navigation — but **not** the live Jikan round-trip from this VM.

**The live round-trip must be verified in a real browser** (not the VM):
open the deployed site, enter the catalog, and confirm cards load with real
data. Until that check is done, the honest claim is: "app logic verified
end-to-end with fixtures; live Jikan data pending a real-browser check."

The video demo (`docs/demo.mp4`) is recorded the same way — silent
(headless recording captures no audio), fixture data, stated in the README.
Recording script: `~/workspace/absensirapat-audit/diag/record-wibufinal.mjs`
(64 frames → `ffmpeg -framerate 3 -i frame-%04d.jpg -c:v libx264
-pix_fmt yuv420p demo.mp4`).

### One test-script lesson (not an app bug)

The mobile check opens a second tab in the same browser, which shares
`localStorage` with the desktop tab — so the desktop's
`wibu-final-entered=1` makes the mobile tab skip the landing. The script
removes that exact key and reloads before asserting the mobile hero. The
key is `wibu-final-entered` (with dash); an earlier version of the script
removed `wibufinal-entered` (no dash), which removed nothing and made the
mobile hero check fail while the app was fine.

## Manual checklist (real browser)

- [ ] Landing → catalog loads with real cards (Jikan reachable).
- [ ] Search "frieren" → results → detail → episode 1 → player iframe loads.
- [ ] Favorite persists across reload.
- [ ] Schedule shows 7 days.
- [ ] Mobile 390px: no horizontal overflow on landing or catalog.
