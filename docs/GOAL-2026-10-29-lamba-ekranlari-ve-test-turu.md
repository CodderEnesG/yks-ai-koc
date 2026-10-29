# Goal — lamba ekranları, test turu ve uzak proje (2026-10-29)

Tarihli çalışma belgesi, kanonik değil. Gözetimsiz `/goal` koşusu için yazıldı; koşu bitince sonuçları
[PROJECT-STATE](PROJECT-STATE.md)'e ve [2026-10-29 gün raporuna](reports/2026-10-29-gun-raporu.md) taşınır.

## Amaç

1. `lamba/` klasöründeki Figma Make prototipinin (`lamba/src`) ekranlarını mobil uygulamaya işlemeye başlamak.
2. PROJECT-STATE "Sıradaki" 1-3: test turu (iOS dev build yeniden, Maestro baştan; hiç koşulmamış `chat`,
   `support`, `youtube-add`), uzak Supabase (T12 taksonomisi ve `feedback_response` migration'ları), uçtan uca
   denenmemişler (T17/T20, T24, T31/T33/T34).
3. Maestro önce iOS'ta, sonra Android'de; yanında kalite kontrol (QA) ajanı.

Kullanıcı kararları (2026-10-29): her iş birimi commit edilip `origin/main`'e push edilir; YouTube testi için
herkese açık bir YKS oynatma listesi ajan tarafından bulunur; boş disk 30 GB'ın altına düşmez.

## Kurallar

- İşe başlamadan: [AGENTS](../AGENTS.md), PROJECT-STATE, final rapor 1.3 / 2.10 / 2.11; `lamba/UI-RULES.md`,
  `lamba/SCREENS.md`; tasarım kararlarının güncel hali remote'ta
  (`gh api repos/CodderEnesG/lamba-design/contents/DECISIONS.md --jq .content | base64 -d`).
- **Disk:** ağır adımdan (prebuild, native build, emülatör açma) önce
  `df -g /System/Volumes/Data` boş alanı ≥35 GB olmalı. 30 GB'a inerse ağır iş durur; yalnız bu koşunun yeniden
  üretilebilir çıktısı silinebilir (`apps/mobile/android`, `./gradlew clean`). Başka projelerin önbelleklerine ve
  simülatörlerine dokunulmaz.
- **Cihaz:** aynı anda tek cihaz; önce iOS, sonra Android. iOS ve Android build paralel değil. Maestro her zaman
  `--device` ile (iOS: iPhone 15 Pro `4E6A4779-12E1-4C5F-9EB9-E74B42018D5E`; Android: `emulator-5554`). Metro
  asla `CI=1` ile başlatılmaz.
- **Veri:** `supabase db reset`, `supabase stop --no-backup` ve Docker volume silme yasak (yerel veritabanı başka
  worktree'lerin verisini tutuyor). Yerelde yalnız `supabase migration up`.
- **Git:** her iş birimi ayrı commit; mevcut stil (`feat:`, `fix:`, `test(e2e):`, `docs:`), Türkçe, sonda
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Commit öncesi
  `pnpm format:check && pnpm typecheck && pnpm lint && pnpm test`. Push öncesi `git pull --rebase origin main`;
  çakışmada `git rebase --abort`, push durur, BLOKE yazılır. Force push yok. Push sonrası CI izlenir; kırmızıysa
  sıradaki iş düzeltmedir. `lamba/`, `data-private/` ve `.env` dosyaları asla commit edilmez.
- **Etkileşim yok:** parola ya da etkileşimli istem isteyen komut `</dev/null` ve zaman aşımıyla çalıştırılır;
  takılırsa adım BLOKE, sıradakine geçilir.
- **Ürün kuralları:** prototipteki destek ve kriz metinleri taslaktır; kaynak `packages/safety` (PDR onayı
  bekliyor), metinler değişmez. Soru metni ya da sayfa görüntüsü yok. Kırmızı yok (YouTube logosu bilinçli
  istisna). İkonlar `expo-symbols` ile (lucide eklenmez). Yeni kütüphane gerekirse önce TECH-STACK'e kayıt.
- **Çelişkide öncelik:** 28 Ekim kararları (bu repo: PROJECT-STATE, commit `b9005a5`, `5fb2027`, `d5bec92`) >
  remote `DECISIONS.md` (3. sürüm) > `lamba/src` prototipi. Yani duman yok (`LampGlow` kalır), 3 sekme ve dişli
  ikonu kalır, koç sekmesinin adı "Alaaddin" kalır.
- `lamba/` `.gitignore` ve `.prettierignore`'a eklenir; içinde `pnpm install` yapılmaz.

## Adımlar

**G0 Hazırlık.** Disk ölçümü; `/lamba/` ignore; taban kontrolleri (`pnpm format:check`, `typecheck`, `lint`,
`test`). QA ajanı arka planda, taze bağlamla arkadaşın 4 commit'ini (`b9005a5..d5bec92`) inceler; doğrulanan
bulgular G3'te düzeltilir.

**G1 Yerel yığın.** `open -a Docker`, `docker info` hazır olana kadar bekle;
`supabase start -x storage-api,imgproxy,logflare,vector`; `supabase migration up`; `supabase test db` (hepsi
geçmeli). Arka planda, logları scratchpad'e: `supabase functions serve --env-file supabase/functions/.env`,
`pnpm --filter @yks/web dev`, `pnpm --filter @yks/mobile start`.

**G2 Uzak Supabase.** HEAD'in CI db işi yeşilse `supabase db push --dry-run` (tam iki migration:
`20261027160000_topic_taxonomy`, `20261028120000_feedback_response`), sonra `supabase db push`. Parola isterse
BLOKE. Doğrulama: `supabase migration list` ikisini uzakta gösterir; publishable anahtarla REST'te `topic`
okunur, `feedback_response` girişsiz kapalıdır. `run_retention` ve PostHog CLI'dan doğrulanamaz; kullanıcı
listesine.

**G3 iOS taban test turu.** `pnpm exec expo prebuild --clean -p ios`;
`pnpm exec expo run:ios --device <UDID> --no-bundler`;
`xcrun simctl addmedia <UDID> data-private/meb-ogm/toc-photo/3adim-tyt-tarih.jpg`; herkese açık bir YKS
oynatma listesi bulunur; `maestro --device <UDID> test -e PLAYLIST='<link>' apps/mobile/e2e`. Kırılan akışta
test mi uygulama mı ayrılır, düzeltilir, tek akış tekrar koşulur; akış başına en fazla 3 deneme, sonra BLOKE ve
kanıt. Ekran görüntüleri (kurulum, Bugün, Kütüphane, Alaaddin, Destek, Ayarlar) QA ajanına verilir. PostHog için
koşu saatleri ve beklenen olaylar kaydedilir.

**G4 lamba ekran entegrasyonu** (iOS'ta, sırayla, her biri ayrı commit):

1. Tasarım sistemi temeli (`apps/mobile/src/global.css`, `components/ui/*`): tip ölçeği, yarıçaplar, dokunma
   alanı ≥44 pt, `tonal` düğme, `accent`'in marka paletine çekilmesi; `lamba/src/ds/primitives.tsx`'in RN
   karşılıkları (Banner, EmptyState, ErrorState, Loading, LockedState, NavCard, ProgressBar, SearchField,
   TextField, Chip, StatusGlyph); `dusunuyor`, `sakin`, `hata` sahneleri.
2. Bugün 2.1 ve check-in 4.1/4.2 (`lamba/src/today/*`).
3. Kütüphane 2.2 ve ekleme 3.1-3.8 (`lamba/src/library/*`).
4. Alaaddin sohbeti 2.3 ve Destek 6.1 (`lamba/src/coach`, `support`, `ds/chat.tsx`); metinler değişmez.
5. Kurulumdaki küçük farklar (aktif bölüt rengi, Hazırsın düzeni).
6. YouTube logosu: prototipteki resmi SVG'ler owner kararına (resmi logo) uyar; kaynağın teyidi kullanıcıda.

Her alt adımdan sonra: kontroller; ilgili Maestro akışları iOS'ta (testID'ler korunur); ekran görüntüsü ve taze
QA ajanı (tasarıma uygunluk, UI-RULES, 44 pt, erişilebilirlik etiketleri, metinler `i18n/tr.ts`'de, token dışı
renk yok, değişmez kurallar); doğrulanan bulgular düzeltilir; commit ve push.

Kapsam dışı (tasarımı yok): Ayarlar, hesap ve veli onayı, veli web sayfaları, FeedbackSheet/InlineFeedback,
dinlenme günü düzeni.

**G5 iOS tam regresyon.** Bütün akışlar yeniden; sonuç tablosu; simülatör kapatılır.

**G6 Android.** Disk kontrolü; `pnpm exec expo prebuild -p android`; emülatör; `expo run:android --no-bundler`;
`adb reverse` 8081, 54321, 3000; `maestro --device emulator-5554 test … apps/mobile/e2e`. iOS'a özgü adımlar
`runFlow: when: platform:` dallarına alınır. Android'e özgü uygulama hatası küçükse düzeltilir, değilse
PROJECT-STATE'e yazılır (Android yayını Ocak'ta). Akış başına en fazla 3 deneme. Sonra emülatör kapatılır,
`./gradlew --stop` ve kotlin daemon durdurulur.

