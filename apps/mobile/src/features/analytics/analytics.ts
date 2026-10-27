// Ürün analitiği (T24, rapor 2.14): PostHog AB bulutu. Birinci metrik D7 ve D30 elde tutma.
//
// * 18 yaş altında veli onayı gelmeden PostHog hiç başlamaz (değişmez kural); onay geri çekilince ya da
//   hesap silinince durur ve cihazdaki kimlik sıfırlanır.
// * Olaylarda kişisel veri, mesaj içeriği ya da kitap adı yok: olay adları ve özellikleri aşağıdaki
//   tiplerle sınırlı. Kişi profili yok (`personProfiles: 'never'`), IP'den konum çıkarılmaz, otomatik
//   dokunma yakalama ve oturum kaydı yok.
// * Anahtar `.env`'de yoksa (geliştirme, test) her şey sessizce kapalı.
import type { Reason } from '@yks/plan-engine';
import { eq } from 'drizzle-orm';
import PostHog from 'posthog-react-native';

import { db } from '@/db/client';
import { appMeta } from '@/db/schema';
import type { ChatAction } from '@/features/chat/chat';

export type AnalyticsEvents = {
  onboarding_tamam: { sinif: '11' | '12' | 'mezun'; alan: 'SAY' | 'EA' | 'SOZ' | 'DIL' };
  kitap_eklendi: { yontem: 'barkod' | 'katalog' | 'hizli' | 'icindekiler' | 'youtube' };
  plan_olustu: Record<string, never>;
  /** Günün son kartı işaretlenince: yapılan görev oranı (0-1) ve varsa ilk neden. */
  checkin: { tamam_orani: number; neden?: Reason };
  sohbet_mesaj: { aksiyon: ChatAction };
  guvenli_mod_acildi: { kaynak: 'sohbet' | 'destek' | 'checkin' };
  veli_onayladi: Record<string, never>;
};

let client: PostHog | null = null;

/** Onay şartı sağlanan öğrencide (reşit ya da veli onaylı) çağrılır; tekrar çağrılması zararsız. */
export function startAnalytics(): void {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;
  if (client || !key || !host) return;
  client = new PostHog(key, {
    host,
    personProfiles: 'never',
    disableGeoip: true,
    enableSessionReplay: false,
    disableSurveys: true,
    preloadFeatureFlags: false,
    // Uygulama açılışları elde tutma ölçümü için (kişisel veri içermez).
    captureAppLifecycleEvents: true,
  });
  // Önceki bir hesap silme ya da onay geri çekme opt-out'u cihazda bırakmış olabilir; buraya yalnız onay
  // şartı sağlanınca gelinir.
  void client.optIn();
  if (planSeenBeforeStart) {
    planSeenBeforeStart = false;
    trackPlanCreatedOnce();
  }
}

/** Onay geri çekilince ya da hesap silinince: gönderim durur, cihazdaki anonim kimlik sıfırlanır. */
export async function stopAnalytics(): Promise<void> {
  if (!client) return;
  const current = client;
  client = null;
  current.reset();
  await current.optOut();
}

const PLAN_CREATED_KEY = 'analytics_plan_olustu';

/** Analitik başlamadan plan görüldüyse (ekranın effect'i başlatmadan önce çalışır) başlayınca gönderilir. */
let planSeenBeforeStart = false;

/** İlk plan oluşunca bir kez. Analitik kapalıyken işaretlenmez; onay gelince ilk açılışta gider. */
export function trackPlanCreatedOnce(): void {
  if (!client) {
    planSeenBeforeStart = true;
    return;
  }
  const [row] = db.select().from(appMeta).where(eq(appMeta.key, PLAN_CREATED_KEY)).all();
  if (row) return;
  db.insert(appMeta).values({ key: PLAN_CREATED_KEY, value: '1' }).run();
  track('plan_olustu');
}

export function track<E extends keyof AnalyticsEvents>(
  event: E,
  ...props: AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]
): void {
  client?.capture(event, props[0]);
}
