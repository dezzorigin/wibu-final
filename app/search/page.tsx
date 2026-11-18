'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSearch, type AnimeListResponse } from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { Pagination } from '@/components/Pagination';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const [result, setResult] = useState<AnimeListResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!q) return;
    getSearch(q, page).then((res) => {
      if (!cancelled) setResult(res);
    });
    return () => {
      cancelled = true;
    };
  }, [q, page]);

  if (!q) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white/60">Enter a search term to find anime.</h1>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 bg-zinc-900 rounded animate-pulse w-72" />
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
        <h1 className="text-2xl font-bold text-white">Search results for &quot;{q}&quot;</h1>
        <p className="text-white/40 text-sm mt-1">Found {items.length} items on this page</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {items.map((anime, i) => (
            <AnimeCard key={`search-${anime.slug}-${i}`} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/40">No anime found matching your search.</div>
      )}

      {items.length > 0 && (
        <Pagination currentPage={currentPage} hasNext={hasNext} basePath={`/search?q=${encodeURIComponent(q)}`} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
