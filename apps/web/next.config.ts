import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Paylaşılan paketler TS kaynağı olarak gelir.
  transpilePackages: ['@yks/plan-engine'],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
