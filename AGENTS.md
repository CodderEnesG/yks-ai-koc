# YKS AI Koç ajan rehberi

YKS AI Koç, öğrencinin kendi kitaplarına göre sayfa ve test düzeyinde günlük plan çıkaran, planı takip eden ve veliye haftalık rapor gönderen bir iOS/Android uygulaması. Repo şu an ürün ve karar belgelerini içeriyor; uygulama kodu Sprint 0'da başlıyor.

## İşten önce oku

- [docs/PROJECT-STATE.md](docs/PROJECT-STATE.md) ile başla.
- Teknik ya da ürün davranışıyla ilgili her iş öncesinde [final raporu](docs/REPORT-2026-10-21-final-teknik-ve-is-modeli.md) oku. Özellikle şu bölümler: 1.3 (değişmez kurallar), 2 (mimari), 2.10 (güvenlik), 2.11 (KVKK ve veli onayı).
- [README.md](README.md) belge haritasını içerir.

## Otorite ve kararlar

- `PRODUCT.md` yazılana kadar **final rapor** kanonik ürün ve teknik referans sayılır. PRODUCT yazıldığında rapor tarihli kaynağa dönüşür ve PRODUCT kazanır.
- **PROJECT-STATE** güncel durumu, açık kararları ve yol haritasını tutar.
- `docs/sources/` altındaki belgeler tarihli kaynaklar: kanıt ve gerekçe içerirler, karar değildirler. Final raporla çelişirlerse final rapor kazanır.
- Rapordaki "owner kararı" ifadesi kurucuların verdiği kararlar demek. Bunları sessizce değiştirme; değişiklik önermek için PROJECT-STATE'teki açık kararlara ekle.
- Kararları sessizce uydurma. İşaretleme kuralları:
  - **OPEN QUESTION:** çözülmemiş soru.
  - **DECISION TO TEST:** kaynağın bilerek teste bıraktığı karar.
  - **NOT DEFINED:** tanımı olmayan tasarım.
  - **ERTELENDİ:** bilerek kapsam dışına bırakılan.
- Görev kimlikleri (T01-T39) kalıcıdır. Kaldırılan görev silinmez, "kaldırıldı" diye işaretlenir; yeni görev sıradaki numarayı alır.

## Değişmez ürün kuralları

Bunlar hiçbir kalite, hız veya maliyet gerekçesiyle gevşetilmez:

- **Soru metni, çözüm ve sayfa görüntüsü yok.** Ne katalogda ne sohbette. Sohbet yalnız metin kabul eder.
- **Forum ve sosyal medya kazıma yok.**
- **Planı kural motoru hesaplar, AI değil.** LLM plan rakamı üretmez.
- **Kriz sinyali AI'a tek başına bırakılmaz.** Deterministik liste ve sınıflandırıcı birlikte çalışır; akut riskte LLM yanıt üretmez, PDR danışmanının onayladığı sabit metin gösterilir.
- **İçindekiler fotoğrafı işlenip silinir** (en geç 24 saat). Paylaşılan katalogda yalnız olgu şeması tutulur, ham başlık metni kopyalanmaz.
- **LLM'e kişisel veri ayıklanmadan gitmez** (ad, e-posta, telefon, okul, şehir).
- **Veli onayı gelmeden 18 yaş altı kullanıcının verisi sunucuya gitmez.**
- **Sohbet içeriği hiçbir zaman veliye gösterilmez.**
- **YouTube API Hizmetleri politikalarına uyulur.** Video indirilmez, arka planda oynatılmaz, oynatıcı değiştirilmez. API verisi (başlık, süre) en fazla 30 gün önbellekte tutulur. Video izleme ücretli duvarın arkasına konmaz. API verisinden türetilmiş veri seti üretilmez (rapor 2.8).
- **Sert ton davranışa yöneliktir, kişiye değil.** Güvenli modda sertlik kapanır.
- PDR veya klinik bir danışmanın yazılı onayı olmadan herkese açık yayın yapılmaz.

## Kanıt disiplini

- Fiyatlar, dönüşüm oranları, pazar payları ve gelir rakamları tahmindir. Öyle yaz ve varsayımı yanına koy.
- App Store puanı; indirme, MAU ya da gelir demek değildir.
- "Kamuya açık iz bulunamadı", "hiç yapılmadı" anlamına gelmez.
- Telifli materyal (kitap içindekiler fotoğrafları, sayfa görüntüleri, sorular) `data-private/` altında tutulur ve **asla commit edilmez**.
- Sırları (API anahtarları, `.env`) commit etme.

## Kod başladığında

- Monorepo düzeni ve stack final raporun 2.2-2.4 bölümlerinde. Yeni bir teknoloji eklemeden önce PROJECT-STATE'e kayıt düş.
- Kütüphane eklemeden önce [TECH-STACK](docs/TECH-STACK.md)'e bak. Expo paketleri `npx expo install` ile kurulur. `@react-navigation/*` import edilmez; Expo Router v56'dan beri `expo-router/react-navigation` kullanılır. Sürümler sabitlenir; TypeScript 6.x'te kalır.
- `packages/plan-engine` saf ve deterministiktir; property testleri CI'da zorunludur (rapor 2.6).
- `packages/safety` eval seti, istem veya model her değiştiğinde yeniden koşulur (rapor 2.10).
- Supabase tablolarında RLS kapalı tablo olmaz.

## Doğrula ve devret

- Belge değişikliklerinde bağlantıları, görev kimliklerini ve belgeler arası tutarlılığı kontrol et.
- Neyin doğrulandığını, neyin doğrulanmadığını dürüstçe raporla.
- Önemli bir iş kararları, kapsamı, sıradaki adımları veya bilinen sorunları anlamlı biçimde değiştirdiyse PROJECT-STATE'i güncelle. Kronolojik değil, güncel tut.
