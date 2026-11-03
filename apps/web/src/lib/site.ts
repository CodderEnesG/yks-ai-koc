// Sitenin mutlak adresi ve arama motoruna açık olup olmadığı (yalnız sunucu ve derleme; istemci kullanmaz).
//
// Adres: `NEXT_PUBLIC_SITE_URL` (alan adı seçilince, karar 8); yoksa Vercel'in sistem değişkenleri (üretimde kalıcı
// proje adresi, önizlemede o dağıtımın adresi); o da yoksa yerel.
//
// İndeksleme varsayılan kapalı: alan adı, PDR onayı ve aydınlatma metni gelmeden tanıtım sitesi arama motoruna
// girmez. Açmak için üretim ortamında `SITE_INDEXABLE=1`. Önizleme dağıtımları hiçbir zaman indekslenmez.

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const host =
    process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  return host ? `https://${host}` : 'http://localhost:3000';
}

export function siteIndexable(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== 'production') return false;
  return process.env.SITE_INDEXABLE === '1';
}
