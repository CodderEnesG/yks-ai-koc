# YKS AI Koç — Final Teknik ve İş Modeli Raporu

**Tarih:** 21 Ekim 2026 · **Durum:** Final v1.1 (başlangıç kararı) · **Kurucular:** Enes Güngör, mhmmcoding

**v1.1 (21 Ekim 2026):** Muhammed Tuncay'ın önerisiyle YouTube oynatma listesinden plan eklendi (Bölüm 2.8). Hesap silme süresi YouTube politikası gereği 7 güne indi.

**Dayanak belgeler:** [Ürün ve iş modeli tasarımı v1 (15 Ekim 2026)](sources/2026-10-15-urun-ve-is-modeli-v1.pdf) · [Kaynak kitap verisi fizibilitesi (8 Ekim 2026)](sources/2026-10-08-kaynak-kitap-verisi-fizibilitesi.md) · [Fizibilite özeti](sources/2026-10-08-kaynak-kitap-verisi-ozet.md)

> Bu belge tarihli bir kaynak belgedir, kanonik ürün belgesi değildir. Güncel durum ve kararlar [PROJECT-STATE](PROJECT-STATE.md)'tedir. Fiyatlar, dönüşüm oranları ve gelir rakamları **tahmindir**; dayandıkları varsayımlar her tablonun altında yazılıdır. Kur: **1 USD = 49,55 TL** (19 Ekim 2026 piyasa verisi).

---

## 0. Karar özeti

**Karar: başlıyoruz.** YKS AI Koç'un dar ama gerçek bir MVP'si **20 Aralık 2026'ya kadar App Store'da ücretsiz** yayına girecek. 11-12. sınıflar ve mezunlar ilk günden kullanabilecek; 18 yaş altı için veli onayı akışı MVP'nin içinde olacak. AI koçla serbest sohbet de MVP'de yer alacak. Ödeme Şubat 2027'de açılacak. Asıl gelir sezonu Eylül 2027 - Haziran 2028.

Önceki iki belge 2-3 mühendis, 10-14 hafta, ≈250 satın alınmış kitap ve altı haftalık bir veri kapısı varsayıyordu. Kurucuların 21 Ekim'deki kararları bu çerçeveyi değiştiriyor:

| Kısıt (owner kararı, 21 Ekim) | Önceki varsayım | Bu raporun karşılığı |
|---|---|---|
| MVP yılbaşından önce çıkacak | Ocak-Şubat 2027 lansmanı | Altı haftalık kapı ayrı bir aşama olmaktan çıkıyor; dört ölçüm Ekim-Aralık sprintlerinin içinde yapılıyor. App Store gönderimi 14 Aralık. |
| 2 kurucu, yarı zamanlı, task bazlı | 2-3 tam zamanlı mühendis | ≈267 saatlik görev listesi (Bölüm 2.16), haftada kişi başı 15-20 saat. Tek kod tabanı (Expo). Takvim kayarsa hangi işin kesileceği önceden sıralı. |
| Lansmana kadar en fazla 5-10 bin TL nakit | ≈110 bin TL kitap alımı + öğretmen + avukat | Kitap satın alınmıyor. Öğrenci kendi kitabını tanımlıyor; MEB'in ücretsiz kitapları katalog tabanı oluyor; katalog kullanıcı gönderimleriyle büyüyor. Aralık'a kadar nakit gideri **≈6.500 TL**. |
| Ödeme: veli web'den + uygulama içi de var | Veli öder | Hedef aynı. Sıralama: Şubat'ta şirketsiz uygulama içi satın alma (GVK 20/B istisnası), web üzerinden veli ödemesi şirket kurulunca. |
| iOS öncelikli | Belirtilmemiş | Expo + React Native ile önce iOS yayınlanıyor. Android aynı koddan çıkıyor ve Google'ın 14 günlük kapalı test şartından sonra, Ocak 2027'de açılıyor. |
| Veli onayı MVP'de | MVP'de | Veli onaylamadan uygulama "onay bekleniyor" modunda çalışır: plan yalnız cihazda yapılır; sohbet ve sunucuya veri gönderimi kapalıdır. |
| Serbest AI sohbeti MVP'de | MVP'de dar sohbet | Güvenlik katmanı MVP'nin **en kritik parçası** oluyor. PDR veya klinik bir danışman kriz protokolünü onaylamadan herkese açık yayın yapılmıyor (Bölüm 2.10). |
| İlk kullanıcılar: kendi çevremiz, koç/dershane tanıdıklar | 300-500 kişilik topluluk anketi | Kapalı beta 15-30 öğrenciyle yapılıyor. Kapsama anketi hedefi 100-150 yanıt. |
| YouTube oynatma listesinden plan (Muhammed, 21 Ekim): MVP'de hafif sürüm, tam özellik planda; kitapla birlikte mi ayrı mı ilerleyeceğini öğrenci seçer | Yoktu | Öğrenci liste linkini yapıştırır, videolar süreleriyle günlük göreve dönüşür (≈16 saat). Uygulama içi oynatıcı, izleme takibi ve video↔kitap eşlemesi Ocak'ta. YouTube politikası gereği önbellek 30 günde bir yenilenir ve video izleme hiçbir zaman ücretli duvarın arkasına konmaz (Bölüm 2.8). |

**Rakamlarla:**

| Gösterge | Değer (tahmin) |
|---|---|
| MVP yayınına kadar nakit gideri | ≈6.491 TL (Apple Developer 4.905 + alan adı 595 + LLM tamponu 991) |
| Ocak'ta Android dahil toplam | ≈7.730 TL |
| Kullanıcı başına AI maliyeti | Ücretsiz kullanıcı ≈1,2 TL/ay, Premium kullanıcı ≈2,4 TL/ay (Claude Haiku 5.5, Türkçe token payı dahil) |
| Ödeyen kullanıcı başına sezonluk net gelir | ≈1.220 TL (KDV, mağaza payı ve ödeme komisyonu düşülmüş) |
| Sezon 2 katkısı, baz senaryo | ≈674 bin TL (15.000 aktif kullanıcı, %5 dönüşüm; kurucu emeği ve pazarlama hariç) |

**Bu hafta:** Apple Developer kaydı, monorepo ve Supabase kurulumu, plan motorunun çekirdeği, içindekiler çıkarım testi, ton rehberi ve kriz protokolü taslağı, PDR danışmanı arayışı ve kurucu sözleşmesi. Ayrıntılar Bölüm 8'de.

---

## 1. Ürün: ne inşa ediyoruz

### 1.1 Tek cümle ve dört döngü

**YKS AI Koç**, öğrencinin elindeki kitapları ve izlediği YouTube ders listelerini tanıyan, her gün sayfa, test ve video düzeyinde plan çıkaran bir uygulama. Akşamları planın ne kadar yapıldığını takip ediyor, aksayan bir şey olursa nedenini sorup planı yeniden kuruyor ve haftalık özeti veliye gönderiyor. Değer AI'ın zekâsından gelmiyor, takipten geliyor: plan yapmak kolay, onu her gün uygulatmak zor.

| Döngü | Sıklık | MVP'de |
|---|---|---|
| Kurulum | Bir kez | Alan, hedef, sınav tarihi ve günlük süre girilir; kitaplar ve YouTube oynatma listeleri eklenir; 18 yaş altıysa veli onayı istenir; ilk plan oluşur. |
| Günlük | Her gün | Sabah görev listesi, akşam check-in, aksayan görev için tek dokunuşla "ne oldu?", yeniden planlama, AI koçla sohbet. |
| Haftalık | Pazar | Seri ve ilerleme özeti, veli raporu. Deneme analizi Ocak'ta eklenecek. |
| Sezon | Yılda bir | Yeni baskıların kataloğa girmesi, 2028 Maarif taksonomisi, sınav sonucu verisi (2027 sonrası). |

### 1.2 Kapsam: 20 Aralık MVP, Ocak, Şubat ve sonrası

| Modül | MVP (20 Aralık) | Ocak 2027 | Şubat 2027 ve sonrası |
|---|---|---|---|
| Kitap kütüphanesi | Barkodla arama; MEB ücretsiz kitapları hazır gelir; özel kitap manuel ya da içindekiler fotoğrafıyla eklenir | Kitle kaynaklı katalog terfisi; en çok eklenen 50 kitabın editör doğrulaması | ≈250 kitaplık çekirdek katalog, 2028 Maarif sürümü |
| YouTube oynatma listesi | Link yapıştırılır; videolar süre ve sırayla göreve dönüşür; "YouTube'da aç" ile izlenir, check-in elle yapılır; listenin kitapla birlikte mi ayrı mı ilerleyeceğini öğrenci seçer | Uygulama içi oynatıcı, izleme ilerlemesinin takibi, liste↔kitap bölüm eşlemesi ("önce video, sonra soru"), önerilen listeler | Otomatik eşleme önerisi (YouTube politika incelemesinden sonra) |
| Plan motoru | Sayfa ve test düzeyinde günlük görev; her check-in'de ve uygulama açılışında yeniden hesap | Kapasiteyi gerçek tamamlamalardan öğrenme | Konu önceliğini deneme sonuçlarıyla ağırlıklandırma |
| Günlük check-in | Tek dokunuşla işaretleme, isteğe bağlı doğru/yanlış girişi, tek dokunuşla neden seçimi | — | İsteğe bağlı son sayfa fotoğrafı |
| Proaktif takip | Yerel bildirimler (sabah, 20:00, 21:30), nedene göre otomatik kaydırma | Sunucudan gelen akıllı push | — |
| AI koç sohbeti | Serbest sohbet (owner kararı); ton rehberi; güvenlik katmanı zorunlu | Haftalık değerlendirme görüşmesi | Kaygı ve motivasyon egzersizleri (PDR danışmanıyla) |
| Güvenlik katmanı | Kelime listesi ve sınıflandırıcı, güvenli mod, yardım ekranı, olay kaydı, insan incelemesi | Eval setinin genişletilmesi | — |
| Veli onayı | Onay linki, web onay sayfası, e-posta doğrulaması, rıza kaydı | — | — |
| Veli raporu | Haftalık web özeti; e-posta ve WhatsApp paylaşım linkiyle gönderim | — | WhatsApp Business API (şirket kurulduktan sonra) |
| İlerleme | Seri ve kitap bitirme yüzdesi | Konu ısı haritası | Rozetler |
| Tekrar motoru (FSRS) | — | Birim ve konu düzeyinde tekrar listesi | — |
| Deneme analizi | Zaman kalırsa elle net girişi | Elle giriş, zayıf konu tespiti | Karne fotoğrafı |
| Ödeme | — | Altyapı (RevenueCat, StoreKit) | Şubat: uygulama içi satın alma; şirketten sonra veliye web ödeme |
| Android | Aynı kod; Aralık ortasında kapalı test başlar | Play Store yayını | — |

### 1.3 Değişmez ürün kuralları

Bu kurallar hız, maliyet veya kalite gerekçesiyle gevşetilmez:

