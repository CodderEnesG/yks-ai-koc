// Takvim günü yardımcıları. Plan motoru saat değil gün ile çalışır; `Date`'in
// cihaz saat dilimine bağlı davranışından kaçmak için her şey epoch-day
// tamsayısı üzerinden hesaplanır. Hermes, Node ve Deno'da aynı sonucu verir.

/** `YYYY-MM-DD` biçiminde takvim günü. */
export type CivilDate = string & { readonly __brand: 'CivilDate' };

const MS_PER_DAY = 86_400_000;

// Türkiye 2016'dan beri kalıcı olarak UTC+3.
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000;

const CIVIL_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCivilDate(value: string): CivilDate {
  const match = CIVIL_DATE_RE.exec(value);
  if (!match) throw new RangeError(`Geçersiz tarih: ${value}`);
  const [, y, m, d] = match;
  const epochDay = Date.UTC(Number(y), Number(m) - 1, Number(d)) / MS_PER_DAY;
  // 2026-02-30 gibi taşan tarihler Date.UTC'de sessizce kayar; geri çevirip yakalıyoruz.
  if (fromEpochDay(epochDay) !== value) throw new RangeError(`Geçersiz tarih: ${value}`);
  return value as CivilDate;
}

export function toEpochDay(date: CivilDate): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d) / MS_PER_DAY;
}

export function fromEpochDay(epochDay: number): CivilDate {
  if (!Number.isInteger(epochDay)) throw new RangeError(`Epoch günü tamsayı olmalı: ${epochDay}`);
  return new Date(epochDay * MS_PER_DAY).toISOString().slice(0, 10) as CivilDate;
}

export function addDays(date: CivilDate, days: number): CivilDate {
  return fromEpochDay(toEpochDay(date) + days);
}

/** `b`'den `a`'ya kaç gün olduğunu verir (a - b). */
export function diffDays(a: CivilDate, b: CivilDate): number {
  return toEpochDay(a) - toEpochDay(b);
}

/** Haftanın günü: 0 = Pazartesi … 6 = Pazar. `gün_bazlı_dk[7]` dizisinin indeksi. */
export function weekdayIndex(date: CivilDate): number {
  // 1970-01-01 Perşembe (indeks 3).
  return (((toEpochDay(date) + 3) % 7) + 7) % 7;
}

/** Verilen andaki İstanbul takvim günü. */
export function istanbulDate(epochMs: number): CivilDate {
  return fromEpochDay(Math.floor((epochMs + ISTANBUL_OFFSET_MS) / MS_PER_DAY));
}
