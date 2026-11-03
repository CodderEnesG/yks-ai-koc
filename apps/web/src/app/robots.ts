import type { MetadataRoute } from 'next';

import { siteIndexable, siteUrl } from '@/lib/site';

// Link önizlemesi (WhatsApp, Telegram vb.) indeksleme değildir: paylaşım kartı için bu botlara her zaman izin var.
const PREVIEW_BOTS = [
  'WhatsApp',
  'facebookexternalhit',
  'TelegramBot',
  'Twitterbot',
  'Slackbot',
  'LinkedInBot',
  'Discordbot',
];

// İndeksleme açık değilse (önizleme dağıtımı ya da `SITE_INDEXABLE` yok) arama motorlarına her şey kapalı. Açıkken
// bile veli sayfalarının linki bir sır taşır (onay ve rapor kodu): kapalı; sayfalarda ve başlıkta da noindex var.
export default function robots(): MetadataRoute.Robots {
  const tokenPages = ['/onay/', '/rapor/'];
  if (!siteIndexable()) {
    return {
      rules: [
        { userAgent: PREVIEW_BOTS, allow: '/', disallow: tokenPages },
        { userAgent: '*', disallow: '/' },
      ],
    };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: tokenPages },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
