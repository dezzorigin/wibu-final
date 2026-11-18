'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeCard } from '@/components/AnimeCard';
import { Pagination } from '@/components/Pagination';
import type { AnimeListResponse } from '@/lib/api';

interface Props {
  title: string;
  subtitle: string;
  basePath: string;
  fetcher: (page: number) => Promise<AnimeListResponse>;
}

function ListContent({ title, subtitle, basePath, fetcher }: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const [result, setResult] = useState<AnimeListResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher(page).then((res) => {
      if (!cancelled) setResult(res);
    });
    return () => {
      cancelled = true;
    };
  }, [page, fetcher]);

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-white/40 text-sm mt-1">{subtitle}</p>
      </div>

      {!result ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[4/3] bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : result.items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {result.items.map((anime, i) => (
              <AnimeCard key={`${basePath}-${anime.slug}-${i}`} anime={anime} />
            ))}
          </div>
          <Pagination currentPage={result.currentPage} hasNext={result.hasNext} basePath={basePath} />
        </>
      ) : (
        <div className="text-center py-20 text-white/40">
          No anime found — the Jikan API may be rate-limited. Try reloading.
        </div>
      )}
    </div>
  );
}

/**
 * Shared list page for /top, /popular, /upcoming and /movies.
 * These four routes were linked from the home page since the first version
 * but never existed (404). They are real pages now, sharing this component.
 */
export function AnimeListPage(props: Props) {
  return (
    <Suspense>
      <ListContent {...props} />
    </Suspense>
  );
}
