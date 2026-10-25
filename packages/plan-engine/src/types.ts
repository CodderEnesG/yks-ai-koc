import type { CivilDate } from './civil-date.ts';

/**
 * Sayfa aralığı, test aralığı ya da tek video. Video bölünmez: `first === last` (listedeki sırası) ve
 * süresi `videoMinutes` ile hesaplanır (rapor 2.6).
 */
export type UnitKind = 'pages' | 'tests' | 'video';

/** Bir kaynağın (kitap ya da oynatma listesi) tek birimi, kaynaktaki sırasıyla. */
export interface StudyUnit {
  id: string;
  kind: UnitKind;
  /** İlk sayfa ya da test numarası (dahil); videoda listedeki sırası. */
  first: number;
  /** Son sayfa ya da test numarası (dahil); videoda `first` ile aynı. */
  last: number;
  /** Birimin tamamı için tahmini dakika. */
  minutes: number;
  /** 0-1 arası sınav ağırlığı. Verilmezse 0,5. */
  examWeight?: number;
  /** 0-1 arası zayıflık. Verilmezse 0,5. */
  weakness?: number;
}

export interface StudySource {
  id: string;
  /** Öğrencinin belirlediği sıra; küçük olan önce. */
  order: number;
  /** Birimler kitaptaki sırasıyla. */
  units: readonly StudyUnit[];
}

export interface PlanInput {
  /** Planın ilk günü: bugün ya da check-in yapıldıysa yarın. Öncesi hiçbir zaman değişmez. */
  from: CivilDate;
  examDate: CivilDate;
  /** Pazartesi'den Pazar'a çalışma dakikası (7 eleman). */
  weekdayMinutes: readonly number[];
  sources: readonly StudySource[];
  /** Birim kimliğine göre baştan itibaren tamamlanan sayfa ya da test sayısı. */
  completed?: Readonly<Record<string, number>>;
  /** Check-in nedenlerinden türetilen ayarlar (rules.ts: deriveAdjustments). */
  adjustments?: PlanAdjustments;
}

/** Neden kurallarının plana etkisi (rapor 2.6). Hepsi isteğe bağlı; yoksa etkisiz. */
export interface PlanAdjustments {
  /** Tüm günlerin kapasite çarpanı, (0, 1]. "Zaman yetmedi" serileri düşürür. */
  capacityFactor?: number;
  /** Belirli günlerin kapasite çarpanı, (0, 1]. Güvenli mod %50. */
  dayFactors?: Readonly<Record<string, number>>;
  /** Birim süre çarpanı, [1, 5]. "Konu zor" ×1,3. */
  unitFactors?: Readonly<Record<string, number>>;
  /** Bu günlerde en kısa görev başa alınır ("ısınma"). */
  warmupDays?: readonly string[];
}

/** Bir birimin ardışık bir aralığı. Süreler tamsayı saniye. */
export interface UnitRange {
  sourceId: string;
  unitId: string;
  kind: UnitKind;
  first: number;
  last: number;
  seconds: number;
}

export interface PlanDay {
  date: CivilDate;
  capacitySeconds: number;
  seconds: number;
  tasks: UnitRange[];
}

export type PlanWarning =
  /** Talep kapasiteyi aşıyor; yalnız çekirdek birimler planlandı, kalanı `optional`'da. */
  | { code: 'overload'; demandSeconds: number; capacitySeconds: number }
  /** Çekirdek işin bir kısmı günlere sığmadı (ör. tek bir test günlük süreden uzun). */
  | { code: 'unscheduled'; seconds: number };

export interface PlanResult {
  /** Plan bu günden önce biter (sınav tarihi - 21 gün; son 3 hafta genel tekrar). */
  targetEnd: CivilDate;
  /** `from` ile `targetEnd` arasındaki çalışma günleri (kapasitesi 0 olanlar hariç). */
  days: PlanDay[];
  /** Çekirdeğe giremeyen birimler: "zaman kalırsa" listesi. */
  optional: UnitRange[];
  /** Çekirdekte olup günlere sığmayan aralıklar. */
  unscheduled: UnitRange[];
  warnings: PlanWarning[];
}
