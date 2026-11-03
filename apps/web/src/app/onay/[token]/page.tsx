import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Loading, PageShell } from '@/components/ui';

import { ConsentForm } from './consent-form';

// Link bir sır taşır: arama motoruna girmez, başka siteye referer olarak gitmez.
export const metadata: Metadata = {
  title: 'Veli onayı',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

// Kabuk önceden üretilir; kod (params) istek anında, Suspense içinde okunur.
export default function ConsentPage({ params }: PageProps<'/onay/[token]'>) {
  return (
    <PageShell title="Veli onayı">
      <Suspense fallback={<Loading />}>
        <TokenForm params={params} />
      </Suspense>
    </PageShell>
  );
}

async function TokenForm({ params }: Pick<PageProps<'/onay/[token]'>, 'params'>) {
  const { token } = await params;
  return <ConsentForm token={token} />;
}