**G7 Kapanış.** Bütün koşunun diff'i üzerinde son inceleme; Metro, functions serve, web sunucusu durdurulur;
`supabase stop`; Docker kapatılır; son disk ölçümü. PROJECT-STATE, gün raporu, README haritası ve bu belgedeki
tablolar güncellenir; commit, push, CI yeşil.

## İlerleme

| Adım | Durum | Not |
|---|---|---|
| G0 Hazırlık | TAMAM | Boş disk 67 GB (başlangıç). `/lamba/` ignore'da. Taban kontrolleri temiz (typecheck'teki `/book/youtube` hatası bayat yerel rota tipleriydi, Metro açılınca düzeldi). QA ajanı arkadaşın 4 commit'inde 6 kırık Maestro akışı, 3 uygulama hatası ve migration eksikleri buldu; G3'te düzeltildi. |
| G1 Yerel yığın | TAMAM | Docker, Supabase (depolamasız), `migration up` (youtube_cache, topic_taxonomy, feedback_response), pgTAP 118/118; functions serve, web, Metro arka planda. |
| G2 Uzak Supabase | TAMAM | `db push` parola istemedi; T12 taksonomisi ve `feedback_response` uzakta. REST: `topic` 514 satır (13 ders + 195 ünite + 306 konu), `feedback_response` girişsiz 42501. `run_retention` ve PostHog kullanıcıda (aşağıda). |
| G3 iOS taban test turu | TAMAM | `prebuild --clean` + derleme (ad "lamba", yazı tipleri ve PostHog pod'ları içeride). Taban koşusu 3/13; düzeltmelerden sonra 13/13. Kırılma sebepleri: Ayarlar'ın sekmeden çıkması (akışlar Ayarlar'da kalıyordu → `_relaunch.yaml`), değişen metinler, klavyenin örttüğü öğeler (Maestro örtülen öğeyi görünür sayıp klavyeye dokunuyor), dev client menüsü. Uygulama hataları: Alaaddin sekme ikonu 900×441 px tek boyut (sekme çubuğunu kaplıyordu → @1x/@2x/@3x), sohbet giriş çubuğu sekme çubuğunun altında, aynı listenin videolarında yinelenen React anahtarı (kırmızı hata ekranı), `toc-extract` import map'inde `@yks/safety` yok (yerel edge runtime'da fonksiyon açılmıyordu), çöp kutusu ikonunun adı düğme etiketine karışıyordu, Ayarlar'dan sıfırlamada eski sekmeler yığında kalıyordu. `feedback_response` sağlamlaştırma migration'ı. YouTube testi: Bıyıklı Matematik "55 Günde TYT Matematik Kampı 2027" (118 video). |
| G4.1 Tasarım sistemi temeli | TAMAM | Yazı ölçeği, yarıçap, 44 pt dokunma alanı, `tonal` düğme, `accent` palete; Icon, Banner, EmptyState, ErrorState, Loading, LockedState, TextField, SearchField, NavCard, Chip, ProgressBar; webp sahneler (`dusunuyor`, `sakin` yeni). Ayrıca: yazı tipleri iOS'ta hiç yüklenmiyordu (dosya adı ≠ PostScript adı), düzeltildi. |
| G4.2 Bugün ve check-in | TAMAM | Başlık, büyük geri sayım, seri çip, EmptyState, Banner'lar, gün tamam kartı (`isDayComplete`), sakin kapanış, görev kartı (düğmeler tam genişlik), etiketli doğru/yanlış. Check-in adımları kurulumla aynı bileşenler; değiştirilmedi. |
| G4.3 Kütüphane ve ekleme | TAMAM | Kütüphane kartları + ProgressBar, NavCard seçim, SearchField, LockedState/Loading (içindekiler, YouTube), barkod izin ekranı ve sahne token'ları. Hızlı ekle ve içindekiler kontrol ekranının düzeni değişmedi (kısmi). |
| G4.4 Alaaddin sohbeti ve Destek | TAMAM | Balonlar, akut yanıt bloğu, giriş çubuğu, 72 pt arama satırları. Metinler değişmedi (`packages/safety`). |
| G4.5 Kurulum farkları | TAMAM | İlerleme çubuğunda aktif adım vurgulu, büyük Devam, Hazırsın kartı. |
| G4.6 YouTube logosu | TAMAM | Prototipteki resmi logo dosyaları (açık/koyu zemin), değiştirilmeden. Kaynağın teyidi kullanıcıda. |
| G5 iOS tam regresyon | TAMAM | 13/13 (toc-add ilk denemede dev link açılışında takıldı, tek başına geçti). Açık ve koyu temada ekran görüntüleri kontrol edildi. İki ayrı QA ajanı (arkadaşın commit'leri, G4 diff'i) bulguları düzeltildi. |
| G6 Android | TAMAM | İlk Android Maestro koşusu (Pixel 6 Pro API 34, `prebuild` + derleme 5 dk 45 sn). `toc-add` hariç 12/12 geçti; ilk turda 5/12. Sebepler: Maestro Android'de Türkçe karakter yazamıyor ("Unicode not supported") → platforma göre değişken; temiz açılışta launcher hazır olmadan gönderilen dev linki yok sayılıyor → bekleme; Android'de odaktaki alana dokununca imleç ortaya düşüyor → tarih alanı `selectTextOnFocus`. İki akışta bir kez açılış ekranında takılma (geçici). `toc-add` iOS'a özgü (`ios-only`). Disk en düşük 35 GB (emülatör açıkken), sonra 40 GB. |
| G7 Kapanış | TAMAM | Son inceleme (taze QA ajanı, `d5bec92..HEAD`): kod ve SQL'de ciddi bulgu yok; gün raporundaki rebase öncesi hash'ler, PROJECT-STATE'teki eski YouTube etiketi ifadesi, sohbet akışında klavye kapatma noktası, `dismissAll` koruması, sekme ikonunun 2:1 oranı ve TECH-STACK'e Android Maestro kuralları düzeltildi; `chat` ve `account-delete` iOS'ta yeniden geçti. Metro, functions serve, web sunucusu, yerel Supabase (`supabase stop`, veri volume'da) ve Docker kapatıldı; simülatör ve emülatör kapalı, Gradle/Kotlin daemon'ları durduruldu. Boş disk 45 GB (en düşük 35 GB, Android emülatörü açıkken). |

## Maestro sonuçları

| Akış | iOS taban (G3) | iOS regresyon (G5) | Android (G6) |
|---|---|---|---|
| onboarding-adult | geçti | geçti | geçti |
| onboarding-minor | geçti | geçti | geçti (3. deneme) |
| support | geçti | geçti | geçti |
| library-add | düştü → geçti | geçti | geçti (2. deneme) |
| today-plan | düştü → geçti | geçti | geçti |
| checkin | düştü → geçti | geçti | geçti (2. deneme) |
| account-sync | düştü → geçti | geçti | geçti (2. deneme) |
| account-delete | düştü → geçti | geçti | geçti |
| chat | düştü → geçti | geçti | geçti (2. deneme) |
| toc-add | düştü → geçti | geçti (2. deneme) | koşulmadı (iOS'a özgü) |
| youtube-add | düştü → geçti | geçti | geçti |
| consent-minor | düştü → geçti | geçti | geçti (2. deneme) |
| report-minor | düştü → geçti | geçti | geçti (3. deneme) |

## Kullanıcıda kalanlar

Goal koşulunun parçası değil; koşu sonunda güncellenir.

- `supabase db push`: `20261029120000_feedback_response_hardening.sql` (otomatik onay üretim dağıtımı olarak
  reddetti). **Yapıldı** (29 Ekim akşamı, geliştirici izniyle); `supabase migration list` uzakta üçünü de gösteriyor.
- PostHog EU arayüzünde koşu saatlerinde `onboarding_tamam`, `kitap_eklendi`, `plan_olustu`, `checkin`,
  `sohbet_mesaj` olayları görünüyor mu. Product analytics özetindeki "Active users" yalnız `$screen`/`$pageview`
  sayar ve uygulama ekran olayı göndermez; olaylara Activity'den bakılır.
- Supabase Dashboard SQL: `select * from cron.job where jobname = 'retention-daily';` ve
  `select status, return_message, start_time from cron.job_run_details where jobid = <id> order by start_time desc limit 5;`
- Gerçek cihaz: barkod okuma ve 5-10 gerçek içindekiler fotoğrafı (Apple hesabı, T01).
- T19: PDR'nin yazacağı ayrı akut test seti (en az 100 akut örnek).
- YouTube resmi logo dosyalarının YouTube marka kaynaklarından geldiğinin teyidi.
- Arkadaştan: 28 Ekim tasarım kararları ve `FeedbackScreens.tsx` lamba-design'a; Figma istem 5-6 (Ayarlar,
  hesap ve veli onayı, veli web sayfaları).
