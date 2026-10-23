# Teknoloji seçimi ve Sprint 0 iskeleti (T02)

Tarih: **2026-10-22**, gözden geçirme **2026-10-23**. Durum: **uygulandı (2026-10-23), tarihli kayıt.** Güncel stack ve kurallar [TECH-STACK](TECH-STACK.md)'te; spike sonuçları PROJECT-STATE'te. Bu belge araştırmanın ve gerekçenin kaydı olarak kalır.

## Bağlam

Kurucular React Native ile iOS + Android'e çıkmaya karar verdi (karar 10 kapandı). Branding paralelde ilerliyor. Bu plan iki şey yapar: (1) kütüphane seçimlerini repoya kanonik bir belge olarak yazar, (2) ardından T02 monorepo iskeletini kurar ve seçimleri 1. gün spike'ıyla doğrular. Araştırma 2026-10-22'de npm registry ve resmi dokümanlardan yapıldı; sürümler o güne ait. 2026-10-23'te npm registry'den yeniden kontrol edildi: `expo` 58.0.17 (58.0.0 çıkışı 29 Eylül), `react-native` 0.88.0, `expo-sqlite` 58.0.13, `drizzle-orm` 0.45.4 (1.0 hâlâ RC), `next` 16.4.3, `uniwind` 1.13.0, `@anthropic-ai/sdk` 1.2.0. `typescript`'in `latest` etiketi 7.0.2; 6.x hattının son sürümü 6.0.3.

Kullanıcı seçimleri: **Expo SDK 58**, **expo-sqlite + Drizzle + kendi sync**. UI için Tamagui istendi; araştırma sonrası kullanıcı öneri istedi → **Uniwind + RN Reusables** (gerekçe aşağıda).

## Neden monorepo

Aynı kod üç ortamda çalışmak zorunda: `plan-engine` mobilde (onay öncesi tamamen cihazda), web'deki veli rapor sayfasında ve sunucuda (haftalık rapor); `safety` kelime listesi Edge Function'da ve istemcide; Zod şemaları ve Supabase tipleri üçünde de. Seri ve plan kuralı iki yerde yazılırsa öğrencinin gördüğüyle velinin raporu ayrışır; "aynı girdi, aynı çıktı" (rapor 2.6) ancak tek kopyayla sağlanır. Ayrıca şema, mobil ve web değişikliği tek PR'da yapılır ve tek CI koşar.

