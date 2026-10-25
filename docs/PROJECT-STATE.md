# YKS AI Koç — Proje Durumu

Son doğrulama: **2026-10-23**. Bu belge projenin güncel durumunu tutar; değişiklik günlüğü değildir.

## Güncel aşama

**Sprint 0 sürüyor; T02, T03 (yerelde), T04, T05 ve T09 tamam.** Kullanılan kütüphaneler ve kurallar [TECH-STACK](TECH-STACK.md)'te, seçimin gerekçesi [PLAN-2026-10-22](PLAN-2026-10-22-teknoloji-secimi-ve-t02.md)'de. Sprint 0'ın geri kalanı (22 Ekim - 1 Kasım): T01, T03, T05-T08. Supabase hesabını Enes açacak; T03 hesapla başlar.

T05 ölçüldü (2026-10-24): Fotoğraf benzeri bozulmuş 32 içindekiler görüntüsünde Claude Haiku 5.5 (varsayılan efor) sayfa numaralarının %100'ünü (669/669) doğru okudu, 32 kitabın hiçbiri düzeltme gerektirmedi; Gemini 3.5 Flash-Lite %99,0 ve 26/32. Rapordaki eşik (≥%95) geçildi; ikinci LLM sağlayıcısına gerek yok, içindekiler okuma Haiku 5.5 ile. Sınırlama: bozulma yapay, MEB dizgisi sade; T11 öncesinde 5-10 gerçek telefon fotoğrafıyla kontrol. Ayrıntı `tools/toc-eval/README.md`.

T05 verisi hazır: fotoğraf yerine MEB OGM'nin 32 ücretsiz YKS kitabının (3 Adım, Konu Pekiştirme) içindekiler sayfaları ve PDF metin katmanından çıkarılan doğru cevap: 670 birim, 649'u başlangıç sayfasında bağımsız olarak doğrulandı. PDF'ler `data-private/`'da, araçlar `tools/toc-eval/`'da. Bulgular: kitapların kendi içindekilerinde hata var (onay ekranı gerekli), 3 Adım serisinde ISBN dersleri ayırmıyor (barkod aramasında ders seçimi gerekli), basılı sayfa PDF sayfasından 2 geride. Sınırlama: görüntüler temiz PDF render'ı, telefon fotoğrafı değil; ölçüm iyimser çıkar.

T03: Supabase projesi Frankfurt'ta (`hhfwzfkhcrmakcvmsvbx`), repo bağlı. Şema v1 (`supabase/migrations/`): katalog (`topic`, `work`, `edition`, `unit`; ham başlık yok, herkes okur, yalnız service role yazar) ve öğrenci tabloları (`profile`, `library_item`, `plan_task`, `checkin`; yalnız sahibi okur/yazar, silme yok, `server_updated_at` tetikleyicisi). Varsayılan yetkiler geri alınıp açık GRANT verildi; yetki ve RLS iki katman. 19 pgTAP testi yerelde geçiyor ve CI'a eklendi. Uzak projeye **henüz gönderilmedi** (`supabase db push`). Rıza/veli (T21), sohbet/güvenlik (T17/T18) ve YouTube önbelleği (T31) tabloları kendi görevlerinde. Yerel yığın depolama servisi olmadan başlatılıyor (`-x storage-api,imgproxy,logflare,vector`); eski CLI'da depolama konteyneri sağlıksız çıkıyor.

T09: Kurulum 6 adım (doğum ayı/yılı, sınıf, alan, hedef sıralama/puan, sınav tarihi, hafta içi/sonu süre) ve özet; profil cihazda SQLite'a yazılır, kurulum yapılmamışsa sekmelerden kuruluma yönlendirilir. 18 yaş altı (doğum ayı içinde de reşit olmayan sayılır) özet ekranında veli onayı uyarısı görür ve profil `pending` onay durumuyla kaydedilir; onay akışı T21'de. Kurallar vitest ile, uçtan uca akış iki Maestro testiyle (yetişkin, 18 yaş altı) iOS simülatörde doğrulandı. Android'de henüz denenmedi.

