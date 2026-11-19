import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WibuFinal — Streaming Anime Full Episode',
  description:
    'WibuFinal adalah katalog + streaming anime: chart musiman, top anime, genre, jadwal rilis mingguan, dan episode yang bisa langsung ditonton — data dari MyAnimeList lewat Jikan API, tanpa akun dan tanpa iklan.',
  metadataBase: new URL('https://wibufinal.pages.dev'),
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'WibuFinal — Streaming Anime Full Episode',
    description:
      'WibuFinal adalah katalog + streaming anime: chart musiman, top anime, genre, jadwal rilis mingguan, dan episode yang bisa langsung ditonton — data dari MyAnimeList lewat Jikan API, tanpa akun dan tanpa iklan.',
    type: 'website',
    url: 'https://wibufinal.pages.dev',
    images: [
      {
        url: 'https://wibufinal.pages.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WibuFinal — katalog dan streaming anime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WibuFinal — Streaming Anime Full Episode',
    description:
      'WibuFinal adalah katalog + streaming anime: chart musiman, top anime, genre, jadwal rilis mingguan, dan episode yang bisa langsung ditonton — data dari MyAnimeList lewat Jikan API, tanpa akun dan tanpa iklan.',
    images: ['https://wibufinal.pages.dev/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
