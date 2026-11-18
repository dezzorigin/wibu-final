const QA = [
  {
    q: 'What is WibuFinal?',
    a: 'A free anime catalog + streaming front-end. It reads the MyAnimeList catalog through the Jikan API and lets you browse, search, check details, keep favorites, and watch episodes — without an account.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There are no accounts at all. Favorites are stored in your browser only.',
  },
  {
    q: 'Why is the video player empty or showing an error?',
    a: 'The player is an iframe to a third-party mirror (animeplay.cfd), not a WibuFinal server. If it is empty, the mirror is down, region-blocked, or the episode is not on the mirror. Try again later — there is nothing to fix on this side.',
  },
  {
    q: 'Why is the catalog empty or slow sometimes?',
    a: 'The Jikan API allows 3 requests per second per IP. The app spaces its requests, so the home page fills in over a few seconds. If everything stays empty, the API is rate-limiting your IP — wait a minute and reload.',
  },
  {
    q: 'Where do my favorites go?',
    a: 'Into localStorage in this browser. Clearing site data deletes them, and they do not sync to other devices.',
  },
  {
    q: 'Is WibuFinal legal?',
    a: 'WibuFinal hosts no media files. It is an index: catalog data from Jikan/MyAnimeList and streams embedded from third-party platforms. All titles, posters, and videos belong to their respective owners.',
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
      <div className="flex flex-col gap-4">
        {QA.map((item) => (
          <div key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-bold text-white mb-2">{item.q}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