T04: `buildPlan` sayfa ve test birimlerini kapasiteye, kitap sırasına ve 21 günlük tekrar penceresine göre günlere dağıtır; aşırı yükte öncelik skoruna göre çekirdek seçer. Rapor 2.6'daki property'ler (video hariç) ve iki ek property CI'da koşuyor; testlerin bilerek bozulan motoru yakaladığı denendi. Öncelik skoru ağırlıkları varsayılan, rapor tanımlamıyor (**NOT DEFINED**). Neden kuralları T14'te, video birimi T32'de. Ayrıntı `packages/plan-engine/README.md`.

T02 spike sonuçları (2026-10-23, yerelde):

| Kontrol | Sonuç |
|---|---|
| pnpm 10.34.7 workspaces, isolated mod, Metro | Çalışıyor; `node-linker=hoisted` gerekmedi |
| `plan-engine` `.ts` uzantılı import'larla Metro, Next 16 ve Deno'da | Üçünde de derleniyor. Deno'ya import map ile kaynak koddan alınır (bundle yok). Supabase deploy'unun `supabase/` dışını paketlemesi T03'te doğrulanacak |
| Uniwind 1.13 + RN Reusables (Button, Text), Expo Router native tabs | Android emülatörde ve iOS simülatörde çalışıyor |
| expo-sqlite + Drizzle 0.45.4: migration, `useLiveQuery`, yeniden başlatmada kalıcılık | Android emülatörde çalışıyor |
| Android dev build (Gradle 9.4.1, JDK 17) | Başarılı |
| iOS dev build (Xcode 26.0.1, CocoaPods 1.17, iPhone 15 Pro simülatör) | Başarılı; ekran açılıyor. SQLite yazma/kalıcılık iOS'ta elle denenmedi (aynı JS, Android'de doğrulandı) |
| typecheck, lint, Prettier, Vitest + fast-check, `deno check` | Yerelde temiz; GitHub Actions ilk koşusu commit'ten sonra |

Bundle ID ve Android paket adı yer tutucu (`dev.placeholder.ykskoc`); branding gelince App Store Connect kaydından **önce** değiştirilir.

Hedef: **MVP ≤20 Aralık 2026'da App Store'da (ücretsiz)**. App Store gönderimi 14 Aralık.

## Repo durumu

```
/
  README.md  AGENTS.md  CLAUDE.md  .gitignore
  package.json  pnpm-workspace.yaml  pnpm-lock.yaml  tsconfig.base.json  .nvmrc  .prettierrc.json
/.github/workflows/ci.yml                            format, typecheck, lint, test, deno check
/apps
  mobile/                                            Expo SDK 58, Expo Router, Uniwind + Reusables, expo-sqlite + Drizzle
  web/                                               Next.js 16 (veli onayı ve rapor sayfaları; şimdilik yer tutucu)
/packages
  plan-engine/                                       saf TS plan motoru çekirdeği (T04) + property testleri
/tools
  toc-eval/                                          MEB OGM içindekiler doğru cevap veri seti (T05, T12); PDF'ler data-private'da
/docs
  PROJECT-STATE.md                                   bu dosya
  REPORT-2026-10-21-final-teknik-ve-is-modeli.md     başlangıç kararı (PRODUCT yazılana kadar kanonik referans)
  REPORT-2026-10-21-final-teknik-ve-is-modeli.pdf    raporun paylaşılabilir PDF'i
  TECH-STACK.md                                      kütüphaneler, sürümler, kodlama kuralları (yaşayan belge)
  PLAN-2026-10-22-teknoloji-secimi-ve-t02.md         teknoloji seçiminin araştırması + T02 planı (tarihli kayıt)
  reports/
    2026-10-23-gun-raporu.md                       22-23 Ekim gün raporu (tarihli kayıt)
  sources/
    2026-10-15-urun-ve-is-modeli-v1.pdf              ürün ve iş modeli tasarımı v1 (kaynak)
    2026-10-08-kaynak-kitap-verisi-fizibilitesi.md   veri, hukuk, maliyet fizibilitesi (kaynak)
    2026-10-08-kaynak-kitap-verisi-ozet.md           fizibilite özeti (kaynak)
```

Git: remote `origin` → `https://github.com/CodderEnesG/yks-ai-koc` (private), branch `main`. Collaborator: `mhmmcoding` (write).

