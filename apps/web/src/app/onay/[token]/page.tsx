import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ConsentForm } from './consent-form';

// Link bir sır taşır: arama motoruna girmez, başka siteye referer olarak gitmez.
export const metadata: Metadata = {
  title: 'Veli onayı · YKS Koç',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

// Kabuk önceden üretilir; kod (params) istek anında, Suspense içinde okunur.
export default function ConsentPage({ params }: PageProps<'/onay/[token]'>) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Veli onayı</h1>
      <Suspense fallback={<p className="mt-4 text-neutral-500">Yükleniyor…</p>}>
        <TokenForm params={params} />
      </Suspense>
    </main>
  );
}

async function TokenForm({ params }: Pick<PageProps<'/onay/[token]'>, 'params'>) {
  const { token } = await params;
  return <ConsentForm token={token} />;
}
