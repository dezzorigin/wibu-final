import Link from 'next/link';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <div className="text-white/60 text-sm md:text-base leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="text-white/40 text-sm">Last updated: November 2026.</p>
      <Section title="What WibuFinal is">
        <p>
          WibuFinal is a fan-made index and front-end for anime information. It is not affiliated
          with MyAnimeList, Jikan, or any studio, licensor, or streaming service.
        </p>
      </Section>
      <Section title="Data & streams">
        <p>
          Catalog data comes from the Jikan API, an unofficial mirror of MyAnimeList. Video
          streams are embedded from independent third-party platforms; WibuFinal does not host,
          store, or upload any media file. Availability and quality of a stream are entirely
          the third party&apos;s responsibility.
        </p>
      </Section>
      <Section title="Your use">
        <p>
          Use the site for personal, non-commercial viewing. Do not abuse the catalog API
          (it is rate-limited per IP), do not scrape the site aggressively, and do not present
          WibuFinal as an official service.
        </p>
      </Section>
      <Section title="No warranty">
        <p>
          The service is provided &quot;as is&quot;. Catalog data can be stale, streams can
          break, and the site can change or go offline without notice.
        </p>
      </Section>
      <p className="text-sm text-white/40">
        Questions? See <Link href="/contact" className="text-[#ff4e00] hover:underline">Contact</Link>.
      </p>
    </div>
  );
}