Repo düzeni Reciapp ve WholeThing'deki yapı örnek alınarak kuruldu: tek kanonik belge, tek güncel durum belgesi, "kanonik değil" başlıklı tarihli kaynak belgeler ve ajanlar için `AGENTS.md`.

## Owner kararları (2026-10-21)

| Konu | Karar |
|---|---|
| Başlama | Başlıyoruz |
| Takvim | MVP olabildiğince hızlı, yılbaşına kalmayacak |
| Ekip | Enes + mhmmcoding kurucu olarak kendileri inşa ediyor; ikisi de yarı zamanlı, task bazlı. Pazarlama çalışması sonra. |
| Kurucu sözleşmesi | Tamamlandı (2026-10-23). |
| İçindekiler test verisi (T05) | Çevreden fotoğraf yok; MEB OGM PDF'lerinin içindekiler sayfaları kullanılır (2026-10-23). |
| İçindekiler okuma modeli (T05) | Claude Haiku 5.5, varsayılan efor. Gemini bırakıldı; tek LLM sağlayıcısı (Anthropic) kuralı geçerli (2026-10-24). |
| Kurulum: hedef (T09) | Hedef sıralama ya da puan; öğrenci türünü seçer, atlayabilir (2026-10-24). |
| Kurulum: sınav tarihi (T09) | Sınıfa göre tahmini tarih dolu gelir (12. sınıf ve mezun: Haziran 2027, 11. sınıf: Haziran 2028); öğrenci değiştirebilir. ÖSYM takvimi (≈14 Kasım) açıklanınca tek yerden güncellenir (2026-10-24). |
| Kurulum: günlük süre (T09) | Hafta içi ve hafta sonu ayrı sorulur; istenirse 7 gün tek tek ayarlanır (2026-10-24). |
| Bütçe | Lansmana kadar olabildiğince az, en fazla 5-10 bin TL |
| Kitle | Herkes (11., 12. sınıf, mezun); veli onayı MVP'de |
| Platform | **React Native / Expo SDK 58, iOS + Android** (2026-10-22). Yayın sırası: önce App Store, sonra Play Store. |
| AI koç | Serbest sohbet MVP'de |
| Ödeme | Veli web'den öder + uygulama içi seçenek de var. **Öneri:** Şubat'ta önce uygulama içi (şirketsiz, GVK 20/B), web ödeme şirket kurulunca (rapor 2.13) |
| İlk kullanıcılar | Kendi çevremiz + koç, dershane, öğretmen tanıdıklar |
| GitHub | `CodderEnesG/yks-ai-koc` private, `mhmmcoding` collaborator |
| YouTube oynatma listesi (Muhammed) | MVP'de hafif sürüm: link yapıştırılır, videolar süreleriyle göreve dönüşür, "YouTube'da aç" ile izlenir. Tam özellik (oynatıcı, izleme takibi, liste↔kitap eşlemesi) Ocak planında. Video ile kitabın sırasını öğrenci seçer. |

## Güncel teknik kararlar (öneri, kod başlarken teyit edilecek)

