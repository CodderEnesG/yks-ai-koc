import type { WeeklySummary } from '@yks/plan-engine';
import { addDays, weekdayIndex } from '@yks/plan-engine';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Card, Loading, Notice, PageShell } from '@/components/ui';

// Link bir sır taşır: arama motoruna girmez, başka siteye referer olarak gitmez.
export const metadata: Metadata = {
  title: 'Haftalık rapor',
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

// Sunucuya ulaşılamazsa veli Next'in İngilizce hata sayfasını değil sakin bir yenileme notunu görür.
async function fetchReportSafe(token: string): Promise<WeeklySummary | null | 'error'> {
  try {
    return await fetchReport(token);
  } catch (e) {
    console.error(e);
    return 'error';
  }
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
    <PageShell title="Haftalık rapor">
      <Suspense fallback={<Loading />}>
        <Report params={params} />
      </Suspense>
    </PageShell>
  );
}

// Gün durumu renkle değil şekille (lamba kararı 27 Ekim; görev kartındaki işaretlerle aynı dil):
// tamamlanan dolu ve tikli, planlı ama tamamlanmamış çerçeveli, planlı olmayan kesik çerçeveli.
function DayMark({ complete, planned }: { complete: boolean; planned: boolean }) {
  const label = complete ? 'tamamlandı' : planned ? 'planlıydı, tamamlanmadı' : 'plan yok';
  return (
    <div
      aria-label={label}
      className={`mt-1.5 flex h-11 items-center justify-center rounded-md text-lg font-bold ${
        complete
          ? 'bg-foreground text-background'
          : planned
            ? 'border-control border-2'
            : 'border-border text-muted-foreground border border-dashed'
      }`}>
      <span aria-hidden>{complete ? '✓' : planned ? '–' : '·'}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  testId,
}: {
  label: string;
  value: string;
  sub?: string;
  testId?: string;
}) {
  return (
    <div className="border-border bg-card rounded-md border p-3 text-center">
      <dt className="text-muted-foreground text-[13px] leading-[18px] font-semibold">{label}</dt>
      <dd className="font-display mt-1 text-[22px] leading-7 font-bold" data-testid={testId}>
        {value}
      </dd>
      {sub ? <dd className="text-muted-foreground text-[13px]">{sub}</dd> : null}
    </div>
  );
}

async function Report({ params }: Pick<PageProps<'/rapor/[token]'>, 'params'>) {
  const { token } = await params;
  const s = await fetchReportSafe(token);
  if (s === 'error')
    return (
      <Notice mark="↻" testId="report-error">
        <p>Rapor şu an açılamadı. Birkaç dakika sonra sayfayı yenileyin.</p>
      </Notice>
    );
  if (!s)
    return (
      <Notice mark="✕" testId="report-invalid">
        <p>Bu link geçersiz ya da süresi dolmuş. Öğrenciden uygulamadan yeni bir link isteyin.</p>
      </Notice>
    );

  const weekEnd = addDays(s.weekStart, 6);
  // Metinler tek parça: tarayıcıların erişilebilirlik ağacında (ekran okuyucu) bölünmesin.
  const range = `${formatDate(s.weekStart)} – ${formatDate(weekEnd)}${
    s.through !== weekEnd ? ` (${formatDate(s.through)} itibarıyla)` : ''
  }`;
  return (
    <div className="-mt-3 space-y-6">
      <p className="text-muted-foreground">{range}</p>

      <Card>
        <ol className="flex gap-1.5" aria-label="Haftanın günleri">
          {s.days.map((d) => (
            <li key={d.date} className="flex-1 text-center">
              <div className="text-muted-foreground text-[13px] font-semibold">
                {DAY_SHORT[weekdayIndex(d.date)]}
              </div>
              <DayMark complete={d.complete} planned={d.planned} />
            </li>
          ))}
        </ol>
        <p className="font-display mt-5 text-xl leading-snug font-bold">{weekNote(s)}</p>
      </Card>

      <dl className="grid grid-cols-3 gap-2.5">
        <Stat
          label="Tamamlanan gün"
          value={`${s.completeDays}/${s.plannedDays}`}
          testId="report-days"
        />
        <Stat
          label="Çalışma"
          value={formatMinutes(s.doneMinutes)}
          sub={`plan: ${formatMinutes(s.plannedMinutes)}`}
        />
        <Stat label="Seri" value={`${s.streak} gün`} />
      </dl>

      {s.books.length > 0 ? (
        <Card className="space-y-5">
          <h2 className="font-display text-xl font-bold">Kitaplar</h2>
          {s.books.map((b) => (
            <div key={b.id}>
              <div className="flex justify-between gap-3">
                <span className="font-semibold">{b.title}</span>
                <span className="text-muted-foreground shrink-0">{`%${b.percent}`}</span>
              </div>
              <div
                role="progressbar"
                aria-label={b.title}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={b.percent}
                className="bg-border mt-2 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-foreground h-full rounded-full"
                  style={{ width: `${Math.max(2, b.percent)}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1.5 text-[15px]">
                {`Bu hafta ${b.doneThisWeek} ${UNIT_NAME[b.kind]}`}
              </p>
            </div>
          ))}
        </Card>
      ) : null}

      <p className="text-muted-foreground text-[13px] leading-[18px]">
        Rapor uygulamadaki plan ve check-in kayıtlarından hesaplanır. Öğrencinin AI koçla
        konuşmaları raporda hiçbir zaman yer almaz.
      </p>
    </div>
  );
}
