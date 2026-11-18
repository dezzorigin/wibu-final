'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getHome, getTop, getPopular, getUpcoming, getMovies,
  getAction, getRomance, getComedy, getAdventure, getSciFi, getFantasy,
  getDetail,
  type AnimeItem, type AnimeDetail,
} from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { Pagination } from '@/components/Pagination';
import { HorizontalScroller } from '@/components/HorizontalScroller';
import { LandingPage } from '@/components/LandingPage';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, RefreshCw } from 'lucide-react';

interface Section {
  title: string;
  href: string;
  items: AnimeItem[];
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="w-full h-[55vh] min-h-[380px] rounded-2xl bg-zinc-900 animate-pulse" />
      {[0, 1, 2].map((s) => (
        <div key={s}>
          <div className="h-6 w-48 bg-zinc-900 rounded animate-pulse mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2, 3, 4, 5].map((c) => (
              <div key={c} className="min-w-[145px] w-[145px] md:min-w-[195px] md:w-[195px] shrink-0">
                <div className="aspect-[4/3] bg-zinc-900 rounded-xl animate-pulse" />
                <div className="h-4 bg-zinc-900 rounded mt-3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  const [entered, setEntered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [homeData, setHomeData] = useState<{ items: AnimeItem[]; currentPage: number; hasNext: boolean }>({
    items: [],
    currentPage: 1,
    hasNext: false,
  });
  const [extraSections, setExtraSections] = useState<Section[]>([]);
  const [heroAnime, setHeroAnime] = useState<AnimeDetail | null>(null);

  useEffect(() => {
    // Defer past first paint: reading localStorage during render would
    // differ between the prerendered shell and the hydrated page.
    const t = setTimeout(() => {
      try {
        setEntered(localStorage.getItem('wibu-final-entered') === '1');
      } catch {
        setEntered(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFailed(false);
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      try {
        if (page === 1) {
          // We stagger the fetches to respect the Jikan API rate limit
          // (3 requests/second). The client in lib/api also spaces them.
          const [resHome, resTop, resPopular] = await Promise.all([
            getHome(page), getTop(1), getPopular(1),
          ]);
          if (cancelled) return;
          let hero: AnimeDetail | null = null;
          if (resTop.items && resTop.items.length > 0) {
            hero = await getDetail(resTop.items[0].slug);
          }
          await sleep(600);
          const [resUpcoming, resMovies, resAction] = await Promise.all([
            getUpcoming(1), getMovies(1), getAction(1),
          ]);
          await sleep(600);
          const [resRomance, resComedy, resAdventure] = await Promise.all([
            getRomance(1), getComedy(1), getAdventure(1),
          ]);
          await sleep(600);
          const [resSciFi, resFantasy] = await Promise.all([
            getSciFi(1), getFantasy(1),
          ]);
          if (cancelled) return;
          setHomeData(resHome);
          setHeroAnime(hero);
          setExtraSections([
            { title: 'Trending Animes', href: '/top', items: resTop.items },
            { title: 'Now Playing', href: '/', items: resHome.items },
            { title: 'Most Popular', href: '/popular', items: resPopular.items },
            { title: 'Upcoming Seasons', href: '/upcoming', items: resUpcoming.items },
            { title: 'Top Movies', href: '/movies', items: resMovies.items },
            { title: 'Action', href: '/genre?g=1', items: resAction.items },
            { title: 'Romance', href: '/genre?g=22', items: resRomance.items },
            { title: 'Comedy', href: '/genre?g=4', items: resComedy.items },
            { title: 'Adventure', href: '/genre?g=2', items: resAdventure.items },
            { title: 'Sci-Fi', href: '/genre?g=24', items: resSciFi.items },
            { title: 'Fantasy', href: '/genre?g=10', items: resFantasy.items },
          ]);
          if (resHome.items.length === 0 && resTop.items.length === 0) setFailed(true);
        } else {
          const res = await getHome(page);
          if (cancelled) return;
          setHomeData(res);
          if (res.items.length === 0) setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (entered) load();
    return () => {
      cancelled = true;
    };
  }, [page, entered]);

  if (entered === null) return <LoadingSkeleton />;
  if (!entered) {
    return (
      <LandingPage
        onEnter={() => {
          try {
            localStorage.setItem('wibu-final-entered', '1');
          } catch {
            /* private mode: landing shows again next visit */
          }
          setEntered(true);
        }}
      />
    );
  }

  if (loading) return <LoadingSkeleton />;

  if (failed) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Couldn&apos;t load the catalog</h1>
        <p className="text-white/50 max-w-md text-sm leading-relaxed">
          WibuFinal fetches its catalog live from the Jikan API (MyAnimeList). The request failed —
          usually the API rate limit (3 requests/second) or a blocked connection. Your favorites are
          safe in this browser.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff4e00] hover:bg-[#ff9d00] text-zinc-950 font-bold rounded-xl text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </div>
    );
  }

  // Set up Hero Banner details with fallbacks
  const heroTitle = heroAnime?.title || extraSections[0]?.items?.[0]?.title || 'WibuFinal Stream';
  const heroPoster = heroAnime?.poster || extraSections[0]?.items?.[0]?.poster || '';
  const heroSynopsis = heroAnime?.synopsis
    ? heroAnime.synopsis.length > 250
      ? heroAnime.synopsis.slice(0, 250) + '...'
      : heroAnime.synopsis
    : 'Explore the best and latest anime series streaming now on WibuFinal.';
  const heroSlug = heroAnime?.slug || extraSections[0]?.items?.[0]?.slug || '';
  const heroRating = heroAnime?.rating || null;
  const heroGenres = heroAnime?.genres || [];

  return (
    <div className="flex flex-col gap-10 overflow-hidden w-full">
      {page === 1 ? (
        <>
          {/* Cinematic Hero Banner */}
          {heroSlug && (
            <div className="relative w-full h-[55vh] md:h-[65vh] min-h-[380px] max-h-[600px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/40 group shadow-2xl mb-2 flex items-end">
              {heroPoster && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={heroPoster}
                    alt={heroTitle}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-[10000ms] ease-out opacity-35 md:opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>
              )}

              {/* Banner Info Content */}
              <div className="relative z-10 p-6 md:p-12 lg:p-16 max-w-3xl flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium">
                  <span className="px-2.5 py-0.5 rounded bg-[#ff4e00]/10 text-[#ff4e00] border border-[#ff4e00]/20 font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(255,78,0,0.2)]">
                    Trending #1
                  </span>
                  {heroRating && (
                    <span className="flex items-center gap-1 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 text-zinc-200">
                      <Star className="w-3.5 h-3.5 text-[#ff4e00] fill-[#ff4e00]" /> {heroRating}
                    </span>
                  )}
                  {heroAnime?.type && (
                    <span className="bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                      {heroAnime.type}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md line-clamp-2">
                  {heroTitle}
                </h1>

                <p className="text-sm md:text-base text-zinc-400 line-clamp-3 leading-relaxed max-w-2xl font-medium">
                  {heroSynopsis}
                </p>

                {heroGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {heroGenres.slice(0, 3).map((g) => (
                      <span key={g.slug} className="text-zinc-500 font-semibold px-2.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2">
                  <Link
                    href={`/anime?id=${heroSlug}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 md:px-7 md:py-3.5 bg-[#ff4e00] hover:bg-[#ff9d00] shadow-[0_0_15px_rgba(255,78,0,0.5)] hover:shadow-[0_0_25px_rgba(255,78,0,0.7)] text-zinc-950 font-black rounded-xl text-sm transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Watch Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Scroller Sections */}
          {extraSections.map((section, idx) => {
            if (!section.items || section.items.length === 0) return null;
            return (
              <section key={idx}>
                <HorizontalScroller title={section.title} viewAllHref={section.href}>
                  {section.items.slice(0, 15).map((anime, i) => (
                    <div key={`${section.title}-${i}`} className="snap-start min-w-[145px] w-[145px] md:min-w-[195px] md:w-[195px] shrink-0">
                      <AnimeCard anime={anime} />
                    </div>
                  ))}
                </HorizontalScroller>
              </section>
            );
          })}
        </>
      ) : (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[1.1rem] md:text-xl font-bold text-[#e0e0e0] flex items-center">
              Now Playing (Page {page})
            </h2>
          </div>

          {homeData.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
              {homeData.items.map((anime: AnimeItem, i: number) => (
                <AnimeCard key={`home-${anime.slug}-${i}`} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">No anime found.</div>
          )}
        </section>
      )}

      <div className="mt-8">
        <Pagination currentPage={homeData.currentPage} hasNext={homeData.hasNext} basePath="/" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
