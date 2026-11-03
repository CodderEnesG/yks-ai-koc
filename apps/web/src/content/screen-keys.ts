// Gerçek ekran görüntülerinin adları (PLAN-2026-11-03): `public/ekran/<ad>-<acik|koyu>.png`. İstemci de kullanır;
// klasörü okuyan kod sunucuda (`screens.ts`).
export const SCREEN_KEYS = ['bugun', 'checkin', 'kutuphane', 'sohbet', 'ayarlar'] as const;
export type ScreenKey = (typeof SCREEN_KEYS)[number];
export type ScreenFiles = Partial<Record<ScreenKey, { acik?: string; koyu?: string }>>;
