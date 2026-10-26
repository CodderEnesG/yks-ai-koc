# @yks/plan-engine

Saf ve deterministik plan motoru (rapor 2.6). Mobilde, Next.js'te ve Supabase Edge Functions'ta (Deno) aynı kaynak koddan çalışır.

## Kullanım

```ts
import { buildPlan, istanbulDate, parseCivilDate } from '@yks/plan-engine';

const plan = buildPlan({
  from: istanbulDate(Date.now()), // check-in yapıldıysa yarın
  examDate: parseCivilDate('2027-06-19'),
  weekdayMinutes: [120, 120, 120, 120, 120, 180, 0], // Pazartesi … Pazar
  sources: [
    {
      id: 'kitap-1',
      order: 0,
      units: [{ id: 'b1', kind: 'pages', first: 1, last: 40, minutes: 90 }],
    },
  ],
  completed: { b1: 12 }, // baştan itibaren yapılan sayfa/test sayısı
});
// plan.days[i].tasks → [{ sourceId, unitId, kind, first, last, seconds }]
// plan.optional → "zaman kalırsa" listesi, plan.unscheduled → sığmayanlar, plan.warnings
```

## Kurallar

- **Algoritma:** Plan sınavdan 21 gün önce biter. Kaynaklar paralel ilerler: her gün önce kalan işleri oranında pay alırlar, sonra boş kapasite kaynak sırasıyla doldurulur. Bir gün kapasiteyi en fazla %10 aşar. Talep kapasiteyi aşarsa öncelik skoruna göre kapasiteye sığan "çekirdek" seçilir, kalan birimler bütün olarak `optional`'a gider.
- **Süreler:** Tamsayı saniye. Birimin süresi sayfa/testlere, toplamı birebir koruyacak şekilde dağıtılır.
- **Takvim:** Saat değil takvim günü (`CivilDate`). `Date`'in cihaz saat dilimine bağlı davranışı kullanılmaz.
- **Bağımlılık yok.** Göreli import'lar `.ts` uzantısıyla yazılır (`./civil-date.ts`); Deno uzantı ister, Metro ve Next `allowImportingTsExtensions` ile kabul eder.
- **Property testleri CI'da zorunlu** (`src/schedule.property.test.ts`): kapasite + %10, her parçanın tam bir kez yer alması, kitap sırası, `[from, targetEnd)` penceresi, determinizm, aşırı yükte çekirdeğin kapasiteye sığması, günün açgözlü doldurulması, yeniden planlamada yapılan işin düşülmesi. Testlerin hata yakaladığı bilerek bozulan motorla denendi.

## Henüz olmayanlar

- Öncelik skoru ağırlıkları varsayılan (0,4 sınav ağırlığı, 0,3 zayıflık, 0,3 kitap içi sıra): rapor formülü veriyor, ağırlıkları vermiyor (**NOT DEFINED**). Gecikme terimi yok.
- Neden kuralları (kapasite %15 düşüşü, süre ×1,3, ısınma görevi, güvenli modda %50 yük): T14. Risk sinyaliyle açılan güvenli mod (`deriveAdjustments` ve `isSafeMode`in `safetyDays` girdisi): T18.
- `video` birim türü, izleme hızı ve not payı: T32.

```sh
pnpm --filter @yks/plan-engine test
pnpm --filter @yks/plan-engine check:deno
```
