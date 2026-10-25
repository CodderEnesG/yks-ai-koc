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

## Senden onay ya da karar bekleyenler

1. **GitHub push:** 3 commit ve bu rapor yerelde (T15, T32, T23).
2. **Karar 13, e-posta sağlayıcı ve karar 14, sync kapsamı:** T16 (giriş ve senkron) bunlara bağlı, son tarih ≈5 Kasım. T11 (içindekiler fotoğrafı) da T16'ya bağlı.
3. **YouTube Data API anahtarı:** T31 ve T33 için (Google Cloud'da YouTube Data API v3). Ücretsiz kota yeterli.
4. **Sabah bildirimi saati:** Rapor "öğrencinin seçtiği saat" diyor; şimdilik 08:00 sabit. Kurulumda mı sorulsun, ayarlar ekranında mı?
5. **Tanımsız olduğu için benim seçtiklerim** (PROJECT-STATE'te işaretli; bakıp onaylaman yeter):
   - Kapasite en fazla %50'ye düşer.
   - Dinlenme günü seriyi bozmaz.
   - Bugünün check-in'i bitmediyse seri dünden sayılır.
   - Sayfa başı varsayılan 3 dk, test başı 15 dk.
   - "Konu zor"da bölme uygulanmadı.
   - Öncelik skoru ağırlıkları varsayılan.

## Dikkat edilecekler

- **Disk dolmuştu:** 25 Ekim'de 519 MB boş kalmıştı. Bu projenin yeniden üretilebilir derleme çıktılarını sildim (Android klasörü 1,1 GB, Xcode önbelleği 2,4 GB); şu an ≈6,4 GB boş. Büyük kalemler başka projelerin ya da paylaşılan önbelleklerin, onlara dokunmadım:
  - Gradle önbelleği 13 GB
  - Docker 15 GB (kullanılmayan eski Supabase imajları dahil; 2,4 GB'lık Postgres 17.6 imajı bizim değil)
  - Simülatörler 8,7 GB
  - chatapp derleme önbelleği 2,9 GB

  Temizlik kararı senin.
- **Simülatör paylaşımı:** Başka bir oturum iPhone 17 simülatörünü kullanıyor; iki simülatör açık. Bizim testler iPhone 15 Pro'ya sabitlendi.
- **Yayından önce mutlaka:** PDR onayı, ton rehberi ve kriz protokolü (T06), güvenlik katmanı (T18). "Kötü hissediyorum" şu an yalnız planı hafifletiyor, destek ya da yönlendirme metni göstermiyor.
- **Gerçek cihazda denenmeyenler:** barkod okuma, bildirimlerin gerçekten düşmesi. TestFlight için Apple Developer hesabı (T01) gerekiyor.
- Android build silindi; Android'e dönülünce `expo prebuild` ve tam derleme gerekecek.

## Sıradaki

Kararlar gelince T16 (giriş, onay öncesi yerel mod, senkron), ardından T11 ve T21 (veli onayı). YouTube anahtarı gelirse T31 ve T33.
