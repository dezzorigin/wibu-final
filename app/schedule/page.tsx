'use client';

import { useEffect, useState } from 'react';
import { getSchedule, type AnimeItem } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

const DAYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Record<string, (AnimeItem & { time: string })[]> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Staggered on purpose: 7 calls against a 3 req/s API.
      const out: Record<string, (AnimeItem & { time: string })[]> = {};
      for (const d of DAYS) {
        const items = await getSchedule(d);
        if (cancelled) return;
        out[d] = items;
        await new Promise((r) => setTimeout(r, 400));
      }
      if (!cancelled) setSchedule(out);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const days = schedule ? DAYS.filter((d) => schedule[d] && schedule[d].length > 0) : [];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <Calendar className="w-8 h-8 text-[#ff4e00]" />
        <div>
          <h1 className="text-3xl font-bold text-white">Release Schedule</h1>
          <p className="text-white/40">Weekly anime release schedule based on Japan time.</p>
        </div>
      </div>

      {!schedule ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[4/3] bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : days.length > 0 ? (
        <div className="flex flex-col gap-10">
          {days.map((day) => (
            <div key={day}>
              <h2 className="text-2xl font-bold mb-4 capitalize sticky top-[72px] bg-zinc-950/95 backdrop-blur-md py-2 z-10 border-b border-white/10 text-white">
                {day}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                {schedule[day].map((anime, i) => (
                  <Link
                    href={`/anime?id=${anime.slug}`}
                    key={`sch-${day}-${i}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:scale-[1.03] hover:border-[#ff4e00]/50 hover:shadow-[0_0_20px_rgba(255,78,0,0.3)] transition-all duration-300 ease-out h-full"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/40">
                      {anime.poster ? (
                        <Image
                          src={anime.poster.startsWith('http') ? anime.poster : `https:${anime.poster}`}
                          alt={anime.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover object-center transition-all duration-500 brightness-75 group-hover:brightness-[1.1] group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 font-medium">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-md text-[10px] text-[#ff4e00] font-bold px-2 py-0.5 rounded-lg border border-zinc-800/80 shadow-[0_0_8px_rgba(255,78,0,0.2)]">
                        {anime.time}
                      </div>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1.5 flex-grow justify-between bg-zinc-900/20">
                      <h3 className="line-clamp-1 text-sm font-bold text-zinc-200 group-hover:text-[#ff4e00] transition-colors leading-tight">
                        {anime.title}
                      </h3>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-xs text-zinc-500 font-medium truncate">
                          {anime.type || 'Anime'}
                        </span>
                        {anime.status && (
                          <span className="text-[9px] bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider border border-zinc-700/30">
                            {anime.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/40">Schedule not available.</div>
      )}
    </div>
  );
}
