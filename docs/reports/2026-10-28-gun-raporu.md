# Gün raporu — 26-28 Ekim 2026

Tarihli kayıt, kanonik değil. Güncel durum [PROJECT-STATE](../PROJECT-STATE.md)'te, stack [TECH-STACK](../TECH-STACK.md)'te.

## Özet

Sprint 1 ve 2'nin kod işi bitti. Giriş ve yedek, içindekiler fotoğrafı, veli onayı ve haftalık rapor, güvenlik
katmanı, koç sohbeti, YouTube listesi, analitik ve hesap silme yazıldı. Marka adı **lamba** oldu; marka teması
ve Figma'nın kurulum tasarımı uygulamada. Uzak Supabase projesinde T12 taksonomisi dışında tüm migration'lar ve
6 Edge Function var.

| Görev | Durum | Commit |
|---|---|---|
| T16 Giriş, yedek, geri yükleme | Tamam | `2593d27` |
| T11 İçindekiler fotoğrafı | Tamam (gerçek telefon fotoğrafı denenmedi) | `45ee92d` |
| T28 Hesap ve veri silme | Tamam | `f33f411` |
| T21 Veli onayı | Tamam; rıza metinleri yer tutucu (T07) | `80d272d` |
| T22 Haftalık veli raporu | Tamam; e-posta gönderimi ERTELENDİ (karar 13) | `5d04943` |
| T18 Güvenlik katmanı | Tamam; metinler PDR onayı bekliyor | `cd06129` |
| T17 + T20 Koç sohbeti | Kod yazıldı, **uçtan uca koşulmadı** | `8d3cb2f` |
| Saklama süreleri (pg_cron) | Tamam, uzakta | `0fa9d12` |
| T24 PostHog | Kod yazıldı, **olay düştüğü görülmedi**; Sentry DSN bekliyor | `06c6e36` |
| T31 + T33 + T34 YouTube listesi | Kod yazıldı, **uçtan uca koşulmadı** | `7ae542d` |
| T19 Güvenlik eval seti | Ölçüldü: akut kaçırma %2,5 (hedef ≤%2) | `4e693a0` |
| Erişilebilirlik ve envanter düzeltmeleri | Tamam | `a7fb71c`, `654dce3` |
| "2 kitap · 1 video" sayımı | Tamam | `1c0cef3` |
| Marka teması (temel) | Tamam, **simülatörde görülmedi** | `ff39d69` |
| T12 Konu taksonomisi | Tamam; **uzak projeye uygulanmadı** | `a1ac950` |
| Kurulum ekranları (Figma 3. sürüm) | Tamam, **simülatörde görülmedi** | `2ee24ee` |

Ortak (`mhmmcoding`): marka paketi (`6098be3`, `72ff6a8`), expo-sqlite web için Metro ayarı (`a0540dc`).

Testler: plan motoru 49, `safety` 38, `ai` 20, `youtube` 5, mobil 42 birim testi; 109 pgTAP testi (10 dosya);
13 Maestro akışı. Maestro'da `chat`, `support` ve `youtube-add` hiç koşulmadı, son tema ve kurulum değişikliğinden
sonra da hiçbiri koşulmadı.

## Öne çıkan bulgular

- **Veri kuralları iki katmanda:** 18 yaş altında onaysız veri sunucuya gitmiyor. Bunu hem uygulama denetliyor
  (`canSync`) hem kısıtlayıcı RLS politikaları (profil doğum bilgisiyle). Veli onayında yalnız kodun hash'i ve
  rıza kanıtının hash'i tutuluyor; ad açık yazılmıyor.
- **Güvenlik eval'i:** İlk koşuda akut kaçırma %7,5'ti; risk istemi ve kelime listesi ayarlanınca %2,5'e indi.
  Ayar aynı sette yapıldığı için rakam iyimser. PDR'nin yazacağı ayrı bir test seti ve 100+ akut örnek gerekli.
