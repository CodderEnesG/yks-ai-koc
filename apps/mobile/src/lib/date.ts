import type { CivilDate } from '@yks/plan-engine';

import { tr } from '@/i18n/tr';

/** "2027-06-19" → "19 Haziran 2027". Intl'e dayanmaz (Hermes'te tr-TR saat dilimi desteği belirsiz). */
export function formatCivilDate(date: CivilDate): string {
  const [year, month, day] = date.split('-').map(Number) as [number, number, number];
  return `${day} ${tr.months[month - 1]} ${year}`;
}
