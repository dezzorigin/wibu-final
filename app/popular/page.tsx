'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getPopular } from '@/lib/api';

export default function PopularPage() {
  return (
    <AnimeListPage
      title="Most Popular"
      subtitle="The most-loved anime by MyAnimeList member count."
      basePath="/popular"
      fetcher={getPopular}
    />
  );
}
