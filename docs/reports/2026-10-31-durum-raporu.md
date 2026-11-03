# Durum raporu — 31 Ekim 2026

Tarihli kayıt, kanonik değil. Güncel durum [PROJECT-STATE](../PROJECT-STATE.md)'te. Bu rapor PROJECT-STATE (son
doğrulama 29 Ekim), [29 Ekim gün raporu](2026-10-29-gun-raporu.md) ve [DAGITIM](../DAGITIM.md) okunarak ve repo
taranarak yazıldı; test koşulmadı.

## Genel durum

- Sprint 1 ve 2'nin kodu bitti (takvimde 2-29 Kasım'dı). Tahmini saatlerin ≈212/267'si.
- Tamam: T02-T05, T09-T18, T20-T23, T28, T31-T34.
- Maestro: iOS 13/13, Android 12/12 (`toc-add` iOS'a özgü).
- Android test APK'sı ve iOS Release yerelde derlendi; ikisi uzak sunucuya karşı duman testinden geçti.
- Sprint 3 (T25-T30: TestFlight beta, düzeltmeler, mağaza hazırlığı, gönderim) başlamadı.
- Hedef: 14 Aralık App Store gönderimi, ≤20 Aralık yayın.

## Beklenenler (dış bağımlılık)

| Ne | Kimde | Neyi engelliyor |
|---|---|---|
| T01 Apple hesabı | Kurucular | TestFlight, `eas init`, imzalı arşiv |
| T06 ton rehberi + PDR onayı | Kurucular | Yayın. Sohbet istemi, kriz listesi ve sabit metinler taslak (`PDR_APPROVED = false`) |
| T07 rıza ve aydınlatma metinleri | Kurucular + avukat | Yayın. `apps/web/src/lib/consent-text.ts` yer tutucu |
| T08 bekleme listesi | Kurucular | Beta kitlesi |
| Karar 13 e-posta sağlayıcı | Avukat görüşmesi | Uzakta giriş kodu yalnız Supabase organizasyon üyelerine gider; veli onayı ve Pazar raporu e-postası yok |
| Karar 15 web barındırma | Kurucular | `/onay` ve `/rapor` yayında değil; release'de `EXPO_PUBLIC_WEB_URL` boş, 18 yaş altı onay linki üretilemez |
| Karar 8 marka adı, alan adı, kalıcı bundle ID | Kurucular (son tarih 1 Kasım) | App Store Connect kaydı; şu an `dev.placeholder.ykskoc` |
| Sentry DSN | Kurucular | Çökme raporu |
| Ayarlar, hesap/veli onayı, veli web ekranları ve `FeedbackScreens.tsx` tasarımı | Muhammed (lamba-design) | Bu ekranların taşınması, geri bildirim istemcisi |
| Gerçek cihaz: barkod, 5-10 gerçek içindekiler fotoğrafı | Geliştirici | T10, T11 doğrulaması |
| PostHog olay kontrolü, uzak `run_retention` cron kontrolü | Geliştirici (elle) | T24 ve saklama doğrulaması |

Yakın tarihler: karar 8 ve ton rehberi taslağı 1 Kasım, PDR 15 Kasım. ÖSYM takvimi (≈14 Kasım) açıklanınca sınav
tarihi tek yerden güncellenecek.

## Beklemeden geliştirilebilecekler

1. **Sentry SDK entegrasyonu.** DSN yoksa no-op; DSN gelince yalnız ortam değişkeni. 18 yaş altında onaydan önce
   kapalı (PostHog'daki kural). `apps/mobile/package.json`'da Sentry yok.
2. **`supabase gen types`.** Senkron sorguları tipsiz.
3. **CI `deno check` açığı.** CI paketi `node_modules`'tan çözdüğü için import map eksiğini yakalamıyor
   (`toc-extract` + `@yks/safety` hatası böyle kaçtı). Import map ile kontrol eden adım.
4. **T31 eksikleri:** paylaş menüsünden liste alma (rapor T31 kapsamında), gömülemeyen video işareti, 500 video
   üstü liste.
5. **PII maskeleyici:** bağlamsız ad ("dün Ayşe aradı"). Sonra güvenlik eval'i yeniden koşulur (ücretli,
   ≈0,03$).
6. **Sohbet gecikme ölçümü:** akışsız yanıt kabul edilebilir mi (DECISION TO TEST).
7. **T27'nin kodsuz kısmı:** gizlilik etiketleri taslağı, yaş derecelendirmesi cevapları, simülatörden ekran
   görüntüleri (mağaza paketi taslağı var).
8. **T29 elle deneme neti girişi** (zaman kalırsa, ≈6 sa; takvim kayarsa ilk kesilen).
9. **Belge:** yol haritasında ödeme hem Kasım 2026'da hem Ocak 2027'de.

Yarı bağımsız: RevenueCat/ödeme (Kasım) iskeleti yazılabilir ama sandbox Apple hesabı, paywall tasarım istiyor.
Geri bildirim istemcisi tasarımı ve açık karar 17'yi bekliyor.

## API durumu

| API | Durum |
|---|---|
| 6 Edge Function (`toc-extract`, `chat`, `classify`, `weekly-report`, `youtube-import`, `account-delete`) | Yazıldı, uzağa main'den deploy edildi (30 Ekim), girişsiz 401. Girişli tam akış uzakta denenmedi (uzakta e-posta yok) |
| 13 migration + pgTAP | Uzakta, CI'da geçiyor. Uzakta cron'un koştuğu görülmedi |
| Anthropic (Haiku 5.5) | Çalışıyor. Uzaktaki `ANTHROPIC_API_KEY` geçici, başka projenin anahtarı; beta'dan önce değiştirilmeli |
| YouTube Data API | Anahtar uzakta, gerçek API'yle denendi |
| PostHog EU | Anahtar doğru, curl test olayı düştü; uygulama olayları arayüzde doğrulanmadı |
| Sentry | DSN yok, kod yok |
| E-posta (SMTP) | Yok (karar 13). Giriş kodu şablonu uzakta ayarlanmadı |
| Web (`/onay`, `/rapor`) | Kod var, barındırma yok (karar 15) |
| RevenueCat | Başlamadı |

## Supabase'te (uzak proje `hhfwzfkhcrmakcvmsvbx`) yapılacaklar

Hepsi üretim projesinde; elle, Dashboard ya da CLI'dan.

**Gerçek cihazda hesaplı testten önce**

1. **Giriş kodu şablonu.** Uygulama 6 haneli kodla girer (`verifyOtp`); Supabase'in varsayılan şablonu link
   gönderir, kod göndermez. Authentication → Emails → Templates: "Magic Link" ve "Confirm signup" gövdesi
   `supabase/templates/otp.html` (içinde `{{ .Token }}`), konu "lamba giriş kodun" gibi.
2. **Kod uzunluğu ve süresi.** Authentication → Providers → Email: OTP uzunluğu 6, geçerlilik 600 sn (yerel
   `config.toml`'daki değerler).
3. **`supabase config push` kullanılmamalı.** Yerel `config.toml`'u bütün olarak gönderir: `site_url`
   `http://127.0.0.1:3000`'e, yeniden gönderim aralığı (`max_frequency`) 1 sn'ye iner. 1 ve 2 Dashboard'dan elle.
4. **Test edenler organizasyona.** Kendi SMTP yokken Supabase e-postayı yalnız organizasyon üyelerine ve saatte
   birkaç kez gönderir. Test eden herkes Supabase organizasyonuna eklenir (ya da karar 13 kapanıp SMTP bağlanır).
5. **Anthropic anahtarı.** `supabase secrets set ANTHROPIC_API_KEY=<kendi anahtarımız>`; sonra sohbetten bir
   mesajla denenir.

**Doğrulama (elle)**

6. **Saklama cron'u.** SQL Editor:
   `select * from cron.job where jobname = 'retention-daily';` ve
   `select status, return_message, start_time from cron.job_run_details where jobid = <id> order by start_time desc limit 5;`
   Her gece 04:00 İstanbul (01:00 UTC) koşmuş ve `succeeded` olmalı.
7. **Girişli uçtan uca deneme (uzakta ilk kez).** 1-5'ten sonra gerçek cihazda: hesap bağlama, yedek, geri
   yükleme, içindekiler okuma, YouTube listesi, sohbet, hesap silme. Fonksiyon günlükleri Edge Functions → Logs.

**Karar gelince**

8. **SMTP (karar 13).** Authentication → SMTP Settings'e sağlayıcı bilgileri. Sonra gönderim sınırı
   (Rate Limits) gözden geçirilir.
9. **Web adresi (karar 15).** Barındırma kurulunca Authentication → URL Configuration'da `site_url` gerçek
   adres. Uygulamada `EXPO_PUBLIC_WEB_URL` (ve EAS ortam değişkeni) doldurulur.

**Geliştirme tarafı (üretime dokunmaz)**

10. `supabase gen types typescript` ile veritabanı tipleri; senkron sorgularına bağlanır.
11. Fonksiyon kodu değişince main'den `supabase functions deploy --use-api`; `weekly-report` JWT doğrulamasız
    (`--no-verify-jwt`).

**Bilinen risk:** ücretsiz planda yedek yok. Beta'da gerçek kullanıcı verisi birikmeden önce yedek yolu
(Pro plan ya da düzenli `supabase db dump`) kararlaştırılmalı.
