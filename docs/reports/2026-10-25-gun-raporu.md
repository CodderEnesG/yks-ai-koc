# Gün raporu — 24-25 Ekim 2026

Tarihli kayıt, kanonik değil. Güncel durum [PROJECT-STATE](../PROJECT-STATE.md)'te, stack [TECH-STACK](../TECH-STACK.md)'te.

## Özet

Uygulamanın günlük döngüsü çalışır hâlde: kurulum → kitap ekleme → bugünün planı → check-in ve neden → yeniden planlama → bildirimler → seri ve ilerleme. Sprint 0'ın kod tarafı bitti, Sprint 1'in A akışı büyük ölçüde bitti. Supabase projesi kuruldu, şema ve katalog tohumu uzakta.

| Görev | Durum | Commit |
|---|---|---|
| T09 Kurulum akışı | Tamam | `c41f382` |
| T05 İçindekiler okuma ölçümü | Tamam: Haiku 5.5 seçildi, Gemini bırakıldı | `7d1d951`, `a6b1f27` |
| T03 Supabase şema v1 + RLS | Tamam, uzak projede | `55189e0` |
| T10 Kütüphane | Tamam (barkod gerçek cihazda denenmedi) | `d2c9076` |
| T12 (ilk parça) MEB katalog tohumu | 32 kitap, 670 birim; uzak projede | `d2c9076` |
| T13 Bugün ekranı | Tamam | `b52d2a9` |
| T14 Check-in, neden kuralları | Tamam (destek metni T18'de) | `658292e` |
| T15 Yerel bildirimler | Tamam, **push edilmedi** | `bc9102e` |
| T32 Video birimi (plan motoru) | Tamam, **push edilmedi** | `21db96c` |
| T23 Seri ve ilerleme | Tamam, **push edilmedi** | `5f6c8c8` |

Testler: plan motoru 42, mobil 32 birim testi, 19 pgTAP RLS testi, 5 Maestro uçtan uca akış (iOS simülatör). CI son push'ta yeşildi.

## Öne çıkan bulgular

- **İçindekiler okuma:** Telefon fotoğrafına benzetilmiş 32 görüntüde Haiku 5.5 sayfaların 669/669'unu doğru okudu, Gemini 3.5 Flash-Lite %99,0. Kitap başı ≈0,0013$ (tahmin). Gerçek fotoğraflarla kontrol T11'den önce.
- **Supabase varsayılan yetkileri:** Eski projelerde her role her yetki veriliyor; geri alınıp açık GRANT verildi, yetki ve RLS iki katman. Bir öğrencinin başkasının kaynağına görev bağlayabildiği açık testle yakalanıp kapatıldı.
- **Testlerle yakalanan arayüz hataları:** iOS sayı klavyesinde "Devam" klavyenin altında kalıyordu; uzun formlarda alanlar klavyenin arkasında kalıyordu; bölüm sayısı bölünen görevde fazla sayılıyordu; "Yapamadım" düğmesi sığmıyordu. Hepsi düzeltildi.
- **Benim hatalarım:** Metro'yu `CI=1` ile başlatıp yarım saat eski kodu test ettim. Maestro birden çok simülatör açıkken başka bir projenin simülatörüne gitti. İkisi de TECH-STACK'e not edildi.

## Genel ilerleme (25 Ekim akşamı)

Hedef: 14 Aralık App Store gönderimi. Saatler raporun görev listesindeki tahminler.

| Durum | Görevler | Tahmini saat |
|---|---|---|
| Bitti | T02, T03, T04, T05, T09, T10, T13, T14, T15, T23, T32 | ≈100 / 267 |
| Kısmen | T12 katalog: 32 MEB kitabı yüklü, konu taksonomisi yok | — |
| Kalan kod işi | T11 fotoğraf, T16 giriş + senkron, T17-T20 sohbet ve güvenlik, T21-T22 veli onayı ve raporu, T24 analitik, T28 hesap silme, T31/T33/T34 YouTube | ≈130 |
| Kurucularda | T01 Apple, T06 ton rehberi + PDR, T07 rıza metinleri, T08 bekleme listesi, marka | — |

Çalışan döngü: kurulum → kitap ekleme (barkod, katalog, hızlı ekle) → bugünün planı → check-in + neden → yeniden planlama → bildirimler → seri ve kitap yüzdesi. Sprint 0'ın kod tarafı bitti, Sprint 1'in A akışı büyük ölçüde bitti, Sprint 2'den T23 öne alındı.

## Bekleyenler

**Onay (hemen)**

1. **GitHub push:** 4 commit yerelde (T15, T32, T23, bu rapor).

**Karar (son tarih ≈5 Kasım)**

2. **E-posta sağlayıcı (karar 13):** Resend / Brevo / AWS SES.
3. **Sync kapsamı (karar 14):** Öneri "cihaz asıl kaynak, sunucu kopya".

Bu ikisi T16'yı tıkıyor; T11, T17, T21 ve T28 de T16'ya bağlı. Kalan kod işinin büyük kısmı bu kararlara bağlı.

**Kuruculardan gelecekler**

4. **YouTube Data API anahtarı:** T31 ve T33 için; ücretsiz kota yeterli.
5. **Apple Developer hesabı (T01):** Gerçek cihazda barkod ve bildirim denemesi, TestFlight.
6. **PDR danışmanı ve ton rehberi (T06):** T18'in önkoşulu ve yayın şartı. "Kötü hissediyorum" şu an yalnız planı hafifletiyor, destek ya da yönlendirme metni yok.
7. **Marka, rıza metinleri (T07), bekleme listesi (T08).**

**Göz atılacaklar (tanımsız olduğu için seçilenler, PROJECT-STATE'te işaretli)**

8. **Sabah bildirim saati:** Şimdilik 08:00 sabit. Kurulumda mı sorulsun, ayarlar ekranında mı?
9. **Seçilen kurallar:**
   - Kapasite en fazla %50'ye düşer.
   - Dinlenme günü seriyi bozmaz.
   - Bugünün check-in'i bitmediyse seri dünden sayılır.
   - Sayfa başı 3 dk, test başı 15 dk varsayılan.
   - "Konu zor"da bölme yok.
   - Öncelik skoru ağırlıkları varsayılan.

## Riskler

- **Disk:** 25 Ekim'de 519 MB'a düştü. Bu projenin yeniden üretilebilir derleme çıktıları silindi (Android klasörü 1,1 GB, Xcode önbelleği 2,4 GB); akşam ≈9 GB boş. Büyük kalemler (Gradle 13 GB, Docker 15 GB, simülatörler 8,7 GB, chatapp derleme önbelleği 2,9 GB) paylaşılan ya da başka projelerin; temizlik kararı kurucularda.
- **Takvim:** Kod tarafı önde. Asıl risk karar ve hesapların gecikmesi:
  - Kararlar 13-14 gecikirse T16 ve ona bağlı işler sıkışır.
  - PDR danışmanı 15 Kasım'a kadar bulunmazsa yayın şartı tutmaz.
  - Apple hesabı olmadan TestFlight olmaz.
- **Simülatör paylaşımı:** Başka bir oturum iPhone 17 simülatörünü kullanıyor; bu projenin testleri iPhone 15 Pro'ya sabitlendi.
- **Denenmeyenler:** Barkod okuma ve bildirimlerin gerçekten düşmesi gerçek cihazda denenmedi. Android build silindi; Android'e dönülünce `expo prebuild` ve tam derleme gerekecek.

## Sıradaki

En hızlı ilerleme için:
- push onayı,
- karar 13 ve 14,
- YouTube anahtarı.

Sonra T16 (giriş, onay öncesi yerel mod, senkron), ardından T11 ve T21 (veli onayı). YouTube anahtarı gelirse T31 ve T33.
