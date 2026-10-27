# YKS AI Koç — Teknoloji Yığını

Son doğrulama: **2026-10-26**. Yaşayan belge: kullanılan ve kullanılacak kütüphaneleri, sabit sürümleri, elenen seçenekleri ve kodlama kurallarını tutar. Seçimlerin araştırması ve gerekçesi [PLAN-2026-10-22](PLAN-2026-10-22-teknoloji-secimi-ve-t02.md)'de; mimari [final rapor](REPORT-2026-10-21-final-teknik-ve-is-modeli.md) bölüm 2'de. Yeni bir kütüphane eklemeden önce buraya ve PROJECT-STATE'e kayıt düşülür (AGENTS.md).

Sürümler araştırma tarihindeki değerlerdir. Fiyat ve limitler sağlayıcı sayfalarından okunmuş tahmindir; kullanmadan önce yeniden kontrol edilir.

## Kurulu olanlar (T02)

| Katman | Paket ve sürüm | Not |
|---|---|---|
| Çalışma ortamı | Node 22 (`.nvmrc`, en az 22.13), pnpm **10.34.7** (`packageManager`), Deno 2 | pnpm 11/12 denenmedi; Expo uyumu belgelenmemiş |
| Monorepo | pnpm workspaces (`apps/*`, `packages/*`), isolated mod | Turborepo yok; CI 5 dakikayı geçerse eklenir |
| Dil | TypeScript **~6.0.3**, her pakette açıkça | npm `latest` 7.x; TS 7'de typescript-eslint çalışmıyor |
| Mobil çatı | Expo **SDK 58** (`expo` ~58.0.17), React Native **0.88.0**, React **19.3.0**, CNG + `expo-dev-client` | `ios/` ve `android/` üretilir, commit edilmez. React Compiler ve typed routes açık |
| Navigasyon | `expo-router` ~58.0.25, native tabs | `@react-navigation/*` import edilmez (aşağıda) |
| UI/stil | `uniwind` **1.13.0** (ücretsiz), `tailwindcss` ^4.3.3, RN Reusables bileşenleri (`src/components/ui/`, kod repoda) + `@rn-primitives/slot`, `@rn-primitives/portal`, `class-variance-authority`, `clsx`, `tailwind-merge` | Tema `src/global.css`'te yer tutucu (shadcn neutral); branding gelince yalnız değişkenler değişir |
| Animasyon/jest | `react-native-reanimated` 4.7.1, `react-native-worklets` 0.13.0, `react-native-gesture-handler` ~3.3.0 | Expo pin'leri. Uniwind ücretsizde `className` animasyonu yok; animasyon doğrudan Reanimated ile |
| Yerel veri | `expo-sqlite` ~58.0.13, `drizzle-orm` **~0.45.4** (1.0 RC değil), `drizzle-kit` (migration üretimi), `babel-plugin-inline-import` (`.sql` gömme) | Migration'lar `apps/mobile/drizzle/`, şema `src/db/schema.ts` |
| Web | `next` **16.4.3**, React 19.3, Tailwind 4, React Compiler, `cacheComponents`; `@supabase/supabase-js` 2.118.0 | Veli onay sayfası `/onay/[token]` (T21; istemci bileşeni, veli oturumu tarayıcıda, erişim yalnız RPC'lerle). `params` gibi istek verisi `Suspense` içinde okunur (cacheComponents kuralı). Ayarlar `apps/web/.env.local` (`.env.example`). Rapor sayfası `/rapor/[token]` (T22; sunucu bileşeni, `weekly-report`'u istek anında çağırır) |
| Plan motoru | `packages/plan-engine`: bağımlılık yok | `vitest` ^5.0.5 + `fast-check` ^4.10.2 ile property testleri |
| Güvenlik | `packages/safety`: bağımlılık yok; uygulama, `packages/ai` ve Edge Function'lar kullanır | Kriz listesi, karar kuralı, çıktı denetimi, sabit metinler (T18). Liste, istem ya da model değişince eval seti (T19) yeniden koşulur |
| Şema/doğrulama | `zod` ^4.6.7 | Kurulum profili doğrulaması (T09). Hedef: aynı şemalar Edge Function ve LLM JSON şeması (`z.toJSONSchema`) için de kaynak olsun. Formlar küçükken düz state + `safeParse` |
| İstemci state | `zustand` ^5.0.16 | Kurulum taslağı (kalıcı değil). TanStack Query 5 yalnız Supabase çağrıları gelince (T16) |
| Kimlik | `expo-crypto` ~58.0.7 (`randomUUID`) | Cihazda üretilen kayıt kimlikleri (sync şeması). Native modül: eklenince dev build yeniden derlendi |
| Klavye | `react-native-keyboard-controller` 1.22.7 (`KeyboardProvider`, `KeyboardStickyView`) | Kurulum adımlarında "Devam" klavyenin üstüne yapışır (iOS sayı klavyesinde kapatma tuşu yok). RN `KeyboardAvoidingView` native stack içinde işe yaramadı. Sohbette de kullanılacak |
| Supabase istemcisi | `@supabase/supabase-js` 2.118.0 | Katalog okuması (oturumsuz da) ve T16'dan beri e-posta OTP oturumu (`expo-sqlite/localStorage` ile saklanır), senkron upsert'leri. Ayarlar `apps/mobile/.env` (`EXPO_PUBLIC_SUPABASE_URL`, `_PUBLISHABLE_KEY`; yerelde `supabase status -o env`) |
| YouTube | YouTube Data API v3, yalnız API anahtarı (herkese açık veri, OAuth yok), yalnız `youtube-import` Edge Function'da (secret `YOUTUBE_API_KEY`); `packages/youtube` link ve ISO 8601 süre ayrıştırma (uygulama ve fonksiyon ortak, `URL`'ye dayanmaz). Video `Linking.openURL` ile YouTube'da açılır | T31, T33. Önbellek en fazla 30 gün (politika III.E.4) |
| Kamera ve görsel | `expo-camera` ~58.0.12, `expo-image-picker` ~58.0.10, `expo-image-manipulator` ~58.0.15, `expo-file-system` ~58.0.10 | Barkod (EAN-13) expo-camera ile. İçindekiler fotoğrafı (T11) image-picker ile (kamera ya da galeri), 1600 px JPEG'e küçültülür, geçici dosyalar file-system ile hemen silinir. `scanDocumentAsync` kullanılmadı: picker iki platformda da galeriyi de veriyor |
| LLM | `@anthropic-ai/sdk` **1.3.0** (tam sürüm) yalnız Edge Function'da ve `tools/toc-eval`'de; `packages/ai` istem, model adı ve Zod çıktı şemasını ikisine paylaştırır | İçindekiler okuma Claude Haiku 5.5, `messages.parse` + `zodOutputFormat` (T11). Risk sınıflandırma aynı yolla, `output_config.effort: 'low'`; istem kısa, önbellek eşiğinin altında, `cache_control` yok (T18). Sohbet (T17) `messages.create`, akışsız, `effort: 'low'`; sabit koç istemi `cache_control` ile önbellekte (Haiku 5.5 eşiği 512 token), değişen bağlam ikinci sistem bloğunda. Haiku 5.5'te düşünme açık: yanıttan yalnız `text` bloklar alınır; önceden doldurma (prefill) 400 verir |
| Edge Functions | `supabase/functions/<ad>/` (Deno), her fonksiyonun kendi `deno.json` import map'i | Yerelde `supabase functions serve --env-file supabase/functions/.env` (gitignore'da). `"lock": false`: yerel Deno 2.9'un lockfile v5'ini edge runtime (Deno 2.1) okuyamıyor. Fonksiyonlar arası ortak kod `supabase/functions/_shared/` (sınıflandırıcı, kitap adları); içe aktaran fonksiyonun import map'iyle çözülür, CI onu ayrı denetlemez |
| Analitik | `posthog-react-native` **4.84.0** + `expo-application`, `expo-device`, `expo-localization` (eş bağımlılıklar) | PostHog AB bulutu (T24). Kişi profili yok (`personProfiles: 'never'`), GeoIP kapalı, oturum kaydı ve anket yok, otomatik dokunma yakalama yok (`PostHogProvider` kullanılmıyor); yalnız uygulama yaşam döngüsü olayları ve `features/analytics`'teki tipli olaylar. 18 yaş altında veli onayından önce başlamaz. Anahtar `.env`'de yoksa kapalı. Native modül: eklenince dev build yeniden derlenmeli |
| Bildirim | `expo-notifications` ~58.1.6 | Yerel, tarih tetikleyicili; 7 gün × en fazla 3 (iOS 64 bekleyen bildirim sınırının altında). `SCHEDULE_EXACT_ALARM` istenmez |
| Metinler | Tipli `src/i18n/tr.ts` nesnesi (`tr.onboarding.…`) | Türkçe tek dil; ikinci dil gelirse i18next'e taşınır. Tarih biçimi Intl'siz (`src/lib/date.ts`) |
| Test (mobil) | `vitest` ^5.0.5 saf mantık için (`src/**/*.test.ts`); Maestro 2 akışları `apps/mobile/e2e/` (yerelde, CI'da değil) | Bileşen testleri gerekirse `jest-expo` + RNTL |
| Lint/format | `eslint` ^9 + `eslint-config-expo` ~58.0.4 / `eslint-config-next` 16.4.3, `eslint-config-prettier`, `prettier` ^3.9.10 | ESLint 10 çıktı ama Expo 9'u sabitliyor |
| CI | GitHub Actions (Linux): Prettier, typecheck, lint, test, `deno check` (plan motoru, güvenlik paketi ve her Edge Function, `--config` ile kendi `deno.json`'uyla) | `.github/workflows/ci.yml` |
| Geliştirme araçları | `tools/*` workspace paketleri; script'ler Node 22'nin TypeScript tip ayıklamasıyla doğrudan çalışır (`node x.ts`), CI typecheck'ine girer. `tools/toc-eval`: poppler (`pdftotext`, `pdftoppm`), `sharp` 0.35.5, `@anthropic-ai/sdk` 1.3.0 | Ayarlar `.env`'de (`.env.example`) |
| Native araçlar | Xcode 26.0.1 + CocoaPods 1.17 (iOS), Android Studio + JDK 17 + Gradle 9.4.1 (Android) | İkisinde de dev build başarılı (2026-10-23) |

## Planlanan, henüz kurulmadı

| Katman | Seçim | Görev |
|---|---|---|
| Backend (kalan) | Gerçek e-posta sağlayıcısı (SMTP) ve Pazar raporu e-postası için pg_cron işi (pg_cron saklama temizliği için kurulu, `retention-daily`). Storage kullanılmıyor: içindekiler görüntüsü istek gövdesiyle gider, hiçbir yere yazılmaz | T22 |
| Listeler | FlatList (kısa listeler), `@shopify/flash-list` 2 (sohbet) | T13, T17 |
| Sohbet | Kendi arayüzümüz + `react-native-keyboard-controller`; akış için AI SDK `useChat` + `expo/fetch` ya da elle SSE okuyucu (Türkçe çok baytlı karakter testiyle seçilir) | T17 |
| Modal | Expo Router `formSheet`; gerekirse `@gorhom/bottom-sheet` 5 | — |
| YouTube (kalan) | Paylaş menüsünden liste alma; Ocak'ta uygulama içi resmi oynatıcı (`react-native-youtube-iframe`) | T35 |
| İkon/diğer | `lucide-react-native` (+ Reusables `icon` bileşeni), `expo-haptics`, `expo-image` | — |
| Test (uygulama) | Bileşen testleri için `jest-expo` + React Native Testing Library (gerekirse); Maestro akışları release öncesi 3-5'e tamamlanır | T25 |
| Hata izleme | Sentry EU (org kurulurken EU seçilir, sonradan değişmez); PII temizleme açık. 18 yaş altında onaydan önce kapalı | T24 (DSN bekleniyor) |
| E-posta | Açık karar #13 (Resend / Brevo / AWS SES Frankfurt). Yerelde Mailpit; sağlayıcı seçilince yalnız SMTP ayarı değişir | Yayın öncesi |
| Web barındırma | Öneri: Cloudflare Workers + AB yerleşimi; olmazsa Vercel Pro fra1 (açık karar #15) | Sprint 2 |
| Ödeme | RevenueCat (`react-native-purchases`) | Şubat 2027 |

## Kurallar

**Paket ekleme**
- Expo paketleri `apps/mobile` içinde `pnpm exec expo install <paket>` ile kurulur; SDK 58'in sabitlediği sürüm gelir. Expo CLI paket yöneticisini PATH'te arar, bu yüzden `corepack enable pnpm` gerekir.
- Sürümler sabitlenir; büyük sürüm yükseltmesi PROJECT-STATE'e kayıt düşülerek yapılır. SDK 59'a geçiş lansmandan (≤20 Aralık) sonra.
- Kurulum script'i isteyen bağımlılıklar `pnpm-workspace.yaml`'daki izin listesine yazılır (`onlyBuiltDependencies`: esbuild; `ignoredBuiltDependencies`: unrs-resolver).

**AI ile kod yazarken sık yapılan hatalar**
- `@react-navigation/*` import etme. Expo Router v56'dan beri kendi kopyasını taşıyor: `expo-router/react-navigation`.
- Gesture Handler 3'te callback adları değişti (`onStart` → `onActivate`); eski API örneklerini kopyalama.
- Uniwind'de `className` yalnız React Native çekirdek bileşenlerinde çalışır. Üçüncü taraf bileşen `withUniwind` ile sarılır (örnek: `src/components/screen.tsx`'teki `SafeAreaView`).
- Render sırasında `Date.now()`, `Math.random()` gibi saf olmayan çağrı yapılmaz; React Compiler lint kuralı yakalar.
- Plan motorunda `Date`'in yerel saat dilimi davranışı kullanılmaz; takvim günü `CivilDate` ile çalışılır. Hermes'te Intl `timeZone` desteği belirsiz.

**Paylaşılan paketler (`packages/*`)**
- Saf TS, kaynak koddan tüketilir (`exports` → `src/index.ts`); build adımı yok.
- Uygulama `packages/ai`'den yalnız `@yks/ai/limits`'i alır (sohbet sınırları). Ana giriş istemleri ve PII düzenli ifadelerini yükler; bunlar telefona girmez.
- Göreli import'lar `.ts` uzantısıyla yazılır (`./civil-date.ts`). Deno uzantı ister; Metro ve Next `allowImportingTsExtensions` ile kabul eder, Next'te `transpilePackages` gerekir.
- Edge Functions'a import map ile alınır: fonksiyonun `deno.json`'unda `"@yks/plan-engine": "../../../packages/plan-engine/src/index.ts"`. Yerelde `deno check` ve `supabase functions serve` ile doğrulandı (`toc-extract` → `packages/ai`); `supabase functions deploy` da `supabase/` dışındaki paketi topluyor (2026-10-26, CLI 2.47.2).

**Metro ve uçtan uca testler**
- Metro'yu `CI=1` ile başlatma: Expo bu modda dosya izlemeyi kapatır ve değişiklikler uygulamaya gelmez (2026-10-24'te yarım saat buna gitti).
- Maestro akışları `apps/mobile/e2e/`'de. Hesap akışı giriş kodunu yerel Mailpit API'sinden (`127.0.0.1:54324/api/v1/messages`) `scripts/read-otp.js` ile okur. Birden çok simülatör açıksa cihaz belirtilmeli (`maestro --device <UDID> test apps/mobile/e2e`); aksi hâlde Maestro başka bir projenin simülatörüne gidebilir. Dev build simülatöre kurulu ve Metro açıkken `maestro test apps/mobile/e2e` ile koşar. `_open-dev-build.yaml` temiz durumla açar ve kendiliğinden açılan Expo geliştirici menüsünü kapatır.
- Maestro iOS'ta ekran dışındaki ya da klavyenin arkasındaki öğeyi görünür sayabilir: `scrollUntilVisible`'da `visibilityPercentage: 100` ve `centerElement: true` kullan, kaydırmadan önce klavyeyi bir başlığa dokunarak kapat. Sayı klavyesinde `hideKeyboard` tuşa basar; kullanma.
- Web sayfaları simülatörün Safari'sinde test edilir (`openLink`). Safari'de `hideKeyboard` forma dokunabiliyor; klavyeyi çubuktaki `Done` ile kapat. Web sayfasında bir metni `{a}/{b}` gibi parçalı yazma: WebKit her parçayı ayrı düğüm verir (Maestro ve ekran okuyucu bölünmüş görür); şablon dizesiyle tek parça yaz. Web görünümünde de ekran dışındaki öğe görünür sayılır: dokunmadan önce `scrollUntilVisible` + `centerElement`. Onay kutularına `aria-label` ile dokunulur; durum `checked: true` ile doğrulanır. `consent-minor.yaml` için `pnpm --filter @yks/web dev` açık olmalı; mobil `.env`'de `EXPO_PUBLIC_WEB_URL`.
- `toc-add.yaml` simülatör galerisinde bir içindekiler görüntüsü ister (`xcrun simctl addmedia <UDID> data-private/meb-ogm/toc-photo/<kitap>.jpg`; telifli, repoya girmez) ve `supabase functions serve` açık olmalı. Her koşu bir gerçek Claude çağrısı yapar (≈0,001$, tahmin).

**Üretilen dosyalar**
- Expo Router typed routes `.expo/types/router.d.ts`'e Metro (`expo start`) tarafından üretilir ve gitignore'dadır. CI'da bu dosya olmadığı için rota adları denetlenmez (`Href` serbest string olur); yerelde Metro açıkken typecheck rota yazım hatalarını yakalar.
- `apps/mobile/src/uniwind-types.d.ts` Metro tarafından üretilir ve commit edilir (CI typecheck için).
- `expo-env.d.ts` gitignore'da; aynı tipler `src/env.d.ts`'ten referanslanır.
- Drizzle migration'ları `pnpm exec drizzle-kit generate --name <ad>` ile `apps/mobile/drizzle/`'a üretilir ve commit edilir.

## Yerel veri ve sync şeması

- Onaydan önce Supabase'e kişisel veri gitmez ve giriş yapılmaz (anonim giriş dahil); yalnız katalog oturumsuz okunur (rapor 2.11).
- Her kullanıcı tablosunda: cihazda üretilen `id` (UUID), `user_id`, `updated_at` (istemci zamanı), `server_updated_at` (sunucuda trigger), `deleted_at` (sunucuda gerçek DELETE yok).
- Her kullanıcı tablosu `user_id … references auth.users (id) on delete cascade`: hesap silme (T28) yalnız auth kullanıcısını siler. pgTAP testi denetler; tek istisna `consent_request` (`set null`, rıza kayıtları kalır).
- 18 yaş altı veri sunucuda da onaysız kabul edilmez: öğrenci tablolarında kısıtlayıcı (restrictive) RLS politikaları (`consent_ok`, `my_consent_ok`). Yeni öğrenci tablosu da aynı politikayı almalı.
- RLS: `using (user_id = auth.uid())` ve `with check (user_id = auth.uid())`. 30 Ekim 2026'dan sonra her migration'a açık `GRANT … TO authenticated` (doğrulanacak).
- Sync kapsamı (karar 14, 2026-10-26): cihaz asıl kaynak, sunucu yedek. Son gönderimden beri değişen satırlar upsert edilir; tam çekme yalnız yeni telefonda geri yüklemede.

## Elenenler

| Seçenek | Neden elendi |
|---|---|
| Bare React Native CLI | Native yükseltme bakımı 225-300 saatlik bütçeye ağır |
| Expo SDK 57 | Kütüphane uyumu daha oturmuş ama lansmandan sonra yükseltme gerekirdi; SDK 58 spike'ta sorunsuz çalıştı |
| Tamagui 3 | 12 günlük major, AI araçları v2 kodu üretiyor, commit'lerin ≈%95'i tek kişiden; native performans üstünlüğü bağımsız ölçümle gösterilmemiş |
| NativeWind v4 | Tailwind v3'te kalıyor; v5 RC ve SDK 58 desteği yolda |
| HeroUI Native, Unistyles 3, düz StyleSheet | Sırasıyla: tasarım diline bağlılık ve SDK 58 uyumu belirsiz; bileşen seti yok; en yavaş yol |
| PowerSync, ElectricSQL, InstantDB, Triplit | Yeni yurt dışı veri işleyen (KVKK); PowerSync ücretsiz planı hareketsizlikte duruyor |
| WatermelonDB, Legend-State v3 | Bakım ve New Architecture durumu belirsiz; Legend-State v3 hâlâ beta |
| MMKV | Nitro bağımlılığı; expo-sqlite zaten var |
| Notifee | 2026-04'te arşivlendi |
| Gifted Chat | Bağımlılık yükü, özelleştirme zor |
| Turborepo, Nx | İki kişilik ekip için gereksiz |
| Biome, oxlint | Expo preset'i yok / formatter beta |
| Gemini (içindekiler okuma) | T05'te Haiku 5.5'ten zayıf çıktı (fotoğraf benzeri görüntüde sayfa %99,0'a %100, başlık %73'e %98,5); tek sağlayıcı kuralı korunur |
| Detox | Native kurulumu pahalı; Maestro yeterli |
