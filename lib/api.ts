// Client-side Jikan API client (MyAnimeList, unofficial).
//
// The app is a fully static export (Cloudflare Pages), so there is no
// server to fetch from: every request goes straight from the visitor's
// browser to https://api.jikan.moe/v4, which serves CORS headers.
// (Verified: multiple independent API directories list Jikan v4 as
// "CORS enabled — callable directly from browser JavaScript".)
//
// Jikan rate limit: 3 requests/second and 60/minute per IP, strictly
// enforced. Requests are spaced through a small queue (>= 400 ms apart)
// and a 429 gets one retry after a 1 s pause. Failed requests resolve to
// the same empty shape the old server code returned, so pages render an
// honest empty/error state instead of crashing.
export const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

const MIN_GAP_MS = 400;
const CACHE_TTL_MS = 10 * 60 * 1000;

let lastStart = 0;
let queue: Promise<void> = Promise.resolve();
const cache = new Map<string, { at: number; data: unknown }>();

function spaced(): Promise<void> {
  const run = queue.then(async () => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastStart));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastStart = Date.now();
  });
  queue = run.catch(() => undefined);
  return run;
}

async function fetchJikan(endpoint: string) {
  const cached = cache.get(endpoint);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data as never;

  await spaced();
  const url = JIKAN_BASE_URL + endpoint;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url);
      if (response.status === 429 && attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000));
        await spaced();
        continue;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      const json = await response.json();
      cache.set(endpoint, { at: Date.now(), data: json });
      return json;
    } catch (error) {
      console.error(`Error fetching from Jikan:`, error instanceof Error ? error.message : error);
      return { data: [], pagination: { has_next_page: false } };
    }
  }
  return { data: [], pagination: { has_next_page: false } };
}

export interface AnimeItem {
  title: string;
  link: string;
  slug: string;
  poster: string | null;
  status: string | null;
  type: string | null;
  episode: string | null;
  sub: string | null;
}

export interface AnimeListResponse {
  items: AnimeItem[];
  currentPage: number;
  hasNext: boolean;
}

function mapAnime(item: any): AnimeItem {
  return {
    title: item.title,
    link: `/anime?id=${item.mal_id}`,
    slug: String(item.mal_id),
    poster: item.images?.webp?.image_url || item.images?.jpg?.image_url || null,
    status: item.status,
    type: item.type,
    episode: item.episodes ? `${item.episodes} Eps` : null,
    sub: item.season ? `${item.season} ${item.year}` : null,
  };
}

