'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getGenre, getGenresList, type AnimeListResponse } from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { Pagination } from '@/components/Pagination';

function GenreContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('g') || '';
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const [result, setResult] = useState<AnimeListResponse | null>(null);
  const [title, setTitle] = useState(slug);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    Promise.all([getGenre(slug, page), getGenresList()]).then(([res, all]) => {
      if (cancelled) return;
      setResult(res);
      const info = all.find((g) => g.slug === slug);
      setTitle(info ? info.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
    });
    return () => {
      cancelled = true;
    };
  }, [slug, page]);

  if (!slug) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white/60">Pick a genre first.</h1>
        <p className="text-white/40 mt-2 text-sm">
          <a href="/genres" className="text-[#ff4e00] hover:underline">
            Browse all genres
          </a>
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 bg-zinc-900 rounded animate-pulse w-56" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[4/3] bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { items, currentPage, hasNext } = result;

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Genre: {title}</h1>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {items.map((anime, i) => (
            <AnimeCard key={`genre-${anime.slug}-${i}`} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/40">No anime found in this genre.</div>
      )}

      {items.length > 0 && (
        <Pagination currentPage={currentPage} hasNext={hasNext} basePath={`/genre?g=${slug}`} />
      )}
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense>
      <GenreContent />
    </Suspense>
  );
}
