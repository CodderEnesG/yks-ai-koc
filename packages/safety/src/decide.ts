// Liste ve sınıflandırıcı birlikte karar verir (değişmez kural: kriz sinyali AI'a tek başına bırakılmaz).
// Sınıflandırıcı listeyi hiçbir zaman düşüremez; ikisinden yüksek olan geçerlidir.
import type { ListResult } from './screen.ts';
import { type Assessment, levelRank, type RiskCategory, type RiskLevel } from './types.ts';

/**
 * - `fixed`: akut. LLM yanıt üretmez; PDR onaylı sabit metin ve yardım ekranı (katman 3).
 * - `support`: yüksek. Güvenli mod açılır, LLM yalnız destekleyici istemle yanıt verir (katman 4).
 * - `check`: yalnız sınav deyimi. Alarm yok; yanıta nazik bir kontrol sorusu eklenir.
 * - `unavailable`: sınıflandırıcı çalışmadı ve liste temiz. Sınıflandırılmamış mesaj LLM'e gitmez.
 * - `reply`: risk yok, normal yanıt.
 */
export type SafetyAction = 'fixed' | 'support' | 'check' | 'unavailable' | 'reply';

export interface SafetyDecision {
  level: RiskLevel;
  category: RiskCategory | null;
  action: SafetyAction;
  /** Riski kim gördü; olay kaydına yazılır. */
  sources: ('list' | 'classifier')[];
  /** Güvenli mod açılmalı mı (72 saat; rapor 2.10 katman 4). */
  safeMode: boolean;
}

export function decide(list: ListResult, classifier: Assessment | null): SafetyDecision {
  const classifierLevel = classifier?.level ?? 'yok';
  const level = levelRank(classifierLevel) > levelRank(list.level) ? classifierLevel : list.level;
  const sources: SafetyDecision['sources'] = [];
  if (list.level !== 'yok') sources.push('list');
  if (classifierLevel !== 'yok') sources.push('classifier');
  // Kategori: seviyeyi belirleyen kaynaktan; eşitse sınıflandırıcı (bağlamı görüyor).
  const category =
    level === 'yok'
      ? null
      : classifier && classifierLevel === level
        ? (classifier.category ?? list.category ?? 'diger')
        : (list.category ?? 'diger');

  let action: SafetyAction;
  if (level === 'akut') action = 'fixed';
  else if (level === 'yuksek') action = 'support';
  else if (classifier === null) action = 'unavailable';
  else if (list.idiom) action = 'check';
  else action = 'reply';

  return { level, category, action, sources, safeMode: level !== 'yok' };
}
