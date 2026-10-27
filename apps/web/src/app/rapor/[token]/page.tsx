import type { WeeklySummary } from '@yks/plan-engine';
import { addDays, weekdayIndex } from '@yks/plan-engine';
import type { Metadata } from 'next';
import { Suspense } from 'react';

// Link bir sır taşır: arama motoruna girmez, başka siteye referer olarak gitmez.
export const metadata: Metadata = {
  title: 'Haftalık rapor · lamba',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const UNIT_NAME = { pages: 'sayfa', tests: 'test', video: 'video' } as const;
const DAY_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

function formatDate(date: string): string {
  const [, m, d] = date.split('-').map(Number) as [number, number, number];
  return `${d} ${MONTHS[m - 1]}`;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m} dk` : m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
}

// Haftanın notu: sayılardan kuralla (LLM'li not ERTELENDİ). Ton davranışa yönelik ve yargısız.
function weekNote(s: WeeklySummary): string {
  if (s.plannedDays === 0) return 'Bu hafta için planlanmış çalışma günü yok.';
  if (s.completeDays === s.plannedDays) return 'Planlanan her günü tamamladı.';
  if (s.completeDays === 0)
    return 'Bu hafta planı tutturamadı. Uygulama planı, verdiği nedenlere göre yeniden ayarlıyor.';
  return `Planlanan ${s.plannedDays} günün ${s.completeDays} tanesini tamamladı.`;
}

async function fetchReport(token: string): Promise<WeeklySummary | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL ve _PUBLISHABLE_KEY gerekli');
  const res = await fetch(`${url}/functions/v1/weekly-report`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`weekly-report ${res.status}`);
  return (await res.json()) as WeeklySummary;
}

export default function ReportPage({ params }: PageProps<'/rapor/[token]'>) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Haftalık rapor</h1>
      <Suspense fallback={<p className="mt-4 text-neutral-500">Yükleniyor…</p>}>
        <Report params={params} />
      </Suspense>
    </main>
  );
}

async function Report({ params }: Pick<PageProps<'/rapor/[token]'>, 'params'>) {
  const { token } = await params;
  const s = await fetchReport(token);
  if (!s)
    return (
      <p className="mt-4" data-testid="report-invalid">
        Bu link geçersiz ya da süresi dolmuş. Öğrenciden uygulamadan yeni bir link isteyin.
      </p>
    );

  const weekEnd = addDays(s.weekStart, 6);
  // Metinler tek parça: tarayıcıların erişilebilirlik ağacında (ekran okuyucu) bölünmesin.
  const range = `${formatDate(s.weekStart)} – ${formatDate(weekEnd)}${
    s.through !== weekEnd ? ` (${formatDate(s.through)} itibarıyla)` : ''
  }`;
  return (
    <div className="mt-2 space-y-6">
      <p className="text-neutral-600">{range}</p>

      <section className="flex gap-2">
        {s.days.map((d) => (
          <div key={d.date} className="flex-1 text-center">
            <div className="text-xs text-neutral-500">{DAY_SHORT[weekdayIndex(d.date)]}</div>
            <div
              className={`mt-1 rounded-md py-2 text-sm ${
                d.complete
                  ? 'bg-emerald-600 text-white'
                  : d.planned
                    ? 'bg-neutral-200'
                    : 'bg-neutral-50 text-neutral-400'
              }`}>
              {d.complete ? '✓' : d.planned ? '–' : '·'}
            </div>
          </div>
        ))}
      </section>

      <p className="text-lg">{weekNote(s)}</p>

      <dl className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-neutral-100 p-3">
          <dt className="text-xs text-neutral-500">Tamamlanan gün</dt>
          <dd className="text-xl font-semibold" data-testid="report-days">
            {`${s.completeDays}/${s.plannedDays}`}
          </dd>
        </div>
        <div className="rounded-lg bg-neutral-100 p-3">
          <dt className="text-xs text-neutral-500">Çalışma</dt>
          <dd className="text-xl font-semibold">{formatMinutes(s.doneMinutes)}</dd>
          <dd className="text-xs text-neutral-500">{`plan: ${formatMinutes(s.plannedMinutes)}`}</dd>
        </div>
        <div className="rounded-lg bg-neutral-100 p-3">
          <dt className="text-xs text-neutral-500">Seri</dt>
          <dd className="text-xl font-semibold">{`${s.streak} gün`}</dd>
        </div>
      </dl>

      {s.books.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-semibold">Kitaplar</h2>
          {s.books.map((b) => (
            <div key={b.id}>
              <div className="flex justify-between text-sm">
                <span>{b.title}</span>
                <span className="text-neutral-500">{`%${b.percent}`}</span>
              </div>
              <div className="mt-1 h-2 rounded bg-neutral-200">
                <div className="h-2 rounded bg-emerald-600" style={{ width: `${b.percent}%` }} />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {`Bu hafta ${b.doneThisWeek} ${UNIT_NAME[b.kind]}`}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <p className="text-xs text-neutral-500">
        Rapor uygulamadaki plan ve check-in kayıtlarından hesaplanır. Öğrencinin AI koçla
        konuşmaları raporda hiçbir zaman yer almaz.
      </p>
    </div>
  );
}
