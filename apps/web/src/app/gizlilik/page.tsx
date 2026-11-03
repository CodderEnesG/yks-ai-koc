import type { Metadata } from 'next';

import { Card, Notice, PageShell } from '@/components/ui';
import { WAITLIST_NOTICE } from '@/lib/waitlist';

// Gizlilik politikası iskeleti (App Store gizlilik adresi, T27). İçerik T07'de avukat ön görüşmesinden sonra
// yazılır; o zamana kadar arama motoruna kapalı. YouTube API Hizmetleri ve Google Gizlilik Politikası bağlantıları
// politika gereği (III.A.1-2) baştan burada.
export const metadata: Metadata = {
  title: 'Gizlilik',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  'Veri sorumlusu ve iletişim',
  'Hangi verileri işliyoruz',
  'Neden işliyoruz ve hukuki sebep',
  '18 yaş altı kullanıcılar ve veli onayı',
  'Yurt dışına aktarım (yapay zekâ sağlayıcısı)',
  'Saklama süreleri',
  'Haklarınız ve başvuru',
];

export default function PrivacyPage() {
  return (
    <PageShell title="Gizlilik">
      <Notice mark="!">
        <p>Bu metin hazırlanıyor. Hukuki incelemeden sonra burada yayımlanacak.</p>
      </Notice>

      <Card>
        <h2 className="font-display text-[22px] font-bold">Başlıklar</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          {SECTIONS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 id="bekleme-listesi" className="font-display text-[22px] font-bold">
          Bekleme listesi (taslak)
        </h2>
        <div className="mt-2 space-y-2">
          {WAITLIST_NOTICE.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-[22px] font-bold">YouTube</h2>
        <p className="mt-2">
          lamba, eklediğin YouTube oynatma listelerinin video başlıklarını ve sürelerini YouTube API
          Hizmetleri ile alır. Bu özelliği kullanarak{' '}
          <a
            href="https://www.youtube.com/t/terms"
            className="font-semibold underline underline-offset-4">
            YouTube Hizmet Şartları
          </a>
          ’nı kabul etmiş olursun. Google’ın verileri nasıl işlediği için:{' '}
          <a
            href="https://policies.google.com/privacy"
            className="font-semibold underline underline-offset-4">
            Google Gizlilik Politikası
          </a>
          .
        </p>
      </Card>
    </PageShell>
  );
}
