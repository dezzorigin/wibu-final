'use client';

import { AnimeListPage } from '@/components/AnimeListPage';
import { getNew } from '@/lib/api';

export default function OngoingPage() {
  return (
    <AnimeListPage
      title="Ongoing Anime"
      subtitle="Anime currently airing, newest first."
      basePath="/ongoing"
      fetcher={getNew}
    />
  );
}
