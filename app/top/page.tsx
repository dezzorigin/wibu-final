'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getTop } from '@/lib/api';

export default function TopPage() {
  return (
    <AnimeListPage
      title="Top Anime"
      subtitle="Highest-rated anime on MyAnimeList, all time."
      basePath="/top"
      fetcher={getTop}
    />
  );
}