1. **Soru metni, çözüm ve sayfa görüntüsü yok.** Ne katalogda ne sohbette. Sohbet MVP'de yalnız metin kabul eder; öğrencinin soru fotoğrafı göndermesine izin verilmez.
2. **Forum ve sosyal medya kazıma yok.** Zorluk ve sıra bilgisi editoryal yolla, ileride de uygulama içi kullanım verisinden gelir.
3. **Planı AI değil kural motoru hesaplar.** LLM plan rakamı üretmez; yalnız konuşur, yorumlar ve içindekiler sayfasını okur.
4. **Kriz sinyali AI'a tek başına bırakılmaz.** Deterministik kurallar ve sınıflandırıcı birlikte çalışır; akut risk durumunda serbest üretim yapılmaz, sabit güvenli yanıt gösterilir.
5. **İçindekiler fotoğrafı işlenir ve silinir.** Paylaşılan katalogda yalnız olgu şeması (sayfa aralığı, test sayısı, kendi taksonomimize eşlenmiş konu) tutulur; ham başlık metni kopyalanmaz.
6. **LLM'e kişisel veri ayıklanmadan gitmez.** Ad, soyad, telefon, e-posta, okul adı ve konum bilgisi istekten önce maskelenir.
7. **Veli onayı gelmeden 18 yaş altı kullanıcının verisi sunucuya gitmez** (Bölüm 2.11).
8. **Sert ton davranışa yöneliktir, kişiye değil.** Duygusal sıkıntı sinyalinde sertlik otomatik olarak kapanır.
9. **YouTube kurallarına uyulur.** Video indirilmez, arka planda oynatılmaz, oynatıcı değiştirilmez ya da üstü örtülmez. API'den gelen başlık ve süreler en geç 30 günde bir yenilenir. Video izleme hiçbir zaman ücretli duvarın arkasına konmaz.

### 1.4 MVP'de bilerek olmayanlar

Konu anlatımı ve soru çözümü (koç, öğretmen değildir), soru bankası içeriği, öğrenciler arası sosyal özellikler, sıralama tabloları, kurum paneli, insan koç eklentisi, yayınevi entegrasyonu.

---

## 2. Teknik mimari

### 2.1 Mimari ilkeler

1. **Plan cihazda da hesaplanabilir olmalı.** Plan motoru saf bir TypeScript paketi; aynı kod mobilde, sunucuda ve web'de çalışır. Böylece veli onayı beklenirken uygulama sunucusuz çalışabilir, check-in sonrası yeniden planlama da anında olur.
2. **AI dar fonksiyonlarda ve denetim altında.** Her LLM çağrısı belirli bir iş için yapılır: yapılandırılmış çıktı, sınırlı bağlam, kişisel verisi ayıklanmış girdi.
3. **Önce ücretsiz katmanlar.** Supabase Free, Expo/EAS Free, Resend Free, PostHog ve Sentry Free kullanılır. Ücretli plana ödeme açılırken geçilir.
4. **Tek LLM sağlayıcısı.** MVP'de yalnız Anthropic (Claude) kullanılır. Bu, KVKK md. 9 kapsamında tek bir yurt dışı aktarım ilişkisi demek; sözleşme ve aydınlatma işi de tek sağlayıcıyla sınırlı kalır.
5. **Veri modeli baştan iki taksonomi sürümünü taşır.** 2027 MEB ve 2028 Maarif sürümleri için tablolarda alan ilk günden açılır, sonradan eklenmez.

### 2.2 Teknoloji seçimi

