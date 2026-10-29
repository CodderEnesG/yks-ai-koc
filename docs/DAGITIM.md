# Build ve dağıtım

Test APK'sı ve TestFlight için çalışma rehberi. Yaşayan belge; güncel durum [PROJECT-STATE](PROJECT-STATE.md)'te.
Kural: PDR onayı (T06) gelmeden herkese açık yayın yok. APK ve TestFlight yalnız kurucular ve davet edilen kapalı
test grubu içindir.

## Durum (2026-10-29)

| İş | Durum |
|---|---|
| `eas.json` (development, preview APK, production) | Hazır; EAS projesine bağlanmadı (`eas init` kullanıcıda) |
| Release ortamı `apps/mobile/.env.production` | Hazır (uzak Supabase, PostHog); gitignore'da |
| Uygulama ikonu ve açılış görseli | Dumansız lamba (owner kararı 2026-10-29); iOS ikonu alfasız, Android uyarlanabilir ikon güvenli alanda |
| iOS ayarları | `ITSAppUsesNonExemptEncryption: false` (yalnız HTTPS; ihracat sorusu çıkmaz), yalnız iPhone. Gizlilik manifesti Expo şablonundan (UserDefaults, FileTimestamp, SystemBootTime) |
| Android test APK'sı (yerel, arm64) | Derlendi (47,7 MB). Emülatörde uzak sunucuya karşı duman testi geçti: kurulum, uzak katalogdan ISBN ile kitap, plan, Alaaddin kilidi, Ayarlar. Paket uzak adresi içeriyor, localhost yok |
| iOS Release (simülatör, yerel) | Derlendi; aynı duman testi uzak sunucuya karşı geçti. İmzalı arşiv ve TestFlight Apple hesabını bekliyor. Simülatördeki dev build Release ile değişti: sonraki Maestro koşusundan önce `expo run:ios` gerekir |
| İlk release derlemesinin bulguları | `web.output: "server"` paketlemeyi kırıyordu (API rotası yok) → `single`. Android'de durum çubuğu simgeleri açık temada açık kalıyordu → `StatusBar style="auto"`. Saat ve doğum yılı çiplerinde "✓" etiketi iki satıra kırıyordu → dar dolgu |
| Edge Functions | Uzakta 6 fonksiyon var ama `toc-extract` 26 Ekim, diğerleri 27 Ekim sürümü; main'den yeniden deploy **kullanıcıda** (otomatik onay üretim dağıtımını reddetti) |
| Bundle ID ve paket adı | **Yer tutucu** (`dev.placeholder.ykskoc`). App Store Connect kaydından önce kalıcı ad seçilmeli |

## Ortamlar

- `apps/mobile/.env`: yerel yığın (Metro, simülatör, Maestro). Değişmez.
- `apps/mobile/.env.production`: release derlemeleri. Expo `NODE_ENV=production`'da bu dosyayı `.env`'in önüne koyar
  (Gradle `assembleRelease` ve Xcode Release bunu kullanır). İçinde uzak Supabase adresi, publishable anahtar,
  PostHog. `EXPO_PUBLIC_WEB_URL` boş: veli onay sayfası henüz yayında değil (açık karar 15), 18 yaş altı onay linki
  üretilemez. Testte yetişkin profil kullanılır.
- EAS bulutu `.env` dosyalarını yüklemez (gitignore). Aynı değerler EAS ortam değişkeni olarak girilir:
  `cd apps/mobile && eas env:push --environment preview --path .env.production` ve aynısı `--environment production`
  ile. Girilmezse build uzak sunucuyu bilmez.

## Android test APK'sı (yerel)

