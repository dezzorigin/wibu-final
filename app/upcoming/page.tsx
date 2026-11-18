'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getUpcoming } from '@/lib/api';

export default function UpcomingPage() {
  return (
    <AnimeListPage
      title="Upcoming Seasons"
      subtitle="Announced anime that have not started airing yet."
      basePath="/upcoming"
      fetcher={getUpcoming}
    />
  );
}
