'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getTV } from '@/lib/api';

export default function TvShowsPage() {
  return (
    <AnimeListPage
      title="TV Shows"
      subtitle="TV anime series on MyAnimeList, most popular first."
      basePath="/tv-shows"
      fetcher={getTV}
    />
  );
}
