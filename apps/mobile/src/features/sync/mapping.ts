// Cihaz satırlarını sunucu satırlarına çevirir ve geri (T16). Sunucu şeması: supabase/migrations.
// `user_id` gönderilmez: eklemede sunucu varsayılanı auth.uid(), güncellemede değişmez. Saf; test edilir.
import type { checkin, libraryItem, planTask, profile } from '@/db/schema';

type Profile = typeof profile.$inferSelect;
type LibraryItem = typeof libraryItem.$inferSelect;
type PlanTask = typeof planTask.$inferSelect;
type Checkin = typeof checkin.$inferSelect;

export function profileToServer(p: Profile) {
  return {
    id: p.id,
    birth_year: p.birthYear,
    birth_month: p.birthMonth,
    grade: p.grade,
    field: p.field,
    target_kind: p.targetKind,
    target_value: p.targetValue,
    exam_date: p.examDate,
    weekday_minutes: p.weekdayMinutes,
    consent_status: p.consentStatus,
    updated_at: p.updatedAt,
  };
}

export function libraryItemToServer(i: LibraryItem) {
  return {
    id: i.id,
    source_kind: i.sourceKind,
    edition_id: i.editionId,
    custom_edition: i.customEdition,
    yt_playlist_id: null,
    sort_order: i.sortOrder,
    priority: i.priority,
    status: i.status,
    minutes_per_item: i.minutesPerItem,
    updated_at: i.updatedAt,
    deleted_at: i.deletedAt,
  };
}

/** Katalog kitabının birim anahtarı katalog birim kimliğidir (unit_id); özel baskıda custom_unit_key. */
export function planTaskToServer(t: PlanTask, fromCatalog: boolean) {
  return {
    id: t.id,
    library_item_id: t.libraryItemId,
    day: t.day,
    kind: t.kind,
    unit_id: fromCatalog ? t.unitKey : null,
    custom_unit_key: fromCatalog ? null : t.unitKey,
    range_first: t.kind === 'video' ? null : t.rangeFirst,
    range_last: t.kind === 'video' ? null : t.rangeLast,
    video_id: null,
    est_seconds: t.estSeconds,
    status: t.status,
    reason: t.reason,
    updated_at: t.updatedAt,
    deleted_at: t.deletedAt,
  };
}

export function checkinToServer(c: Checkin) {
  return {
    id: c.id,
    day: c.day,
    correct_count: c.correctCount,
    wrong_count: c.wrongCount,
    updated_at: c.updatedAt,
  };
}

type ServerProfile = ReturnType<typeof profileToServer> & { server_updated_at?: string };
type ServerLibraryItem = ReturnType<typeof libraryItemToServer>;
type ServerPlanTask = ReturnType<typeof planTaskToServer>;
type ServerCheckin = ReturnType<typeof checkinToServer>;

// Geri yükleme (yeni telefon): sunucu satırı → cihaz satırı. Sunucu sayıları metin dönebilir (numeric).
export function profileFromServer(s: ServerProfile): Profile {
  return {
    id: s.id,
    birthYear: s.birth_year,
    birthMonth: s.birth_month,
    grade: s.grade,
    field: s.field,
    targetKind: s.target_kind,
    targetValue: s.target_value === null ? null : Number(s.target_value),
    examDate: s.exam_date,
    weekdayMinutes: s.weekday_minutes,
    consentStatus: s.consent_status,
    createdAt: s.updated_at,
    updatedAt: s.updated_at,
  };
}

export function libraryItemFromServer(s: ServerLibraryItem): LibraryItem {
  return {
    id: s.id,
    sourceKind: s.source_kind,
    editionId: s.edition_id,
    customEdition: s.custom_edition,
    minutesPerItem: s.minutes_per_item === null ? null : Number(s.minutes_per_item),
    sortOrder: s.sort_order,
    priority: s.priority,
    status: s.status,
    createdAt: s.updated_at,
    updatedAt: s.updated_at,
    deletedAt: s.deleted_at,
  };
}

export function planTaskFromServer(s: ServerPlanTask): PlanTask {
  return {
    id: s.id,
    libraryItemId: s.library_item_id,
    day: s.day,
    kind: s.kind,
    unitKey: s.unit_id ?? s.custom_unit_key ?? '',
    rangeFirst: s.range_first ?? 1,
    rangeLast: s.range_last ?? 1,
    estSeconds: s.est_seconds,
    status: s.status,
    reason: s.reason,
    createdAt: s.updated_at,
    updatedAt: s.updated_at,
    deletedAt: s.deleted_at,
  };
}

export function checkinFromServer(s: ServerCheckin): Checkin {
  return {
    id: s.id,
    day: s.day,
    correctCount: s.correct_count,
    wrongCount: s.wrong_count,
    createdAt: s.updated_at,
    updatedAt: s.updated_at,
  };
}

/** 18 yaş altında veli onayı gelmeden hiçbir veri sunucuya gitmez (değişmez kural, rapor 2.11). */
export function canSync(consentStatus: Profile['consentStatus']): boolean {
  return consentStatus === 'not_required' || consentStatus === 'granted';
}
