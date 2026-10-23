import { parseCivilDate, weekdayIndex } from '@yks/plan-engine';

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// T02 yer tutucu sayfa: plan-engine'in Next.js'te çalıştığını gösterir.
// Veli onayı sayfası T21'de, haftalık rapor T22'de.
export default function Home() {
  const submission = parseCivilDate('2026-12-14');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">YKS Koç</h1>
      <p className="mt-2 text-neutral-600">
        App Store gönderimi: {submission} {WEEKDAYS[weekdayIndex(submission)]}
      </p>
    </main>
  );
}
