'use client';

import { useEffect, useState } from 'react';
import { getGenresList } from '@/lib/api';
import Link from 'next/link';

export default function GenresPage() {
  const [genres, setGenres] = useState<{ name: string; count: number | null; slug: string }[] | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    getGenresList().then((g) => {
      if (!cancelled) setGenres(g);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Anime Genres</h1>
        <p className="text-white/40">Browse anime by your favorite categories.</p>
      </div>

      {!genres ? (
        <div className="flex flex-wrap gap-3 justify-center">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-32 bg-zinc-900 rounded-full animate-pulse" />
          ))}
        </div>
      ) : genres.length === 0 ? (
        <p className="text-center text-white/40 py-10">
          Genre list failed to load from the Jikan API — try reloading the page.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={`/genre?g=${genre.slug}`}
              className="flex items-center justify-between gap-3 px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0a] hover:border-[#ff4e00]/50 transition-colors shadow-sm"
            >
              <span className="font-medium text-white">{genre.name}</span>
              {genre.count !== null && (
                <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full text-white/40">
                  {genre.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
