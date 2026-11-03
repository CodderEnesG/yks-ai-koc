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
| Edge Functions | 6 fonksiyon main'den (`20c784e`) deploy edildi (2026-10-30); hepsi açılıyor, girişsiz çağrı 401 |
| Web (`apps/web`, Vercel) | Yapılandırma hazır (2026-11-03): `apps/web/vercel.json`, güvenlik başlıkları, indeksleme varsayılan kapalı. Vercel projesi açılmadı, deploy edilmedi. Aşağıda "Web (Vercel)" |
| Bundle ID ve paket adı | **Yer tutucu** (`dev.placeholder.ykskoc`). App Store Connect kaydından önce kalıcı ad seçilmeli |

## Ortamlar

- `apps/mobile/.env`: yerel yığın (Metro, simülatör, Maestro). Değişmez.
- `apps/mobile/.env.production`: release derlemeleri. Expo `NODE_ENV=production`'da bu dosyayı `.env`'in önüne koyar
  (Gradle `assembleRelease` ve Xcode Release bunu kullanır). İçinde uzak Supabase adresi, publishable anahtar,
  PostHog. `EXPO_PUBLIC_WEB_URL` boş: veli onay sayfası henüz yayında değil, 18 yaş altı onay linki üretilemez.
  Testte yetişkin profil kullanılır. Web Vercel'e çıkınca üretim adresi (alan adı ya da `*.vercel.app`) buraya yazılır.
- EAS bulutu `.env` dosyalarını yüklemez (gitignore). Aynı değerler EAS ortam değişkeni olarak girilir:
  `cd apps/mobile && eas env:push --environment preview --path .env.production` ve aynısı `--environment production`
  ile. Girilmezse build uzak sunucuyu bilmez.

## Web (Vercel)

`apps/web` (tanıtım sitesi, `/onay`, `/rapor`, `/destek`, `/gizlilik`) Vercel'de, `fra1` (Frankfurt) bölgesinde.
`/rapor` sunucuda Supabase'e (eu-central-1) istek atar; bölge bu yüzden AB'de ve sabit (`vercel.json`).

**Bir kez, Vercel panelinde (Add New → Project → GitHub `CodderEnesG/yks-ai-koc`):**

1. Root Directory: `apps/web`. Framework: Next.js (kendiliğinden). "Include files outside the root directory" açık
   kalsın (`packages/plan-engine` gerekiyor).
2. Kurulum ve atlama komutları `apps/web/vercel.json`'da: `pnpm install --frozen-lockfile --filter @yks/web...`
   (yalnız web ve plan-engine; Expo bağımlılıkları kurulmaz) ve `ignoreCommand` (son başarılı dağıtımdan bu yana
   web, plan-engine ya da lockfile değişmediyse derleme atlanır; yalnız mobil commit'lerde Vercel derlemez). Son
   commit'e (`HEAD^`) bakmak yanlıştı: çok commit'li push'ta son commit belge olunca web derlenmiyordu (2026-11-03).
3. Node.js: 22.x (kök `package.json` `engines`). pnpm sürümü için ortam değişkeni
   `ENABLE_EXPERIMENTAL_COREPACK=1` (kök `packageManager: pnpm@10.34.7`; yoksa Vercel lockfile'dan sürüm tahmin eder).
4. Ortam değişkenleri (Production ve Preview):

| Değişken | Değer | Not |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Uzak proje adresi (`apps/mobile/.env.production`'daki) | Zorunlu: yoksa derleme geçer ama `/onay` açılırken hata verir |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Uzak publishable anahtar | Zorunlu. Gizli değil; veriyi RLS ve fonksiyonlar korur |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` | pnpm 10 |
| `NEXT_PUBLIC_SITE_URL` | Alan adı seçilince (karar 8) | Boşken üretimde Vercel'in kalıcı adresi, önizlemede dağıtım adresi kullanılır |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `info@<alan adı>` | Boşken iletişim bağlantısı gizli |
| `NEXT_PUBLIC_WAITLIST_OPEN` | `1` yalnız T07 aydınlatma metni gelince | Ondan önce form "çok yakında" der. Açmadan önce `20261103120000_waitlist.sql` uzak projede olmalı |
| `SITE_INDEXABLE` | `1` yalnız yayın kapıları açılınca (alan adı, PDR, T07) | Yalnız Production. Boşken her sayfa `noindex`, `robots.txt` arama motorlarını kapatır; WhatsApp/Telegram önizleme botları açık (paylaşım kartı çalışır). Önizleme dağıtımları hiç indekslenmez |

`NEXT_PUBLIC_*` değerleri derlemede sayfaya gömülür: değiştirince yeniden deploy gerekir.

**Derleme önbelleği kapalı (`next.config.ts`, `turbopackFileSystemCacheForBuild: false`):** Vercel `.next/cache`'i
önceki dağıtımdan geri yüklüyor; ilk dağıtımda Turbopack önbelleği `globals.css`'in eski halinin çıktısını kullandı
ve canlıda tema renkleri, yazı tipleri yoktu (2026-11-03). Derleme biraz uzar; doğruluk için. Benzer bir bayatlıkta
Vercel'de "Redeploy" → "Use existing Build Cache" işaretsiz.

**Plan:** Vercel Hobby yalnız kişisel, ticari olmayan kullanım içindir; ticari bir ürünün sitesi için Pro gerekir
(**OPEN QUESTION**, PROJECT-STATE açık karar 15). Önizleme için Hobby ile denemek kurucuların kararı.

**Yerelde Vercel benzeri derleme (2026-11-03'te denendi):** temiz kopyada (`git ls-files -co --exclude-standard`)
filtreli kurulum 7 sn, `VERCEL_ENV=production` ile `next build` geçti; başlıklar, `robots.txt`, `noindex` ve mutlak
paylaşım kartı adresi doğrulandı. Vercel CLI ile deploy edilirse kök `.vercelignore` `data-private/`, `.env*` ve
derleme çıktılarını dışarıda tutar (Git entegrasyonunda zaten yalnız commit'li dosyalar gider).

**Deploy sonrası:** `EXPO_PUBLIC_WEB_URL`'i (`apps/mobile/.env.production` ve EAS ortamları) üretim adresine yaz;
veli onay linki ancak böyle üretilir. Supabase Auth'ta ek yönlendirme adresi gerekmez (web veli girişi 6 haneli kod).

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

- **Edge Functions** fonksiyon kodu değişince main'den deploy edilir: `supabase functions deploy --use-api` (repo
  kökünde). Sırlar (`ANTHROPIC_API_KEY`, `YOUTUBE_API_KEY`) uzakta tanımlı.
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
