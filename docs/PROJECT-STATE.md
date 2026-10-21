# YKS AI Koç — Proje Durumu

Son doğrulama: **2026-10-21**. Bu belge projenin güncel durumunu tutar; değişiklik günlüğü değildir.

## Güncel aşama

**Başlangıç kararı verildi, kod yok.** [Final rapor](REPORT-2026-10-21-final-teknik-ve-is-modeli.md) yazıldı. Sıradaki iş Sprint 0 (22 Ekim - 1 Kasım): T01-T08.

Hedef: **MVP ≤20 Aralık 2026'da App Store'da (ücretsiz)**. App Store gönderimi 14 Aralık.

## Repo durumu

```
/
  README.md  AGENTS.md  CLAUDE.md  .gitignore
/docs
  PROJECT-STATE.md                                   bu dosya
  REPORT-2026-10-21-final-teknik-ve-is-modeli.md     başlangıç kararı (PRODUCT yazılana kadar kanonik referans)
  REPORT-2026-10-21-final-teknik-ve-is-modeli.pdf    raporun paylaşılabilir PDF'i
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
| Bütçe | Lansmana kadar olabildiğince az, en fazla 5-10 bin TL |
| Kitle | Herkes (11., 12. sınıf, mezun); veli onayı MVP'de |
| Platform | iOS öncelikli; Swift olabilir, olmazsa React Native ile iki platform. **Öneri: Expo** (rapor 2.2). Kurucular onaylayınca bu satır güncellenecek. |
| AI koç | Serbest sohbet MVP'de |
| Ödeme | Veli web'den öder + uygulama içi seçenek de var. **Öneri:** Şubat'ta önce uygulama içi (şirketsiz, GVK 20/B), web ödeme şirket kurulunca (rapor 2.13) |
| İlk kullanıcılar | Kendi çevremiz + koç, dershane, öğretmen tanıdıklar |
| GitHub | `CodderEnesG/yks-ai-koc` private, `mhmmcoding` collaborator |
| YouTube oynatma listesi (Muhammed) | MVP'de hafif sürüm: link yapıştırılır, videolar süreleriyle göreve dönüşür, "YouTube'da aç" ile izlenir. Tam özellik (oynatıcı, izleme takibi, liste↔kitap eşlemesi) Ocak planında. Video ile kitabın sırasını öğrenci seçer. |

## Güncel teknik kararlar (öneri, kod başlarken teyit edilecek)

Expo + TypeScript (mobil) · Supabase AB/Frankfurt (Postgres, Auth, Edge Functions, RLS) · Next.js (veli onayı ve raporu, kürasyon paneli) · Claude Haiku 5.5 (sohbet, sınıflandırma, içindekiler, özet) + Sonnet 5.5 (hakem) · plan motoru saf TS paketi, cihazda ve sunucuda aynı · yerel bildirimler · YouTube Data API v3 (önbellek ≤30 gün; Ocak'ta resmi gömülü oynatıcı) · ts-fsrs (Ocak) · RevenueCat + StoreKit (Şubat) · PostHog EU + Sentry. Ayrıntılar rapor 2.2-2.15'te.

`ARCHITECTURE.md` henüz yok. Kod başlamadan önce gerekmiyor; rapor bölüm 2 bu işi görüyor. Rapor ile kod ayrışmaya başlayınca yazılacak.

## Açık kararlar

Tam tablo ve önerilerimiz rapor bölüm 7'de. Son tarihi yakın olanlar:

| # | Karar | Son tarih |
|---|---|---|
| 1 | Kurucu sözleşmesi (hisse, IP, Apple hesabı kimin adına, gelir paylaşımı) | 1 Kasım |
| 8 | Marka ve App Store adı, alan adı | 1 Kasım |
| 10 | Swift mi Expo mu (öneri: Expo) | 22 Ekim |
| 5 | Ton rehberi v1 | 1 Kasım (taslak) |
| 6 | PDR danışmanı | 15 Kasım |
| 7 | **OPEN QUESTION:** Akut riskte veliye otomatik bildirim gidecek mi | 29 Kasım |
| 12 | **OPEN QUESTION:** Liste↔kitap otomatik eşleme önerisi YouTube'un "türetilmiş veri" yasağına (III.E.4.h) takılıyor mu | Ocak |

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

İki yarı zamanlı kurucuyla Aralık takvimi dar (YouTube hafif sürümüyle ≈267 saat iş, ≈225-300 saat kapasite). Serbest sohbet ve reşit olmayan kullanıcılar birlikte en büyük ürün riski; PDR onayı yayın koşulu. KVKK yurt dışı aktarımı için avukat görüşü bekleniyor. Tam liste rapor bölüm 6'da.
