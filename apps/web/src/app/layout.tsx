import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Source_Sans_3 } from 'next/font/google';
import './globals.css';

import { siteIndexable, siteUrl } from '@/lib/site';

// Başlık Bricolage Grotesque, metin Source Sans 3 (marka kılavuzu). Türkçe harfler için latin-ext.
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
});
const sans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], variable: '--font-source-sans' });

// Paylaşım kartı ve sitemap mutlak adres ister (src/lib/site.ts). İndeksleme açılana kadar her sayfa noindex.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  ...(siteIndexable() ? {} : { robots: { index: false, follow: false } }),
  title: { default: 'lamba · senin YKS yardımcın', template: '%s · lamba' },
  description:
    'lamba, YKS’ye hazırlanan öğrencinin kendi kitaplarına ve YouTube listelerine göre her gün sayfa sayfa plan çıkarır, akşam takip eder ve veliye haftalık özet gönderir.',
  applicationName: 'lamba',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'lamba',
  },
};

export const viewport: Viewport = {
  themeColor: '#1c1330',
};

// `js` sınıfı ilk boyamadan önce eklenir: giriş animasyonu olan öğeler yalnız JavaScript çalışıyorsa gizli başlar
// (globals.css `[data-reveal]`). JavaScript yoksa her şey görünür.
const JS_CLASS = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_CLASS }} />
      </head>
      <body className="font-sans text-[17px] leading-relaxed antialiased">{children}</body>
    </html>
  );
}
