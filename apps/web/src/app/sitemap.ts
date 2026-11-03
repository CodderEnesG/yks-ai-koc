import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/site';

// /gizlilik metni T07'de gelince eklenir (şimdilik noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteUrl();
  return [
    { url: site, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/destek`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