```sh
cd apps/mobile
pnpm exec expo prebuild -p android          # android/ yoksa
cd android && NODE_ENV=production ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# çıktı: apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

- Debug anahtarıyla imzalı: telefona doğrudan kurulur, Play'e gitmez. Telefon "bilinmeyen kaynak" ve Play Protect
  uyarısı gösterebilir.
- Kurulum: USB ile `adb install -r app-release.apk` ya da dosyayı telefona gönderip açmak.
- Aynı paket adlı dev build telefonda varsa önce kaldırılır (imza farklı).
- Sonra `./gradlew --stop` ve Kotlin daemon'u kapat (Mac ısınıyor).

Alternatif: `eas build -p android --profile preview` (bulutta, APK; EAS hesabı ve ortam değişkenleri gerekir).

## iOS TestFlight (EAS)

Önkoşullar: Apple Developer Program üyeliği aktif (T01), kalıcı bundle ID, Expo hesabı.

1. `apps/mobile/app.json`'da `ios.bundleIdentifier` ve `android.package` kalıcı ada çevrilir. Ters alan adı
   biçiminde ve dünyada tekil olmalı (ör. sahip olunan bir alan adıyla `com.<alanadi>.lamba`). App Store Connect
   kaydından sonra değişmez.
2. `cd apps/mobile && eas login && eas init`: EAS projesi açılır, `extra.eas.projectId` app.json'a yazılır (commit).
3. Ortam değişkenleri: yukarıdaki `eas env:push` (preview ve production).
4. `eas build -p ios --profile production`: Apple hesabıyla girilir; EAS sertifika ve provisioning profile'ı kendisi
   üretir, bundle ID'yi Apple'da kaydeder. Build numarası EAS'ta tutulur ve her build'de artar
   (`appVersionSource: remote`, `autoIncrement`).
5. `eas submit -p ios --latest`: App Store Connect'te uygulama kaydı yoksa açar (ad, dil, SKU sorar) ve build'i
   yükler. Mağaza adı tekil olmalı; isim kararı (açık karar 8) kapanmadan geçici bir ad kullanılabilir.
6. App Store Connect → TestFlight → Internal Testing: hesaptaki kullanıcılar (en çok 100) incelemesiz test eder.
   Harici test (davetli beta, T25) Beta App Review ister; test bilgileri ve muhtemelen gizlilik politikası adresi
   gerekir (açık karar 15).

Yerel yol (EAS yetmezse, rapor 2.3): Xcode'a Apple hesabı eklenir, `expo prebuild -p ios` sonrası
`lamba.xcworkspace` Release arşivlenir ve Organizer'dan yüklenir.

## Uzak tarafta test öncesi

- **Edge Functions** main'den deploy edilir: `supabase functions deploy --use-api` (repo kökünde). Bugün yerelde
  13/13 test edilen kod bu; uzaktaki `toc-extract` import map düzeltmesini ve T18 değişikliklerini içermiyor.
  Sırlar (`ANTHROPIC_API_KEY`, `YOUTUBE_API_KEY`) uzakta tanımlı.
- **Giriş e-postası:** uygulama 6 haneli kodla girer (`verifyOtp`). Dashboard → Authentication → Emails →
  Templates'te "Magic Link" ve "Confirm signup" gövdesi `{{ .Token }}` içermeli (`supabase/templates/otp.html`).
  Kod uzunluğu 6 olmalı (Authentication → Providers → Email). Kendi SMTP'miz yokken (açık karar 13) Supabase
  e-postayı yalnız organizasyon üyelerinin adresine ve saatte birkaç kez gönderir: test edenler Supabase
  organizasyonuna eklenmeli ya da SMTP bağlanmalı.
- **PostHog:** release olayları da üretim projesine (322471) gider.
- **Sentry:** DSN yok; çökme raporu toplanmaz.

## Gerçek cihaz test listesi

Hesapsız çalışanlar:

- Kurulum (yetişkin profil), yazı tipleri, ikon ve açılış ekranı, açık ve koyu tema.
- Kitap ekleme: barkod (gerçek kitap, kamera izni), katalogdan arama, hızlı ekle. Plan oluşur, Bugün görevleri.
- Check-in ("Yaptım / Yarım kaldı / Yapamadım"), seri, güvenli mod bandı, Destek ekranı (112 ve ALO 183 arama).
- Bildirim izni ve hatırlatma; Android geri tuşu; Material Symbols ikonları.

Hesap gerektirenler (e-posta kodu, yukarıdaki SMTP notu):

- Hesap bağlama, yedekleme ve geri yükleme.
- İçindekiler fotoğrafı (gerçek kitap, 5-10 farklı yayınevi; kamera ve galeri).
- YouTube oynatma listesi ekleme.
- Alaaddin sohbeti, "Bildir", akut mesajda sabit metin.
- Hesap silme.

Sonuçlar gün raporuna; hata çıkarsa ekran görüntüsü ve adım.
