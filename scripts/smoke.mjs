// Static smoke test: serves out/ the way Cloudflare Pages does (clean URLs:
// a request for /schedule is answered with schedule.html) and asserts every
// route returns 200. Client-rendered copy lives in the JS chunks (pages
// behind a <Suspense> boundary prerender only their fallback), so markers
// for those routes are checked against the built chunks; routes that
// prerender their shell are checked against the served HTML itself.
// Also asserts the .txt flight payloads exist — client-side navigation
// fetches those. Run after `npm run build`.
// Usage: npm run smoke
import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain' };

// markerIn: 'html' = assert the marker is in the served HTML,
//            'bundle' = assert it in the built JS chunks.
const ROUTES = [
  { path: '/', marker: 'Mulai Nonton', markerIn: 'bundle' },
  { path: '/anime', marker: 'Anime Not Found', markerIn: 'bundle' },
  { path: '/episode', marker: 'Episode Not Found', markerIn: 'bundle' },
  { path: '/genre', marker: 'Pick a genre first', markerIn: 'bundle' },
  { path: '/genres', marker: 'Anime Genres', markerIn: 'html' },
  { path: '/schedule', marker: 'Release Schedule', markerIn: 'html' },
  { path: '/search', marker: 'Enter a search term', markerIn: 'bundle' },
  { path: '/favorites', marker: 'Your Favorites', markerIn: 'bundle' },
  { path: '/top', marker: 'Top Anime', markerIn: 'bundle' },
  { path: '/popular', marker: 'Most Popular', markerIn: 'bundle' },
  { path: '/upcoming', marker: 'Upcoming Seasons', markerIn: 'bundle' },
  { path: '/movies', marker: 'Top Movies', markerIn: 'bundle' },
  { path: '/tv-shows', marker: 'TV Shows', markerIn: 'bundle' },
  { path: '/ongoing', marker: 'Ongoing Anime', markerIn: 'bundle' },
  { path: '/terms', marker: 'Terms of Service', markerIn: 'html' },
  { path: '/policy', marker: 'Privacy Policy', markerIn: 'html' },
  { path: '/faq', marker: 'Frequently Asked Questions', markerIn: 'html' },
  { path: '/contact', marker: 'Open an issue on GitHub', markerIn: 'html' },
];

async function collectJs(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectJs(p, acc);
    else if (entry.name.endsWith('.js')) acc.push(p);
  }
  return acc;
}

// Pages-style clean-URL resolution: /schedule -> schedule.html.
function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/^\//, '');
  const candidates = [
    path.join(ROOT, clean === '' ? 'index.html' : clean),
    path.join(ROOT, clean + '.html'),
    path.join(ROOT, clean, 'index.html'),
  ];
  for (const c of candidates) {
    if (existsSync(c) && !c.endsWith('/')) return c;
  }
  return null;
}

function serve(req, res) {
  const urlPath = new URL(req.url, 'http://x').pathname;
  const file = resolve(urlPath);
  if (!file) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  readFile(file)
    .then((body) => {
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    })
    .catch(() => {
      res.writeHead(404);
      res.end('not found');
    });
}

const server = http.createServer(serve);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// All built JS, read from disk: the same files the server serves.
let bundle = '';
for (const f of await collectJs(path.join(ROOT, '_next', 'static', 'chunks'))) {
  bundle += await readFile(f, 'utf8');
}

let failures = 0;
for (const route of ROUTES) {
  const res = await fetch(`http://127.0.0.1:${port}${route.path}`);
  const text = await res.text();
  const htmlOk = res.status === 200 && text.includes('WibuFinal');
  const markerOk =
    route.markerIn === 'html' ? text.includes(route.marker) : bundle.includes(route.marker);
  const flightOk = route.path === '/' || existsSync(path.join(ROOT, route.path.slice(1) + '.txt'));
  const ok = htmlOk && markerOk && flightOk;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} ${route.path} -> ${res.status} (shell ${htmlOk ? 'ok' : 'BAD'}, marker "${route.marker}" ${route.markerIn === 'html' ? 'in html' : 'in bundle'} ${markerOk ? 'found' : 'MISSING'}, flight .txt ${flightOk ? 'ok' : 'MISSING'})`,
  );
  if (!ok) failures++;
}

server.close();
if (failures > 0) {
  console.log(`SMOKE FAILED: ${failures} check(s)`);
  process.exit(1);
}
console.log('SMOKE OK: all routes 200, all markers found, flight payloads present');