Elenenler: ayrı repolar + npm'e yayın (her değişiklikte yayın ve sürüm angaryası), kod kopyalama (kopyalar ayrışır), web'siz tek Expo uygulaması (veli sayfası yine lazım, plan motoru Edge Function'a yine taşınır). Bedel: Metro/pnpm ve Deno import sürtünmesi; spike'ın 3. ve 5. maddeleri bunu test eder. Bedeli küçük tutmak için Turborepo/Nx yok.

## Seçilen stack

| Katman | Seçim (sürüm) | Neden | Elenen |
|---|---|---|---|
| Çatı | Expo SDK 58 (RN 0.88, React 19.3), CNG + dev client | Lansmana kadar yükseltme yok. Legacy arch SDK 55'te kalktı | Bare RN CLI (bakım yükü) |
| Navigasyon | Expo Router 58 (typed routes, native tabs) | Template varsayılanı. **Not:** v56'dan beri `@react-navigation/*` import'u yok, `expo-router/react-navigation` kullanılır | React Navigation 7 |
| Monorepo | pnpm workspaces (Turborepo yok; CI 5 dk'yı geçerse eklenir) | Expo SDK 54'ten beri pnpm isolated destekliyor. Sorun çıkarsa `node-linker=hoisted`. pnpm sürümü `packageManager` alanıyla corepack üzerinden sabitlenir. pnpm 10'dan beri bağımlılıkların kurulum script'leri varsayılan olarak çalışmaz; gerekenler izin listesine yazılır (pnpm 10'da `onlyBuiltDependencies`; seçilen sürümdeki adı spike'ta doğrulanır) | Nx |
| Dil | TypeScript **6.x'e sabit** (`~6.0.3`) | TS 7'de typescript-eslint çalışmıyor. npm `latest` 7.0.2 olduğu için sürüm her pakette açıkça yazılır | — |
| UI/stil | **Uniwind (ücretsiz) + RN Reusables** | Tailwind v4, derleme anında stil. Bileşen kodu repoya kopyalanır, branding gelince token değiştirmek yeterli. AI araçları Tailwind'i iyi yazıyor. Haftalık 638 bin indirme | Tamagui 3 (12 günlük major, AI v2 kodu üretiyor, bus factor ≈1, native performans üstünlüğü bağımsız ölçümle gösterilmemiş), NativeWind v4 (Tailwind v3'te, v5 RC), HeroUI Native |
| Animasyon/jest | Reanimated 4 + RNGH 3 (Expo pin'leri) | Uniwind ücretsizde `className` animasyonu yok → animasyonlar doğrudan Reanimated ile | — |
| Modal/sheet | Expo Router `formSheet`; gerekirse @gorhom/bottom-sheet 5 | Native, ek paket yok | — |
| Liste | FlatList (kısa listeler), FlashList v2 (sohbet) | — | Legend List (v3 durumu belirsiz) |
| İstemci state | Zustand 5 | Minimal | Jotai, Legend-State (v3 beta) |
| Uzak state | TanStack Query 5 (yalnız Supabase çağrıları) | Yerel veri Drizzle live query'den gelir | — |
| Şema/doğrulama | Zod 4 tek kaynak (uygulama, Edge Function, LLM JSON şeması `z.toJSONSchema`) | Formlar küçük → düz state + `safeParse`; büyürse react-hook-form | Valibot, ArkType |
| Tarih | Bağımlılıksız "civil date" yardımcıları (`YYYY-MM-DD` ↔ epoch-day, İstanbul sabit UTC+3) | Hermes, Node, Deno'da birebir aynı sonuç; plan motoru deterministik kalır. Hermes'te Intl `timeZone` desteği belirsiz | date-fns-tz, Temporal polyfill |
| Metinler | Tipli `tr.ts` + `t('key')` | Türkçe tek dil; ileride i18next'e geçiş kolay. ı/İ dönüşümü için kendi yardımcı + test | i18next, Lingui |
| Sohbet | Kendi UI (FlashList v2 + react-native-keyboard-controller) | Gifted-chat bağımlılık yükü | Gifted-chat 3 |
| Akış (streaming) | **Spike ile seçilir:** AI SDK `useChat` + `expo/fetch` ↔ elle SSE okuyucu (~80 satır) | AI SDK hızla major değiştiriyor; Türkçe çok baytlı karakter chunk sınırı test edilmeli | — |
| Yerel DB + sync | expo-sqlite 58 + Drizzle **0.45.x (RC değil)** + elle sync (kapsam açık; aşağıda 4. madde: tam LWW push/pull ya da gönder + geri yükle) | Yeni veri işleyen yok; onay öncesi tamamen yerel | PowerSync (yeni yurt dışı işleyen), WatermelonDB, Legend-State |
| KV + oturum | `expo-sqlite/localStorage` (Supabase oturumu), kv-store (Zustand persist) | Expo + Supabase resmi yolu; şifreleme gerekirse LargeSecureStore | MMKV (Nitro, gereksiz) |
| Supabase | supabase-js 2.x, CLI 2.x, bölge **eu-central-1** (genel "Europe" değil), pgTAP ile RLS testi | — | — |
| Edge Functions | Deno; `@anthropic-ai/sdk` **tam sürüme sabit** (1.0 bir gün önce kırıcı değişiklikle çıktı); paylaşılan paket: spike ile seçilir (import map + `.ts` uzantılı import'lar ↔ `_shared/` bundle) | — | — |
| Barkod + TOC foto | expo-camera (`barcodeTypes: ['ean13']`; TOC için `scanDocumentAsync`, olmazsa expo-image-picker) + expo-image-manipulator + expo-file-system ile silme | Tek paket, Expo'nun | VisionCamera 5 |
| Bildirim | expo-notifications (`SCHEDULE_EXACT_ALARM` istenmez) | Notifee 2026-04'te arşivlendi | Notifee |
| YouTube | MVP: link yapıştırma + `Linking.openURL`; paylaş menüsü sonra (expo-sharing deneysel) | — | — |
| İkon/diğer | lucide-react-native, expo-haptics, expo-image | — | — |
| Lint/format | `expo lint` (ESLint flat + eslint-config-expo) + Prettier | Expo varsayılanı, hook kuralları AI kodunu yakalar | Biome, oxlint |
| Test | Vitest + fast-check (plan-engine, CI'da zorunlu); jest-expo + RNTL (az sayıda); Maestro 3-5 akış yerelde, release öncesi | — | Detox |
| CI/CD | GitHub Actions Linux: typecheck, lint, test, `deno check`. Dev build yerelde, production EAS cloud, EAS Submit | EAS Free: 15 iOS + 15 Android build/ay | macOS runner |
| Web | Next.js 16 | — | — |
| Gözlem | PostHog EU (replay **kapalı**) + Sentry EU (org kurulurken EU seçilir, sonradan değişmez) | — | Aptabase |
| Ödeme (Şubat) | RevenueCat | — | expo-iap |

## Yeni açık kararlar ve riskler (PROJECT-STATE'e girecek)

1. **OPEN QUESTION — E-posta sağlayıcı:** Supabase'in yerleşik e-postası production'da OTP göndermiyor (saatte 2, yalnız ekip adresleri). Özel SMTP = yeni veri işleyen. Resend'in hesap verisi ve logları ABD'de; ücretsiz katman günde 100 e-posta. Alternatifler: Brevo (AB), AWS SES Frankfurt. Avukat ön görüşmesine bağlı; son tarih T16 öncesi (≈5 Kasım). Geliştirmede Supabase yerel Inbucket yeterli.
2. **Onay öncesi gözlem:** Değişmez kural gereği 18 yaş altında onaydan önce PostHog ve Sentry kapalı. Etkisi: o dönemin D7 ölçümü ve çökme raporu yok. Anonim çökme raporu avukata sorulacaklar listesine eklenir.
3. **Web barındırma (öneri, Sprint 2'de kesinleşir):** Cloudflare Workers Free + EU placement; 3 MiB sınırı aşılırsa Vercel Pro fra1. Vercel Hobby ticari kullanıma izin vermiyor.
4. **OPEN QUESTION — Sync kapsamı (takvim riski):** Çift yönlü LWW push/pull tahmini 20-30 saat; T16'da 8 saat ayrılmış. Öneri (2026-10-23 gözden geçirmesi): MVP'de **cihaz asıl kaynak, sunucu kopya**. Cihazda yazılan tablolar (`profile`, `library_item`, `plan_task`, `checkin`) bir outbox kuyruğuyla sunucuya gönderilir (upsert; `updated_at` büyük olan kazanır). Sunucudan tam çekme yalnız yeni cihazda ya da yeniden kurulumda yapılır (geri yükleme). Sunucuda yazılan veriler (onay durumu, sohbet, katalog) sync'e girmez, doğrudan sorguyla okunur. Gerekçe: sunucu veriyi veli raporu ve sohbet bağlamı için istiyor; aynı anda iki cihazda düzenleme MVP'de nadir. Tahmin 8-12 saat (varsayım: tek aktif cihaz, ayrıca çakışma çözümü yok). 7. maddedeki şema aynen kalır, ileride tam LWW'ye geçiş açık. Onay anında ilk gönderim: onay öncesi biriken tüm yerel satırlar tek seferde kuyruğa alınır (outbox onaydan önce doldurulmaz, çünkü o dönemde hiçbir şey gönderilmeyecek). Karar kurucuların; son tarih T16 öncesi (≈5 Kasım).
5. **Supabase değişikliği (doğrulanacak):** 30 Ekim 2026'dan itibaren tablolar Data API'ye otomatik açılmıyor → her migration'da açık `GRANT … TO authenticated`. Ücretsiz planda yedek yok → yayından önce `pg_dump` yedeği ya da Pro.
6. **Ortam (2026-10-23'te kontrol edildi):** **Dikkat:** terminalde (login shell) PATH'te önce `~/.antigravity/antigravity/bin/node` geliyor ve o **Node 20.19.4**; SDK 58 en az 22.13 istiyor. nvm'deki Node 22.23.1 ancak `nvm use` ile devreye giriyor; pnpm 9.15.0 ve corepack de Homebrew `node@20` altında. Spike'tan önce: repoya `.nvmrc` (22) eklenir, PATH sırası düzeltilir, `node -v` 22 göstermeden kurulum yapılmaz. Diğerleri: pnpm 9.15.0, Docker 24.0.6, Deno 2.9.6, Xcode 26.0.1, JDK 17.0.8 ve Android SDK kurulu. pnpm 9 eski (npm'de son sürüm 12.15.0); proje sürümü `packageManager` alanıyla corepack üzerinden sabitlenir. Docker 2023 sürümü; Supabase CLI ile çalıştığı T03'te denenir. Xcode ve JDK'nin SDK 58 / RN 0.88 ile uyumu spike'ta doğrulanır.
7. Sync şeması T03'ü etkiler: her kullanıcı tablosunda istemci üretimi `id uuid`, `updated_at`, `server_updated_at` (trigger), `deleted_at`; sunucuya DELETE yok; pull imleci sunucu zamanı.

## Adım 1 — Belgeler

İki parçaya bölünür. Kayıt kod başlamadan düşülür (AGENTS.md: yeni teknolojiden önce PROJECT-STATE'e kayıt); TECH-STACK ise spike'tan sonra yazılır ki doğrulanmış sonuç bir kez yazılsın.

**1a — Kod başlamadan:**

- **`docs/PROJECT-STATE.md`:** Platform satırı → "React Native / Expo SDK 58, iOS + Android (2026-10-22)". Açık kararlardan #10 çıkar. Yukarıdaki 1-5. maddeler eklenir. "Güncel teknik kararlar" kısalır ve bu plana bağlanır; TECH-STACK yazılınca bağlantı ona çevrilir. Son doğrulama tarihi güncellenir.
- **`AGENTS.md` "Kod başladığında":** "Kütüphane eklemeden önce TECH-STACK'e (o yazılana kadar bu plana) bak; Expo paketleri `npx expo install` ile; `@react-navigation/*` import etme; sürümleri sabitle" maddesi eklenir.

**1b — Spike bittikten sonra:**

- **Yeni `docs/TECH-STACK.md`** (yaşayan belge): yukarıdaki tablo, spike sonucu, sabit sürümler, elenen seçenekler ve nedenleri, sync taslağı, AI ile kodlama uyarıları, kaynak URL'leri ve araştırma tarihi. Fiyat ve limitler "araştırma tarihindeki değer" diye işaretlenir.
- **`README.md`:** belge haritasına TECH-STACK eklenir.
- Final rapor değiştirilmez (tarihli kanonik referans); farklar PROJECT-STATE ve TECH-STACK'te.

## Adım 2 — T02 iskeleti + 1. gün spike'ı

```text
package.json            private, packageManager: pnpm@<doğrulanan sürüm>, engines node >=22.13
pnpm-workspace.yaml     apps/*, packages/*
tsconfig.base.json      strict, TS 6.x
.github/workflows/ci.yml   install → typecheck → lint → test → deno check
apps/mobile             create-expo-app --template default@sdk-58; Uniwind + Reusables; görünen ad "YKS Koç" (yer tutucu)
apps/web                create-next-app (Next 16, App Router, TS), tek sayfa
packages/plan-engine    sıfır bağımlılık, Vitest + fast-check, civil-date yardımcıları + determinizm property testi
```

`packages/safety`, `ai`, `catalog` ve `supabase/` ilgili görevlerde (T03, T18…) açılır; boş paket kurulmaz. Bundle ID App Store Connect'e kaydedilmez (branding bekleniyor).

**Süre (tahmin):** Raporda T02 için 6 saat ayrılmış; iskelet + spike gerçekçi olarak 8-10 saat. Sprint 0'da ayrılmış tampon yok (T01-T08 toplamı 55 saat). Sıkışırsa spike 2 (Uniwind) T09'a, spike 4 (Drizzle) T16'ya kayar; ikisi de o görevlerin riskini öne çektiği için T02'de denenmeye değer.

Spike kontrol listesi (≈4 saat zaman kutusu):
1. SDK 58 dev build iOS simülatörde ve Android emülatörde açılıyor, Expo Router sekmeleri çalışıyor.
2. Uniwind + bir Reusables bileşeni (Button) çalışıyor; açık/koyu token değişiyor.
3. `plan-engine` Metro, Next ve `deno check` üçünden de import ediliyor → Deno paylaşım yöntemi seçilir.
4. expo-sqlite + Drizzle 0.45.x: tek tablo, migration, `useLiveQuery`.
5. pnpm isolated mod Metro'da sorunsuz; değilse `node-linker=hoisted`. Kurulum script'i isteyen bağımlılıklar izin listesine alınır ve liste TECH-STACK'e yazılır.

Bir madde takılırsa: SDK 58 → 57'ye in; Uniwind → NativeWind v4. Sonuç TECH-STACK'e işlenir.

## Doğrulama

- Belgeler: bağlantılar açılıyor, görev kimlikleri (T02, T03, T16…) ve karar numaraları PROJECT-STATE, rapor ve TECH-STACK arasında tutarlı.
- Kod: `pnpm install`, `pnpm -r typecheck`, `pnpm -r test` (fast-check property testi geçiyor), `pnpm lint` yerelde temiz. `npx expo run:ios` ve `npx expo run:android` uygulamayı açıyor. `pnpm --filter web dev` sayfayı veriyor. `deno check` geçiyor.
- CI: GitHub Actions ilk koşuda yeşil.
- Commit yalnız kullanıcı isterse; `data-private/` ve `.env` commit dışı.
