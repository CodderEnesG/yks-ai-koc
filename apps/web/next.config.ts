import type { NextConfig } from 'next';

// Her yanıtta güvenlik başlıkları. Tam CSP yok: Next'in satır içi betikleri nonce ister, o da sayfaları dinamik
// yapar (tanıtım sitesi statik kalmalı); yalnız çerçeveye gömülme kapalı.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

// Veli sayfalarının linki bir sır taşır (onay ve rapor kodu): başka siteye referer olarak gitmez, arama motoruna
// girmez (sayfaların metadata'sına ek olarak başlıkta da).
const tokenPageHeaders = [
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

const nextConfig: NextConfig = {
  // Paylaşılan paketler TS kaynağı olarak gelir.
  transpilePackages: ['@yks/plan-engine'],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/onay/:path*', headers: tokenPageHeaders },
      { source: '/rapor/:path*', headers: tokenPageHeaders },
    ];
  },
};

export default nextConfig;