Expo SDK 58 + TypeScript 6 + Expo Router · pnpm workspaces monorepo · Uniwind + RN Reusables (UI) · expo-sqlite + Drizzle (yerel veri) + elle sync · Zustand + TanStack Query · Zod 4 · Supabase AB/Frankfurt (eu-central-1) · Next.js 16 · Claude Haiku 5.5 + Sonnet 5.5 (yalnız Edge Function'dan) · expo-camera, expo-notifications · PostHog EU + Sentry EU · Vitest + fast-check · RevenueCat (Şubat). Kütüphane listesi, sürümler ve elenen seçenekler [TECH-STACK](TECH-STACK.md)'te. Mimari rapor 2.2-2.15'te.

`ARCHITECTURE.md` henüz yok. Kod başlamadan önce gerekmiyor; rapor bölüm 2 bu işi görüyor. Rapor ile kod ayrışmaya başlayınca yazılacak.

## Açık kararlar

Tam tablo ve önerilerimiz rapor bölüm 7'de. Son tarihi yakın olanlar:

| # | Karar | Son tarih |
|---|---|---|
| 8 | Marka ve App Store adı, alan adı | 1 Kasım |
| 5 | Ton rehberi v1 | 1 Kasım (taslak) |
| 6 | PDR danışmanı | 15 Kasım |
| 7 | **OPEN QUESTION:** Akut riskte veliye otomatik bildirim gidecek mi | 29 Kasım |
| 12 | **OPEN QUESTION:** Liste↔kitap otomatik eşleme önerisi YouTube'un "türetilmiş veri" yasağına (III.E.4.h) takılıyor mu | Ocak |
| 13 | **OPEN QUESTION:** E-posta sağlayıcı. Supabase'in yerleşik e-postası production'da OTP göndermiyor; özel SMTP yeni veri işleyen demek. Resend (veri ABD), Brevo (AB), AWS SES Frankfurt. Avukat ön görüşmesine bağlı | T16 öncesi (≈5 Kasım) |
| 14 | **OPEN QUESTION:** Sync kapsamı. Öneri: cihaz asıl kaynak, sunucu kopya (outbox ile gönder + yeni cihazda geri yükle, ≈8-12 saat); tam çift yönlü LWW ≈20-30 saat (T16'da 8 saat ayrılmış) | T16 öncesi (≈5 Kasım) |
| 15 | Web barındırma. Öneri: Cloudflare Workers Free + AB yerleşimi; 3 MiB sınırı aşılırsa Vercel Pro fra1 (Vercel Hobby ticari kullanıma izin vermiyor) | Sprint 2 |

## Yol haritası

| Tarih | Adım |
|---|---|
| 22 Ekim - 1 Kasım | Sprint 0: T01-T08 (Apple hesabı, monorepo, Supabase şeması, plan motoru çekirdeği, içindekiler testi, ton rehberi, rıza metinleri, anket) |
| 2 - 15 Kasım | Sprint 1: T09-T16, T31-T33 (kurulum, kütüphane, günlük döngü, bildirimler, auth, YouTube liste ekleme) |
| 16 - 29 Kasım | Sprint 2: T17-T24, T34 (sohbet, güvenlik katmanı, veli onayı ve raporu, YouTube önbellek yenileme) |
| 30 Kasım - 13 Aralık | Sprint 3: T25-T30 (TestFlight kapalı beta, düzeltmeler, App Store hazırlığı) |
| 14 Aralık | App Store gönderimi + Google kapalı testinin başlaması (12 testçi × 14 gün) |
| ≤20 Aralık | **MVP App Store'da** |
| Ocak 2027 | Android, tam video özelliği (T35-T39), FSRS, deneme analizi, katalog terfisi, ödeme altyapısı, ücretli avukat görüşü, 20/B teyidi |
| 1 Şubat 2027 | Ödeme açılır (Sezon 1: sınava kadar paketi 799 TL + aylık 299 TL; öneri) |
| Eylül 2027 | Sezon 2 (asıl gelir sezonu) |

Takvim kayarsa kesme sırası: T29 → T23 → T11 → T22 (e-posta kısmı) → T12. Kesilmeyenler: plan motoru, check-in, güvenlik katmanı, veli onayı, sohbet, YouTube hafif sürümü (T31-T34).

## Bilinen riskler

İki yarı zamanlı kurucuyla Aralık takvimi dar (YouTube hafif sürümüyle ≈267 saat iş, ≈225-300 saat kapasite). Serbest sohbet ve reşit olmayan kullanıcılar birlikte en büyük ürün riski; PDR onayı yayın koşulu. KVKK yurt dışı aktarımı için avukat görüşü bekleniyor. Onay öncesinde 18 yaş altı için PostHog ve Sentry kapalı (değişmez kural); o dönemin D7 ölçümü ve çökme raporu yok, anonim çökme raporu avukata sorulacak. Supabase'te 30 Ekim 2026'dan itibaren tablolar Data API'ye otomatik açılmıyor (her migration'da açık `GRANT`, doğrulanacak); ücretsiz planda yedek yok. Expo SDK 58 ve birçok kütüphane çok yeni; spike takılırsa SDK 57'ye inilir. Tam liste rapor bölüm 6'da.
