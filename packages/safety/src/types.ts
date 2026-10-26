// Risk seviyeleri ve kategorileri (rapor 2.10 katman 2). Değerler sınıflandırıcının çıktı şemasında,
// `safety_event` tablosunda ve istemcide aynıdır.

export const RISK_LEVELS = ['yok', 'yuksek', 'akut'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_CATEGORIES = ['kendine_zarar', 'istismar', 'yeme', 'madde', 'diger'] as const;
export type RiskCategory = (typeof RISK_CATEGORIES)[number];

export const levelRank = (level: RiskLevel): number => RISK_LEVELS.indexOf(level);

/** Bir kaynağın (liste ya da sınıflandırıcı) mesaj hakkındaki değerlendirmesi. */
export interface Assessment {
  level: RiskLevel;
  category: RiskCategory | null;
}
