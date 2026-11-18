'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Search, Heart, Calendar, Zap, ShieldCheck, Globe } from 'lucide-react';
import { getTop, type AnimeItem } from '@/lib/api';

const REPO_URL = 'https://github.com/dezzorigin/wibu-final';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Fast catalog',
    text: 'Seasonal charts, top lists and genres load straight from the MyAnimeList database via the Jikan API — no account, no waiting room.',
  },
  {
    icon: Search,
    title: 'Search everything',
    text: 'Search the full MyAnimeList catalog by title, then jump straight to the detail page, episode list and stream.',
  },
  {
    icon: Play,
    title: 'Watch in place',
    text: 'Episode pages open the stream right inside WibuFinal, with previous / next episode navigation and the full episode list.',
  },
  {
    icon: Heart,
    title: 'Favorites, offline',
    text: 'Tap the heart on any anime and it stays in your Favorites in this browser — no login, no server, nothing leaves your device.',
  },
  {
    icon: Calendar,
    title: 'Weekly schedule',
    text: 'A full 7-day release schedule (Senin–Minggu) with airing times, so you know what drops tonight.',
  },
  {
    icon: ShieldCheck,
    title: 'No ads, no tracking',
    text: 'No ads, no analytics, no account. The only network calls are to the catalog API and the poster CDN.',
  },
];

const STEPS = [
  { n: '1', title: 'Find it', text: 'Browse the seasonal chart, a genre, or search by title.' },
  { n: '2', title: 'Check it', text: 'Score, studio, synopsis and the full episode list on one page.' },
  { n: '3', title: 'Watch it', text: 'Open any episode and stream it in place. Heart it to keep it.' },
];

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [preview, setPreview] = useState<AnimeItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    getTop(1)
      .then((res) => {
        if (!cancelled) setPreview(res.items.slice(0, 6));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      {/* Hero, two columns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-14 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-[#ff4e00]/10 text-[#ff4e00] border border-[#ff4e00]/20 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> Anime sub Indo · gratis · tanpa daftar
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]">
            Nonton anime favoritmu, langsung dari katalog MyAnimeList.
          </h1>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
            WibuFinal adalah katalog + streaming anime: chart musiman, top anime, genre, jadwal rilis
            mingguan, dan episode yang bisa langsung ditonton — semuanya dari database MyAnimeList
            lewat Jikan API, tanpa akun dan tanpa iklan.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <button
              onClick={onEnter}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#ff4e00] hover:bg-[#ff9d00] shadow-[0_0_20px_rgba(255,78,0,0.4)] text-zinc-950 font-black rounded-xl text-sm transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <Play className="w-4 h-4 fill-current" /> Mulai Nonton
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> Open Source
            </a>
          </div>
          <div className="flex gap-8 mt-4 text-sm">
            <div>
              <div className="text-xl font-black text-white">26.000+</div>
              <div className="text-zinc-500 text-xs font-medium">Anime di katalog MAL</div>
            </div>
            <div>
              <div className="text-xl font-black text-white">7 hari</div>
              <div className="text-zinc-500 text-xs font-medium">Jadwal rilis mingguan</div>
            </div>
            <div>
              <div className="text-xl font-black text-white">Rp 0</div>
              <div className="text-zinc-500 text-xs font-medium">Gratis, tanpa akun</div>
            </div>
          </div>
        </div>

        {/* Product preview: live top posters */}
        <div id="katalog" className="relative">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-2xl">
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_8px_rgba(255,78,0,0.8)]" />
                Trending di MyAnimeList
              </span>
              <span className="text-xs text-zinc-500 font-medium">live · Jikan API</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {preview.length > 0
                ? preview.map((a) => (
                    <button
                      key={a.slug}
                      onClick={onEnter}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/60 text-left"
                      title={a.title}
                    >
                      {a.poster ? (
                        <Image
                          src={a.poster}
                          alt={a.title}
                          fill
                          sizes="33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
                        <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{a.title}</p>
                      </div>
                    </button>
                  ))
                : [0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl bg-zinc-800 animate-pulse" />
                  ))}
            </div>
            <p className="text-xs text-zinc-500 text-center pt-3">
              Klik poster apa pun untuk masuk ke katalog lengkap.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Semua yang perlu buat nonton</h2>
        <p className="text-zinc-400 mt-2 mb-8 max-w-2xl">
          Bukan sekadar daftar — tiap halaman punya fungsi: cari, cek detail, simpan favorit, sampai
          nonton episodenya.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#ff4e00]/40 transition-colors"
            >
              <f.icon className="w-6 h-6 text-[#ff4e00] mb-3" />
              <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-8">Cara kerja</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
              <div className="w-9 h-9 rounded-full bg-[#ff4e00] text-zinc-950 font-black flex items-center justify-center mb-4">
                {s.n}
              </div>
              <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-[#ff4e00] px-6 py-10 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">
            Siap nonton? Gratis, tanpa daftar.
          </h2>
          <p className="text-zinc-900/70 mt-2 mb-6 text-sm md:text-base">
            Masuk ke katalog dan mulai dari anime yang lagi trending minggu ini.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-sm transition-colors"
          >
            <Play className="w-4 h-4 fill-current" /> Buka Katalog
          </button>
        </div>
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} WibuFinal — data katalog oleh Jikan API (MyAnimeList, tidak resmi).</span>
          <Link href={REPO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors font-semibold">
            <GithubIcon className="w-4 h-4" /> github.com/dezzorigin/wibu-final
          </Link>
        </footer>
      </section>
    </div>
  );
}