- **Taksonomi kaynağı:** MEB'in 2026 YKS kazanım PDF'inde Mantık, Sosyoloji ve Psikoloji sayfalarının yazı
  tipi kodlaması kaymış (Latin harfler +29). Ünite adları bu kaydırma çözülerek aynı belgeden doğrulandı. Ham
  kitap başlığı taksonomiye girmedi.
- **Git geçmişi iki kez zorla yazıldı** (`brand/`'in geçmişten silinmesi). Yereldeki commit'ler yedek dal ve
  rebase ile kurtarıldı. Öneri: `main`'de branch protection ve zorla push yasağı.
- **Uzakta e-posta yok** (karar 13): girişli akışlar (sohbet, içindekiler, YouTube, onay) uzak projede
  denenemiyor; yalnız girişsiz çağrının 401 döndüğü doğrulandı.

## Genel ilerleme (28 Ekim)

Saatler raporun görev listesindeki tahminler.

| Durum | Görevler | Tahmini saat |
|---|---|---|
| Bitti ya da kodu yazıldı | T02-T05, T09-T24, T28, T31-T34 | ≈212 / 267 |
| Kurucularda | T01 Apple, T06 ton rehberi + PDR, T07 rıza metinleri, T08 bekleme listesi | ≈15 |
| Sprint 3 | T25 TestFlight beta, T26 düzeltmeler, T27 App Store hazırlığı, T29 deneme girişi (zaman kalırsa), T30 gönderim | ≈40 |

## Bekleyenler

**Hemen (geliştirici)**

1. iOS dev build'i yeniden derle (yazı tipleri, PostHog native modülleri, ikonlar değişti).
2. Maestro'yu baştan koş. İlk kez koşulacaklar: `chat.yaml`, `support.yaml`,
   `youtube-add.yaml` (`-e PLAYLIST=<liste linki>`). Tema ve kurulumu gözle kontrol et.
3. CI'daki db işi yeşilse T12 migration'ını uzak projeye uygula (`supabase db push`).
4. PostHog'a olay düştüğünü ve elde tutmanın anonim kimlikle çalıştığını doğrula.

**Kurucularda (yayını engeller)**

5. PDR danışmanı (T06, karar 6): güvenlik metinleri, kriz listesi, eval etiketleri, koç istemi.
6. Aydınlatma ve rıza metinleri (T07); avukat ön görüşmesi.
7. E-posta sağlayıcı (karar 13): uzakta giriş, veli onayı linki ve haftalık rapor e-postası buna bağlı.
8. Apple Developer hesabı (T01): gerçek cihaz (barkod, bildirim), TestFlight.
9. Sentry DSN (AB bölgesi).

**Tasarım**

10. Figma Make: Bugün ekranına 1. sürüm kararlarını işlesin, sonra `lamba-design/FIGMA-PROMPTS.md`'deki sıradaki
    adımlar. Açık temada duman ve sahne sürümleri, dinlenme günü ve sınava ≤30 gün duman önerileri, Gölge modu
    kararı bekliyor (`lamba-design/DECISIONS.md`).
11. Uygulamada henüz yok: Bugün'de duman ve Alaaddin sahneleri, resmi YouTube logosu (şu an metin etiketi),
    tehlikeli eylemde çöp kutusu ikonu (ikon kütüphanesi seçilmedi).

## Riskler

- **Denenmemiş kod birikiyor:** sohbet, YouTube ve analitik uçtan uca hiç koşulmadı; tema ve kurulum
  simülatörde görülmedi. Yeni işe geçmeden önce bir test turu öneriyorum.
- **Yayın şartları dışarıda:** PDR, rıza metinleri ve e-posta sağlayıcı gecikirse kod hazır olsa da beta
  (T25, 30 Kasım) başlamaz.
- **Güvenlik hedefi:** akut kaçırma %2,5 ve ölçüm iyimser; PDR seti gelmeden "hedef karşılandı" denemez.
