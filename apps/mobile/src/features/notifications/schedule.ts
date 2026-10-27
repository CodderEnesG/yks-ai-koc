// Yerel bildirim takvimi (T15, rapor 2.12): sabah görev özeti, 20:00 ve 21:30 check-in hatırlatması.
// Uygulama her açıldığında önümüzdeki 7 gün yeniden kurulur; check-in yapılan günün akşam
// hatırlatmaları kurulmaz. iOS'ta en fazla 64 bekleyen bildirim olabilir; 7 gün × 3 = 21. Saf; test edilir.
import { addDays, type CivilDate } from '@yks/plan-engine';

export const SCHEDULE_DAYS = 7;
// Sabah saati öğrencinin seçtiği saat (Ayarlar); varsayılan 08:00.
export const MORNING = { hour: 8, minute: 0 };
export const EVENING = { hour: 20, minute: 0 };
export const LATE_EVENING = { hour: 21, minute: 30 };

// Türkiye 2016'dan beri kalıcı olarak UTC+3; bildirim saatleri cihaz saat diliminden bağımsız İstanbul.
const ISTANBUL_OFFSET_HOURS = 3;

export interface DayLoad {
  date: CivilDate;
  seconds: number;
  books: number;
  videos: number;
}

export interface PlannedNotification {
  id: string;
  /** Epoch ms. */
  at: number;
  kind: 'morning' | 'evening' | 'late';
  date: CivilDate;
  seconds: number;
  books: number;
  videos: number;
}

export function istanbulTime(date: CivilDate, time: { hour: number; minute: number }): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d, time.hour - ISTANBUL_OFFSET_HOURS, time.minute);
}

/**
 * `loads`: planın önümüzdeki günleri (görevi olmayan gün = dinlenme, bildirim yok).
 * `checkedInToday`: bugünün check-in'i tamamsa bugünün akşam hatırlatmaları kurulmaz.
 */
export function buildSchedule(args: {
  today: CivilDate;
  now: number;
  loads: readonly DayLoad[];
  checkedInToday: boolean;
  morning?: { hour: number; minute: number };
}): PlannedNotification[] {
  const result: PlannedNotification[] = [];
  for (let i = 0; i < SCHEDULE_DAYS; i++) {
    const date = addDays(args.today, i);
    const load = args.loads.find((l) => l.date === date);
    if (!load || load.seconds <= 0) continue;
    const slots = [
      { kind: 'morning' as const, time: args.morning ?? MORNING },
      ...(i === 0 && args.checkedInToday
        ? []
        : [
            { kind: 'evening' as const, time: EVENING },
            { kind: 'late' as const, time: LATE_EVENING },
          ]),
    ];
    for (const slot of slots) {
      const at = istanbulTime(date, slot.time);
      if (at <= args.now) continue;
      result.push({
        id: `${date}-${slot.kind}`,
        at,
        kind: slot.kind,
        date,
        seconds: load.seconds,
        books: load.books,
        videos: load.videos,
      });
    }
  }
  return result;
}
