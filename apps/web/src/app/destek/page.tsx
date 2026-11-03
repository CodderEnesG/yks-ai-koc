import type { Metadata } from 'next';

import { Card, PageShell } from '@/components/ui';
import { SSS } from '@/content/sss';

// App Store destek adresi (T27). Tema telefonu izler (veli sayfalarıyla aynı kabuk).
export const metadata: Metadata = {
  title: 'Destek',
  description: 'lamba ile ilgili sık sorulanlar, iletişim, hesap ve veri silme.',
};

export default function SupportPage() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <PageShell title="Destek">
      <Card>
        <h2 className="font-display text-[22px] font-bold">Bize ulaş</h2>
        {contact ? (
          <p className="mt-2">
            Sorun, öneri ya da listeden çıkma isteği için{' '}
            <a href={`mailto:${contact}`} className="font-semibold underline underline-offset-4">
              {contact}
            </a>{' '}
            adresine yaz.
          </p>
        ) : (
          <p className="text-muted-foreground mt-2">İletişim adresi çok yakında burada.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-[22px] font-bold">Hesabını ve verini silmek</h2>
        <p className="mt-2">
          Uygulamada Ayarlar → Verileri sil. Hesabın ve sunucudaki verin hemen silinir; telefondaki
          plan da temizlenir.
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-[22px] font-bold">Veli onayını geri çekmek</h2>
        <p className="mt-2">
          Onayı verdiğiniz linki açıp “Onayı geri çek”e basın. Öğrencinin sunucudaki hesabı ve
          verisi silinir; uygulama telefonda çalışmaya devam eder.
        </p>
      </Card>

      <section aria-labelledby="sss-title" className="space-y-4">
        <h2 id="sss-title" className="font-display text-[26px] font-bold">
          Sık sorulanlar
        </h2>
        {SSS.map((item) => (
          <details key={item.q} className="border-border border-t pt-4">
            <summary className="cursor-pointer text-[18px] font-semibold">{item.q}</summary>
            <p className="text-muted-foreground mt-2">{item.a}</p>
          </details>
        ))}
      </section>
    </PageShell>
  );
}