export async function getHome(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/seasons/now?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getNew(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?status=airing&order_by=start_date&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getTop(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/top/anime?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getPopular(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/top/anime?filter=bypopularity&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getUpcoming(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/seasons/upcoming?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getMovies(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?type=movie&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getTV(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?type=tv&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getAction(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=1&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getRomance(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=22&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getComedy(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=4&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getAdventure(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=2&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getSciFi(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=24&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getFantasy(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=10&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getSearch(query: string, page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?q=${encodeURIComponent(query)}&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getGenresList() {
  const data = await fetchJikan(`/genres/anime`);
  const items: { name: string; count: number | null; slug: string }[] = [];
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((g: any) => {
      items.push({
        name: g.name,
        count: g.count,
        slug: String(g.mal_id),
      });
    });
  }
  return items;
}

export async function getGenre(slug: string, page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=${slug}&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export interface AnimeDetail {
  slug: string;
  title: string;
  poster: string | null;
  rating: number | null;
  status: string | null;
  studio: string | null;
  released: string | null;
  duration: string | null;
  type: string | null;
  totalEps: string | null;
  genres: { name: string; slug: string }[];
  synopsis: string | null;
  episodes: { number: string | null; title: string | null; slug: string; date: string | null }[];
}

export async function getDetail(slug: string): Promise<AnimeDetail | null> {
  const details = await fetchJikan(`/anime/${slug}/full`);
  const info = details.data || {};
  if (!info.mal_id && !info.title) return null;

  const eps = await fetchJikan(`/anime/${slug}/episodes`);

  const episodes: { number: string | null; title: string | null; slug: string; date: string | null }[] = [];
  if (eps.data && Array.isArray(eps.data)) {
    eps.data.forEach((ep: any) => {
      episodes.push({
        number: String(ep.mal_id),
        title: ep.title,
        slug: `${slug}-${ep.mal_id}`,
        date: ep.aired ? new Date(ep.aired).toLocaleDateString() : null,
      });
    });
  }

  return {
    slug,
    title: info.title || 'Unknown',
    poster: info.images?.webp?.large_image_url || info.images?.jpg?.large_image_url || null,
    rating: info.score || null,
    status: info.status || null,
    studio: info.studios?.[0]?.name || null,
    released: info.aired?.string || null,
    duration: info.duration || null,
    type: info.type || null,
    totalEps: info.episodes ? String(info.episodes) : null,
    genres: (info.genres || []).map((g: any) => ({ name: g.name, slug: String(g.mal_id) })),
    synopsis: info.synopsis || null,
    episodes,
  };
}

export interface EpisodeDetail {
  title: string;
  iframeUrl: string | null;
  videoUrl: string | null;
  prevEpisode: string | null;
  nextEpisode: string | null;
  allEpisodesSlug: string;
  episodeList: { title: string; slug: string; info: string }[];
}

export async function getEpisode(slug: string): Promise<EpisodeDetail | null> {
  // slug format: animeId-episodeId
  const parts = slug.split('-');
  const animeId = parts[0];
  const epId = parts.slice(1).join('-');
  if (!animeId || !epId) return null;

  const animeFull = await fetchJikan(`/anime/${animeId}`);
  const details = await fetchJikan(`/anime/${animeId}/episodes/${epId}`);
  const allEps = await fetchJikan(`/anime/${animeId}/episodes`);

  const epData = details.data || {};
  const allEpsData = allEps.data || [];
  if (!animeFull.data && !epData.title) return null;

  let prevEpisode = null;
  let nextEpisode = null;

  const currentIdx = allEpsData.findIndex((e: any) => String(e.mal_id) === epId);
  if (currentIdx !== -1) {
    if (currentIdx > 0) prevEpisode = `${animeId}-${allEpsData[currentIdx - 1].mal_id}`;
    if (currentIdx < allEpsData.length - 1) nextEpisode = `${animeId}-${allEpsData[currentIdx + 1].mal_id}`;
  }

  return {
    title: epData.title
      ? `${animeFull.data?.title || 'Anime'} - Episode ${epId}: ${epData.title}`
      : `${animeFull.data?.title || 'Anime'} - Episode ${epId}`,
    // Stream is served by a third-party mirror, not by this app or Jikan.
    // It may be down, region-blocked, or show its own ads; the app only
    // frames it. See README "Streaming" for the honest limitation.
    iframeUrl: `https://animeplay.cfd/stream/mal/${animeId}/${epId}/sub`,
    videoUrl: null,
    prevEpisode,
    nextEpisode,
    allEpisodesSlug: animeId,
    episodeList: allEpsData.map((e: any) => ({
      title: e.title || `Episode ${e.mal_id}`,
      slug: `${animeId}-${e.mal_id}`,
      info: e.aired ? new Date(e.aired).toLocaleDateString() : '',
    })),
  };
}

export async function getSchedule(day: string): Promise<(AnimeItem & { time: string })[]> {
  const daysMap: Record<string, string> = {
    senin: 'monday',
    selasa: 'tuesday',
    rabu: 'wednesday',
    kamis: 'thursday',
    jumat: 'friday',
    sabtu: 'saturday',
    minggu: 'sunday',
  };

  const englishDay = daysMap[day.toLowerCase()] || 'monday';
  const data = await fetchJikan(`/schedules?filter=${englishDay}`);
  // Add time manually since Jikan doesn't return exact airing times in schedule list without extra parsing
  return (data.data || []).map((item: any) => {
    const ai = mapAnime(item);
    return {
      ...ai,
      time: item.broadcast?.time || 'TBA',
    };
  });
}
