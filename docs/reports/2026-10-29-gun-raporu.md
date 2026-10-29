# Gün raporu — 29 Ekim 2026

Tarihli kayıt, kanonik değil. Güncel durum [PROJECT-STATE](../PROJECT-STATE.md)'te; koşunun adımları ve tabloları
[GOAL-2026-10-29](../GOAL-2026-10-29-lamba-ekranlari-ve-test-turu.md)'de.

## Özet

Gözetimsiz `/goal` koşusu. Test turu yapıldı: iOS dev build temizden derlendi, 13 Maestro akışı taban koşusunda
3/13 geçti, düzeltmelerden sonra 13/13. lamba-design prototipinin (Figma Make) ekranları uygulamaya taşındı:
tasarım sistemi, Bugün, Kütüphane ve ekleme, Alaaddin sohbeti, Destek, kurulumdaki farklar, resmi YouTube logosu.
Uzak Supabase'e T12 taksonomisi ve `feedback_response` uygulandı. Android'de ilk kez Maestro koşuldu:
`toc-add` (iOS'a özgü) hariç 12/12.

| İş | Durum | Commit |
|---|---|---|
| Goal belgesi, `lamba/` ignore | Tamam | `e96db47` |
| Test turunda çıkan uygulama hataları | Tamam | `a5c3751` |
| Ayarlar sekmeden çıkınca kırılan akışlar | Tamam, iOS 13/13 | `aa872df` |
| `feedback_response` sağlamlaştırma | Tamam; uzak projeye geliştirici izniyle gönderildi | `4e9ea1f` |
| Tasarım sistemi temeli | Tamam | `ab4a54e` |
| Bugün ve görev kartı | Tamam | `b8d50cc`, `0db2ea1` |
| Kütüphane ve ekleme ekranları | Tamam (hızlı ekle ve içindekiler kontrolü düzeni aynı) | `43269f1` |
| Alaaddin sohbeti ve Destek | Tamam, metinler değişmedi | `d5c43bf` |
| Kurulum farkları | Tamam | `bf9cd7c` |
| Resmi YouTube logosu | Tamam, kaynak teyidi bekliyor | `1d53817` |
| Kalite kontrol düzeltmeleri | Tamam | `558d218`, `754fada` |
| Yazı tipleri (iOS) | Tamam | `c856b84` |
| Android platform dalları | Tamam | `836333b` |
| Android koşusu | 12/12 (`toc-add` iOS'a özgü) | `99e6e08`, `2c38a2a` |

## Öne çıkan bulgular

- **Yazı tipleri iOS'ta hiç yüklenmiyordu** (27 Ekim temasından beri). Tema dosya adını
  (`SourceSans3_400Regular`) kullanıyordu; iOS PostScript adını (`SourceSans3-Regular`) ister. Dosyalar
  `assets/fonts`'ta PostScript adlarıyla; iki platformda aynı ad.
- **Ayarlar'ın sekmeden çıkması (28 Ekim) 6 akışı kırdı.** Akışlar Ayarlar'da kalıyor, sekme adına
  dokunamıyordu; native geri düğmesinin erişilebilir adı yok. `_relaunch.yaml` uygulamayı durumu silmeden dev
  linkiyle açıp Bugün'e döndürüyor. Düz `launchApp`, dev client'ın yüzen menü düğmesini açıp uygulamanın
  dişlisini örtüyordu.
- **Maestro örtülen öğeyi görünür sayar.** Klavyenin altındaki düğmeye "dokunurken" klavyedeki tuşa basıyor
  ("40" kitap adına, "u" YouTube linkine yazıldı). Klavye artık bu adımlardan önce kapatılıyor.
- **Testte çıkan uygulama hataları:**
  - Alaaddin sekme ikonu 900×441 px tek boyuttu ve iOS'ta sekme çubuğunu kaplıyordu.
  - Sohbet giriş çubuğu sekme çubuğunun altında kalıyordu.
  - Aynı listenin videoları aynı React anahtarını alıyordu; kırmızı hata ekranı açılıyordu.
  - `toc-extract`'ın import map'inde `@yks/safety` yoktu; fonksiyon yerelde açılmıyordu. CI bunu yakalamıyor,
    çünkü `deno check` paketi `node_modules`'tan çözüyor.
  - Çöp kutusu ikonunun adı düğme etiketine karışıyordu.
  - Ayarlar'dan sıfırlamada eski sekmeler yığında kalıyordu.
- **İki kalite kontrol ajanı çalıştı:** biri arkadaşın 28 Ekim commit'lerinde, biri G4 diff'inde. Doğrulanan
  bulgular düzeltildi: erişilebilirlik (`accessible`), tek turuncu eylem, yarıçap ölçeğinin taşınmamış ekranlara
  etkisi, `LampGlow` geçişinin hiç oynamaması, migration'da indeks ve sütun yetkisi.
- **Android ilk kez:** Maestro Android'de Türkçe karakter yazamıyor; akışlar platforma göre ASCII metin
  kullanıyor (iOS Türkçe kaldı). Temiz açılışta dev launcher hazır olmadan gönderilen link yok sayılıyor.
  Akışlarda Android'e özgü uygulama hatası çıkmadı; kurulum ekranında yazı tipleri doğru görünüyor. Diğer
  ekranlara ve Material Symbols ikonlarına Android'de gözle bakılmadı.
- **Otomatik onay sınırı:** `feedback_response` sağlamlaştırma migration'ı üretim dağıtımı sayılıp
  reddedildi; geliştirici izin verince akşam gönderildi (uzakta 3 migration da var). Uzak cron kaydını okumak
  (`supabase db dump -s cron`) üretim okuması sayılıp reddedildi.
- **PostHog:** Product analytics özetinde "Active users" 0. Bu pano yalnız `$screen`/`$pageview` sayar; uygulama
  ekran olayı göndermez. Proje anahtarı EU'da geçerli (`/flags` 200), Metro `.env`'i yükledi; olaylara Activity'den
  bakılmalı.

## Akşam: dağıtım hazırlığı

- Uzakta `feedback_response` sağlamlaştırması uygulandı. Eski worktree'ler, dallar, `DerivedData/YKSKoc-…` ve
  `apps/mobile/android` temizlendi.
- PostHog: anahtar ve proje doğru (curl ile gönderilen `baglanti_testi` olayı projeye düştü). Activity'nin
  varsayılan aralığı "Last hour"; koşu olayları için aralık genişletilmeli.
- Test APK'sı ve TestFlight hazırlığı ([DAGITIM](../DAGITIM.md)): `eas.json`, `.env.production`, dumansız ikon ve
  açılış görseli, iOS ihracat ve iPhone ayarı. Android APK ve iOS Release yerelde derlendi; ikisi de uzak sunucuya
  karşı duman testinden geçti. APK: `~/Desktop/lamba-test-2026-10-29.apk`.
- Release derlemesinde çıkanlar: `web.output: "server"` paketlemeyi kırıyordu (→ `single`); Android'de durum
  çubuğu simgeleri açık temada okunmuyordu (→ `StatusBar style="auto"`); saat ve doğum yılı çiplerinde "✓" etiketi
  iki satıra kırılıyordu (→ dar dolgu). Android ekranlarına ilk kez gözle bakıldı; Material Symbols ikonları doğru.
- Otomatik onay iki işi reddetti: uzak cron kaydını okumak ve Edge Functions'ı main'den deploy etmek.

## Bekleyenler

**Geliştirici**

1. `supabase db push`: `20261029120000_feedback_response_hardening.sql`. **Yapıldı** (akşam). Gerçek cihaz
   testinden önce: Edge Functions main'den deploy (`supabase functions deploy --use-api`) ve giriş e-postası
   şablonunda `{{ .Token }}` ([DAGITIM](../DAGITIM.md)).
2. PostHog EU arayüzünde koşu saatlerindeki olaylar (`onboarding_tamam`, `kitap_eklendi`, `plan_olustu`,
   `checkin`, `sohbet_mesaj`). Test olayları üretim projesine gitti.
3. Supabase Dashboard SQL'de `run_retention` cron'unun koştuğunu kontrol et (sorgu goal belgesinde).
4. Android: barkod ve kamera gerçek cihazda; `toc-add` için Android galeri akışı (Android yayını Ocak'ta).

**Kurucularda**

5. PDR (T06), rıza metinleri (T07), e-posta sağlayıcı (karar 13), Apple hesabı (T01), Sentry DSN.
6. Gerçek cihaz: barkod ve 5-10 gerçek içindekiler fotoğrafı. T19 için PDR'nin ayrı akut test seti.
7. Arkadaştan: 28 Ekim tasarım kararları ve `FeedbackScreens.tsx` lamba-design'a; Figma istem 5-6 (Ayarlar,
   hesap ve veli onayı, veli web). YouTube logo dosyalarının kaynağının teyidi.