| Katman | Seçim | Neden | Alternatif |
|---|---|---|---|
| Mobil | **Expo (React Native) + TypeScript + Expo Router**. Kurulumda güncel kararlı SDK kullanılır (Ekim 2026'da 56/57, RN 0.85/0.86) | Ekip Expo'yu biliyor (ChatAppBluetooth, Expo 54). iOS ve Android tek koddan çıkıyor. Plan motoru web ve sunucuyla paylaşılıyor. | Swift (aşağıdaki karar kutusuna bakın) |
| Backend | **Supabase**: Postgres, Auth, Storage, Edge Functions, pg_cron. Bölge: **AB (Frankfurt)** | Ekip idea_factory'den tanıyor. RLS ile satır düzeyinde yetki. Ücretsiz katman beta için yeterli. | Firebase; ayrı bir Node API |
| Web | **Next.js**: veli onayı ve veli raporu sayfaları, kürasyon paneli, ileride web ödeme | Ekip biliyor; plan motoru paketini doğrudan kullanır | Expo web |
| LLM | **Claude Haiku 5.5** (sohbet, risk sınıflandırma, içindekiler okuma, haftalık özet); **Claude Sonnet 5.5** yalnız anlaşmazlık hakemi ve zor vakalar için | Haiku 5.5 girdi için 0,10$/MTok, çıktı için 0,50$/MTok. Tek sağlayıcı. Yapılandırılmış çıktı ve görsel okuma destekli. | Gemini 2.5 Flash-Lite (0,10$/0,40$). Sprint 0'daki çıkarım testinde Haiku ile karşılaştırılacak; açık farkla kazanırsa yalnız içindekiler okuma için ikinci sağlayıcı olarak eklenir. |
| Tekrar | **ts-fsrs** (Ocak) | Açık kaynak FSRS'in TypeScript sürümü | — |
| Bildirim | **expo-notifications ile yerel zamanlanmış bildirimler** | Sunucu ve maliyet gerektirmez. Uygulama hiç açılmasa da 7 günlük bildirim önceden kuruludur. | Expo Push (Ocak) |
| Barkod | expo-camera barkod tarama | Hazır modül | — |
| Video | **YouTube Data API v3** (API anahtarı, ücretsiz günlük kota); Ocak'ta **react-native-youtube-iframe** ile resmi gömülü oynatıcı | Liste başlığı, video süresi, gömülebilirlik ve "çocuklara özel" durumu resmi API'den gelir; kazıma gerekmez | YouTube uygulamasına derin link (MVP'nin yolu) |
| E-posta | Resend, ücretsiz katman | Veli onayı ve rapor e-postası | Supabase SMTP |
| Veliye WhatsApp | **wa.me paylaşım linki** (MVP) | Maliyetsiz; şirket ve Meta doğrulaması gerektirmez | WhatsApp Cloud API (şirket sonrası) |
| Ödeme | RevenueCat + StoreKit (Şubat); iyzico abonelik (şirket sonrası) | Bölüm 2.13 | PayTR |
| Analitik ve hata | PostHog Cloud EU + Sentry, ücretsiz katmanlar | AB'de barındırılan analitik | — |
| Build ve CI | EAS Build/Submit (ücretsiz katman, yetmezse yerel Xcode build), GitHub Actions (typecheck + test) | — | — |

> **Karar kutusu — Swift mi, Expo mu?** Owner tercihi "iOS öncelikli; Swift olabilir, yoksa React Native ile iki platform birden". Önerimiz **Expo**. Gerekçeler:
>
> 1. Türkiye mobil pazarının **≈%74'ü Android** (StatCounter, Temmuz 2026). Ödeme gücü iOS tarafında daha yüksek olsa da öğrenci tabanı Android'de.
> 2. Plan motoru TypeScript'te yazılınca aynı kod mobilde, veli web sayfasında ve sunucuda çalışıyor. Swift seçilirse bu motor iki kez yazılır.
> 3. Haftada kişi başı 15-20 saatle iki ayrı native uygulamayı yürütmek gerçekçi değil.
> 4. Ekip daha önce Expo ile uygulama yayınladı.
>
> Swift'in iOS'ta kilit ekranı widget'ı ve Live Activity gibi avantajları var; Expo'da bunlar ileride config plugin'leriyle eklenebilir. "iOS öncelikli" ilkesi teknoloji seçiminde değil, **yayın sırasında** uygulanıyor: önce App Store, sonra Play Store.

### 2.3 Sistem şeması

```text
                         +-----------------------------+
   Öğrenci (iOS/Android) |  apps/mobile (Expo)         |
                         |  - plan-engine (cihazda)    |
                         |  - yerel bildirimler        |
                         |  - onay öncesi: yalnız yerel|
                         |  - "YouTube'da aç" linki    |
                         +-------------+---------------+
                                       | HTTPS (Supabase JS, RLS)
                                       v
+----------------------+   +---------------------------+   +----------------------+
| apps/web (Next.js)   |-->| Supabase (AB / Frankfurt) |<--| Edge Functions       |
| - veli onayı         |   | Postgres + RLS            |   | - chat (akış)        |
| - veli haftalık rapor|   | Auth (e-posta OTP)        |   | - risk sınıflandırma |
| - kürasyon paneli    |   | Storage (geçici görsel)   |   | - toc-extract        |
| - (sonra) web ödeme  |   | pg_cron (rapor, yenileme) |   | - youtube-import     |
|                      |   |                           |   | - weekly-report      |
+----------------------+   +---------------------------+   +----------+-----------+
                                                                      | PII ayıklı
                                                                      v
                                                          +-----------------------+
                                                          | Dış API'ler           |
                                                          | - Claude Haiku/Sonnet |
                                                          | - YouTube Data API v3 |
                                                          +-----------------------+
   Veli <-- e-posta (Resend) / wa.me paylaşım linki --- apps/web rapor sayfası
```

### 2.4 Repo yapısı (kod başlarken)

```text
yks-ai-koc/
  apps/
    mobile/            Expo uygulaması (iOS öncelikli, Android aynı kod)
    web/               Next.js: veli onayı + rapor, kürasyon paneli, ileride ödeme
  packages/
    plan-engine/       saf TS: planlama + yeniden planlama + property testleri
    catalog/           eser/baskı/birim şemaları, içindekiler doğrulama kuralları
    ai/                istem şablonları, çıktı şemaları, PII ayıklayıcı
    safety/            kelime listeleri, risk eşikleri, sabit yanıtlar, eval seti
  supabase/
    migrations/        şema + RLS politikaları
    functions/         chat, classify, toc-extract, youtube-import, weekly-report
  docs/                bu belgeler
  data-private/        (gitignore) telifli test fotoğrafları, commit edilmez
```

Paket yöneticisi pnpm workspace (idea_factory ile aynı düzen).

### 2.5 Veri modeli

**Katalog (paylaşılan, salt okunur; yalnız editör rolü yazar):**

| Tablo | Ana alanlar | Not |
|---|---|---|
| `work` (eser) | id, yayınevi, seri, ders, sınav (TYT/AYT), tür (soru bankası / konu anlatımı / deneme) | Baskıdan bağımsız kimlik |
| `edition` (baskı) | id, work_id, **isbn, basım_yılı, sayfa_sayısı**, müfredat_sürümü (MEB-2027 / Maarif-2028), kaynak, durum (taslak / doğrulandı), doğrulayan | Baskı anahtarı yalnız ISBN olamaz: ISBN + yıl + sayfa sayısı (fizibilite bulgusu) |
| `unit` (birim) | id, edition_id, sıra, sayfa_baş, sayfa_son, test_sayısı, topic_id, tahmini_dk | Ham başlık metni paylaşılan katalogda tutulmaz |
| `topic` (konu) | id, taksonomi_sürümü, ders, üst_id, ad, meb_kodu, sınav_ağırlığı | MEB 2026 kazanım PDF'inden v1; Maarif için ayrı sürüm |
| `toc_submission` | id, user_id, isbn, çıkarım_json, doğrulama_sonucu, durum, oluşturma | Görsel saklanmaz; yalnız çıkarılan olgular |
| `yt_playlist` (önbellek) | youtube_playlist_id, başlık, kanal_adı, video_sayısı, **çekilme_zamanı** | YouTube API verisi: en geç 30 günde bir yenilenir ya da silinir (politika III.E.4) |
| `yt_video` (önbellek) | playlist_id, sıra, video_id, başlık, süre_sn, gömülebilir, çocuklara_özel, gizlilik, **çekilme_zamanı** | Aynı 30 gün kuralı; plan görevleri yalnız `video_id` tutar, başlık ve süre ekranda önbellekten okunur |

**Kullanıcı tarafı (her satır RLS ile yalnız sahibine açık):**

| Tablo | Ana alanlar |
|---|---|
| `profile` | user_id, doğum_ayı/yılı, sınıf, alan (SAY/EA/SÖZ/DİL), hedef, sınav_tarihi, gün_bazlı_dk[7], onay_durumu |
| `guardian` | id, öğrenci_id, e-posta/telefon, doğrulanma_zamanı |
| `consent` | id, kişi_id, tür (aydınlatma / yurt dışı aktarım + AI sohbet / veli raporu), metin_sürümü, veren (öğrenci/veli), zaman, ip_hash, geri_çekilme |
| `library_item` | id, user_id, kaynak_türü (kitap / oynatma listesi), edition_id **veya** özel_baskı (json: birimler) **veya** yt_playlist_id, sıra, öncelik, durum, izleme_hızı ve not_payı (video), bağlı_kaynak_id ve bölüm eşlemesi (Ocak) |
| `plan_task` | id, user_id, tarih, unit_id + aralık (sayfa a-b / test x-y) **veya** video_id, tahmini_dk, durum (planlandı / tamam / yarım / atlandı), neden |
| `checkin` | id, user_id, tarih, tamamlananlar, doğru/yanlış, neden, not |
| `mock_exam` (Ocak) | id, user_id, tarih, tür, ders ve konu bazında netler |
| `review_state` (Ocak) | user_id, unit_id/topic_id, FSRS stability, difficulty, due, last_review |
| `chat_message` | id, user_id, rol, içerik, risk_etiketi, oluşturma (90 günlük kayan saklama) |
| `safety_event` | id, user_id, message_id, seviye, kategori, alınan_aksiyon, inceleyen, inceleme_zamanı |

### 2.6 Plan motoru

**Girdiler:** sınav tarihi, bugünün tarihi, haftanın her günü için çalışılacak dakika, kitaplar (sıra ve öncelik), her kitabın birimleri (sayfa aralığı veya test sayısı ve tahmini süre), tamamlanma geçmişi, neden kayıtları.

**Algoritma (deterministik, açgözlü liste zamanlama):**

```text
hedef_bitis   = sinav_tarihi - 21 gün        // son 3 hafta: genel tekrar + deneme
kalan_gunler  = bugün..hedef_bitis arasındaki çalışma günleri
her kitap k:
  kalan_is[k]  = Σ kalan birimlerin tahmini_dk
  gunluk_pay[k] = kalan_is[k] / |kalan_gunler|
toplam_talep  = Σ kalan_is ; toplam_kapasite = Σ gun_dk[kalan_gunler]
eger toplam_talep > toplam_kapasite:
  uyarı üret + öncelik skoruna göre "çekirdek" birimleri seç, kalanı "zaman kalırsa" listesine al
her gün g (bugünden başlayarak):
  kapasite = gun_dk[g] (- Ocak'tan sonra: FSRS tekrar payı, en fazla %20)
  kitaplar arasında gunluk_pay ağırlıklı round-robin:
    sıradaki birimi al; kapasiteye sığmıyorsa sayfa/test aralığını böl
  çıktı: g -> [(kitap, s. a-b | test x-y, dk)]
yeniden planlama: yalnız bugünden sonrası değişir; geçmiş görevler değişmez
```

**Öncelik skoru:** `w1·sınav_ağırlığı + w2·zayıflık + w3·kitap_içi_sıra + w4·gecikme`. MVP'de zayıflık ve sınav ağırlığı kaba değerlerle girilir; Ocak'tan sonra deneme netlerinden beslenir.

**Kaynak türleri:** Plan motoru üç birim türüyle çalışır: sayfa aralığı, test aralığı ve **video**. Bir video görevinin süresi `video_süresi / izleme_hızı × (1 + not_payı)` formülüyle hesaplanır. Varsayılan hız 1×, not payı %25; öğrenci 1,25×, 1,5× ya da 2× seçebilir. Oynatma listesi de kitap gibi bir kaynak sayılır ve kendi sırasıyla round-robin'e girer. Kitapla liste arasındaki ilişkiyi **öğrenci seçer** (owner kararı):

- **Bağımsız (varsayılan, MVP):** Liste ve kitap kendi sıralarıyla paralel ilerler.
- **Bağlı (Ocak):** Öğrenci listeyi bir kitaba bağlar ve bölüm düzeyinde eşler ("video 30-45 ↔ kitapta Bölüm 5"). Motor eşlenmiş çiftlerde önce videoyu, sonra aynı bölümün sayfa ya da testini planlar. Eşlenmemiş kısımlar bağımsız ilerler.

Video görevinden sonra "konu zor geldi" seçilirse sıradaki soru görevi ikiye bölünür ve aynı videonun tekrar izlenmesi önerilir.

**Neden kuralları (check-in'deki tek dokunuşluk seçim):**

| Neden | Plan tepkisi | Koç tepkisi |
|---|---|---|
| Zaman yetmedi | Kalan iş sonraki günlere yayılır. Üç gün üst üste seçilirse o günün kapasitesi %15 düşürülür ve plan bu daha gerçekçi kapasiteyle yeniden kurulur. | Kısa ve yargısız bir not |
| Konu zor geldi | O birimin süre tahmini ×1,3; sıradaki görev ikiye bölünür; konu anlatımı önerilir | Konu odaklı kısa yönlendirme |
| İsteksizim | Plan değişmez; ertesi günün ilk görevi en kısa görev olur ("ısınma") | AI koçla kısa sohbet: tatlı-sert, davranışa odaklı |
| Kötü hissediyorum | **Güvenli mod** 72 saat: ertesi günün yükü %50; sert ton kapanır | Destekleyici dil, risk taraması (Bölüm 2.10) |

**Seri kuralı:** Bir gün, planlanan görevlerin en az üçte ikisi **veya** planlanan dakikanın en az %60'ı tamamlanmışsa "tamam" sayılır.

**Property testleri (CI'da zorunlu):**
- Bir günün görev dakikaları toplamı, kapasite + %10'u aşmaz.
- Her birim tam bir kez planlanır; sayfa aralıkları çakışmaz ve kitap sırasını korur.
- Yeniden planlama geçmiş günleri değiştirmez.
- Aynı girdi her zaman aynı çıktıyı verir.
- Hedef bitiş tarihinden sonra görev oluşmaz.
- Talep kapasiteyi aşarsa uyarı üretilir ve "çekirdek" listesi kapasiteye sığar.
- Video görevleri liste sırasını korur. Bağlı çiftlerde video, eşlendiği sayfa ya da test görevinden önce veya aynı gün gelir.

### 2.7 Tekrar motoru (Ocak)

`ts-fsrs` kullanılır; kart yerine **birim veya konu** düzeyinde çalışır. Check-in'deki doğru/yanlış oranı FSRS puanına çevrilir: %85 ve üzeri "kolay", %60-85 "iyi", %40-60 "zor", %40'ın altı "tekrar". Tekrar görevleri günlük kapasitenin en fazla %20'sini kullanır. FSRS'in bilgi kartı yerine konu düzeyinde kullanımı bir uyarlamadır; ilk sezon verisiyle doğrulanmalı (fizibilite notu).

### 2.8 Kaynak ekleme: kitap, içindekiler hattı ve YouTube oynatma listeleri

```text
barkod okut ─> katalogda var mı? ─evet─> konu-sayfa haritası hazır gelir
                     │ hayır
                     v
     ┌── "Hızlı ekle": ad + toplam sayfa veya test sayısı (30 sn)
     └── "İçindekilerden ekle": 1-4 fotoğraf
              -> Edge Function: Claude Haiku 5.5 görsel okuma, katı JSON şeması
              -> Türkçe karakter onarımı (ğ, ş, ı/İ)
              -> kod doğrulaması: sayfalar artan sırada mı, son sayfa ≤ kitabın sayfa sayısı mı
              -> öğrenci 30 sn'de kontrol edip onaylar ya da düzeltir
              -> görsel silinir (işlem bitince hemen, en geç 24 saatte)
     özel baskı yalnız o öğrenciye açıktır
     aynı ISBN'i 3 farklı kullanıcı uyumlu şekilde gönderirse -> editör kuyruğu -> ortak kataloğa terfi
```

**Katalog tohumu:** MEB OGM'nin ücretsiz "3 Adım" ve "Konu Pekiştirme" kitapları (≈35 PDF; metin katmanlı ve hukuken temiz). Fizibilitede yalnız bir başlığın içindekileri doğrulanmıştı; diğerleri Sprint 1'de kontrol edilecek.

**Hızlı ekle** modu, fizibilitenin tahminine göre konu eşlemesi olmadan ilk gün algılanan değerin ≈%60-70'ini koruyor. Kitap satın almadan başlamayı mümkün kılan da bu mod.

#### YouTube oynatma listeleri

Öğrencilerin yaygın alışkanlıklarından biri, kaynak kitabı bir YouTube ders listesiyle birlikte kullanmak. Bu kaynak türü kitaptan çok daha kolay ekleniyor: video başlıkları, sıraları ve süreleri YouTube Data API'den yapılandırılmış veri olarak geliyor, içindekiler fotoğrafına ya da OCR'a gerek kalmıyor.

```text
öğrenci liste linkini yapıştırır ya da YouTube'da "Paylaş" ile uygulamaya gönderir
  -> Edge Function youtube-import:
       playlistItems.list (sayfa başına 50 video) + videos.list (süre,
       gömülebilirlik, "çocuklara özel" durumu, gizlilik)
  -> önbellek: yt_playlist / yt_video (en fazla 30 gün; pg_cron 25. günde yeniler)
  -> özel ya da silinmiş videolar plandan çıkar; gömülemeyenler işaretlenir
  -> öğrenci: izleme hızı, not payı, "kitaba bağla / bağımsız" seçimi
  -> plan motoru: video görevleri (başlık, süre, kanal, "YouTube'da aç")
```

**MVP (hafif sürüm, ≈16 saat):** Link ekleme, video görevleri, YouTube uygulamasına ya da web'e derin link ve check-in'de elle "izledim" işareti. Uygulama içi oynatıcı olmadığı için izleme verisi toplanmıyor; politika riski en düşük yol bu.

**Ocak (tam sürüm, ≈32 saat):**

- Uygulama içi resmi gömülü oynatıcı (react-native-youtube-iframe): otomatik oynatma kapalı, arka planda oynatma yok, oynatıcının üstünde katman yok, YouTube markası görünür.
- Oynatıcı olaylarından öğrencinin kendi ilerlemesi: %90'ı izlenen video için "görev tamamlandı" önerisi gösterilir. "Çocuklara özel" işaretli videolarda takip kapalı (III.E.4.j). İzleme ilerlemesi kişisel veri; aydınlatma metnine eklenir.
- Liste↔kitap bağlama ve bölüm eşlemesiyle "önce video, sonra soru" planı.
- Önerilen listeler: aynı listeyi ekleyen öğrenci sayısına göre sıralanır. Bu sayı YouTube API verisi değil, kendi kullanım verimiz.
- Video başlıklarından kitap bölümüne **otomatik eşleme önerisi** (LLM + öğrenci onayı). API verisinden "türetilmiş veri" üretmeyi yasaklayan III.E.4.h maddesi nedeniyle **politika incelemesi olmadan açılmaz** (OPEN QUESTION).

**YouTube API Hizmetleri yükümlülükleri ([Developer Policies](https://developers.google.com/youtube/terms/developer-policies)):**

| Madde | Yükümlülük | Tasarımdaki karşılığı |
|---|---|---|
| III.E.4.c-e | API verisi en fazla 30 gün saklanır, sonra silinir ya da yenilenir; güncel tutulur | `çekilme_zamanı` alanı ve pg_cron yenilemesi; plan görevleri yalnız `video_id` tutar |
| III.E.4.h | API verisinden yeni ya da türetilmiş veri veya metrik üretilmez | Süre yalnız görev hesabında kullanılır, ayrı bir veri seti olarak saklanmaz. Otomatik eşleme inceleme bitene kadar kapalı. Kanal ya da video için "başarı skoru" üretilmez. |
| III.E.4.g | Kullanıcı silme talebinde API verisi 7 gün içinde silinir | Hesap silme süresi tüm veriler için 7 güne indi (Bölüm 2.11) |
| III.E.4.j | "Çocuklara özel" videolarda takip kapatılır | `çocuklara_özel` alanı; bu videolarda ilerleme takibi yapılmaz |
| III.I.4-9 | Oynatıcı değiştirilmez, reklam ve linkler engellenmez, arka planda oynatılmaz | Resmi IFrame oynatıcı, varsayılan ayarlar |
| III.F.2 | YouTube içeriğin kaynağı olarak açıkça gösterilir | Video görev kartında YouTube logosu ve kanal adı |
| III.F.3.a | Gömülü oynatıcıda izlemek için ücret alınmaz | Oynatıcı ve "YouTube'da aç" ücretsiz katmanda da her zaman açık. Premium izlemeyi değil, planlama, koç ve rapor özelliklerini satar. |
| III.A.1-2 | YouTube Hizmet Şartları'na link; gizlilik politikasında YouTube API Hizmetleri ve Google Gizlilik Politikası | Aydınlatma metni ve kullanım şartlarına eklenir (T07, T34) |

**Kota:** Ücretsiz günlük kota 10.000 birim. Liste ve video sorguları çağrı başına 1 birim tutuyor; 100 videoluk bir liste ≈4 birim. Popüler listeler ortak önbellekten okunacağı için kota MVP ve Sezon 1'e fazlasıyla yetiyor. Maliyet 0 TL. *(Birim maliyetleri Google'ın kota hesaplayıcısından teyit edilmeli.)*

### 2.9 AI katmanı

| Fonksiyon | Model | Girdi → çıktı | Sınır |
|---|---|---|---|
| Koç sohbeti | Haiku 5.5, akışlı yanıt | Öğrenci mesajı + özet bağlam (bugünkü plan, son 7 günün tamamlama oranı, son neden kayıtları, kısa geçmiş) → koç yanıtı | Günde 60 mesaj, mesaj başına 1.000 karakter, metin dışı içerik yok |
| Risk sınıflandırma | Haiku 5.5, yapılandırılmış çıktı | Her öğrenci mesajı → `{risk: yok / yüksek / akut, kategori}` | Yanıt üretiminden **önce** çalışır |
| Neden yanıtı | Haiku 5.5 | Seçilen neden + görev bilgisi → 1-2 cümle | Ton rehberi |
| İçindekiler okuma | Haiku 5.5 (görsel) | 1-4 fotoğraf → `{birimler: [{sıra, başlık_ham, sayfa_baş, test_sayısı}]}` | Ham başlık yalnız özel baskıda kalır |
| Haftalık özet | Haiku 5.5 | Haftanın sayıları → öğrenci ve veli için 3-4 cümle | Sayıları LLM üretmez; yalnız cümleye döker |
| Liste↔kitap eşleme önerisi (Ocak, politika incelemesinden sonra) | Haiku 5.5, yapılandırılmış çıktı | Video başlıkları + kitap birimleri → önerilen bölüm eşlemesi | Öğrenci onaylamadan uygulanmaz; YouTube politikası III.E.4.h incelemesine bağlı |
| Anlaşmazlık hakemi | Sonnet 5.5 | Uyuşmayan iki içindekiler çıkarımı → tek sonuç | Nadiren kullanılır |

**Uygulama notları:**
- API anahtarı yalnız Edge Function'da tutulur; mobil uygulama Claude'u doğrudan çağırmaz.
- Sistem istemi (ton rehberi ve kurallar) sabit tutulur ve **prompt caching** ile önbelleğe alınır. Önbellekten okunan token, normal girdi fiyatının ≈%10'una faturalanır.
- Haiku 5.5'te uyarlamalı düşünme varsayılan olarak açık ve düşünme token'ları çıktı olarak faturalanıyor. Sohbet ve sınıflandırmada `effort: low` kullanılmalı (ya da düşünme kapatılmalı; bu modelde `high` ve altında mümkün). Maliyet ölçümle doğrulanacak.
- PII ayıklayıcı (`packages/ai`) her istekte çalışır. Ad, e-posta, telefon, okul adı ve şehir maskelenir. Öğrenciye adıyla hitap gerekiyorsa ad, yanıt üretildikten sonra cihazda eklenir.
- Anthropic'in ticari API şartlarında API verisi varsayılan olarak model eğitiminde kullanılmıyor. Saklama süresi ve sıfır saklama (ZDR) seçeneği sözleşme aşamasında teyit edilmeli.

**AI maliyeti (Haiku 5.5: girdi 0,10$/MTok, önbellek okuma ≈0,01$/MTok, çıktı 0,50$/MTok; Türkçe token şişmesi için ×1,6):**

| Profil | Aylık sohbet turu | Maliyet/ay |
|---|---|---|
| Hafif (ücretsiz kullanıcı, kısıtlı sohbet) | 20 | ≈0,02$ ≈ 1,2 TL |
| Tipik Premium kullanıcı | 60 | ≈0,05$ ≈ 2,4 TL |
| Yoğun kullanıcı | 300 | ≈0,20$ ≈ 9,9 TL |
| İçindekiler okuma (kitap başına) | — | ≈0,00125$ (300 kitap × 3 yedek gönderim ≈ 1,1$) |

*Varsayımlar: bir tur = 2.500 önbellekli + 1.500 yeni girdi token'ı + 250 çıktı token'ı, artı sınıflandırıcı çağrısı (800 girdi + 30 çıktı). Profillere 4 haftalık özet, 30 neden yanıtı ve 2 içindekiler okuması da dahil. Sonuç fizibilitedeki 0,02-0,11$ aralığıyla tutarlı.* Ödeme açıldıktan sonra ücretsiz katmanda sohbet haftada 5 mesajla sınırlanır. Senaryolarda ücretsiz kullanıcı, temkinli bir varsayımla kotasını tam kullanan "hafif" profil (≈1,17 TL/ay) olarak hesaplanmıştır.

### 2.10 Güvenlik katmanı (MVP'nin en kritik parçası)

Serbest sohbet, reşit olmayan kullanıcılar ve sınav stresi bir araya gelince en büyük ürün riski teknik değil, güvenlik riski. Katmanlar:

| Katman | Ne yapar | Nerede |
|---|---|---|
| 1. Deterministik liste | Türkçe kriz ifadeleri, yazım varyantları ve ı/i normalizasyonuyla eşleştirme yapar → anında güvenli mod | `packages/safety`, sunucuda (bir kopyası istemcide) |
| 2. Risk sınıflandırıcı | Her mesajda `yok / yüksek / akut` ve kategori (kendine zarar, istismar, yeme, madde, diğer) üretir | Edge Function, yanıttan önce |
| 3. Akut yanıt | Akut riskte LLM'e yanıt yazdırılmaz. PDR danışmanının onayladığı **sabit metin** gösterilir: 112 Acil Çağrı, ALO 183 Sosyal Destek Hattı, "güvendiğin bir yetişkinle ya da okulundaki rehber öğretmenle konuş"; bir de tek dokunuşla "velime/rehberime haber ver" seçeneği sunulur | Mobil |
| 4. Güvenli mod | 72 saat boyunca sert ton kapanır, görev yükü %50 azalır, sohbet yalnız destekleyici dille sürer | Plan motoru + istem |
| 5. Sistem istemi kuralları | Teşhis koyma, ilaç veya tedavi önerisi, başka öğrenciyle kıyaslama, utandırma, tehdit, beden ve sağlık yorumu yasak; soru çözümü kapsam dışı | `packages/ai` |
| 6. Çıktı denetimi | Yasaklı kalıplar için regex; ihlal varsa yanıt sabit metinle değiştirilir | Edge Function |
| 7. İnsan incelemesi | `safety_event` kayıtları 24 saat içinde kurucular tarafından incelenir; yalnız işaretlenen mesajlar açılır (aydınlatma metninde belirtilir) | Kürasyon paneli |
| 8. Bildir düğmesi | Öğrenci her AI yanıtını "uygunsuz" diye bildirebilir | Mobil |

**Türkçe deyim tuzağı:** "Bu sınav beni öldürecek", "kafayı yiyeceğim" gibi ifadeler çoğunlukla deyim. Sınıflandırıcı bu durumlarda alarm yerine nazik bir kontrol sorusu sormalı. Eval seti bunu ölçmeli.

**Eval seti (Sprint 2):** 200 Türkçe mesaj: 100 riskli (dolaylı ifadeler, argo, yazım hataları dahil) ve 100 zararsız ama stresli. Hedefler: akut sınıfta **kaçırma oranı ≤%2** (amaç sıfır); yanlış alarm ölçülür ve raporlanır. Her istem ve model değişikliğinde yeniden koşulur.

**Yayın koşulu:** PDR veya klinik bir danışman (gönüllü ya da tanıdık) kriz protokolünü, sabit metinleri ve ton rehberini **yazılı olarak onaylamadan** herkese açık yayın yapılmaz. Akut riskte veliye otomatik bildirim gidip gitmeyeceği bu danışmanla kararlaştırılacak (**OPEN QUESTION**). MVP varsayılanı: otomatik bildirim yok, öğrenciye tek dokunuşla haber verme seçeneği var.

### 2.11 KVKK ve veli onayı akışı

**Akış:**

1. Kurulumda doğum ayı ve yılı sorulur. 18 yaş altıysa "veli onayı gerekli" ekranı açılır.
2. **Onay öncesi mod:** Plan motoru cihazda çalışır; kitap ekleme yalnız katalog araması ve "hızlı ekle" ile yapılır. Sohbet, fotoğraf yükleme ve sunucu senkronu kapalıdır. Sunucuda yalnız anonim kullanıcı kimliği ve onay istemek için verilen veli iletişim bilgisi tutulur.
3. Öğrenci velisinin e-posta adresini girer. Sistem tek kullanımlık bir onay linki üretir; öğrenci bu linki **WhatsApp'tan paylaşır** (wa.me, maliyetsiz) ya da link e-postayla gönderilir.
4. Veli web sayfasında aydınlatma metnini okur. **Ayrı ayrı** açık rıza verir: (a) AI sohbet ve yurt dışına aktarım (Claude API, ABD; Supabase, AB), (b) haftalık veli raporu. Adını yazar ve e-posta OTP'siyle doğrular. Metin sürümü, zaman ve IP hash'i kaydedilir.
5. Onaydan sonra cihazdaki veri sunucuyla senkronize edilir; sohbet ve fotoğraf yükleme açılır; veli haftalık rapor almaya başlar.
6. Veli aynı linkten rızasını geri çekebilir. Bu durumda sohbet kapanır ve veri silme akışı başlar.

**Saklama:**

| Veri | Süre |
|---|---|
| İçindekiler fotoğrafı | İşlem sonrası hemen, en geç 24 saat |
| Sohbet mesajları | 90 günlük kayan pencere |
| Güvenlik olay kaydı | İnceleme sonrası 1 yıl (avukat teyidiyle) |
| YouTube önbelleği (başlık, süre) | En fazla 30 gün; sonra yenilenir ya da silinir |
| Hesap silme | Talepten sonra **7 gün** içinde tüm kişisel veri. YouTube politikası (III.E.4.g) API verisi için 7 gün şart koşuyor; karışıklık olmasın diye tek süre kullanılıyor. |
| Rıza kayıtları | İspat yükü nedeniyle hesap silinse de sürüm, zaman ve hash tutulur (avukat teyidiyle) |

**Yurt dışına aktarım (KVKK md. 9):** Hem Anthropic (ABD) hem Supabase (AB) yurt dışı. Ana yol standart sözleşme ve imzadan sonra **5 iş günü içinde** Kurum'a bildirim. Bildirim yapılmazsa 2026 ceza aralığı 90.308-1.806.377 TL (fizibilite). Pratikte büyük bulut sağlayıcılarına KVKK standart sözleşmesi imzalatmak zor olabilir; bu, avukata sorulacak 6. soru. Kalan riski azaltmak için LLM'e PII ayıklanmış veri gönderilir ve rızalar ayrı ayrı alınır.

**VERBİS:** 50'den az çalışanı ve 100 milyon TL'nin altında bilançosu olan, ana faaliyeti özel nitelikli veri işlemek olmayan veri sorumluları genellikle kayıttan muaf. Sohbet sağlıkla ilgili içerik barındırabildiği için muafiyet avukatla teyit edilmeli.

**Bilinen zayıf nokta:** Öğrenci kendini veli gibi gösterip onay verebilir. MVP'deki önlem beyan + ayrı e-posta OTP'si; daha güçlü kimlik doğrulama orantısız maliyetli. Avukata sorulacak.

**Avukata sorulacaklar** (fizibilitedeki 5 soruya ek olarak): (6) büyük sağlayıcılarla standart sözleşme pratiği, (7) veli onayının ispat düzeyi, (8) sohbet içeriğinin özel nitelikli veri sayılması ve buna göre gereken rıza yapısı. Bütçe kısıtı nedeniyle ücretsiz bir ön görüşme (tanıdık avukat, baro danışma hattı veya kuluçka merkezi hukuk saatleri) Kasım'da; ücretli yazılı görüş ise ödeme açılmadan önce, Ocak'ta.

### 2.12 Bildirimler ve veli kanalı

- **Yerel bildirimler:** Sabah görev özeti (öğrencinin seçtiği saatte), 20:00 ve 21:30'da check-in hatırlatması. Check-in yapılınca o günün kalan bildirimleri iptal edilir. 7 günlük bildirim önceden kurulur, uygulama her açıldığında yenilenir.
- **Veli raporu:** Pazar 20:00'de `pg_cron` haftalık özeti hazırlar. Veliye e-posta gider; öğrenci uygulamasında "velime gönder" (wa.me) düğmesi çıkar. Rapor sayfası imzalı ve süreli bir linkle açılır, veliden hesap açması istenmez.
- **Rapor içeriği:** Hedeflenen ve gerçekleşen çalışma günleri, kitap ilerlemesi, seri, haftanın notu. Sohbet içeriği **hiçbir zaman** veliye gösterilmez.

### 2.13 Ödeme altyapısı (Şubat 2027)

Owner'ın hedefi: veli web'den öder, uygulama içinde de satın alma seçeneği vardır. Bütçe kısıtı yüzünden iki aşamada kurulması öneriliyor:

| Aşama | Ne zaman | Nasıl | Neden |
|---|---|---|---|
| **A: Uygulama içi** | Şubat 2027 | StoreKit + RevenueCat (aylık gelir ≈2.500$'a kadar ücretsiz katman; teyit edilmeli). Apple Small Business Program ile %15 komisyon. Apple hesabı bireysel. Gelir **GVK mükerrer 20/B** istisnasıyla, özel banka hesabı üzerinden %15 stopajla alınır (2026 sınırı 5,3 milyon TL). | Şirket, mali müşavir ve sanal POS gerekmez; sabit gider sıfıra yakın |
| **B: Veliye web ödeme** | Şirket kurulunca (öneri: aylık net gelir ≈15 bin TL'yi geçince ya da Eylül 2027'den önce) | iyzico abonelik ödemesi; komisyon ≈%2,5-4 + işlem ücreti, teklif alınmalı. Veli raporundaki "Premium'a geç" linki web ödeme sayfasına gider. | Net gelir ≈%80'e çıkar (uygulama içinde ≈%65,5) |

**Notlar:**
- **20/B kapsamı teyit edilmeli:** Kaynaklar, App Store gelirinin istisnaya girip girmediği konusunda farklı şeyler söylüyor. Mali müşavirden Ocak'ta yazılı teyit alınmalı.
- **Apple kuralı:** Uygulama içinde web ödeme linki gösterilmez (Türkiye'de harici ödemeye yönlendirme serbest değil). Web'de alınan abonelik uygulamada kullanılabilir; bunun için aynı içerik uygulama içi satın alma olarak da sunulur (çok platformlu hizmet kuralı). Veli linki öğrenci uygulamasında değil, veli raporunda yer alır.
- **Apple'ın Türkiye kesintileri:** Apple geliri hesaplarken KDV'yi (%20) ve 2020'den beri dijital hizmet vergisini (%7,5) düşüyor. Güncel oran App Store Connect'te kontrol edilmeli.
- **YouTube kuralı:** Gömülü oynatıcıda izlemek için ücret alınamıyor (III.F.3.a). Video oynatma ve "YouTube'da aç" ücretsiz katmanda da açık kalır; Premium yalnız planlama, koç ve rapor özelliklerini kapsar.
- **Yetki kaydı:** Hangi kanaldan ödenmiş olursa olsun `entitlement` tablosuna yazılır ve tek kaynak olur (RevenueCat webhook'u + iyzico webhook'u).
- **Kurucular arası paylaşım:** Bireysel Apple hesabı tek kurucunun adına açılır. Gelir paylaşımı ve fikri mülkiyet bu yüzden yazılı bir kurucu sözleşmesiyle şimdiden netleştirilmeli (Bölüm 7).

### 2.14 Gözlem ve analitik

Temel olaylar (PostHog): `onboarding_tamam`, `kitap_eklendi{yöntem}`, `plan_olustu`, `checkin{tamam_orani, neden}`, `sohbet_mesaj`, `guvenli_mod_acildi`, `veli_onay_istendi`, `veli_onayladi`, `veli_rapor_acildi`, `paywall_goruldu`, `satin_alma`. Olaylarda kişisel veri ya da mesaj içeriği bulunmaz. Birinci metrik **D7 ve D30 elde tutma**. Hatalar Sentry'ye gider; PII temizleme açık olmalı.

### 2.15 Altyapı maliyeti (tahmin)

| Kalem | Beta (≤100 kullanıcı) | 1.000 MAU | 10.000 MAU | 100.000 MAU |
|---|---|---|---|---|
| Supabase | 0 (Free) | 25$ (Pro, yedekli) | 25-60$ | 100-200$ |
| Web hosting | 0 (Vercel Hobby, ticari olmayan beta) | 20$ (Vercel Pro) | 20$ | 20-50$ |
| LLM (Premium oranı %5) | ≈5$ (betada herkes sohbet eder) | ≈25$ | ≈250$ | ≈2.490$ |
| E-posta | 0 | 0 | ≈20$ | ≈90$ |
| Analitik ve hata | 0 | 0 | 0-50$ | 100-300$ |
| YouTube Data API | 0 | 0 | 0 | 0 (kota artışı gerekirse uyum denetimi) |
| **Toplam** | **≈5$ ≈ 250 TL/ay** | **≈70$ ≈ 3.500 TL/ay** | **≈315-400$ ≈ 16-20 bin TL/ay** | **≈2.800-3.130$ ≈ 139-155 bin TL/ay** |

*Not: Vercel Hobby planı ticari kullanıma izin vermiyor. Beta sürerken bu bir gri alan; ödeme açılınca Pro'ya geçilmeli. Supabase'in ücretsiz projeleri 7 gün hareketsiz kalırsa duraklıyor; günlük kullanılan bir uygulamada sorun olmaz, ama yedek yok.*

### 2.16 İnşa planı: 2 kurucu, yarı zamanlı, task bazlı

**İki iş akışı (öneri; atamayı kurucular yapar):**
- **A — Mobil ve plan:** Expo uygulaması, plan motoru, kütüphane, check-in, bildirimler, sohbet arayüzü.
- **B — Backend, AI ve web:** Supabase şeması ve RLS, Edge Functions, güvenlik katmanı, veli onayı ve rapor sayfaları, katalog tohumu.

**Kapasite:** 2 kişi × 15-20 saat/hafta × ≈7,5 hafta (22 Ekim - 13 Aralık) ≈ **225-300 saat**. Görev listesinin toplamı, YouTube hafif sürümüyle birlikte **≈267 saat**. Tahminler AI destekli kodlama varsayıyor; tampon dar, bu yüzden kesme sırası önceden belirlendi.

| ID | Görev | Akış | Saat | Bağımlılık |
|---|---|---|---|---|
| **Sprint 0 · 22 Ekim - 1 Kasım** | | | **55** | |
| T01 | Apple Developer bireysel kaydı (onay 1-2 gün sürebilir), bundle ID, App Store Connect kaydı | Ortak | 2 | — |
| T02 | pnpm monorepo: Expo + Next.js + `plan-engine`; CI (typecheck + test) | A | 6 | — |
| T03 | Supabase (AB): şema v1, RLS, migration'lar | B | 10 | — |
| T04 | Plan motoru çekirdeği ve property testleri | A | 16 | T02 |
| T05 | İçindekiler çıkarım testi: çevreden 20-30 sayfa, Haiku 5.5 ile Gemini Flash-Lite karşılaştırması, doğruluk ölçümü | B | 8 | — |
| T06 | Ton rehberi v1, kriz protokolü taslağı, PDR danışmanı bulma | Ortak | 6 | — |
| T07 | Aydınlatma ve açık rıza metinleri (şablondan, avukat ön görüşmesine hazır) | Ortak | 4 | — |
| T08 | Bekleme listesi ve kapsama anketi (Tally), koç ve öğretmen tanıdıklara duyuru | Ortak | 3 | — |
| **Sprint 1 · 2 - 15 Kasım** | | | **92** | |
| T09 | Kurulum akışı: alan, hedef, sınav tarihi, günlük süre, yaş kapısı | A | 10 | T02 |
| T10 | Kütüphane: barkod, katalog araması, "hızlı ekle" | A | 14 | T03 |
| T11 | İçindekiler fotoğrafı akışı (kamera → Edge Function → JSON → onay → görsel silme) | A+B | 12 | T05 |
| T12 | MEB OGM katalog tohumu (≈35 kitap) | B | 8 | T03 |
| T13 | Bugün ekranı, görev listesi, plan entegrasyonu | A | 12 | T04 |
| T14 | Check-in, neden seçimi, yeniden planlama | A | 10 | T13 |
| T15 | Yerel bildirimler | A | 5 | T13 |
| T16 | Auth (e-posta OTP), senkron, onay öncesi yerel mod | B | 8 | T03 |
| T31 | YouTube liste ekleme: link yapıştırma ve paylaş menüsü, Edge Function `youtube-import`, önbellek tabloları | B | 6 | T03 |
| T32 | Plan motorunda `video` birim türü, izleme hızı ve not payı, property testleri | A | 4 | T04 |
| T33 | Video görev kartı: başlık, süre, kanal, YouTube logosu, "YouTube'da aç", elle "izledim" | A | 3 | T13, T31 |
| **Sprint 2 · 16 - 29 Kasım** | | | **76** | |
| T17 | Sohbet Edge Function: Haiku 5.5, akışlı yanıt, bağlam kurma, PII ayıklama, mesaj sınırı | B | 12 | T16 |
| T18 | Güvenlik katmanı: kelime listesi, sınıflandırıcı, güvenli mod, yardım ekranı, olay kaydı | B | 14 | T06 |
| T19 | Güvenlik eval seti (200 mesaj) ve ölçüm | Ortak | 6 | T18 |
| T20 | Sohbet arayüzü ve "bildir" düğmesi | A | 8 | T17 |
| T21 | Veli onayı: link, wa.me paylaşımı, web onay sayfası, e-posta OTP, rıza kaydı | A+B | 16 | T16, T07 |
| T22 | Haftalık veli raporu (web + e-posta, pg_cron) | B | 8 | T21 |
| T23 | İlerleme: seri ve kitap bitirme yüzdesi | A | 5 | T14 |
| T24 | PostHog ve Sentry | B | 4 | — |
| T34 | YouTube önbelleğinin 30 günlük yenilenmesi (pg_cron), silinen ve özel videoların plandan çıkarılması; YouTube şartları ve gizlilik metinleri | B | 3 | T31 |
| **Sprint 3 · 30 Kasım - 13 Aralık** | | | **44** | |
| T25 | TestFlight, 15-30 kişilik kapalı beta (çevre ve koç) | Ortak | 4 | Sprint 2 |
| T26 | Beta düzeltmeleri | Ortak | 20 | T25 |
| T27 | App Store hazırlığı: ekran görüntüleri, gizlilik etiketleri, yaş derecelendirmesi, destek URL'si | Ortak | 8 | — |
| T28 | Uygulama içinden hesap ve veri silme (Apple zorunluluğu) | B | 4 | T16 |
| T29 | *(Zaman kalırsa)* Elle deneme neti girişi | A | 6 | — |
| T30 | App Store gönderimi (**14 Aralık**) + Google kapalı testinin başlatılması | Ortak | 2 | T26-T28 |

**Ocak görevleri — tam video özelliği (≈32 saat):**

| ID | Görev | Akış | Saat | Bağımlılık |
|---|---|---|---|---|
| T35 | Uygulama içi gömülü oynatıcı (react-native-youtube-iframe), politikaya uygun ayarlar | A | 8 | T33 |
| T36 | Oynatıcı olaylarıyla kişisel izleme ilerlemesi; "çocuklara özel" videolarda kapalı | A | 4 | T35 |
| T37 | Liste↔kitap bağlama, bölüm eşleme arayüzü, plan motorunda "önce video, sonra soru" | A+B | 10 | T32 |
| T38 | *(Politika incelemesinden sonra)* LLM ile eşleme önerisi + öğrenci onayı | B | 6 | T37 |
| T39 | Önerilen listeler (ekleyen öğrenci sayısına göre) | B | 4 | T31 |

**Yayın penceresi:** 14-20 Aralık. Apple'ın yıl sonu tatil döneminde (genelde 23-27 Aralık) inceleme yavaşlıyor; bu yüzden 20 Aralık sonrasına kalmamak gerekiyor.

**Takvim kayarsa kesme sırası** (ilk satır ilk kesilir): T29 deneme girişi → T23 ilerleme (yalnız seri kalır) → T11 içindekiler fotoğrafı (yalnız "hızlı ekle" kalır) → T22 veli raporu e-postası (yalnız wa.me linki kalır) → T12 katalog tohumu (yalnız özel kitap kalır). **Kesilmez:** plan motoru, check-in, güvenlik katmanı, veli onayı, sohbet ve YouTube hafif sürümü T31-T34 (owner kararları).

**Herkese açık yayın için "bitti" tanımı:** Property testleri yeşil; güvenlik eval seti eşiği geçiyor; PDR danışmanının yazılı onayı var; aydınlatma ve rıza metinleri yayında; hesap silme çalışıyor; en az 10 beta kullanıcısı 7 gün kullanmış.

### 2.17 Teknik riskler

| Risk | Önlem |
|---|---|
| Türkçe içindekiler okuma doğruluğu düşük çıkar | T05'te erken ölçülür; öğrenci onay ekranı kontrolü sağlar; "hızlı ekle" yedek yoldur |
| Haiku 5.5'in Türkçe koç tonu yetersiz kalır | Ton eval'i (20 örnek konuşma) yapılır; gerekirse sohbet Sonnet 5.5'e alınır (maliyet ≈20 kat ama mutlak değer hâlâ düşük) |
| Yerel bildirimler iOS'ta sınırlı | iOS'ta uygulama başına 64 bekleyen bildirim sınırı var; 7 gün × 3 bildirim = 21, sınırın altında |
| Apple yaş derecelendirmesinde AI sohbet 16+ çıkar | Derecelendirme anketi Sprint 0'da doldurulur; 16+ çıkarsa 11. sınıflar Ekran Süresi kısıtına takılabilir (risk tablosunda) |
| Ücretsiz katman sınırları (EAS build, Supabase) | Yerel Xcode build; ödeme açılınca Supabase Pro'ya geçilir |

---

## 3. İş modeli

### 3.1 Kullanıcı, ödeyen ve değer önerisi

| Taraf | Rolü | Ona ne söylüyoruz |
|---|---|---|
| Öğrenci (11., 12. sınıf, mezun) | Kullanıcı | "Elindeki kitaplara ve izlediğin YouTube derslerine göre her gün ne yapacağını söyleyen ve seni takip eden koç." |
| Veli | Ödeyen | "Çocuğunun gerçekten çalıştığını gör. Haftalık rapor, insan koçun onda biri fiyat." |
| Koç ve öğretmen (pilot) | Kanal (Faz 3'te müşteri) | "Öğrencinin sayfa aralıklarını elle girmeyi bırak." |

Bugün insan koçluk ayda 3.000-35.000 TL. Ücretsiz ChatGPT plan yapabiliyor ama öğrencinin kitabını bilmiyor, takip etmiyor ve akşam "neden yapmadın?" diye sormuyor. Ücretsiz YouTube ders listelerini öğrencinin kendi kitabıyla tek bir programda birleştirmek, ürünü "ücretsiz kaynakla çalışan öğrenciye koç disiplini" olarak konumluyor.

### 3.2 Pazar büyüklüğü (tahmin)

| Katman | Sayı | Varsayım |
|---|---|---|
| 2026 YKS başvurusu | 2.425.560 | Habertürk |
| Aktif hazırlanan, akıllı telefonu olan, basılı kitapla çalışan (SAM) | ≈1,33 milyon | Başvuranların %55'i (tahmin) |
| Ailesi aylık ≈300 TL ödeyebilecek olanlar | ≈333 bin | SAM'in %25'i (tahmin) |
| Teorik sezonluk gelir üst sınırı | ≈549 milyon TL | 333 bin × 1.647 TL brüt |

Baz senaryodaki Sezon 2 hedefi olan 15 bin aktif kullanıcı SAM'in **%1,1'i**; iyi senaryodaki 50 bin ise %3,75'i. Sayılar dar bir pazar payıyla bile anlamlı bir iş çıktığını gösteriyor. Asıl soru pazarın büyüklüğü değil, elde tutma ve dönüşüm.

### 3.3 Paketler ve fiyat (öneri; testle netleşecek)

| Paket | İçerik | Fiyat (KDV dahil) | Ne zaman |
|---|---|---|---|
| Ücretsiz | En fazla 2 kaynak (kitap ya da oynatma listesi), günlük plan, check-in, haftada 5 sohbet mesajı; güvenlik özellikleri ve video izleme her zaman açık | 0 TL | Aralık 2026'dan itibaren (betada sınırsız) |
| Premium aylık | Sınırsız kaynak (kitap ve oynatma listesi) ve sohbet, veli raporu, deneme analizi, tekrar motoru | **299 TL/ay** (bant: 199-349) | Şubat 2027 |
| Sınava kadar paketi (Sezon 1) | Premium, Şubat'tan sınava kadar tek ödeme | **799 TL** | Şubat-Haziran 2027 |
| Sezon paketi (Sezon 2) | Premium, Eylül-Haziran tek ödeme (≈%40 indirimli) | **1.799 TL** | Eylül 2027 |
| Koç eklentisi | Ayda 2-4 görüşme, koç AI raporuyla hazırlıklı gelir | İnsan koçluğun belirgin altında | Faz 2 |
| Kurum paneli | Koçluk kurumları ve dershaneler | Pazardaki koç yazılımları 199,99-1.099,99 TL/ay | Faz 3 |

**Sezon mantığı:** 20 Aralık'tan tahmini TYT tarihine (19 Haziran 2027) 181 gün var. Ödemenin açılacağı 1 Şubat'tan sınava 138 gün kalıyor. Sezon 1 bir **öğrenme sezonu**: ödeme isteği, fiyat ve dönüşüm ölçülür. Asıl gelir Sezon 2'de, yani 2028 Maarif kohortuyla gelir. ÖSYM'nin 2027 takvimi Kasım ortasında bekleniyor; sınav tarihi şimdilik tahmin.

### 3.4 Ödeme kanalına göre net gelir

| Paket | Brüt | KDV hariç | Uygulama içi net | Web net |
|---|---|---|---|---|
| Aylık | 299 | 249,17 | **195,91 (%65,5)** | **238,45 (%79,7)** |
| Sınava kadar | 799 | 665,83 | **523,51** | **637,62** |
| Sezon | 1.799 | 1.499,17 | **1.178,72** | **1.435,95** |

*Uygulama içi: KDV %20 düşülür, dijital hizmet vergisi %7,5, Apple payı %15. Web: KDV %20, iyzico ≈%3,5 + 0,25 TL (tahmin). 20/B stopajı (%15) ve gelir/kurumlar vergisi bu tabloya dahil değil.*

### 3.5 Birim ekonomisi

- **Brüt marj:** Ödeyen bir kullanıcının kendi AI ve altyapı maliyeti ayda ≈3-5 TL. Ama %5 dönüşümde her ödeyen kullanıcı, 19 ücretsiz kullanıcının AI maliyetini de taşıyor (≈22 TL/ay). Ödeyen başına aylık net gelir ≈122 TL olduğu için ödeme kesintilerinden sonra brüt marj **≈%80**. Ücretsiz katmanın sohbet kotası bu yüzden marjı belirleyen ana kaldıraç. Asıl maliyetler ise müşteri edinme ve kurucu zamanı.
- **Sezon başına LTV:** Ödeyenlerin yarısı sezon paketi, yarısı ortalama 5 ay aylık abonelik alırsa ve kanal dağılımı %60 web / %40 uygulama içi olursa, ödeyen başına **brüt 1.647 TL, net ≈1.220 TL**.
- **CAC tavanı:** LTV'nin üçte biri, **≈407 TL/ödeyen**. %5 ücretsizden ücretliye dönüşümle bu, **kurulum başına ≈20 TL**'ye denk geliyor. Meta reklamlarının Türkiye'de veliye kurulum başı maliyeti bilinmiyor; Sezon 2 öncesinde küçük bütçeli testlerle ölçülmeli.
- **Müşteri ömrü sınırı:** Ürün sınava bağlı; öğrenci en fazla 1-2 sezon kalıyor. Sezon paketi bu yüzden hem nakit akışı hem kayıp oranı için önemli.

### 3.6 Finansal senaryolar (tahmin)

**Sezon 1 — Şubat-Haziran 2027 (5 ay), yalnız 799 TL'lik paket, yalnız uygulama içi:**

| Senaryo | Aktif | Dönüşüm | Ödeyen | Brüt | Net | AI | Sabit | **Katkı** |
|---|---|---|---|---|---|---|---|---|
| Kötü | 300 | %3 | 9 | 7.191 | 4.712 | 1.812 | 6.194 | **−3.294** |
| Baz | 1.500 | %5 | 75 | 59.925 | 39.263 | 9.248 | 6.194 | **23.822** |
| İyi | 5.000 | %7 | 350 | 279.650 | 183.229 | 31.455 | 6.194 | **145.580** |

**Sezon 2 — Eylül 2027-Haziran 2028 (10 ay), paket karışımı, %60 web / %40 uygulama içi:**

| Senaryo | Aktif | Dönüşüm | Ödeyen | Brüt | Net | AI | Sabit | **Katkı** |
|---|---|---|---|---|---|---|---|---|
| Kötü | 3.000 | %3 | 90 | 148.230 | 109.810 | 36.234 | 56.385 | **17.191** |
| Baz | 15.000 | %5 | 750 | 1.235.250 | 915.086 | 184.950 | 56.385 | **673.750** |
| İyi | 50.000 | %7 | 3.500 | 5.764.500 | 4.270.400 | 629.100 | 56.385 | **3.584.914** |

*Varsayımlar: AI maliyeti ücretsiz kullanıcı için 1,17 TL/ay (kotanın tamamı kullanılıyor), Premium için 2,43 TL/ay. Sezon 1 sabit gideri Supabase Pro (5 × 1.239 TL). Sezon 2 sabit gideri aylık 5.639 TL: Supabase Pro + Vercel Pro + Apple'ın aylık payı + mali müşavir (≈3.000 TL/ay, tahmin). Katkıya kurucu emeği, pazarlama (CAC), stopaj ve vergiler dahil değil. 10 bin MAU'nun üzerinde LLM dışı altyapı da büyür (Bölüm 2.15): baz senaryodan ≈30 bin TL, iyi senaryodan ≈0,2 milyon TL daha düşülmeli.*

**Yorum:** Sezon 1 para kazandırmaz ama zarar da ettirmez; değeri ölçümde. Sezon 2'nin sonucunu belirleyen iki sayı var: **aktif kullanıcıyı Eylül'e kadar 15 bine taşımak** (pazarlamanın işi) ve **%5 dönüşüm** (değerin ve veli raporunun işi). Kötü senaryo bile nakit yakmıyor, çünkü sabit giderler küçük.

### 3.7 Nakit bütçe

**MVP'ye kadar (Ekim-Aralık 2026), tavan 10 bin TL:**

| Kalem | TL | Not |
|---|---|---|
| Apple Developer Program (yıllık 99$) | 4.905 | Zorunlu; iOS öncelikli |
| Alan adı (yıllık) | 595 | Veli sayfaları ve e-posta için |
| LLM test ve beta tamponu (20$) | 991 | Gerçek kullanım ≈5$/ay |
| **Aralık toplamı** | **6.491** | |
| Google Play (tek seferlik 25$), Ocak | 1.239 | Android yayını |
| **Ocak dahil toplam** | **7.730** | ≈2.270 TL tampon kalıyor |
| Kitap satın alma | 0 | Çevreden ödünç; MEB PDF'leri |
| Öğretmen ve editör | 0 | Kademe tablosu MVP'de gerekmiyor; Ocak'ta kitle kaynaklı katalogla değerlendirilecek |
| Avukat | 0 | Ücretsiz ön görüşme; ücretli görüş Ocak'ta ayrı karar |
| Şirket | 0 | Ödemenin A aşaması şirketsiz; şirket B aşamasında |

**Ödeme açıldıktan sonra (Şubat 2027-):** Supabase Pro 1.239 TL/ay; ücretli avukat görüşü (tutar bilinmiyor, teklif alınmalı); şirket kurulunca mali müşavir (≈3.000 TL/ay, tahmin) ve Vercel Pro (991 TL/ay). Bunlar Sezon 1 gelirinden karşılanacak şekilde sıralandı. Gelir gelmezse şirket ve web ödeme ertelenir; uygulama içi satın alma tek başına çalışmaya devam eder.

**Ücretsiz destek ve hibe:** TÜBİTAK 1512 BiGG ve üniversite teknoparklarındaki kuluçka programları, kurucuların zaman ve bütçe kısıtına uygun dış finansman ve hukuk desteği kaynakları. Başvuru takvimleri ve şartları ayrıca araştırılmalı.

### 3.8 İlk kullanıcılar ve büyüme

Pazarlama işleri sonraya bırakıldı (owner kararı). Yine de takvim gereği ertelenemeyecek asgari işler var:

1. **Kapalı beta (Aralık):** Kurucuların çevresinden ve koç, dershane, öğretmen tanıdıklarından 15-30 öğrenci. Bir koçla pilot teklifi: "Öğrencilerinin planını uygulama çıkarsın, sen haftalık raporu gör, ücretsiz."
2. **Google Play kapalı testi:** Kişisel geliştirici hesabında **12 testçi 14 gün kesintisiz** kapalı test şartı var; testçi sayısı 12'nin altına düşerse süre sıfırlanıyor. Android kullanan beta öğrencileriyle 14 Aralık'ta başlarsa Play yayını Ocak başında olur.
3. **Bekleme listesi ve kapsama anketi (Sprint 0):** Hedef 100-150 yanıt. Anket, ilk kitlenin ve öncelikli kitap listesinin de kaynağı.
4. **Sezon 2 hazırlığı (Mart-Ağustos 2027):** Sponsorsuz TikTok ve YouTube içerikleri, öğrenci toplulukları (r/YKSDers, r/liseliler, Technopat), okul rehberlik servisleri, veliye yönelik küçük bütçeli Meta reklam testleri.

### 3.9 Gelir genişlemesi ve ortaklıklar

- **Faz 2, insan koç eklentisi:** Koç, AI'ın üç aylık raporuyla seansa hazır gelir. Gelir paylaşımlı pazar yeri modeli.
- **Faz 3, kurum paneli:** Bugün sayfa aralıklarını elle giren koçluk kurumları. Sezon 1'deki koç pilotu bu ürünün ilk müşteri görüşmesi olur.
- **Yayınevleri ve FERNUS (ölçekten sonra):** Teklif paketi; yalnız metadata kullanılacağı güvencesi, satış atfı, yayınevinin video çözüm uygulamasına derin link ve anonim kullanım verisi. Lansmanın ön koşulu değil, ölçeğin ödülü.
- **Affiliate riski:** Kitap satışından komisyon almak, öğrencinin "bu kitap sana uygun" önerisine duyduğu güveni bozabilir. Öneriler komisyondan bağımsız kalmalı; affiliate yapılacaksa açıkça etiketlenmeli.

### 3.10 Rekabet ve hendek

| Grup | Örnekler | Fark |
|---|---|---|
| İnsan koç merkezli | Kopilot Rehberlik, Tahta | Pahalı; ölçeklenmesi insana bağlı |
| İçerik platformları | Kunduz, Doping Hafıza, Pakodemy | Öğrencinin basılı kitabını bilmiyor |
| Yeni AI koçlar | Rota AI (10 Ekim 2026), Koç'a Sor, Mentoras | Konu ve süre bazlı. Rota AI'ın mimarisi bizimkine çok benziyor: kural motoru + AI dil katmanı |
| Kitap takip denemeleri | Karınca, Kitap Koçum | Barkod ya da tek yayınevi; ölçek yok |

**Hendek motor değil, veri ve davranış:** (1) Her yıl yeni baskıları rakiplerden hızlı yakalayan kitle kaynaklı katalog hattı; (2) 2028 Maarif taksonomisini ilk günden taşımak; (3) "hangi öğrenci hangi kitabı ne hızda bitiriyor" verisi; (4) veli raporunun yarattığı ödeme alışkanlığı; (5) hangi YouTube listesinin hangi kitapla birlikte kullanıldığı bilgisi (YouTube API verisi değil, kendi kullanım verimiz). Rota AI aynı motoru zaten kuruyor; bu yüzden hız önemli. **Aralık yayını bu açıdan doğru karar.**

---

## 4. Yol haritası

| Tarih | Kilometre taşı | Çıktı |
|---|---|---|
| 22 Ekim - 1 Kasım | Sprint 0 | Repo, şema, plan motoru çekirdeği, içindekiler testi sonucu, ton rehberi, rıza metni taslakları, Apple hesabı |
| 2 - 15 Kasım | Sprint 1 | Kurulum, kütüphane, günlük döngü, bildirimler, auth, YouTube liste ekleme |
| ≈14 Kasım | ÖSYM 2027 takvimi (beklenen) | Sınav tarihi uygulamada güncellenir |
| Kasım | Avukat ön görüşmesi (ücretsiz), PDR danışmanı | Hukuk ve güvenlik görüşü |
| 16 - 29 Kasım | Sprint 2 | Sohbet, güvenlik katmanı, veli onayı ve raporu |
| 30 Kasım - 13 Aralık | Sprint 3, kapalı beta (TestFlight) | Beta düzeltmeleri, App Store hazırlığı |
| **14 Aralık** | App Store gönderimi, Google kapalı testi başlar | — |
| **≤20 Aralık** | **MVP App Store'da (ücretsiz)** | — |
| Ocak 2027 | Android yayını, tam video özelliği (T35-T39), FSRS, deneme analizi, katalog terfisi, ödeme altyapısı, ücretli avukat görüşü, 20/B teyidi | — |
| 1 Şubat 2027 | **Ödeme açılır** (uygulama içi; sınava kadar paketi + aylık) | Sezon 1 ölçümü |
| ≈19-20 Haziran 2027 | YKS 2027 (tahmini) | Sonuç verisi toplanır |
| Haziran-Ağustos 2027 | Maarif taksonomisi, şirket + web ödeme, Sezon 2 pazarlaması | — |
| Eylül 2027 | **Sezon 2**: sezon paketi, 2028 kohortu | Asıl gelir sezonu |
| 2028 | Faz 2 insan koç, Faz 3 kurum paneli | — |

---

## 5. KPI'lar ve karar eşikleri

Fizibilitedeki dört kapı testi bu takvime göre yeniden tanımlandı:

| Test | Ölçüm | Eşik | Tutmazsa |
|---|---|---|---|
| Çıkarım kalitesi (T05, Ekim sonu) | 20-30 içindekiler sayfası, elle etiketlenmiş doğru cevaplarla | Kod doğrulamasından sonra sayfa numarası doğruluğu ≥%95; kullanıcının düzeltme süresi <60 sn | Fotoğraf yolu "deneysel" etiketlenir, "hızlı ekle" birincil olur |
| Kapsama (Sprint 0-1) | 100-150 anket yanıtı | Öğrencilerin ana kitaplarının ≥%70'i "hızlı ekle" ya da fotoğrafla 3 dakikanın altında eklenebiliyor | Katalog terfisi Ocak'ta öne çekilir |
| Hukuk (Kasım) | Ücretsiz ön görüşme | Olgu şeması + geçici işleme + veli onayı modeline kırmızı bayrak yok | İlgili özellik yayından önce kapatılır |
| **Değer (Aralık beta)** | 15-30 öğrenci | D7 ≥%40; günlerin ≥%50'sinde check-in; görüşmelerde kitap bazlı plan sade plana açıkça tercih ediliyor | **D7 <%20 ve plan kullanılmıyorsa ürün sorunu var:** yayın ertelenir, döngü yeniden tasarlanır |

**Sezon 1 metrikleri:**

| Metrik | Hedef (baz) |
|---|---|
| D7 / D30 elde tutma | ≥%40 / ≥%20 |
| Check-in yapılan günlerin oranı (aktif kullanıcıda) | ≥%60 |
| Haftalık plan tamamlama | ≥%65 |
| Veli onayı tamamlama (18 yaş altı) | ≥%60 |
| Veli raporu açılma oranı | ≥%50 |
| Ücretsizden ücretliye dönüşüm | ≥%5 |
| Kitap ekleme başarısı (<3 dk) | ≥%80 |
| Oynatma listesi ekleyen aktif kullanıcı oranı | Betada ölçülür, hedef Ocak'ta belirlenir |
| Video görevlerinin tamamlanma oranı | ≥%60 |
| Güvenlik: akut olayların 24 saatte incelenme oranı | %100 |
| Güvenlik eval'inde akut sınıfta kaçırma | ≤%2 |

---

## 6. Riskler ve önlemler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| 2 yarı zamanlı kurucu Aralık'a yetişemez | Orta-yüksek | Yüksek | Önceden sıralı kesme listesi; haftalık görev ilerlemesinin takibi; 14 Aralık gönderimi sabit |
| Serbest sohbette reşit olmayan bir kullanıcıyla kriz yaşanır | Düşük | Çok yüksek | 8 katmanlı güvenlik; PDR onayı olmadan herkese açık yayın yok; eval seti; 24 saatte insan incelemesi |
| Veli onayının sahte verilmesi | Orta | Orta | Beyan + e-posta OTP; avukat görüşü; rıza kayıtları |
| KVKK yurt dışı aktarım yükümlülükleri | Orta | Yüksek | PII ayıklama; ayrı rızalar; standart sözleşme ve bildirim süreci; avukat |
| Apple yaş derecelendirmesi (AI sohbet) 16+ çıkar | Orta | Orta | Anket Sprint 0'da doldurulur; gerekirse sohbet ayarları sıkılaştırılır |
| Google 12 testçi × 14 gün şartı Android'i geciktirir | Orta | Düşük | Kapalı test 14 Aralık'ta başlar; testçi sayısı 15+ tutulur |
| Öğrenci 2-3 hafta sonra bırakır | Yüksek | Yüksek | 30 saniyelik check-in, proaktif takip, veli raporu; D7/D30 birinci metrik |
| Türkçe içindekiler okuması zayıf kalır | Orta | Orta | "Hızlı ekle" yedek yol; kullanıcı onayı; kitle kaynaklı doğrulama |
| Sezon 1 dönüşümü düşük çıkar | Orta | Orta | Sezon 1 öğrenme sezonu; fiyat ve paket testleri; asıl hedef Sezon 2 |
| Rakipler (Rota AI) hızlanır | Orta | Orta | Aralık yayını; veri hattı ve Maarif taksonomisi |
| Telif: öğrencinin soru fotoğrafı göndermesi | Orta | Orta | Sohbet yalnız metin kabul eder; içindekiler görseli işlenip silinir |
| 20/B istisnasının App Store gelirine uygulanmaması | Orta | Orta | Mali müşavir teyidi Ocak'ta; olmazsa şirket öne çekilir |
| YouTube API politikası (30 gün saklama, türetilmiş veri yasağı, izleme için ücret yasağı) | Orta | Orta | Önbellek yenileme; kalıcı olarak yalnız `video_id`; otomatik eşleme inceleme sonrasına; izleme ücretsiz; hafif sürüm izleme verisi toplamıyor |
| Listedeki videolar silinir, gizlenir ya da gömülemez | Orta | Düşük | 30 günlük yenilemede plandan çıkarılır; gömülemeyenlerde "YouTube'da aç" |
| Bütçenin aşılması | Düşük | Orta | Ücretsiz katmanlar; ücretli plana yalnız gelirle geçiş |

---

## 7. Açık kararlar

| # | Karar | Önerimiz | Son tarih |
|---|---|---|---|
| 1 | **Kurucu sözleşmesi:** hisse, fikri mülkiyet, Apple hesabının kimin adına olacağı, gelir paylaşımı | Şablonla yazılı sözleşme (0 TL), şimdi | 1 Kasım |
| 2 | Şirket kuruluşunun zamanı | A aşaması şirketsiz (20/B + uygulama içi); şirket aylık net ≈15 bin TL'yi geçince ya da Eylül 2027'den önce | Ocak |
| 3 | Fiyat bandı (199 / 299 / 349) | Şubat'ta 799 TL'lik sınava kadar paketi + 299 TL aylık; Mart'ta A/B testi | Ocak |
| 4 | Kaygı modülü MVP'de ne kadar | Yalnız güvenli mod ve yönlendirme; egzersizler uzmanla sonra | Karar verildi (öneri) |
| 5 | AI koçun ton sınırları | Ton rehberi v1 Sprint 0'da; PDR danışmanı onaylar | 1 Kasım (taslak) |
| 6 | PDR danışmanı ve içerik editörü ne zaman | PDR danışmanı 15 Kasım'a kadar (gönüllü, tanıdık ya da küçük hisse); editör Ocak'ta katalog büyürken | 15 Kasım |
| 7 | Akut riskte veliye otomatik bildirim | **OPEN QUESTION.** MVP varsayılanı otomatik bildirim yok, tek dokunuşla haber verme var; PDR danışmanıyla netleşecek | 29 Kasım |
| 8 | Marka ve App Store adı | "YKS AI Koç" çalışma adı; App Store adı ve alan adı Sprint 0'da | 1 Kasım |
| 9 | Barındırma bölgesi | Supabase AB (Frankfurt); Türkiye içi barındırma ölçekten sonra değerlendirilir | Karar verildi (öneri) |
| 10 | Teknoloji: Swift mi Expo mu | Expo (Bölüm 2.2) | 22 Ekim |
| 11 | Ücretsiz katmanın sınırı | 2 kaynak (kitap ya da oynatma listesi) + haftada 5 sohbet mesajı; güvenlik özellikleri ve video izleme her zaman açık | Ocak |
| 12 | Liste↔kitap otomatik eşleme önerisi (T38) | **OPEN QUESTION.** YouTube politikası III.E.4.h'deki "türetilmiş veri" yasağı açısından incelenmeli. O zamana kadar eşlemeyi öğrenci elle yapar | Ocak |

---

## 8. İlk 14 gün yapılacaklar (22 Ekim - 4 Kasım)

**Ortak:**
- [ ] Bu raporu okuyup açık kararları işaretlemek (özellikle 1, 8, 10)
- [ ] Kurucu sözleşmesi taslağı
- [ ] Apple Developer bireysel kaydı (T01)
- [ ] Ton rehberi v1 ve kriz protokolü taslağı (T06); PDR veya psikolog tanıdık listesi
- [ ] Aydınlatma ve rıza metni taslakları (T07); ücretsiz avukat ön görüşmesi için randevu
- [ ] Bekleme listesi ve kapsama anketi; koç ve dershane tanıdıklarına pilot mesajı (T08)
- [ ] Çevreden 20-30 kitabın içindekiler fotoğrafı (`data-private/`, commit edilmez)

**A akışı:**
- [ ] Monorepo, Expo uygulaması, CI (T02)
- [ ] Plan motoru çekirdeği ve property testleri (T04)
- [ ] Kurulum ekranlarına başlangıç (T09)

**B akışı:**
- [ ] Supabase AB projesi, şema v1, RLS (T03)
- [ ] İçindekiler çıkarım testi ve model kararı (T05)
- [ ] MEB OGM kitaplarının listesi ve içindekiler kontrolü (T12'ye hazırlık)
- [ ] YouTube Data API anahtarı (Google Cloud projesi), kota ve politika kontrolü (T31'e hazırlık)

---

## 9. Kaynaklar

**Proje belgeleri:** [Ürün ve iş modeli v1](sources/2026-10-15-urun-ve-is-modeli-v1.pdf) · [Kaynak kitap verisi fizibilitesi](sources/2026-10-08-kaynak-kitap-verisi-fizibilitesi.md). Fizibilitedeki tüm kaynaklar (MEB, FSEK, KVKK, rakipler, Studyplus ve diğerleri) bu rapor için de geçerli.

**Bu rapor için 21 Ekim 2026'da kontrol edilenler:**
- Döviz kuru, 19 Ekim 2026: [İşçi Haber](https://www.iscihaber.net/ekonomi/19-ekim-2026-dolar-ne-kadar-euro-bugun-kac-tl-oldu/273006)
- Claude fiyatları (Haiku 5.5: 0,10$/0,50$; Sonnet 5.5: 2$/10$ per MTok): Anthropic API belgeleri, [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Gemini 2.5 Flash-Lite fiyatı (0,10$/0,40$, üçüncü taraf derlemeler): [MorphLLM](https://www.morphllm.com/gemini-api-pricing), [AnotherWrapper](https://anotherwrapper.com/llm-pricing/gemini-2.5-flash-lite)
- Türkiye mobil işletim sistemi payları (Android %74,18, iOS %25,81, Temmuz 2026): [StatCounter](https://gs.statcounter.com/os-market-share/mobile/turkey)
- Supabase plan sınırları: [Jetadmin, Supabase Pricing 2026](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/)
- Expo SDK 56, RN 0.85: [Expo changelog](https://expo.dev/changelog/sdk-56). SDK 57 tek kaynakta geçiyor; kurulumda doğrulanacak.
- Google Play 12 testçi / 14 gün şartı (üçüncü taraf): [Testers Community](https://www.testerscommunity.com/blog/google-play-closed-testing-requirements-2026), [Choicely](https://www.choicely.com/blog/google-play-12-tester-rule)
- GVK mükerrer 20/B, 2026 sınırı 5,3 milyon TL ve %15 stopaj: [MuhasebeNews](https://www.muhasebenews.com/?p=169373), [Vergi Merkezi](https://vergimerkezi.com.tr/?p=4673). Mobil uygulama kapsamı mali müşavirle teyit edilecek.
- Apple'ın Türkiye'de dijital hizmet vergisini geliri hesaplarken düşmesi (2020): [9to5Mac](https://9to5mac.com/2020/09/01/app-store-prices-increase-chile-mexico-saudi-arabia-turkey/)
- iyzico komisyon aralığı (üçüncü taraf, teklif alınmalı): [Ticimax](https://www.ticimax.com/blog/iyzico-komisyon-oranlari)
- WhatsApp Business Platform fiyatlandırması (Türkiye için utility fiyatı bulunamadı): [Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- YouTube API Hizmetleri Geliştirici Politikaları (30 gün saklama, türetilmiş veri, oynatıcı, ücretlendirme ve gizlilik kuralları): [Google for Developers](https://developers.google.com/youtube/terms/developer-policies)
- 2027 ÖSYM takvimi henüz yayımlanmadı; tahmini tarihler: [Dünya](https://www.dunya.com/gundem/2027-osym-takvimi-yayimlandi-mi-2027-ysk-kpss-msu-dgs-ne-zaman-yapilacak-haberi-844150), [Unikazan](https://unikazan.com/blog/2027-yks-sinav-takvimi-basvuru-sinav-sonuc-tarihleri/)
- ALO 183 Sosyal Destek Hattı (7/24; aile, kadın, çocuk): [Aile ve Sosyal Hizmetler Bakanlığı](https://www.aile.gov.tr/haberler/alo-183e-gecen-yil-kadina-yonelik-hizmetler-alaninda-43-bin-421-basvuru-yapildi/). Türkiye'de gençlere özel ulusal bir kriz hattı doğrulanamadı; acil durumda 112. Yardım metinleri PDR danışmanıyla doğrulanacak.

**Doğrulanmayan ve tahmin olarak bırakılanlar:** YouTube Data API'nin çağrı başına kota maliyeti, RevenueCat ücretsiz katman eşiği, Vercel ve Resend katman ayrıntıları, mali müşavir ücreti, Türkçe token şişme katsayısı (×1,6), dönüşüm ve elde tutma hedefleri, pazar payı yüzdeleri, Meta reklamlarında kurulum başı maliyet.
