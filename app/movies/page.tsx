'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getMovies } from '@/lib/api';

export default function MoviesPage() {
  return (
    <AnimeListPage
      title="Top Movies"
      subtitle="Highest-rated anime movies on MyAnimeList."
      basePath="/movies"
      fetcher={getMovies}
    />
  );
}
